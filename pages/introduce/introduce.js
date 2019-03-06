// pages/introduce/introduce.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  ToDetails:function(){
    wx.navigateTo({
      url: '../details/details',
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