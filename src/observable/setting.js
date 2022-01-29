import Vue from 'vue'



class SettingObservable {

    /**
     * @private
     * @type {YApiSetting}
     */
    setting

    constructor() {
        /**
         * @type {YApiSetting}
         */
        const initial = {
            template: ""
        }
        /**
         * @private
         */
        this.setting = Vue.observable(initial)
        this.init()
    }

    /**
     * @private
     * @return {Promise<void>}
     */
    init() {
        window.chrome.storage.local.get("y-api-gen:setting:template", (items) => {
            this.setting.template = items["y-api-gen:setting:template"]
        })
    }


    get template() {
        return this.setting.template
    }

    set template(value) {
        this.setting.template = value
        window.chrome.storage.local.set({"y-api-gen:setting:template": value})
    }


}


export const Setting = new SettingObservable()
