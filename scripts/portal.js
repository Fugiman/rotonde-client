Vue.component('portal', {
  template: `
    <div id="portal">
    <template v-if="viewing">
      <div id="profile">
        <div class="icon"><img :src="viewing.icon"></div>
        <div class="name">{{ viewing.name }}</div>
        <div class="desc">{{ viewing.description }}</div>
        <div class="site"><a target="_blank" :href="viewing.site">{{ viewing.clean_site }}</a></div>
      </div>
      <div id="activity">
        <span class="portals">{{ viewing.following }}<unit>Following</unit></span>
        <span class="entries">{{ viewing.entries }}<unit>Entries</unit></span>
      </div>
      <span class="port_list"></span>
    </template>
    <template v-else>
      <div id="profile">
        <div class="icon"><img src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0idmVjdG9yIiB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMzAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgYmFzZVByb2ZpbGU9ImZ1bGwiIHZlcnNpb249IjEuMSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6YmxhY2s7c3Ryb2tlLXdpZHRoOjI4cHg7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlOyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLDE1MCkscm90YXRlKDEyMCwwLDApIj4KICAgIDxwYXRoIGQ9Ik0tMTUsLTEwMCBhOTAsOTAgMCAwLDEgOTAsOTAgbDAsNjAiPjwvcGF0aD4gICAKICA8L2c+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLDE1MCkscm90YXRlKDI0MCwwLDApIj4KICAgIDxwYXRoIGQ9Ik0tMTUsLTEwMCBhOTAsOTAgMCAwLDEgOTAsOTAgbDAsNjAiPjwvcGF0aD4gICAKICA8L2c+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLDE1MCkscm90YXRlKDAsMCwwKSI+CiAgICA8cGF0aCBkPSJNLTE1LC0xMDAgYTkwLDkwIDAgMCwxIDkwLDkwIGwwLDYwIj48L3BhdGg+ICAgCiAgPC9nPgo8L3N2Zz4="></div>
        <div class="name">ROTONDE</div>
        <div class="desc">A peer-to-peer social network</div>
        <div class="site"><a target="_blank" href="http://wiki.xxiivv.com/rotonde">Rotonde Homepage</a></div>
      </div>
    </template>
    </div>
  `,
  computed: {
    viewing: model('viewing'),
  },
})
