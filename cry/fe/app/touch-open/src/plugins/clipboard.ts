import type { App } from 'vue';
import Clipboard from 'clipboard' // FIXME: workaround for browserify

const VueClipboardConfig = {
  autoSetContainer: false,
  appendToBody: true, // This fixes IE, see #50
}

export const copyText = (text: string, container?: any) => {
  return new Promise(function (resolve, reject) {
    const fakeElement = document.createElement('button')
    const clipboard = new Clipboard(fakeElement, {
      text: function () { return text },
      action: function () { return 'copy' },
      container: typeof container === 'object' ? container : document.body,
    })
    clipboard.on('success', function (e) {
      clipboard.destroy()
      resolve(e)
    })
    clipboard.on('error', function (e) {
      clipboard.destroy()
      reject(e)
    })
    if (VueClipboardConfig.appendToBody) document.body.appendChild(fakeElement)
    fakeElement.click()
    if (VueClipboardConfig.appendToBody) document.body.removeChild(fakeElement)
  })
}

const VueClipboard = {
  install: function (app: App) {
    app.config.globalProperties.$clipboardConfig = VueClipboardConfig
    app.config.globalProperties.$copyText = copyText;

    app.directive('clipboard', {
      mounted: function (el, binding) {
        if (binding.arg === 'success') {
          el._vClipboard_success = binding.value
        } else if (binding.arg === 'error') {
          el._vClipboard_error = binding.value
        } else {
          const clipboard = new Clipboard(el, {
            text: function () { return binding.value },
            action: function () { return binding.arg === 'cut' ? 'cut' : 'copy' },
            container: VueClipboardConfig.autoSetContainer ? el : undefined,
          })
          clipboard.on('success', function (e) {
            const callback = el._vClipboard_success
            callback && callback(e)
          })
          clipboard.on('error', function (e) {
            const callback = el._vClipboard_error
            callback && callback(e)
          })
          el._vClipboard = clipboard
        }
      },
      updated: function (el, binding) {
        if (binding.arg === 'success') {
          el._vClipboard_success = binding.value
        } else if (binding.arg === 'error') {
          el._vClipboard_error = binding.value
        } else {
          el._vClipboard.text = function () { return binding.value }
          el._vClipboard.action = function () { return binding.arg === 'cut' ? 'cut' : 'copy' }
        }
      },
      unmounted: function (el, binding) {
        if (binding.arg === 'success') {
          delete el._vClipboard_success
        } else if (binding.arg === 'error') {
          delete el._vClipboard_error
        } else {
          el._vClipboard.destroy()
          delete el._vClipboard
        }
      },
    })
  },
  config: VueClipboardConfig,
}

export default VueClipboard
