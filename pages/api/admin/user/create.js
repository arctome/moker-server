import { requestTypeLimitor } from '../../../../server/utils/utils'
import UserVerify from '../../../../server/controllers/user-verify'
import User from '../../../../server/entity/user';

export default async function AdminUserCreateApi(event) {
    let res = requestTypeLimitor(event, "POST");
    if (res) return res;
    let user = await UserVerify(event);
    if (!user.ok || user.userid !== 'admin') return new Response(null, { status: 403 });
    let reqJson = await event.request.json();
    if (!reqJson.user_id || !reqJson.username || !reqJson.password) return new Response(null, { status: 400 });
    let isExist = await User.CheckUserIDExist(reqJson.user_id).catch(e => {throw e});
    if(isExist) return new Response(JSON.stringify({code: 0, msg: "User id has been used, please try another one"}))
    let result = await User.CreateUser(reqJson).catch(e => { throw e });
    return new Response(JSON.stringify({ code: result ? 1 : 0 }))
}