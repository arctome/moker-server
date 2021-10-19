import { requestTypeLimitor } from '../../../server/utils/utils'
import UserSession, { setCookieString } from '../../../server/session/user'
import User from '../../../server/entity/user'

export default async function LoginPanelApi(event) {
    let res = requestTypeLimitor(event, "POST");
    if (res) return res;
    // let session = getCookie(event, MOKER_VARS_SESS_KEY);
    // if (!session) return new Response(null, { status: 403 });
    // let userid = await UserSession.Verify(session).catch(e => { throw e });
    try {
        let reqJson = await event.request.text().catch(e => { throw e });
        reqJson = Object.fromEntries(new URLSearchParams(reqJson).entries());
        if (!reqJson.username || !reqJson.password) return new Response(null, {
            status: 400
        })
        let user = await User.ReadUser(reqJson.username, reqJson.password).catch(e => { throw e });
        if (!user) return new Response(JSON.stringify({ code: 0, msg: "Account & password mismatch or account not found." }))
        // let encryptedPass = await hmacSHA512toHex(reqJson.password).catch(e => { throw e })
        // if (encryptedPass !== user.password) return new Response(JSON.stringify({ code: 0, msg: "Account & password mismatch" }));
        const session = await UserSession.Create(reqJson.username);
        return new Response(JSON.stringify({ code: 1, data: { userid: reqJson.username, username: user.name } }), {
            status: 200,
            headers: {
                "Set-Cookie": setCookieString(MOKER_VARS_SESS_KEY, session, MOKER_VARS_DEPLOY_DOMAIN)
            }
        })
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}