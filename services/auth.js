const msal = require('@azure/msal-node');

const APP_ID = process.env.CLIENT_ID;
const APP_SECRET = process.env.CLIENT_SECRET;
const TOKEN_ENDPOINT = `${process.env.MS_AUTH_URL}${process.env.TENANT_ID}`;
const MS_GRAPH_SCOPE = process.env.GRAPH_API_URL;

const tokenRequest = {
	scopes: [MS_GRAPH_SCOPE + '.default'],
};

const msalConfig = {
	auth: {
		clientId: APP_ID,
		authority: TOKEN_ENDPOINT ,
		clientSecret: APP_SECRET,
    tenantId: process.env.TENANT_ID,
	}
};

//MS AD Token
const cca = new msal.ConfidentialClientApplication(msalConfig);

/**
 * Acquires token with client credentials.
 * @param {object} tokenRequest 
 */
async function getToken() {
	const token = await cca.acquireTokenByClientCredential(tokenRequest);
	console.log("@@@@@@@@@@@@@@TOKEN:", token)
	return token;
}


const rootURL = MS_GRAPH_SCOPE+ 'v1.0/';
const apiConfig = {
	getUsers:  rootURL+'users',
  createGroups: rootURL+'groups',
//   getUser:rootURL+'users/user',
}

module.exports = {
  apiConfig: apiConfig,
	tokenRequest: tokenRequest,
	getToken: getToken
};