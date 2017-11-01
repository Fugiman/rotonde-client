Vue.component('account-selector', {
  template: `
    <div class="account-selector dropdown center">
      <span v-if="selectedProfile" class="loggedIn" @click="location.hash = selectedProfile">
        <img :src="selectedIcon">
        <span>{{ selectedName }}</span>
      </span>
      <span v-else>
        Anonymous
      </span>
      <div>
        <span v-for="p in profiles">
          <img :src="p.icon">
          <span>{{ p.name }}</span>
        </span>
        <span>Create New Account</span>
        <span>Add Existing Account</span>
      </div>
    </div>
  `,
  computed: {
    selectedProfile: model('selectedProfile'),
    profiles: model('hydratedProfiles'),

    selectedIcon: function() {
      return `dat://${this.selectedProfile}/media/content/icon.svg`
    },
    selectedName: function() {
      let profile = this.profiles.find(p => {
        return p.key === this.selectedProfile
      })
      return profile ? profile.name : ''
    },
  },
})
