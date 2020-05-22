(function () {

  /**
   * Install plugin
   * @param Vue
   * @param sweetalert2
   */

  function plugin(Vue, sweetalert2) {

    if (plugin.installed) {
      return
    }
    plugin.installed = true

    if (!sweetalert2) {
      console.error('You have to install sweetalert2')
      return
    }

    Object.defineProperties(Vue.prototype, {
      $swal: {
        get() {
          return sweetalert2
        }
      }
    })
  }

  if (typeof exports == "object") {
    module.exports = plugin
  } else if (typeof define == "function" && define.amd) {
    define([], function () { return plugin })
  } else if (window.Vue && window.sweetalert2) {
    Vue.use(plugin, window.sweetalert2)
  }

})();