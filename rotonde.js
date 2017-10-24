// Backwards compatibility
function Rotonde() {
  this.install = function() {}
}

let client_url = document.currentScript.src.slice(0, -10) // cut off '/rotonde.js'
window.addEventListener('load', function() {
  let install_style = function(name, is_user_side) {
    var href = 'links/' + name + '.css'
    if (!is_user_side) href = client_url + href
    var s = document.createElement('link')
    s.rel = 'stylesheet'
    s.type = 'text/css'
    s.href = href
    document.getElementsByTagName('head')[0].appendChild(s)
  }

  let install_script = function(name, vendor) {
    var s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = client_url + (vendor ? 'vendor/' : 'scripts/') + name + '.js'
    if (vendor) {
      document.getElementsByTagName('head')[0].appendChild(s)
    } else {
      document.body.appendChild(s)
    }
  }

  let requirements = {
    style: ['reset', 'fonts', 'main'],
    script: ['operator', 'portal', 'feed', 'main'],
    vendor: ['vue', 'vuex'],
  }

  requirements.vendor.forEach(name => {
    install_script(name, true)
  })
  requirements.script.forEach(name => {
    install_script(name)
  })
  requirements.style.forEach(name => {
    install_style(name)
  })
  install_style('custom', true)
})
