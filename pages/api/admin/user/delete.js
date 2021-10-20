import { requestTypeLimitor } from '../../../../server/utils/utils'
import UserVerify from '../../../../server/controllers/user-verify'
import User from '../../../../server/entity/user';

export default async function AdminUserDeleteApi(event) {
    let res = requestTypeLimitor(event, "POST");
    if (res) return res;
    let user = await UserVerify(event);
    if (!user.ok || user.userid !== 'admin') return new Response(null, { status: 403 });
    let reqJson = await event.request.json();
    if (!reqJson.user_id) return new Response(null, { status: 400 });
    let result = await User.DelUser(reqJson.user_id).catch(e => { throw e });
    return new Response(JSON.stringify({ code: result ? 1 : 0 }))
}