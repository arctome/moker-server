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
        // if (!mockData.cases || !Array.isArray(mockData.cases)) {
        //     return new Response(JSON.stringify({
        //         code: 0,
        //         msg: "Cases not found"
        //     }))
        // }
        if (!mockData.name || !mockData.url) return new Response(null, {
            status: 400
        })
        const record_id = await Record.CreateRecord(userid, {
            name: mockData.name,
            url: mockData.url,
            collections: mockData.collections,
            private_read: mockData.private_read === 'on' ? true : false
        }, []).catch(e => { throw e })
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