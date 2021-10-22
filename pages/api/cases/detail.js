import { getParam, requestTypeLimitor } from '../../../server/utils/utils'
import Record from '../../../server/entity/record';
import UserVerify from '../../../server/controllers/user-verify'

export default async function GetMockCaseApi(event) {
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
        const case_id = getParam(event, 'case_id')
        if (!record_id || !case_id) return new Response(null, { status: 400 })
        const case_data = await Record.ReadRecordCase(userid, record_id, case_id);
        if (!case_data) return new Response(JSON.stringify({ code: 0 }))
        return new Response(JSON.stringify({ code: 1, data: case_data }))
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}