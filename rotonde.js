// Backwards compatibility
function Rotonde() {
  this.install = function() {}
}

let client_url = document.currentScript.src.slice(0, -10) // cut off '/rotonde.js'
;(() => {
  let install_style = function(name, is_user_side) {
    var href = 'links/' + name + '.css'
    if (!is_user_side) href = client_url + href
    var s = document.createElement('link')
    s.rel = 'stylesheet'
    s.type = 'text/css'
    s.href = href
    document.getElementsByTagName('head')[0].appendChild(s)
  }

  let install_script = function(name) {
    var s = document.createElement('script')
    s.type = 'text/javascript'
    s.defer = true
    s.async = false
    s.src = client_url + name + '.js'
    document.getElementsByTagName('head')[0].appendChild(s)
  }

  let requirements = {
    style: ['reset', 'fonts', 'main'],
    script: ['ALL_FEED', 'store', 'account_selector', 'operator', 'portal', 'feed', 'entry', 'main'],
    vendor: ['vue', 'vuex'],
  }

  requirements.vendor.forEach(name => {
    install_script('vendor/' + name)
  })
  requirements.script.forEach(name => {
    install_script('scripts/' + name)
  })
  requirements.style.forEach(name => {
    install_style(name)
  })
  install_style('custom', true)
})()
