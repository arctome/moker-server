import { requestTypeLimitor } from '../../../server/utils/utils'
import UserVerify from '../../../server/controllers/user-verify'
import User from '../../../server/entity/user';

export default async function UserUpdateApi(event) {
    let res = requestTypeLimitor(event, "POST");
    if (res) return res;
    let user = await UserVerify(event);
    if (!user.ok) return new Response(null, { status: 404 });
    let reqJson = await event.request.json();
    if (!reqJson.username) return new Response(null, { status: 400 });
    let userinfo = await User.UpdateUser(user.userid, { username: reqJson.username }).catch(e => { throw e });
    return new Response(JSON.stringify({
        code: userinfo ? 1 : 0
    }))
}