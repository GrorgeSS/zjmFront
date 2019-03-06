// pages/aromaRecord/aromaRecord.js
var app = getApp()
var restUrl = require('../../utils/config.js');
var baseUrl = restUrl.Config.restUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectRecord:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.request({
      url: baseUrl + 'show',
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      success: res => {
        this.setData({
          collectRecord: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})