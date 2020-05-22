(function () {

  /**
   * Install plugin
   * @param Vue
   * @param lodash
   */

  function plugin(Vue, lodash) {

    if (plugin.installed) {
      return
    }
    plugin.installed = true

    if (!lodash) {
      console.error('You have to install lodash')
      return
    }

    Object.defineProperties(Vue.prototype, {
      _: {
        get() {
          return lodash
        }
      }

    })
  }

  if (typeof exports == "object") {
    module.exports = plugin
  } else if (typeof define == "function" && define.amd) {
    define([], function () { return plugin })
  } else if (window.Vue&& window.lodash) {
    Vue.use(plugin,window.lodash)
  }

})();