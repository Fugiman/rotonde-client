Vue.component('entry', {
  template: `
    <div class="entry">
      <div><a :href="entry.url" @click.prevent="setHash(entry.key)"><img class="icon" :src="icon"></a></div>
      <div class="content">
        <div>
          <span class="portal">
            <a :href="entry.url" @click.prevent="setHash(entry.key)">{{ entry.name }}</a>
          </span>
          <span class="timestamp">{{ duration }} ago</span>
        </div>
        <div class="message" dir="auto">{{ entry.message }}</div>
      </div>
      <div v-if="image" class="image" :class="{big: bigImage}" @click="bigImage = !bigImage">
        <img :src="image">
      </div>
    </div>
  `,
  props: ['entry'],
  data: function() {
    return {
      bigImage: false,
    }
  },
  computed: {
    icon() {
      return `${this.entry.url}/media/content/icon.svg?${this.entry.version}`
    },
    duration() {
      return this.timeSince(this.entry.timestamp, this.$store.state.now)
    },
    image() {
      let url = this.entry.media
      if (!url) return ''
      let parts = url.split('.')
      let extension = parts[parts.length - 1].toLowerCase()
      if (parts.length === 1) {
        url += '.jpg'
        extension = 'jpg'
      }
      if (!~['apng', 'bmp', 'dib', 'gif', 'jpg', 'jpeg', 'jpe', 'png', 'svg', 'svgz', 'tiff', 'tif', 'webp'].indexOf(extension)) return ''

      return `${this.entry.url}/media/content/${url}`
    },
  },
  methods: {
    setHash: key => {
      window.location.hash = key
    },
    timeSince: (date, now) => {
      let seconds = Math.floor((now - date) / 1000)
      let interval = Math.floor(seconds / 31536000)

      if (interval >= 1) {
        var years = interval == 1 ? ' year' : ' years'
        return interval + years
      }
      interval = Math.floor(seconds / 2592000)
      if (interval >= 1) {
        var months = interval == 1 ? ' month' : ' months'
        return interval + months
      }
      interval = Math.floor(seconds / 86400)
      if (interval >= 1) {
        var days = interval == 1 ? ' day' : ' days'
        return interval + days
      }
      interval = Math.floor(seconds / 3600)
      if (interval >= 1) {
        var hours = interval == 1 ? ' hour' : ' hours'
        return interval + hours
      }
      interval = Math.floor(seconds / 60)
      if (interval >= 1) {
        var minutes = interval == 1 ? ' minute' : ' minutes'
        return interval + minutes
      }
      interval = Math.floor(seconds)
      return interval + (interval == 1 ? ' second' : ' seconds')
    },
  },
})
