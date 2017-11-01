Vue.component('operator', {
  template: `
    <div id="operator" v-show="isSelf">
      <img class="icon" :src="selectedIcon">
      <textarea rows="1" placeholder="What's on your mind?" v-model="message" @input="updateSize" @keydown.enter.exact.prevent="submit" ></textarea>
      <span class="upload">📷</span>
      <span class="submit">⇒</span>
    </div>
  `,
  data: function() {
    return {
      message: '',
    }
  },
  computed: {
    selectedProfile: model('selectedProfile'),
    viewing: model('viewing'),
    isSelf: function() {
      return this.viewing && this.viewing.key === this.selectedProfile
    },
    selectedIcon: function() {
      return `dat://${this.selectedProfile}/media/content/icon.svg`
    },
  },
  methods: {
    updateSize: e => {
      e.target.style.height = 'auto'
      e.target.style.height = e.target.scrollHeight + 'px'
    },
    submit: async function() {
      let uuid = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => (a ^ ((Math.random() * 16) >> (a / 4))).toString(16))

      let post = {
        id: uuid(),
        timestamp: Date.now(),
        message: this.message,
      }
      this.message = ''

      this.$store.commit('addEntry', post)

      // await archive.writeFile('/portal.json', JSON.stringify(this.data, null, 2));
      // await archive.commit();
    },
  },
})
