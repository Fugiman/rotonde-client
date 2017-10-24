Vue.component('portal', {
  template: `
    <div id="portal">
      <div id="profile">
        <div class="icon"><img src="/media/content/icon.svg"></div>
        <div class="name">@{{ name }}</div>
        <div class="desc">{{ description }}</div>
        <div class="site"><a target="_blank" :href="site">{{ site }}</a></div>
      </div>
      <div id="activity">
        <t class="portals">00<unit>Following</unit></t>
        <t class="entries">000<unit>Entries</unit></t>
      </div>
      <t class="port_list"></t>
      <div id="version" style="filter: saturate(0%)">
        <a target="_blank" href="https://github.com/fugiman/rotonde-client">{{ version }}</a>
      </div>
    </div>
  `,
  computed: Vuex.mapState(['name', 'description', 'site', 'version']),
})
