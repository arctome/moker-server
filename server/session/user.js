import User from '../entity/user'
import { nanoid } from 'nanoid'

const UserSession = {
    Create: async function (user_id, maxAge = 3 * 24 * 60 * 60) {
        if (!user_id) throw new Error("Required fields missing");
        let isExist;
        if(user_id === 'admin') {
            isExist = true;
        } else {
            isExist = await User.CheckUserIDExist(user_id);
        }
        if (!isExist) throw new Error("Required key not found");
        const session = nanoid(8)
        await MOKER_SESSION_USER.put(session, user_id, { expirationTtl: maxAge }).catch(e => {
            throw new Error("KV write error");
        })
        return session;
    },
    Delete: async function (session) {
        await MOKER_SESSION_USER.delete(session).catch(e => {
            throw new Error("KV write error");
        });
        return true;
    },
    Verify: async function (session) {
        if (!session) throw new Error("Required fields missing")
        let user_id = await MOKER_SESSION_USER.get(session);
        return user_id;
    }
}

export default UserSession;

export function setCookieString(key, value, domain, maxAge = 3 * 24 * 60 * 60) {
    if(!key || !domain) return "";
    if(!value) return `${key}=; Domain=${domain}; Max-Age=-1; SameSite=Lax; Path=/; Secure; HttpOnly`;
    return `${key}=${value}; Domain=${domain}; Max-Age=${maxAge}; SameSite=Lax; Path=/; Secure; HttpOnly`;
}