import { requestTypeLimitor, getCookie } from '../../../server/utils/utils'
import UserSession, { setCookieString } from '../../../server/session/user'

export default async function LogoutPanelApi(event) {
    let res = requestTypeLimitor(event, "GET");
    if (res) return res;
    let session = getCookie(event.request.headers.get("cookie"), MOKER_VARS_SESS_KEY);
    if (!session) return new Response(null, {
        status: 403
    })
    try {
        let verified = await UserSession.Verify(session).catch(e => { throw e });
        if (!verified) return new Response(null, {
            status: 403
        })
        await UserSession.Delete(session).catch(e => { throw e });
        return new Response(null, {
            status: 302,
            headers: {
                "Set-Cookie": setCookieString(MOKER_VARS_SESS_KEY, null, MOKER_VARS_DEPLOY_DOMAIN),
                "Location": `/login`
            }
        })
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}