import { requestTypeLimitor } from '../../../server/utils/utils'
import Token from '../../../server/entity/token';
import UserVerify from '../../../server/controllers/user-verify';

export default async function AdminListTokenApi(event) {
    let res = requestTypeLimitor(event, "GET")
    if (res) return res;
    let urlSearch = new URL(event.request.url).searchParams;
    let page = urlSearch.get('page') || 1;
    let size = urlSearch.get('size') || 20;
    let cursor = urlSearch.get('cursor') || "";
    let userCheck = await UserVerify(event).catch(e => { throw e });
    if (!userCheck.ok) return new Response(null, { status: 403 });
    let userid = userCheck.userid;
    let data = await Token.List(userid, { page, size, cursor }).catch(e => { throw e });
    if (!data) return new Response(JSON.stringify({ code: 0, msg: "No data fetched" }));
    return new Response(JSON.stringify({ code: 1, data }))
}