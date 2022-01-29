window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    /**
     * @type {'detect'|'interface'}
     */
    const command = request.command

    if (command === 'detect') {
        sendResponse({isYApi: isYApiPage(), isYApiDetail: isYApiDetailPage()})
    } else if (command === 'interface') {
        getInterfaceDetail(sendResponse)
        return true
    }
})


async function getInterfaceDetail(sendResponse) {

    let apiId = ""
    if (detailHashReg.test(location.hash)) {
        apiId = location.hash.match(detailHashReg)[2]
    } else if (detailPathReg.test(location.pathname)) {
        apiId = location.pathname.match(detailPathReg)[2]
    }
    let {protocol, host} = window.location
    try {
        let result = await window.fetch(`${protocol}//${host}/api/interface/get?id=${apiId}`)
        let {status, statusText,} = result
        if (status !== 200) {
            sendResponse({status, statusText})
            return
        }
        let json = await result.json()
        json.data.res_body = JSON.parse(json.data.res_body || "{}")
        json.data.req_body_other = JSON.parse(json.data.req_body_other || "{}")
        sendResponse({status, interface: json.data, document: location.href})
    } catch (e) {
        sendResponse({status: 505, statusText: "failed to request interface detail"})
    }
}

const detailHashReg = /^#\/project\/(\d+)\/interface\/api\/(\d+)$/
const detailPathReg = /^\/project\/(\d+)\/interface\/api\/(\d+)$/

function isYApiDetailPage() {
    console.info(window.location)
    return detailHashReg.test(window.location.hash) || detailPathReg.test(window.location.pathname);
}

function isYApiPage() {
    let isYApi = true
    if (window.document.querySelector("body>#yapi") == null) {
        return false
    }
    return isYApi;
}

