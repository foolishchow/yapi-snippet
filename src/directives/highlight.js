/**
 * 自定义代码高亮插件
 */
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

export const install = function (Vue) {
    Vue.directive('highlight', {
        deep: true,
        bind (el, binding) {
            let targets = el.querySelectorAll('code')

            targets.forEach(target => {
                if (typeof binding.value === 'string') {
                    target.textContent = binding.value
                }
                hljs.highlightBlock(target)
            })
        },
        componentUpdated (el, binding) {
            // after an update, re-fill the content and then highlight
            let targets = el.querySelectorAll('code')

            targets.forEach(target => {
                if (typeof binding.value === 'string') {
                    target.textContent = binding.value
                    hljs.highlightBlock(target)
                }
            })
        },
    })

}

// if (window.Vue) {
//     // window['highlight'] = highlight
//     Vue.use(install) // eslint-disable-line
// }


