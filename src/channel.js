/**
 * @return {Promise<{ isYApi: boolean,isYApiDetail:boolean }>}
 */
export function detectYApi() {
    return new Promise((resolve) => {
        sendMessage("detect", (response) => {
            if (response) {
                resolve(response)
            } else {
                resolve({isYApi: false, isYApiDetail: false})
            }
        });
    });
}

/**
 * @return {Promise<{ status: number,statusText:string,interface:YApiScheme,document:string }>}
 */
export function queryInterface() {
    return new Promise((resolve) => {
        sendMessage("interface", resolve);
    });
}

/**
 *
 * @param { 'detect' | 'interface' } type
 * @param { Function } resolve
 */
function sendMessage(type, resolve) {
    window.chrome.tabs
        .query({active: true, currentWindow: true})
        .then((tabs) => {
            window.chrome.tabs.sendMessage(
                tabs[0].id,
                {command: type},
                (response) => {
                    resolve(response);
                }
            );
        });
}


