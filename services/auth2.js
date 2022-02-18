const msal = require('@azure/msal-node');

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md 
 */
const msalConfig = {
	auth: {
		clientId: process.env.CLIENT_ID,
		authority: process.env.MS_AUTH_URL + process.env.TENANT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	}
};

/**
 * With client credentials flows permissions need to be granted in the portal by a tenant administrator.
 * The scope is always in the format '<resource>/.default'. For more, visit: 
 * https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow 
 */
const tokenRequest = {
	scopes: [process.env.GRAPH_API_URL+ '.default'],
};
const rootURL = process.env.GRAPH_API_URL+ 'v1.0/';
const apiConfig = {
	getUsers:  rootURL+'users',
	createGroup: rootURL+'groups',
	createTeam:  rootURL+'teamsTemplates(\'standard\')',
	createChannel: rootURL+'/teams/team00000000/channels',

};

/**
 * Initialize a confidential client application. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md
 */
const cca = new msal.ConfidentialClientApplication(msalConfig);

/**
 * Acquires token with client credentials.
 * @param {object} tokenRequest 
 */
async function getToken(tokenRequest) {
	const token = await cca.acquireTokenByClientCredential(tokenRequest);
	console.log("@@@@@@@@@@@@@@TOKEN:", token)
	return token;
}

module.exports = {
	apiConfig: apiConfig,
	tokenRequest: tokenRequest,
	getToken: getToken
};
