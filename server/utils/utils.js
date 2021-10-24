export function requestTypeLimitor(event, type) {
    if (!Array.isArray(type)) {
        type = [type]
    }
    let flag = false;
    type.forEach(element => {
        event.request.method.toLowerCase() === element.toLowerCase() ? flag = true : undefined
    });
    if (!flag) return new Response(null, {
        status: 405
    })
}

/**
 * Generate uuid in v4 mode (fake but fit most condition)
 */
export function uuidv4() {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    return [...bytes].map(b => ('0' + b.toString(16)).slice(-2)).join('') // to hex
}

/**
* Get cookie both in Web Worker & browser env.
* @param {*} cookieStr document.cookie或header内的cookie字符串
* @param {string} key 查找的cookie字符串
*/
export function getCookie(cookieStr, key) {
    if (!cookieStr) return '';
    let cookieArr = cookieStr.split('; ')
    for (let i = 0; i < cookieArr.length; i++) {
        let temp = cookieArr[i].split('=')
        if (temp[0] === key) {
            return temp[1]
        }
    }
    return ''
}

export function getParam(event, key) {
    const url = event.$$origin ? event.$$origin.request.url : event.request.url
    return new URLSearchParams(new URL(url).searchParams).get(key) || '';
}