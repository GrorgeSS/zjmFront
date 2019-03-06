// pages/beDealer/beDealer.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      btn: 'https://api.txzyzjm.xyz/imgs/be-dealer/btn.png'
    },
    onShareAppMessage: function () {
      return {
        title: '孵化中国优质产品，用参与取代消费',
        path: '/pages/aroma/aroma',
        imageUrl: 'https://api.txzyzjm.xyz/imgs/share-only.jpg'
      }
    }
})