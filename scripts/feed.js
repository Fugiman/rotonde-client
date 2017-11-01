Vue.component('feed', {
  template: `
    <div id="feed">
      <entry v-for="entry in feed" :entry="entry"></entry>
    </div>
  `,
  computed: {
    feed() {
      return this.$store.getters.feed
    },
  },
})
