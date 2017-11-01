;(async function() {
  // Find out where we're running
  let dat = window.location.toString()
  let archive = new DatArchive(dat)
  let info = await archive.getInfo()

  // If we're running in a dat that we own that doesn't have a portal, install it
  // ...unless we're running on ourselves
  let clientArchive = new DatArchive(client_url)
  let clientInfo = await clientArchive.getInfo()
  if (info.isOwner && info.key !== clientInfo.key) {
    try {
      await archive.stat('/portal.json')
    } catch (e) {
      await genPortal(info, archive)
    }
  }

  // Fetch our existing store and set viewing to the current site
  let store = await getStore()
  await store.dispatch('setViewing', info.key)
  store.commit('updateModel', { keys: ['defaultViewing'], value: store.state.viewing })
  await window.onhashchange()

  // If we own the page, add it to our list of available profiles
  if (info.isOwner && info.key !== clientInfo.key) {
    await store.dispatch('addProfile', info.key)
  }

  let app = new Vue({
    store,
    template: `
      <div :class="{ dark: darkMode }">
        <div class="header">
          <div>
            <span class="brand">ROTONDE</span>
            <a class="version" target="_blank" href="https://github.com/fugiman/rotonde-client">{{ version }}</a>
          </div>
          <div class="spacer" @click.shift="inDev = !inDev"></div>
          <account-selector></account-selector>
          <div class="center">
            <span class="darkmode" @click="darkMode = !darkMode">{{ darkModeSymbol }}</span>
          </div>
          <div class="dropdown center" v-if="inDev">
            <span class="devicon">🔧</span>
            <div>
              <span>TEST TEST</span>
              <span>TEST TEST</span>
            </div>
          </div>
        </div>
        <div class="rotonde">
          <portal></portal>
          <div class="main">
            <operator></operator>
            <feed></feed>
          </div>
        </div>
      </div>
    `,
    computed: {
      darkMode: model('darkMode').global(),
      inDev: model('inDev').global(),
      version: model('version'),

      darkModeSymbol() {
        return this.darkMode ? '☀️' : '🌙'
      },
    },
    methods: Vuex.mapMutations(['toggleOwner']),
  })
  app.$mount()
  document.body.appendChild(app.$el)

  store.commit('updateModel', { keys: ['loading'], value: false })
})()
