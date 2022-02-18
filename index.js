// read in env settings
require('dotenv').config();
const auth = require('./services/auth');

const logger = require('./logger')

// async function getToken() {
//     const authResponse = await auth.getToken(auth.tokenRequest);
//     console.log('$$$$$$$$$$$$$$$$$$$$$$$:', authResponse);
//     return authResponse;
// }
// console.log("GETTOKEN::::::::::::::::::::::::;;", await getToken());

const msTeamsService = require('./services/ms-teams-service');
const teamCreationPayload = {
  // authorization: getToken(),
  teamName: '',
  teamMembers: [{
    userId: 'tony.lockhart@ymail.com',
    role: 'admin'
  },
//   {
//     userId: 'dummy_1@gmail.com',
//     role: 'admin'
//   }
]
}

class Index {
  async invoke () {
    try {
      console.log("AUTHREQUEST:", auth.tokenRequest) ;
      const authResponse = await auth.getToken(auth.tokenRequest);
      console.log("AUTHRESPONSE:", authResponse);

      teamCreationPayload.authorization = authResponse;
      
      const { message } = await msTeamsService.createTeam(teamCreationPayload)
      logger.info('Index:invoke: Team created ', { message })
    } catch (error) {
      logger.error('Index:invoke: Error during team creation ', { error })
    }
  }
}

new Index()
  .invoke()

