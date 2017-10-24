;(async function() {
  let dat = window.location.toString()
  let archive = new DatArchive(dat)
  let info = await archive.getInfo()
  let dat_str = await archive.readFile('/dat.json')
  let dat_data = JSON.parse(dat_str)
  let portal_str
  let portal_data

  let regenerate_portal = async function() {
    portal_data = {
      dat: dat_data.url,
      name: dat_data.title.replace(/\W/g, ''),
      desc: dat_data.description.replace(/\W/g, ''),
      site: '',
      port: [],
      feed: [],
    }
    await archive.writeFile(
      '/portal.json',
      JSON.stringify(portal_data, null, 2),
    )
    await archive.writeFile(
      '/index.html',
      `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="${client_url}rotonde.js"></script>
  </head>
  <body></body>
</html>
`,
    )
    try {
      await archive.mkdir('/media')
      await archive.mkdir('/media/content')
    } catch (err) {
      console.debug('/media/content already exists')
    }
    await archive.writeFile('/media/content/icon.svg', genIcon())
    await archive.commit()
  }

  // Read or make file
  try {
    portal_str = await archive.readFile('/portal.json')
  } catch (err) {
    await regenerate_portal()
  }

  try {
    portal_data = JSON.parse(portal_str)
    // append slash to port entry so that .indexOf works correctly in other parts
    portal_data.port = portal_data.port.map(follow => {
      if (follow.slice(-1) !== '/') {
        follow += '/'
      }
      return follow
    })
  } catch (err) {
    console.error('Malformed JSON in portal.json')
  }

  if (portal_data.dat !== dat_data.url) {
    await regenerate_portal()
  }

  let store = new Vuex.Store({
    state: {
      version: '🗻 0.0.1',
      isOwner: info.isOwner,
      name: portal_data.name,
      description: portal_data.desc,
      site: portal_data.site,
    },
  })
  let app = new Vue({
    store,
    template: `
      <div class="rotonde">
        <portal></portal>
        <div class="main">
          <operator v-if="isOwner"></operator>
          <feed></feed>
        </div>
      </div>
    `,
    computed: Vuex.mapState(['isOwner']),
  })
  app.$mount()
  document.body.appendChild(app.$el)
})()

function genIcon() {
  let buf =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid" version="1.1">'
  buf += '<defs><symbol id="shape" viewBox="0 0 100 100">'

  let curve = (x1, y1, x2, y2) => {
    let h = Math.hypot(x2 - x1, y2 - y1) / 2 * Math.sqrt(2)
    let a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 4
    let cx = x1 + h * Math.cos(a)
    let cy = y1 + h * Math.sin(a)
    buf += `<path d="M${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}" stroke="black" fill="transparent" />`
  }
  for (let lines = 6 + Math.random() * 12; lines > 0; lines--) {
    curve(
      (Math.random() * 9 + 1) * 10,
      (Math.random() * 9 + 1) * 10,
      (Math.random() * 9 + 1) * 10,
      (Math.random() * 9 + 1) * 10,
    )
  }
  buf += '</symbol></defs>'

  let repetitions = 20 // 6 + Math.random() * 12
  for (let i = 0; i < repetitions; i++) {
    buf += `<use href="#shape" x="150" y="150" height="120" width="120" transform="rotate(${360 /
      repetitions *
      i} 150 150)" />`
  }

  buf += '</svg>'
  return buf
}
