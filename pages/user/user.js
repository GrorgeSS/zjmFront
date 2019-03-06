var restUrl = require('../../utils/config.js');
var baseUrl = restUrl.Config.restUrl;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifRegisted: 0,
    loginHidden: true,
    loginPannelHidden: true,
    send: true,
    second: 60,
    alreadySend: false,
    phone: '',
    resPhone: '',
    avatarUrl: '',
    code: '',
    userInfo: {
      avatarUrl: 'https://api.txzyzjm.xyz/imgs/phoneAvatar.jpg',
      nickName: null
    },
    features: {
      order: {
        icon: 'https://api.txzyzjm.xyz/imgs/featrues/order.png',
        title: '我的订单'
      },
      afterSale: {
        icon: 'https://api.txzyzjm.xyz/imgs/featrues/afterSale.png',
        title: '售后&客服'
      },
      dealer: {
        icon: 'https://api.txzyzjm.xyz/imgs/featrues/dealer.png',
        title: '我是经销商'
      },
      exchange: {
        icon: 'https://api.txzyzjm.xyz/imgs/featrues/exchange.png',
        title: '兑换商城'
      }
    },
    manage: {
      rightIcon: '',
      address: {
        icon: 'https://api.txzyzjm.xyz/imgs/manage/address.png',
        title: '我的地址'
      },
      beDealer: {
        icon: 'https://api.txzyzjm.xyz/imgs/manage/be-dealer.png',
        title: '成为经销商'
      }
    },
    task: {
      title: '做任务赚香气',
      a: {
        icon: 'https://api.txzyzjm.xyz/imgs/task/1.png',
        title: '知识变现'
      },
      b: {
        icon: 'https://api.txzyzjm.xyz/imgs/task/2.png',
        title: '寻找优品'
      },
      c: {
        icon: 'https://api.txzyzjm.xyz/imgs/task/3.png',
        title: '为产品定价'
      }
    }
  },

  onShow: function () {
    this.checkRegisted();
  },

  checkRegisted: function () {
    if (app.globalData.ifRegisted == 0 && app.globalData.redirectArg == 0) {
      return;
    } else if (app.globalData.redirectArg != 0) {
      app.globalData.redirectArg = 0;
      this.setData({
        ifRegisted: 1,
        loginHidden: !this.data.loginHidden
      })
    } else {
      this.setData({
        ifRegisted: 1,
        userInfo: {
          avatarUrl: app.globalData.avatarUrl == '' ? 'https://api.txzyzjm.xyz/imgs/phoneAvatar.jpg' : app.globalData.avatarUrl,
          nickName: app.globalData.nickName
        },
        resPhone: app.globalData.resPhone,
        avatarUrl: app.globalData.avatarUrl
      })
    }
  },

  assertIsDealer: function () {
    var that = this;
    if (app.globalData.resPhone ==''){
      wx.showModal({
        title: '绑定手机',
        content: '点击头像绑定手机后可参与成为经销商环节',
      }) 
      return
    } else {
      wx.request({
        url: baseUrl + 'authority',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded",
          token: app.globalData.token
        },
        success: (res) => {
          if (res.data == 1) {
            wx.navigateTo({
              url: '/pages/dealer/dealer'
            })
          }
          if (res.data == 0) {
            wx.showModal({
              title: '提示',
              content: '你不是经销商用户，请申请成为经销商',
              confirmText: '去申请',
              cancelText: '取消',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/be-dealer/be-dealer'
                  })
                } else if (res.cancel) {
                  return '';
                }
              }
            })
          }
        }
      })}
  },

  showLogin: function () {
    if (this.data.ifRegisted == 1 && this.data.avatarUrl != '' && this.data.resPhone != '') {
      return
    } else {
      this.setData({
        loginHidden: !this.data.loginHidden
      })
    }

  },

  showLoginPannel: function () {
    this.setData({
      loginHidden: !this.data.loginHidden,
      loginPannelHidden: !this.data.loginPannelHidden
    })
  },

  cancelLogin: function () {
    this.setData({
      loginHidden: !this.data.loginHidden
    })
  },

  cancelLoginPannel: function () {
    this.setData({
      loginPannelHidden: !this.data.loginPannelHidden
    })
  },

  //手机号码部分
  getPhone: function (e) {
    var phone = e.detail.value;
    if (phone.length === 11) {
      let checkedNum = this.checkPhoneNum(phone)
      if (checkedNum) {
        this.setData({
          phone: phone
        })
      }
    } else {

    }
  },

  checkPhoneNum: function (phone) {
    let str = /^1\d{10}$/
    if (str.test(phone)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        image: 'https://api.txzyzjm.xyz/imgs/manage/fail.png'
      })
      return false
    }
  },

  getCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  //获取验证码
  sendMsg: function () {
    var phone = this.data.phone;
    if (phone.length === 11) {
      wx.request({
        url: baseUrl + 'sendSms?XDEBUG_SESSION_START=12082',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: {
          phone: phone
        }
      })
      this.setData({
        alreadySend: true,
        send: false
      })
      this.timer()
    } else {
      wx.showToast({
        title: '请输入手机号码',
        image: 'https://api.txzyzjm.xyz/imgs/manage/fail.png'
      })
    }
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  //微信登录
  bindgetuserinfo: function (res) {
    var self = this;
    var rawData = JSON.parse(res.detail.rawData);
    wx.request({
      url: baseUrl + 'setUInfo',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: {
        nickName: rawData.nickName,
        avatarUrl: rawData.avatarUrl,
        ifRegisted: 1,
      },
      success: res => {
        app.globalData.ifRegisted = 1;
        app.globalData.avatarUrl = rawData.avatarUrl;
        app.globalData.nickName = rawData.nickName;
        this.setData({
          ifRegisted: 1,
          avatarUrl: 'done',
          userInfo: {
            avatarUrl: rawData.avatarUrl,
            nickName: rawData.nickName
          }
        })
      }
    });
    this.cancelLogin();
  }
  ,

  //手机登录
  toLoginPannel: function () {
    var code = this.data.code,
      phone = this.data.phone;
    if (code === '' || phone === '') {
      wx.showToast({
        title: '请正确填写信息',
        image: 'https://api.txzyzjm.xyz/imgs/manage/fail.png'
      })
    } else {
      wx.request({
        url: baseUrl + 'login?XDEBUG_SESSION_START=19184',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded",
          token: app.globalData.token
        },
        data: {
          code: code
        },
        success: res => {
   
          if (res.data === 0) {
            wx.showToast({
              title: '验证码错误',
              image: 'https://api.txzyzjm.xyz/imgs/manage/fail.png'
            })
          } else {
            var setImgUrl = res.data.imgUrl != '' ? res.data.imgUrl : 'https://api.txzyzjm.xyz/imgs/phoneAvatar.jpg';

            app.globalData.ifRegisted = 1;
            app.globalData.resPhone = 'done';
            this.setData({
              loginPannelHidden: !this.data.loginPannelHidden,
              ifRegisted: 1,
              resPhone: 'done',
              userInfo: {
                avatarUrl: setImgUrl,
                nickName: app.globalData.avatarUrl == '' ? res.data.username : app.globalData.nickName
              }
            })
          }
        },
        fail: () => {
          return
        }
      })
    }
  },
  toExchange: function () {
    if (app.globalData.ifRegisted == 0) {
      wx.showModal({
        title: '完成注册并参与香气收集！'
      });
    } else {
      wx.navigateTo({
        url: '../exchange/exchange',
      })
    }

  },
  onShareAppMessage: function () {
    return {
      title: '孵化中国优质产品，用参与取代消费',
      path: '/pages/aroma/aroma',
      imageUrl: 'https://api.txzyzjm.xyz/imgs/share-only.jpg'
    }
  }

})