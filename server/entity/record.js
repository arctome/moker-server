import { nanoid } from 'nanoid';

// Find record via 2 collections, "Record" & "Cases"
const Record = {
    CreateRecord: async function (user_id, data, cases) {
        if (!data || !user_id || !cases || !Array.isArray(cases)) throw new Error("Required fields missing");
        const record_id = nanoid(12);
        // Required fields: name
        if (!data.name || !data.url) throw new Error("Required fields missing");
        // Create Cases Task
        const createCasesQuene = [];
        const casesId = []
        for (let i = 0; i < cases.length; i++) {
            if (!cases[i].case_id) cases[i].case_id = nanoid(4);
            casesId.push(cases[i].case_id);
            createCasesQuene.push(MOKER_STORAGE_CASES.put(record_id + ':' + cases[i].case_id, cases[i].body || "null", {
                metadata: {
                    status: 200,
                    content_type: cases[i].content_type || "text/plain",
                    redirect: cases[i].redirect || false,
                    proxy: cases[i].proxy || false,
                    url: cases[i].url || "",
                    cors: cases[i].cors || false
                }
            }))
        }
        if (createCasesQuene.length > 0) await Promise.all(createCasesQuene).catch(e => { throw e });
        await MOKER_STORAGE_RECORD.put(record_id, casesId.join(','), {
            metadata: {
                name: data.name,
                url: data.url,
                collections: data.collections || "",
                private_read: data.private_read ? user_id : false,
                owner_id: user_id,
                c_time: Date.now()
            }
        })
        return record_id;
    },
    UpdateRecordMetadata: async function (user_id, record_id, patch_data) {
        if (!user_id || !record_id || !patch_data) throw new Error("Requied fields missing");
        let oldCases = await MOKER_STORAGE_RECORD.getWithMetadata(record_id).catch(e => { throw e });
        if (!oldCases) return false;
        await MOKER_STORAGE_RECORD.put(record_id, oldCases.value, {
            metadata: {
                name: patch_data.name,
                url: patch_data.url,
                collections: patch_data.collections || "",
                private_read: patch_data.private_read ? user_id : false,
                owner_id: oldCases.metadata.owner_id,
                c_time: oldCases.metadata.c_time
            }
        })
        return true;
    },
    AddCaseToRecord: async function (user_id, record_id, case_data) {
        // valiate user, record, and case
        if (!user_id || !record_id || !case_data) throw new Error("Requied fields missing");
        let oldCases = await MOKER_STORAGE_RECORD.getWithMetadata(record_id).catch(e => { throw e });
        if (!oldCases) return false;
        oldCases.value = oldCases.value ? oldCases.value.split(",") : []
        // generate a case
        if (!case_data.case_id) case_data.case_id = nanoid(4);
        await MOKER_STORAGE_CASES.put(record_id + ':' + case_data.case_id, case_data.body, {
            metadata: {
                status: 200,
                content_type: case_data.content_type || "text/plain",
                redirect: case_data.redirect || false,
                proxy: case_data.proxy || false,
                url: case_data.url || "",
                cors: case_data.cors || false
            }
        }).catch(e => { throw e })
        if (!oldCases.value.includes(case_data.case_id)) {
            await MOKER_STORAGE_RECORD.put(record_id, [...oldCases.value, case_data.case_id].join(","), { metadata: oldCases.metadata }).catch(e => { throw e });
        }
        return true;
    },
    RemoveCaseFromRecord: async function (user_id, record_id, case_id) {
        // valiate user, record, and case
        if (!user_id || !record_id || !case_id) throw new Error("Requied fields missing");
        let oldCases = await MOKER_STORAGE_RECORD.getWithMetadata(record_id).catch(e => { throw e });
        if (!oldCases) return false;
        if (!oldCases.value.includes(case_id)) return false;
        oldCases.value = oldCases.value.split(",")
        // delete case
        await MOKER_STORAGE_CASES.delete(record_id + ':' + case_id).catch(e => { throw e });
        oldCases.value.splice(oldCases.value.indexOf(case_id), 1)
        await MOKER_STORAGE_RECORD.put(record_id, oldCases.value.join(","), { metadata: oldCases.metadata }).catch(e => { throw e });
        return true;
    },
    ReadRecordCase: async function (user_id, record_id, case_id) {
        if (!user_id || !record_id || !case_id) throw new Error("Requied fields missing");
        // valiate case_id is in record
        let record = await MOKER_STORAGE_RECORD.getWithMetadata(record_id);
        if (!record || !record.value.split(',').includes(case_id)) return null;
        if (record.metadata.private_read && record.metadata.private_read !== user_id) return null;
        let theCase = await MOKER_STORAGE_CASES.getWithMetadata(record_id + ':' + case_id);
        return {
            ...theCase.metadata,
            body: theCase.value
        }
    },
    ReadFullRecord: async function (user_id, record_id) {
        if (!user_id || !record_id) throw new Error("Requied fields missing");
        let record = await MOKER_STORAGE_RECORD.getWithMetadata(record_id);
        if (!record) throw new Error("Required key not found");
        if (record.metadata.private_read && record.metadata.private_read !== user_id) return null;
        return {
            cases: record.value,
            ...record.metadata,
            collections: record.metadata.collections
        }
    },
    DelRecord: async function (user_id, record_id) {
        if (!user_id || !record_id) throw new Error("Requied fields missing");
        let record = await MOKER_STORAGE_RECORD.getWithMetadata(record_id);
        if (!record) throw new Error("Required key not found");
        if (record.metadata.owner.user_id !== user_id) return false;
        await MOKER_STORAGE_RECORD.delete(record_id).catch(e => {
            throw new Error("KV write error");
        })
        let cleanCasesQuene = []
        record.split(",").forEach(case_id => {
            cleanCasesQuene.push(MOKER_STORAGE_CASES.delete(record_id + ':' + case_id));
        })
        await Promise.all(cleanCasesQuene).catch(e => { console.log("Errors occur in deleting " + record_id + "'s cases (" + e.message + ")") })
        return true;
    },
    DelCaseFromRecord: async function (user_id, record_id, case_id) {
        if (!user_id || !record_id || !case_id) throw new Error("Requied fields missing");
        let oldRecord = await MOKER_STORAGE_RECORD.getWithMetadata(record_id).catch(e => { throw e });
        let oldCase = await this.ReadRecordCase(user_id, record_id, case_id).catch(e => { throw e });
        if (!oldRecord.value || !oldCase || oldRecord.value.indexOf(case_id) < 0) return false;
        oldRecord = oldRecord.value.split(",")
        await MOKER_STORAGE_RECORD.put(record_id, oldRecord.splice(oldRecord.indexOf(case_id), 1).join(",")).catch(e => { throw e });
        await MOKER_STORAGE_CASES.delete(record_id + ':' + case_id)
    },
    ListRecords: async function (user_id, collection = "", cursor = "") {
        if (!user_id) throw new Error("Requied fields missing");
        let keys = await MOKER_STORAGE_RECORD.list({ cursor })
        let result = [];
        keys.keys.forEach(key => {
            if (key.metadata.private_read && key.metadata.private_read !== user_id) return;
            let record_id = key.name.replace(user_id + ":", "")
            if (!collection || key.metadata.collections.includes(collection) ) {
                result.push(
                    {
                        record_id,
                        ...key.metadata
                    }
                )
            }
        })
        return result;
    }
}

export default Record;