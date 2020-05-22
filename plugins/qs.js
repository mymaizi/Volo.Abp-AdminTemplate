(function () {

  /**
   * Install plugin
   * @param Vue
   * @param qs
   */

  function plugin(Vue, qs) {

    if (plugin.installed) {
      return
    }
    plugin.installed = true

    if (!qs) {
      console.error('You have to install qs')
      return
    }

    Object.defineProperties(Vue.prototype, {
      $qs: {
        get() {
          return qs
        }
      }

    })
  }

  if (typeof exports == "object") {
    module.exports = plugin
  } else if (typeof define == "function" && define.amd) {
    define([], function () { return plugin })
  } else if (window.Vue&& window.qs) {
    Vue.use(plugin,window.qs)
  }

})();