import { requestTypeLimitor } from '../../../server/utils/utils'
import UserVerify from '../../../server/controllers/user-verify'
import Token from '../../../server/entity/token'

export default async function IssueTokenApi(event) {
    let res = requestTypeLimitor(event, "POST");
    if (res) return res;
    try {
        let verify = await UserVerify(event).catch(e => { throw e });
        if (!verify.ok) {
            return new Response(null, {
                status: 403,
                headers: {
                    "Set-Cookie": verify.cookie || ""
                }
            })
        }
        const userid = verify.userid;
        const reqJson = await event.request.json().catch(e => {throw e})
        if(!reqJson.name) return new Response(null, {status: 400})
        const token = await Token.Issue(userid, reqJson.name).catch(e => {throw e})
        return new Response(JSON.stringify({code: 1, data: {
            token
        }}))
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}