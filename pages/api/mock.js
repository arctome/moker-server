// accept redirected requests
import Record from "../../server/entity/record";
import Token from "../../server/entity/token"
import { getParam } from "../../server/utils/utils";

export default async function MockApi(event) {
    // Get user auth from:
    // - header: Moker-Authorization (prefered)
    // - url param: token=xxx
    let auth = event.request.headers.get("Moker-Authorization");
    if (!auth) auth = getParam(event, "token");
    if (!auth) return new Response(null, { status: 403 });
    try {
        // Valiate auth
        const isExist = await Token.Verify(auth).catch(e => { throw e });
        if (!isExist) return new Response(null, { status: 403 });
        const user_id = isExist.user_id;
        // get mock_id & case_id from url params
        let mock_id = getParam(event, "mock_id")
        let case_id = getParam(event, "case_id")
        if (!mock_id) return new Response(null, { status: 404 });
        const record = await Record.ReadFullRecord(user_id, mock_id).catch(e => { throw e });
        if (!record || Object.keys(record.cases).length < 1) return new Response(null, { status: 404 });
        let data = record.cases[case_id];
        if (!data) data = record.cases[Object.keys(record.cases)[0]];
        let presetHeader = {};
        presetHeader["Content-Type"] = data.content_type || 'text/plain';
        if (data.redirect_url) presetHeader["Location"] = data.redirect_url;
        return new Response(data.body, {
            status: data.status || 200,
            headers: presetHeader
        })
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}