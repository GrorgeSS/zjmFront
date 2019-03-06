var app = getApp();
var restUrl = require('../../utils/config.js');
var baseUrl = restUrl.Config.restUrl;
Page({
  data: {
    productPic: 'https://api.txzyzjm.xyz/imgs/product.jpg',
    orderDetails: [],
    ifNoOrder: false
  },
  onLoad: function (e) {
    var that = this;
  },
  onShow: function () {
    this.getAllOrder();
  },
  getAllOrder: function(){
    var that = this;
    wx.request({
      url: baseUrl + 'allOrders',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      success: (res) => {
       
        if (res.data.data.length != 0) {
          wx.hideLoading();
          that.setData({
            orderDetails: res.data.data.data
          });
        } else if (res.data.data.length == 0 ){
          that.setData({
            ifNoOrder: true
          })
        }
        
      }
    })
  },
  goPay: function (e) {
      var that = this;
      var oid = e.currentTarget.dataset.oid;
      wx.request({
        url: baseUrl + 'pay/pre_order',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded",
          token: app.globalData.token
        },
        data: {
          id: oid,
        },
        success: (data) => {
          var resData = data.data.slice(7);
          var payData = JSON.parse(resData);
     
          var timeStamp = payData.timeStamp;
          if (timeStamp) { //可以支付
            wx.requestPayment({
              'timeStamp': payData.timeStamp,
              'nonceStr': payData.nonceStr,
              'package': payData.package,
              'signType': payData.signType,
              'paySign': payData.paySign,
              success: function () {
                wx.request({
                  url: baseUrl + 'getStatus?XDEBUG_SESSION_START=14546',
                  method: 'POST',
                  header: {
                    "content-type": "application/x-www-form-urlencoded",
                    token: app.globalData.token
                  },
                  data: {
                    status: 2,
                    id: oid
                  },
                  success: () => {
                    that.getAllOrder();
                  }
                })
                
              },
              fail: function () {
                wx.request({
                  url: baseUrl + 'getStatus',
                  method: 'POST',
                  header: {
                    "content-type": "application/x-www-form-urlencoded",
                    token: app.globalData.token
                  },
                  data: {
                    status: 1,
                    id: oid
                  },
                  success: () => {
                    that.getAllOrder();
                  }
                })
              }
            });
          }
          else {
            wx.request({
              url: baseUrl + 'getStatus',
              method: 'POST',
              header: {
                "content-type": "application/x-www-form-urlencoded",
                token: app.globalData.token
              },
              data: {
                status: 0,
                id: oid
              },
              success: () => {
                that.getAllOrder();
              }
            })
          }
        }
      })
  },
  // getOrderStatus: function (res) {
  //   var that = this;
  //   wx.request({
  //     url: baseUrl + 'getStatus',
  //     method: 'POST',
  //     header: {
  //       "content-type": "application/x-www-form-urlencoded",
  //       token: app.globalData.token
  //     },
  //     data: {
  //       status: res,
  //       id: oid
  //     }
  //   })
  // },
  DeleteOrder: function (e) {
    var that = this;
    var oid = e.currentTarget.dataset.oid;
    wx.showModal({
      title: '删除订单',
      content: '是否删除订单？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: baseUrl + 'DeleteOrder',
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded",
              token: app.globalData.token
            },
            data: {
              id: oid
            },
            success: res => {
              that.getAllOrder();
            }
          })
        } else {
          return
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '孵化中国优质产品，用参与取代消费',
      path: '/pages/aroma/aroma',
      imageUrl: 'https://api.txzyzjm.xyz/imgs/share-only.jpg'
    }
  }
})