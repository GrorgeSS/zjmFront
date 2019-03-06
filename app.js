//app.js
import { Token } from 'utils/token.js';
var baseUrl = 'https://api.txzyzjm.xyz/api/v1/';

App({
  onLaunch: function () {
  },
  globalData: {
    avatarUrl: '',
    nickName: '',
    ifRegisted: 0,
    token: '',
    resPhone: '',
    redirectArg: 0,
    identity: 0,
    shareCode :''
  }
}
)

module.exports = {
  baseUrl: baseUrl
}