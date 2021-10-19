export default async function hmacSHA512toHex(data, secret) {
    // encoder to convert string to Uint8Array
    const enc = new TextEncoder("utf-8");
    const key = await crypto.subtle.importKey(
        "raw", // raw format of the key - should be Uint8Array
        enc.encode(secret),
        { // algorithm details
            name: "HMAC",
            hash: { name: "SHA-512" }
        },
        false, // export = false
        ["sign", "verify"] // what this key can do
    ).catch(e => { throw e });
    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        enc.encode(data)
    ).catch(e => { throw e });
    let b = new Uint8Array(signature);
    let str = Array.prototype.map.call(b, x => ('00' + x.toString(16)).slice(-2)).join("");
    return str;
}