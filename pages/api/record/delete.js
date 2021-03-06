import { requestTypeLimitor } from '../../../server/utils/utils'
import UserVerify from '../../../server/controllers/user-verify'
import Record from '../../../server/entity/record';

export default async function DeleteRecordApi(event) {
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
        const reqJson = await event.request.json().catch(e => { throw e })
        if (!reqJson.record_id) return new Response(null, {
            status: 400
        })
        await Record.DelRecord(userid, reqJson.record_id).catch(e => { throw e })
        return new Response(JSON.stringify({ code: 1 }));
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}