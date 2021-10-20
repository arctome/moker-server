import { requestTypeLimitor } from '../../../../server/utils/utils'
import UserVerify from '../../../../server/controllers/user-verify'
import User from '../../../../server/entity/user';

export default async function AdminUserUpdateApi(event) {
    let res = requestTypeLimitor(event, "POST");
    if (res) return res;
    let user = await UserVerify(event);
    if (!user.ok || user.userid !== 'admin') return new Response(null, { status: 403 });
    let reqJson = await event.request.json();
    if (!reqJson.user_id || !reqJson.username || !reqJson.password) return new Response(null, { status: 400 });
    let result = await User.UpdateUser(reqJson.user_id, reqJson).catch(e => { throw e });
    return new Response(JSON.stringify({ code: result ? 1 : 0 }))
}