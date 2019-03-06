//index.js
//获取应用实例
var restUrl = require('../../utils/config.js');
var baseUrl = restUrl.Config.restUrl;
var app = getApp()
Page({
  data: {
    addressList: []
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    wx.request({
      url: baseUrl+'getAddressOne',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: {
        id: id,
        // isDefault:'true'
      },
      success: (res) => {
      
        var id = res.data.id;
        prevPage.setData({
          id: id
        });
        wx.navigateBack({})
      }
    })
  },

  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address/address"
    })
  },
  
  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address/address?id=" + e.currentTarget.dataset.id
    })
  },
  
  onLoad: function () {
 
  },
  onShow : function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: baseUrl+'getAddress',
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: {
        // token:app.globalData.token
      },
      success: (res) =>{
        that.setData({
          addressList: res.data
        });
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
