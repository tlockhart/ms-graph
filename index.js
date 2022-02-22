// read in env settings
require("dotenv").config();
const fetch = require("./services/fetch");
const auth = require("./services/auth");
const requestUtils = require("./utils/request.utils");

const logger = require("./logger");
const msTeamsUtils = require("./utils/ms-teams.utils");

class Index {
  async invoke() {
    // Step 1: Get AuthToken
    const authResponse = await auth.getToken();
    console.log("AUTHRESPONSE:", authResponse);

    const MSGraph = await auth.getToken();
    console.log("MSGRAPH:", MSGraph);

    // Step 2: Get Users:
    const users = await fetch.getRequest(
      auth.apiConfig.getUsers,
      authResponse.accessToken
    );
    console.log("USERS:", users);

    // Step 3: Get Team Profiles
    const user = [];
    users.value.map(async (item, index) => {
      const userURL = `${auth.apiConfig.getUsers}/${item.id}`;
      console.log("USERURL:", userURL);
      user[index] = await fetch.getRequest(userURL, authResponse.accessToken);
      console.log(`TEAM_USER_${index} PROFILE`, user[index]);
    });

    // Step 4: Create Group:
    console.log("APIGROUPS:", auth.apiConfig.createGroups);
    const now = new Date().getTime();
    let options = {
      method: "POST",
      url: auth.apiConfig.createGroups,
      headers: {
        Authorization: `Bearer ${authResponse.accessToken}`,
        "Content-Type": "application/json",
      },
      body: {
        description: "prototyping-platform",
        displayName: "prototyping-platform",
        groupTypes: ["Unified"],
        mailEnabled: false,
        mailNickname: `Dummy_${now}`,
        securityEnabled: true,
        "owners@odata.bind": [
          `https://graph.microsoft.com/v1.0/users/${process.env.OWNER_ID}`,
        ],
      },
      json: true,
    };

    const group = await requestUtils.request(options);
    console.log("GROUP:", group);

    // Step5: Create team (ChatRoom)
    const teamURL = `${auth.apiConfig.createGroups}/${group.id}/team`;
    console.log("TEAM_URL:", teamURL);

    options = {
      method: "PUT",
      url: teamURL,
      headers: {
        Authorization: `Bearer ${authResponse.accessToken}`,
        "Content-Type": "application/json",
      },
      body: {
        memberSettings: { allowCreateUpdateChannels: true },
        messagingSettings: {
          allowUserEditMessages: true,
          allowUserDeleteMessages: true,
        },
        funSettings: {
          allowGiphy: true,
          giphyContentRating: "strict",
        },
      },
      json: true,
    };

    const team = await requestUtils.request(options, true);
    console.log("TEAM:", team);
  }
}

new Index().invoke();
