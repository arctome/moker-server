import { requestTypeLimitor } from '../../../server/utils/utils'
import UserVerify from '../../../server/controllers/user-verify'
import User from '../../../server/entity/user';

export default async function UserInfoApi(event) {
    let res = requestTypeLimitor(event, "GET");
    if (res) return res;
    let user = await UserVerify(event);
    if (!user.ok) return new Response(null, { status: 404 });
    let userinfo = await User.ReadUserMeta(user.userid).catch(e => {throw e});
    return new Response(JSON.stringify({ code: userinfo ? 1 : 0, data: {
        user_id: userinfo.user_id,
        username: userinfo.name
    }}))
}