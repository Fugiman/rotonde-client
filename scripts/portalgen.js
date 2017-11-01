async function genPortal(info, archive) {
  portal_data = {
    dat: info.url,
    name: info.title.replace(/\W/g, ''),
    desc: info.description.replace(/\W/g, ''),
    site: '',
    port: [],
    feed: [],
  }
  await archive.writeFile('/portal.json', JSON.stringify(portal_data, null, 2))
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

  return portal_data
}

function genIcon() {
  let buf = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid" version="1.1">'
  buf += '<defs><symbol id="shape" viewBox="0 0 100 100">'

  let curve = (x1, y1, x2, y2) => {
    let h = Math.hypot(x2 - x1, y2 - y1) / 2 * Math.sqrt(2)
    let a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 4
    let cx = x1 + h * Math.cos(a)
    let cy = y1 + h * Math.sin(a)
    buf += `<path d="M${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}" stroke="black" fill="transparent" />`
  }
  for (let lines = 6 + Math.random() * 12; lines > 0; lines--) {
    curve((Math.random() * 9 + 1) * 10, (Math.random() * 9 + 1) * 10, (Math.random() * 9 + 1) * 10, (Math.random() * 9 + 1) * 10)
  }
  buf += '</symbol></defs>'

  let repetitions = 20 // 6 + Math.random() * 12
  for (let i = 0; i < repetitions; i++) {
    buf += `<use href="#shape" x="150" y="150" height="120" width="120" transform="rotate(${360 / repetitions * i} 150 150)" />`
  }

  buf += '</svg>'
  return buf
}
