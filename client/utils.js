export function collectFormData(data) {
    const form = new FormData(data);
    const json = {};
    for (let pair of form.entries()) {
        json[pair[0]] = pair[1];
    }
    return json;
}

export function copyToClipboard(text) {
    if (text === "") return;
    var ipt = document.createElement('textarea')
    ipt.setAttribute(
        'style',
        'position:absolute;z-index:-1;width:1px;height:1px;top:-1px;opacity:0;-webkit-user-select: text;'
    )
    document.body.appendChild(ipt)
    ipt.value = text
    // ipt.select()
    if (/iphone|ipad|ios/.test(navigator.userAgent.toLowerCase())) {
        var oldContentEditable = ipt.contentEditable
        var oldReadOnly = ipt.readOnly
        var range = document.createRange()

        ipt.contentEditable = true
        ipt.readOnly = false
        range.selectNodeContents(ipt)

        var s = window.getSelection()
        s.removeAllRanges()
        s.addRange(range)

        ipt.setSelectionRange(0, 999999) // A big number, to cover anything that could be inside the element.

        ipt.contentEditable = oldContentEditable
        ipt.readOnly = oldReadOnly
    } else {
        ipt.select()
    }
    document.execCommand('Copy')
    ipt.blur()
    document.body.removeChild(ipt)
    ipt = null
}

export const loadScript = (url) => new Promise((resolve, reject) => {
    let ready = false;
    if (!document) {
        reject(new Error('Document was not defined'));
    }
    const tag = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    script.onreadystatechange = () => {
        if (!ready && (!this.readyState || this.readyState === 'complete')) {
            ready = true;
            resolve(script);
        }
    };
    script.onload = script.onreadystatechange;

    script.onerror = (msg) => {
        console.log(msg);
        reject(new Error('Error loading script.'));
    };

    script.onabort = (msg) => {
        console.log(msg);
        reject(new Error('Script loading aboirted.'));
    };

    if (tag.parentNode != null) {
        tag.parentNode.insertBefore(script, tag);
    }
});