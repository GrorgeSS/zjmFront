var app = getApp();
var cal = require('../../utils/cal.js');
var restUrl = require('../../utils/config.js');
import { Token } from '../../utils/token.js';
var baseUrl = restUrl.Config.restUrl;


// pages/aroma/aroma.js
Page({
  data: {
    rankList: [],//排行榜
    aromaAnimation: {},//气泡浮动动画
    noticeAnimation: {},
    pickedAroma: [],//当前收集的香气数量集合
    aromaItems: [],//后台获取香气
    num: 0,//自定义属性num
    temp: [],//转换需要的中间数组，
    total: 0,//当前香气总和,
    ifRegisted: 0,
    resPhone: '',
    shareCode: ''
  },
  // ------------------------生命周期函数-----------------------------
  onLoad: function (res) {
    app.globalData.enterCode = res.shareCode;
    var self = this;
    //获取排行榜
    wx.showLoading({
      title: '请稍后',
    });
    this.getRankLisk();

  },
 
  onShow: function () {
    //设置气泡浮动动画
    this.aromaAnimation();
    this.getCriticalInfo();
    this.checkRegisted();
  },
  onHide: function () {//后台发送数据
    this.resetTemp();
    this.resetAromaItems();
  },

  // ------------------------自定义函数-----------------------------

  getShareCode: function () {
    var self = this;
    wx.request({
      url: baseUrl + 'getShareCode',
      method: 'POST',
      header: {
        token: app.globalData.token
      },
      success: res => {
        self.setData({
          shareCode: res.data
        })
      }
    })
  },



  showTimeOut: function () {
    wx.hideLoading();
    wx.showModal({
      title: '网络错误',
      content: '请检查你的网络环境',
    })
  },

  refreshTime: function () {
    wx.request({
      url: baseUrl + 'verifyTime',
      header: {
        token: app.globalData.token
      }
    })
  },

  getCriticalInfo: function () {//先获取token
    var self = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: baseUrl + 'getToken/user',
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {//所有操作都在token后进行
            app.globalData.token = res.data;
            self.getUInfoFormDB();
            self.getAromaItems();
            wx.hideLoading();
          },
          fail: function () {
            setTimeout(self.showTimeOut, 20000);
          }
        })
      }
    })
  },
  getUInfoFormDB: function () {
    var self = this;
    wx.request({
      url: baseUrl + 'getUInfo',
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      success: res => {
        app.globalData.avatarUrl = res.data.imgUrl;
        app.globalData.nickName = res.data.username;
        app.globalData.ifRegisted = res.data.ifRegisted;
        app.globalData.resPhone = res.data.phone;
        app.globalData.identity = res.data.identity;
        app.globalData.shareCode = res.data.share_code
        self.setData({
          ifRegisted: res.data.ifRegisted,
          resPhone: res.data.phone,
          shareCode: res.data.share_code
        })
        if (self.data.resPhone != '' && self.data.shareCode == '') {
          self.getShareCode();
        } else {}
        if (app.globalData.ifRegisted == 0 && (app.globalData.enterCode != undefined || app.globalData.enterCode != null) && app.globalData.enterCode != app.globalData.shareCode ) {
          wx.request({
            url: baseUrl + 'becomeUserByShareCode',
            method: 'POST',
            header: {
              token: app.globalData.token
            },
            data: {
              shareCode: app.globalData.enterCode
            },
            success: res => {
              wx.showModal({
                title: '欢迎加入',
                content: '完成注册可帮你的好友加速并获取专属香气加成！',
                success: function (res) {
                  if (res.confirm) {
                    app.globalData.redirectArg = 1;
                    wx.switchTab({
                      url: '../user/user',
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  checkRegisted: function () {
    if (app.globalData.ifRegisted == 1 && app.globalData.resPhone == '') {
      this.setData({
        ifRegisted: 1
      })
    } else if (app.globalData.ifRegisted == 1 && app.globalData.resPhone != '') {
      this.setData({
        ifRegisted: 1,
        resPhone: 'done'
      })
    } else {
      return
    }
  },


  navTo: function (e) {//跳转函数
    var self = this;
    var ifRegisted = app.globalData.ifRegisted;
    var resPhone = app.globalData.resPhone;
    switch (e.currentTarget.dataset.nav) {
      case 'share':
        if (ifRegisted == 0 && resPhone == '') {
          wx.showModal({
            title: '完成注册并参与香气收集！',
            content: '前往我的页面进行登录',
            success: function (res) {
              if (res.confirm) {
                app.globalData.redirectArg = 1;
                wx.switchTab({
                  url: '../user/user',
                })
              }
            }
          })
          return
        } else if (ifRegisted != 0 && resPhone == '') {
          wx.showModal({
            title: '绑定手机并参与加速！',
            content: '前往我的页面进行绑定',
            success: function (res) {
              if (res.confirm) {
                app.globalData.redirectArg = 1;
                wx.switchTab({
                  url: '../user/user',
                })
              }
            }
          })
        } else {
          return;
        }
        break
      case 'task':
        if (ifRegisted == 0) {
          wx.showModal({
            title: '完成注册并参与香气收集！',
            content: '前往我的页面进行登录',
            success: function (res) {
              if (res.confirm) {
                app.globalData.redirectArg = 1;
                wx.switchTab({
                  url: '../user/user',
                })
              }
            }
          })
          return
        } else {
          wx.switchTab({
            url: '../user/user'
          });
        }

        break;
      case 'exchange':
        if (ifRegisted == 0) {
          wx.showModal({
            title: '完成注册并参与香气收集！',
            content: '前往我的页面进行登录',
            success: function (res) {
              if (res.confirm) {
                app.globalData.redirectArg = 1;
                wx.switchTab({
                  url: '../user/user',
                })
              }
            }
          })
          return
        } else {
          wx.navigateTo({
            url: '../exchange/exchange'
          });
        }
        break;
      case 'aroma':
        if (ifRegisted == 0) {
          wx.showModal({
            title: '完成注册并参与香气收集！',
            content: '前往我的页面进行登录',
            success: function (res) {
              if (res.confirm) {
                app.globalData.redirectArg = 1;
                wx.switchTab({
                  url: '../user/user',
                })
              }
            }
          })
          return
        } else {
          wx.navigateTo({
            url: '../aromaRecord/aromaRecord'
          });
        }
        break;
      case 'intro':
        wx.navigateTo({
          url: '../introduce/introduce'
        });
        break;
    };

  },

  getRankLisk: function () {//获得排行榜函数
    var self = this;
    wx.request({
      url: baseUrl + 'rank',
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: res => {
        self.setData({
          rankList: res.data
        })
      }
    });
  },

  pickAroma: function (e) {//每次点击收集香气函数
    var self = this;
    var pickedAroma = [];
    var aromaItems = self.data.aromaItems;
    var index = e.currentTarget.dataset.num;
    var total = self.data.total;
    var newTotal = 0;
    var temp = self.data.temp;
    var ifRegisted = self.data.ifRegisted;

    //设置隐藏不可点击
    if (app.globalData.ifRegisted == 0) {
      wx.showModal({
        title: '完成注册并参与香气收集！',
        content: '前往我的页面进行登录',
        success: function (res) {
          app.globalData.redirectArg = 1;
          if (res.confirm) {
            wx.switchTab({
              url: '../user/user',
            })
          }
        }
      })
      return;
    } else {
      aromaItems[index].hidden = !aromaItems[index].hidden;
      self.setData({
        aromaItems: aromaItems,
      })

      //每次收集获得总和total
      if (aromaItems[index].hidden) {
        newTotal = cal.accAdd(total, aromaItems[index].fragrance_quantity)
        self.setData({
          total: newTotal.toFixed(2)
        })
      }

      //获得当前收集了的香气的fragrance_quantity
      for (let i = 0; i < aromaItems.length; i++) {
        if (aromaItems[i].hidden) {
          pickedAroma.push(aromaItems[i].fragrance_quantity);
          self.setData({
            pickedAroma: pickedAroma,
          })
        }

      };

      //当前操作收集完毕(用于“正在生成中”的显示！！！此时未发送收集请求！！！)
      if (pickedAroma.length == aromaItems.length && temp.length !== 0) {
        temp = [];
        self.setData({
          temp: temp,
        })
      }
    }

  },

  resetTemp: function () {//重置temp，用于当前收集但未收集完的情形
    var self = this;
    var aromaItems = this.data.aromaItems;
    var temp = self.data.temp;
    var newArr = [];
    var pickedAroma = self.data.pickedAroma;

    //新的temp中不含有picked的项目，即未收集的项目
    for (let i = 0; i < temp.length; i++) {
      if (pickedAroma.indexOf(temp[i]) === -1) {
        newArr.push(temp[i])
      }

    }
    self.setData({
      temp: newArr
    })
  },

  getAromaItems: function () {
    var self = this;
    var sendItem = {};
    // sendItem.time = Date.now();

    wx.request({
      url: baseUrl + 'create',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: sendItem,
      success: res => {
        var total = res.data.total;
        var newTotal = Number(total).toFixed(2)
        if (res.statusCode === 500) {
          wx.showModal({
            title: '网络错误',
            content: '请检查网络连接',
          })
        } else {
          self.setData({
            aromaItems: res.data.item,
            total: newTotal
          })
          self.refreshTime();
          self.setAromaItems();//异步数据获取不到问题
        }

      }

    });

  },

  setAromaItems: function () {//获得香气items
    var self = this;
    var aromaItems = this.data.aromaItems;
    var temp = self.data.temp;

    //temp是每个香气的数量
    for (let i = 0; i < aromaItems.length; i++) {
      temp.push(aromaItems[i].fragrance_quantity);
    };
    self.setData({
      temp: temp
    })
  },

  aromaAnimation: function () {//气泡浮动动画函数
    var self = this;
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease-out",
      delay: 0
    });
    this.animation = animation;
    function movement() {
      animation.translateY(-5).step();
      animation.translateY(0).step();
    }
    setInterval(function () {
      movement();
      self.setData({
        aromaAnimation: animation.export()
      })
    }.bind(self), 1000);
  },

  resetAromaItems: function () {//重置香气items
    var self = this;
    var aromaItems = this.data.aromaItems;
    var temp = self.data.temp;
    var pickedAroma = self.data.pickedAroma;
    var newAromaItems = [];

    //新的aromaItems中删除收集的项目，剩下未收集的项目
    for (let i = 0; i < aromaItems.length; i++) {
      if (temp.indexOf(aromaItems[i].fragrance_quantity) !== -1) {
        newAromaItems.push(aromaItems[i])
      }
    }

    //先发送，再清空，如果picked为空，则不发送
    var sendItem = {};//后端要求的传输格式
    // sendItem.token = token;
    sendItem.pickedAroma = pickedAroma;
    wx.request({
      url: baseUrl + 'collect',
      method: 'POST',
      data: sendItem,
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      }
    })

    pickedAroma = [];

    self.setData({
      aromaItems: newAromaItems,
      pickedAroma: pickedAroma
    })
  },

  onShareAppMessage: function (e) {
    var self = this;
    if (e.from === 'button') {
      return {
        title: '我正在参与首批区块链应用，帮我加速，获取专属回报!',
        path: '/pages/aroma/aroma' + '?shareCode=' + self.data.shareCode,
        imageUrl: 'https://api.txzyzjm.xyz/imgs/share.jpg',
        success: function () {
          wx.showModal({
            title: '分享成功',
            content: '成功邀请用户完成注册后，可额外获得5点香气加成！',
          })
        }
      }
    } else {
      return {
        title: '孵化中国优质产品，用参与取代消费',
        path: '/pages/aroma/aroma',
        imageUrl: 'https://api.txzyzjm.xyz/imgs/share-only.jpg'
      }
    }

  }


})