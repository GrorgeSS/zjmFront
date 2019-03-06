var restUrl = require('../../utils/config.js');

var baseUrl = restUrl.Config.restUrl;
var app = getApp();
// pages/dealer/dealer.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: 'https://api.txzyzjm.xyz/imgs/phoneAvatar.jpg',
        name: '',
        invCode: '',
        dealer: {
            order: {
                icon: 'https://api.txzyzjm.xyz/imgs/dealer/order.png',
                title: '销售订单'
            },
            intro: {
                icon: 'https://api.txzyzjm.xyz/imgs/dealer/intro.png',
                title: '介绍代理'
            },
            consumer: {
                icon: 'https://api.txzyzjm.xyz/imgs/dealer/custom.png',
                title: '我是消费者'
            },
            release: {
                icon: 'https://api.txzyzjm.xyz/imgs/dealer/task.png',
                title: '发布任务'
            }
        },
        energy: 'https://api.txzyzjm.xyz/imgs/dealer/energy.png',
        value: 'https://api.txzyzjm.xyz/imgs/dealer/value.png'
    },

    onLoad: function(){
        var that = this;
        // wx.request({
        //   url: baseUrl + 'getUsername',
        //     method: 'POST',
        //     header: {
        //         "content-type": "application/x-api-form-urlencoded",
        //         token: app.globalData.token
        //     },
        //     success: (res) => {
        //       console.log(res.data)
        //         that.setData({
        //             name: res.data
        //         })
        //     }
        // })
        if (app.globalData.avatarUrl != '') {
          this.setData({
            avatarUrl: app.globalData.avatarUrl,
            name: app.globalData.nickName
          })
        } else {
          this.setData({
            name: app.globalData.nickName
          })
        }
    },

    createInvCode: function () {
        var that = this;
        wx.request({
          url: baseUrl + 'createInvitationCode',
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded",
                token: app.globalData.token
            },
            success: (res) => {
                that.setData({
                    invCode: res.data,
                    avatarUrl: app.globalData.avatarUrl
                })
            }
        })
      
    },

    bindCancel:function () {
        // wx.navigateBack({})
    },
    onShareAppMessage: function () {
      return {
        title: '孵化中国优质产品，用参与取代消费',
        path: '/pages/aroma/aroma',
        imageUrl: 'https://api.txzyzjm.xyz/imgs/share-only.jpg'
      }
    }

})