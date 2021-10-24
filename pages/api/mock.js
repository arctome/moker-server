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
        // const record = await Record.ReadFullRecord(user_id, mock_id).catch(e => { throw e });
        // if (!record || Object.keys(record.cases).length < 1) return new Response(null, { status: 404 });
        // let data = record.cases[case_id];
        // if (!data) data = record.cases[Object.keys(record.cases)[0]];
        // let presetHeader = {};
        // presetHeader["Content-Type"] = data.content_type || 'text/plain';
        // if (data.redirect_url) presetHeader["Location"] = data.redirect_url;
        // return new Response(data.body, {
        //     status: data.status || 200,
        //     headers: presetHeader
        // })
        // If case_id defined
        if (case_id) {
            let caseData = await Record.ReadRecordCase(user_id, mock_id, case_id).catch(e => { throw e });
            if (caseData.redirect) {
                if (!caseData.url) return new Response("[Moker] No URL delivered for redirect mode", { status: 400 })
                return new Response(null, {
                    status: 302,
                    headers: {
                        "Location": caseData.url
                    }
                })
            }
            if (caseData.proxy) {
                const resp = await fetch(caseData.url, {...event.request})
                return resp;
            }
            console.log(typeof caseData.body)
            return new Response(caseData.body, {
                headers: {
                    "Content-Type": caseData.content_type
                },
                status: caseData.status || 200
            })
        } else {
            // Or, return the record detail to client
            let fullRecord = await Record.ReadFullRecord(user_id, mock_id).catch(e => { throw e });
            return new Response(JSON.stringify({ code: 1, data: fullRecord }))
        }
    } catch (e) {
        return new Response(e.message, {
            status: 500
        })
    }
}