import { getParam, requestTypeLimitor } from '../../../server/utils/utils'
import Record from '../../../server/entity/record';
import UserVerify from '../../../server/controllers/user-verify'

export default async function GetFullMockRecordApi(event) {
    let res = requestTypeLimitor(event, "GET");
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
        const record_id = getParam(event, 'record_id')
        if (!record_id) return new Response(null, { status: 400 })
        const record = await Record.ReadFullRecord(userid, record_id);
        if(!record) return new Response(JSON.stringify({code: 0}))
        return new Response(JSON.stringify({code: 1, data: record}))
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}