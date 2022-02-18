const APP_ID = process.env.CLIENT_ID;
const APP_SECERET = process.env.CLIENT_SECRET;
const TOKEN_ENDPOINT = `${process.env.MS_AUTH_URL}${process.env.TENANT_ID}/oauth2/v2.0/token`;
const MS_GRAPH_SCOPE = process.env.GRAPH_API_URL;

const axios = require("axios");
const qs = require("qs");

const tokenRequest = {
  client_id: APP_ID,
  scope: MS_GRAPH_SCOPE,
  client_secret: APP_SECERET,
  grant_type: "client_credentials",
};

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

let token = "";

async function getToken(tokenRequest) {
    try {
        const response = await axios.post(TOKEN_ENDPOINT, qs.stringify(tokenRequest));
        console.log("RESPONSE:", response.data);
        return response.data.access_token;
    }catch(e) {
        console.log("ERROR1:", error);
    }
}

module.exports = {
	tokenRequest: tokenRequest,
	getToken: getToken
};