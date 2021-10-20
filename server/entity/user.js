import hmacSHA512toHex from '../utils/encrypt'

const User = {
    /**
     * Basic user scheme
     * @param {object} data
     * @param {object} data.userid
     * @param {string} data.username
     * @param {string} data.password HMAC + SHA512 password
     */
    CheckUserIDExist: async function (userid) {
        if (userid === 1) return true;
        const existUser = await MOKER_STORAGE_USER.get(userid);
        if (!existUser) return false;
        return true;
    },
    ReadUser: async function (userid, password) {
        if (!userid || !password) throw new Error("Required fields missing");
        if(userid === 'admin') {
            let existUser = await MOKER_STORAGE_USER.getWithMetadata(userid).catch(e => {throw e});
            if(password !== MOKER_ADMIN_PASSWORD) {
                return false;
            }
            return { ...existUser.metadata, user_id: userid} || { name: 'admin' }
        } else {
            let existUser = await MOKER_STORAGE_USER.getWithMetadata(userid).catch(e => {throw e});
            password = await hmacSHA512toHex(password, MOKER_VARS_HMAC_SALT);
            if(password !== existUser.value) return false;
            return { ...existUser.metadata, user_id: userid} || {};
        }
    },
    ReadUserMeta: async function (userid) {
        if (!userid) throw new Error("Required fields missing");
        if(userid === 'admin') {
            let existUser = await MOKER_STORAGE_USER.getWithMetadata(userid).catch(e => {throw e});
            return existUser && existUser.metadata ? { ...existUser.metadata, user_id: userid} : { name: 'admin', user_id: 'admin' }
        } else {
            let existUser = await MOKER_STORAGE_USER.getWithMetadata(userid).catch(e => {throw e});
            return existUser && existUser.metadata ? { ...existUser.metadata, user_id: userid} : { user_id: userid };
        }
    },
    CreateUser: async function (data) {
        if (!data.user_id || !data.username || !data.password) throw new Error("Required fields missing");
        const userid = data.user_id;
        const isExist = await this.CheckUserIDExist(userid);
        if (isExist) throw new Error("Duplicated key");
        // const formattedData = {
        //     username: data.username,
        //     password: await hmacSHA512toHex(data.password, MOKER_VARS_HMAC_SALT)
        // }
        const password = await hmacSHA512toHex(data.password, MOKER_VARS_HMAC_SALT).catch(e => { throw e })
        await MOKER_STORAGE_USER.put(userid, password, {
            metadata: {
                name: data.username,
            }
        }).catch(e => {
            throw new Error("KV write failed")
        })
        return userid;
    },
    DelUser: async function (userid) {
        if (!userid) throw new Error("Required fields missing");
        if (userid === 'admin') throw new Error("Role not qualified")
        const isExist = await this.CheckUserIDExist(userid);
        if (!isExist) throw new Error("Required key not found");
        await MOKER_STORAGE_USER.delete(userid).catch(e => {
            throw new Error("KV write failed")
        })
        return true;
    },
    UpdateUser: async function (userid, data) {
        if (!userid) throw new Error("Required key missing");
        if (!data) throw new Error("Required fields missing");
        const user = await MOKER_STORAGE_USER.getWithMetadata(userid);
        if (userid === 'admin') {
            // Admin's username & password cannot be updated via api,
            // if you really need, edit the `wrangler.toml` and re-deploy.
            throw new Error("Role not qualified");
        }
        if (!user) throw new Error("Required key not found");
        // valiate submitted data
        const patchData = {};
        if (!data.username && !data.password) throw new Error("Required fields missing");
        if (data.username) patchData.username = data.username;
        if (data.password) patchData.password = await hmacSHA512toHex(data.password, MOKER_VARS_HMAC_SALT).catch(e => {
            e.message = "Internal service error: encrypt";
            throw e;
        });
        await MOKER_STORAGE_USER.put(userid, patchData.password || user.value, { metadata: { name: patchData.username || user.metadata.name } }).catch(e => {
            throw new Error("KV write failed")
        })
        return true;
    },
    ListUser: async function() {
        let users = await MOKER_STORAGE_USER.list().catch(e => {throw e});
        if(!users || !users.keys) return false;
        users = users.keys.map(user => {
            return {
                user_id: user.name,
                username: user.metadata.name
            }
        })
        return users;
    }
}

export default User;