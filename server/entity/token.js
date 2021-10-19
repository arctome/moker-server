import { nanoid } from 'nanoid';
import * as jwt from '@tsndr/cloudflare-worker-jwt';

const Token = {
    Issue: async function (user_id, name) {
        if (!user_id || !name) throw new Error("Required fields missing")
        const token_id = nanoid(4);
        const tokenSignPayload = {
            user_id, token_id
        }
        const token = await jwt.sign(tokenSignPayload, MOKER_VARS_JWT_SECRET).catch(e => {
            throw new Error("Internal service error: JWT")
        })
        await MOKER_STORAGE_TOKEN.put(user_id + ':' + token_id, token, { metadata: { name, c_time: Date.now() } }).catch(e => { throw new Error("KV write error"); })
        return token;
    },
    Revoke: async function (user_id, token_id) {
        if (!user_id || !token_id) throw new Error("Required fields missing");
        let tokenRecord = await MOKER_STORAGE_TOKEN.get(user_id + ':' + token_id);
        if (!tokenRecord) throw new Error("Required key not found");;
        // start delete
        await MOKER_STORAGE_TOKEN.delete(user_id + ':' + token_id).catch(e => {
            throw new Error("KV write error");
        })
        return true;
    },
    Verify: async function (token) {
        if (!token) throw new Error("Required fields missing");
        // Verifing token
        const isValid = await jwt.verify(token, MOKER_VARS_JWT_SECRET).catch(e => { throw e })
        if (!isValid) return false;
        const tokenPayload = await jwt.decode(token).catch(e => { throw e });
        const tokenExist = await MOKER_STORAGE_TOKEN.get(tokenPayload.user_id + ':' + tokenPayload.token_id);
        if (tokenExist !== token) return false;
        return tokenPayload;
    },
    List: async function (user_id, data) {
        let page = data.page || 1; // Unused
        let size = data.size || 20;
        let cursor = data.cursor || "";
        if (!user_id) throw new Error("Required fields missing");
        let keys = await MOKER_STORAGE_TOKEN.list({ prefix: user_id + ':', cursor, limit: size }).catch(e => { throw new Error("KV write error") })
        keys = keys.keys.map(key => {
            let token_id = key.name.replace(user_id + ":", "")
            return {
                token_id,
                name: key.metadata.name,
                c_time: key.metadata.c_time
            }
        })
        return keys;
    }
}

export default Token;