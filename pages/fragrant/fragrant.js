// pages/fragrant/fragrant.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        record: '',
        fragrant: {
            seed: 0,
            gold: 0
        }
    },

    onLoad: function(){
        wx.request({
            url: '',
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                id: dealer.id
            },
            success: res => {
                this.setData({
                    record: res.data.record,
                    fragrant: res.data.fragrant
                })
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