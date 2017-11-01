;(() => {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  let persistValue = (keys, value) => {
    iframe.contentWindow.postMessage(JSON.stringify({ key: keys.join('.'), value: value }), '*')
  }

  // Make the store
  let store = new Vuex.Store({
    state: {
      loading: true,
      version: '🗻 0.0.1',
      now: new Date(),
      selectedProfile: null,
      profiles: [],
      hydratedProfiles: [],
      viewing: null,
      defaultViewing: null,
      feeds: {},
    },
    getters: {
      feed: state => {
        if (state.loading) return []
        let urls = state.viewing ? (state.viewing.key === state.selectedProfile ? state.viewing.feed : [state.viewing.url]) : ALL_FEED
        let f = []
        urls.forEach(u => {
          if (!(u in state.feeds)) store.dispatch('trackFeed', u)
          let d = state.feeds[u] || { feed: [] }
          d.feed.forEach(e => {
            f.push(Object.assign({}, d.metadata, e))
          })
        })
        f.sort((a, b) => {
          return b.timestamp - a.timestamp
        })

        // Remove future posts (allow 1min of desync)
        let cutoff = new Date() - -60
        return f.filter(e => e.timestamp <= cutoff)
      },
    },
    mutations: {
      updateModel: (state, data) => {
        let n = data.keys
        let o = state
        for (let i = 0; i < n.length - 1; i++) {
          let k = n[i]
          o = o[k]
        }
        Vue.set(o, n[n.length - 1], data.value)
      },
    },
    actions: {
      async setViewing({ commit }, hash) {
        let archive = new DatArchive('dat://' + hash)
        let info = await archive.getInfo()
        let viewing = null

        try {
          let portal = JSON.parse(await archive.readFile('/portal.json'))
          viewing = {
            key: hash,
            url: info.url,
            name: portal.name,
            description: portal.desc,
            icon: info.url + '/media/content/icon.svg',
            site: portal.site,
            clean_site: portal.site.replace(/^(https?|dat):\/\//, ''),
            following: portal.port.length,
            entries: portal.feed.length,
            feed: portal.port.concat([info.url]),
          }
        } catch (e) {}

        commit('updateModel', {
          keys: ['viewing'],
          value: viewing,
        })
        document.title = 'rotonde' + (viewing ? '/' + viewing.name : '')
      },
      async addProfile({ state, commit }, hash) {
        if (state.profiles.includes(hash)) return

        let profiles = state.profiles.concat([hash])
        console.log(profiles)
        commit('updateModel', { keys: ['profiles'], value: profiles })
        persistValue(['profiles'], profiles)

        if (state.selectedProfile === null) {
          commit('updateModel', { keys: ['selectedProfile'], value: hash })
          persistValue(['selectedProfile'], hash)
        }
      },
      async trackFeed({ state, commit }, url) {
        if (url in state.feeds) return
        commit('updateModel', { keys: ['feeds', url], value: { feed: [] } })
        // Dat archive lock acquired

        let archive = new DatArchive(url)
        let info = await archive.getInfo()
        let portal = JSON.parse(await archive.readFile('/portal.json'))
        commit('updateModel', {
          keys: ['feeds', url],
          value: {
            metadata: {
              key: info.key,
              url: info.url,
              version: info.version,
              name: portal.name,
            },
            feed: portal.feed,
          },
        })
      },
    },
  })
  // Every 5000ms update "now" (for use in timeSince strings)
  setInterval(() => {
    store.commit('updateModel', { keys: ['now'], value: new Date() })
  }, 5000)
  // Keep hydrated profile data in sync with profile list
  store.watch(
    state => state.profiles,
    async () => {
      let hydratedProfiles = await Promise.all(
        store.state.profiles.map(async hash => {
          let archive = new DatArchive('dat://' + hash)
          let portal = JSON.parse(await archive.readFile('/portal.json'))
          return { key: hash, name: portal.name, icon: `dat://${hash}/media/content/icon.svg` }
        }),
      )
      hydratedProfiles.sort((a, b) => {
        return a.name.toLowerCase() < b.name.toLowerCase()
      })
      store.commit('updateModel', { keys: ['hydratedProfiles'], value: hydratedProfiles })
    },
  )
  // Change pages on hash change
  window.onhashchange = async () => {
    let hash = (location.hash || '#').slice(1)
    switch (hash) {
      case '':
        store.commit('updateModel', { keys: ['viewing'], value: store.state.defaultViewing })
        break
      default:
        await store.dispatch('setViewing', hash)
    }
  }

  // Make a promise that resolves when the store is ready
  let storeReady = new Promise(resolve => {
    window.onmessage = function(e) {
      let payload = JSON.parse(e.data)
      Object.keys(payload).forEach(key => {
        store.commit('updateModel', {
          keys: key.split('.'),
          value: payload[key],
        })
      })
      resolve()
    }
  })

  // Populate the store (asyncronously)
  let archive = new DatArchive(client_url)
  archive.getInfo().then(info => {
    iframe.src = `dat://${info.key}/iframe.html`
  })

  // Make it easy to use the store
  window.model = function(/* ...props */) {
    let normalizeKeys = (self, keys) => {
      let a = []
      keys.forEach(k => {
        a.push(k[0] === ':' ? self[k.substr(1)] : k)
      })
      return a
    }

    let props = Array.prototype.slice.call(arguments)
    let global = false
    return {
      global() {
        global = true
        return this
      },
      get() {
        let keys = normalizeKeys(this, props)
        let o = this.$store.state
        keys.forEach(k => {
          if (o) o = o[k]
        })
        return o
      },
      set(value) {
        let keys = normalizeKeys(this, props)
        this.$store.commit('updateModel', { keys, value })
        if (global) persistValue(keys, value)
      },
    }
  }

  // Allow getting the store safely
  window.getStore = async function() {
    await storeReady
    return store
  }
})()
