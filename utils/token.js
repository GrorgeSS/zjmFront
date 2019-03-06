import { Config } from 'config.js';

class Token {
    constructor(){
      // this.verifyUrl = Config.restUrl + 'token/verify?XDEBUG_SESSION_START=17183';
      this.tokenUrl = Config.restUrl + 'getToken/user?XDEBUG_SESSION_START=11841';
    }

    verify() {
        var token = wx.getStorageSync('token');
        if (!token) {
            this.getTokenFromServer();
        }
        else {
            this._veirfyFromServer(token);
        }
    }

    // 携带令牌去服务器校验令牌
    _veirfyFromServer(token) {
        var that = this;
        wx.request({
            url: that.verifyUrl,
            method: 'POST',
            data: {
                token: token
            },
            success: function (res) {
                var valid = res.data.isValid;
                if (!valid) {
                    that.getTokenFromServer();
                }
            }
        })
    }

    //从服务器获取token
    getTokenFromServer() {
        var that = this;
        wx.login({
            success: function (res) {
                wx.request({
                    url: that.tokenUrl,
                    method: 'POST',
                    data: {
                        code: res.code
                    },
                    success: function (res) {                    
                        // wx.setStorage('token', res.data);
                        wx.setStorage({
                          key: 'token',
                          data: res.data,
                        })
                        that.restToken = wx.getStorageSync('token');
                     
                    }
                })
            }
        })
    }
}

export {Token};