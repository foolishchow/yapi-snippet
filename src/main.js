import Vue from 'vue'
import App from './App.vue'
import * as Highlight from "./directives/highlight"
Vue.config.productionTip = false

Highlight.install(Vue)
new Vue({
    render: h => h(App),
}).$mount('#app')








