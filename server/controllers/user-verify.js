import { getCookie } from '../utils/utils'
import UserSession, { setCookieString } from '../session/user'

export default async function UserVerify(event) {
    const session = getCookie(event.request.headers.get("Cookie"), MOKER_VARS_SESS_KEY);
    if(!session) return {
        ok: 0
    };
    const userid = await UserSession.Verify(session);
    if(!userid) return {
        ok: 0,
        cookie: setCookieString(MOKER_VARS_SESS_KEY, null, MOKER_VARS_DEPLOY_DOMAIN)
    };
    return {
        ok: 1,
        userid,
        cookie: setCookieString(MOKER_VARS_SESS_KEY, null, MOKER_VARS_DEPLOY_DOMAIN)
    }
}