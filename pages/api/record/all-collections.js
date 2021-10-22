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
        let record = await Record.ListRecords(userid);
        let collections = [];
        record.forEach(r => {
            if(!r.collections) return;
            let rCollection = r.collections;
            collections = [...collections, ...rCollection];
        })
        return new Response(JSON.stringify({ code: 1, data: collections }))
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}