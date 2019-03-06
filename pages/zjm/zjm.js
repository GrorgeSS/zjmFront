// pages/zjm/zjm.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifRegister: 0
  },

  ToPurchase:function(){
    if(app.globalData.ifRegisted == 0){
      wx.showModal({
        title: '完成注册并参与香气收集！',
        content:'前往我的页面进行登录',
        success: function (res) {
          if (res.confirm) {
            app.globalData.redirectArg = 1;
            wx.switchTab({
              url: '../user/user',
            })
          }
        }
      })
    } else{
      wx.navigateTo({
        url: '../order/order',
      })
    }
    
  },

  toExchange:function(){
    if (app.globalData.ifRegisted == 0) {
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
  },
  onShareAppMessage: function () {
    return {
      title: '孵化中国优质产品，用参与取代消费',
      path: '/pages/aroma/aroma',
      imageUrl: 'https://api.txzyzjm.xyz/imgs/share-only.jpg'
    }
  }


})