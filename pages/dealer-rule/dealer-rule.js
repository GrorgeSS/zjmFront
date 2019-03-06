var restUrl = require('../../utils/config.js');

var baseUrl = restUrl.Config.restUrl;
var app = getApp();
// pages/dealer-rule/dealer-rule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dealerRulePic: 'https://api.txzyzjm.xyz/imgs/be-dealer/btn.png',
    name: '',
    phone: '',
    identity: '',
    address: '',
    invitation: ''
  },

  getName: function (e) {
    var val = e.detail.value;
    this.setData({
      name: val
    });
  },

  getPhone: function (e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    });
  },

  getIdentity: function (e) {
    var val = e.detail.value;
    this.setData({
      identity: val
    });
  },

  getAddress: function (e) {
    var val = e.detail.value;
    this.setData({
      address: val
    });
  },

  getInvitation: function (e) {
    var val = e.detail.value;
    this.setData({
      invitation: val
    });
  },

  submit: function () {
    if (this.data.name === "") {
      wx.showModal({
        title: '提示',
        content: '请填写称呼',
        showCancel: false
      })
      return
    }
    if (this.data.phone === "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系手机',
        showCancel: false
      })
      return
    }
    if (this.data.identity === "") {
      wx.showModal({
        title: '提示',
        content: '请填写身份证号码',
        showCancel: false
      })
      return
    }
    if (this.data.address === "") {
      wx.showModal({
        title: '提示',
        content: '请填写收货地址',
        showCancel: false
      })
      return
    }
    var that = this;
    // var form = {};
    // var formInfoDetail = [];
    // formInfoDetail.name = that.data.name;
    // formInfoDetail.phone = that.data.phone;
    // formInfoDetail.idc = that.data.identity;
    // formInfoDetail.address = that.data.address;
    // form.formInfo = formInfoDetail;
    // form.code = that.data.invitation;
    // console.log(form);
      wx.request({
        url: baseUrl + 'submit',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded",
          token: app.globalData.token
        },
        data: {
          name: that.data.name,
          phone: that.data.phone,
          idc: that.data.identity,
          address: that.data.address,
          code: that.data.invitation
        },
        success: (res) => {
      
          if (res.data == 0) {
            wx.showModal({
              title: '提示',
              content: '推荐码无效',
              showCancel: false
            })
          }
          if (res.data == 1) {
            wx.navigateTo({
              url: '/pages/order/order',
            })
          }
          if (res.data == 2) {
            wx.showModal({
              title: '提示',
              content: '推荐码为空，您不能直接下单，稍后会有中界门工作人员联系你',
              showCancel: false
            })
          }
          if (res.data == 3) {
            wx.showModal({
              title: '提示',
              content: '你已经是经销商',
              showCancel: false
            })
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