(function () {

  /**
   * Install plugin
   * @param Vue
   * @param toastr
   */

  function plugin(Vue, toastr) {

    if (plugin.installed) {
      return
    }
    plugin.installed = true

    if (!toastr) {
      console.error('You have to install toastr')
      return
    }

    Object.defineProperties(Vue.prototype, {

      $toastr: {
        get() {
          return toastr
        }
      }

    })
  }

  if (typeof exports == "object") {
    module.exports = plugin
  } else if (typeof define == "function" && define.amd) {
    define([], function () { return plugin })
  } else if (window.Vue && window.toastr) {
    Vue.use(plugin, window.toastr)
  }

})();