import { requestTypeLimitor } from '../../../../server/utils/utils'
import UserVerify from '../../../../server/controllers/user-verify'
import User from '../../../../server/entity/user';

export default async function AdminUserListApi(event) {
    let res = requestTypeLimitor(event, "GET");
    if (res) return res;
    let user = await UserVerify(event);
    if (!user.ok || user.userid !== 'admin') return new Response(null, { status: 403 });
    let result = await User.ListUser().catch(e => { throw e });
    return new Response(JSON.stringify({ code: result ? 1 : 0, data: result }))
}