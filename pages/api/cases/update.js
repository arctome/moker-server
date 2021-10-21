import { requestTypeLimitor } from '../../../server/utils/utils'
import UserVerify from '../../../server/controllers/user-verify'
import Record from '../../../server/entity/record';

export default async function MockCreateApi(event) {
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
        const mockData = await event.request.json().catch(e => { throw e });
        if(!mockData.record_id) return new Response(null, {
            status: 400
        })
        if (!mockData.cases || !Array.isArray(mockData.cases)) {
            return new Response(JSON.stringify({
                code: 0,
                msg: "Cases not found"
            }))
        }
        const patchData = {}
        if(mockData.name) patchData.name = mockData.name;
        if(mockData.url) patchData.url = mockData.url;
        if(mockData.cases && Array.isArray(mockData.cases)) patchData.cases = mockData.cases;
        await Record.UpdateRecord(userid, mockData.record_id, patchData).catch(e => { throw e })
        return new Response(JSON.stringify({
            code: 1, data: {
                record_id
            }
        }))
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}