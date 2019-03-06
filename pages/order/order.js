var commonCityData = require('../../utils/city.js');
import { Token } from '../../utils/token.js';
var restUrl = require('../../utils/config.js');
var cal = require('../../utils/cal.js');


var baseUrl = restUrl.Config.restUrl;
var app = getApp();

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    id: '',
    num: 1,
    total: 0,
    account:'',
    message:'',
    cost: 0,
    orderStatus:0,
    productName:'中界门',
    productPrice:'',
    checkedValue:true,
    productImages:'https://api.txzyzjm.xyz/imgs/about/product.jpg'
  },

  onLoad: function(){
    this.getOwnerPrice();
    this.getProductMessage();
  },  

  onShow:function(data){
    var that = this;
    let pages = getCurrentPages(),
      currPage = pages[pages.length - 1];
    if (currPage.data.id) {
      this.getAddress(currPage.data.id);
    };

    //获取订单详情
    if (this.data.orderStatus != 0) {
      this.setData({
        orderStatus: data.status,
        basicInfo: {
          orderTime: data.create_time,
          orderNo: data.order_no
        }
      })
    }
  },

  getOwnerPrice: function(){
    var self = this;
    wx.request({
      url: baseUrl + 'product',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      success: res => {
        self.setData({
          productPrice: res.data.price
        })
        self.getCost(1);
      }
    })
  },

  getProductMessage:function(){
    var that = this;
    wx.request({
      url: baseUrl + 'totalFrag',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      success: res => {
        var total = that.data.total;
        var account = that.data.account;
        var aromaNumber = res.data.total;
        var Deductible = that.data.Deductible;
        var noCost = this.data.num 
        *this.data.productPrice;
        var cost = this.data.cost;

        if (noCost >= aromaNumber){
        Deductible = aromaNumber;
        account = cal.accSub(total, Deductible);
        }else{
          Deductible = noCost;
          account = cost;
        }
        that.setData({
          aromaNumber: aromaNumber,
          Deductible: Deductible,
          account: account
        });
      }
    })
  },


  getAddress: function (id) {
    var that = this;
    var id = id;
    wx.request({
      url: baseUrl + 'getAddressOne',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: {
        // token:app.globalData.token,
        id: id,
        // isDefault:'true'
      },
      success: (res) => {
     that.setData({
       linkMan: res.data.linkMan,
       mobile: res.data.mobile,
       address: res.data.address
     });
     that.changeAddress(res.data);
     that.getCost(res.data.provinceId);
   } 
      
    })
  },

  changeAddress: function(data) {
      for (var i = 0; i < commonCityData.cityData.length; i++) {
          if (data.provinceId == commonCityData.cityData[i].id) {
              this.setData({
                  selProvince: commonCityData.cityData[i].name
              });
              for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
                  if (data.cityId == commonCityData.cityData[i].cityList[j].id) {
                      this.setData({
                          selCity: commonCityData.cityData[i].cityList[j].name
                      });
                      for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
                          if (data.districtId == commonCityData.cityData[i].cityList[j].districtList[k].id) {
                              this.setData({
                                  selDistrict: commonCityData.cityData[i].cityList[j].districtList[k].name
                              });
                          }
                      }
                  }
              }
          }
      }
  },

  getCost: function (res) {
    var res = res,
      total = this.data.total,
      Deductible = this.data.Deductible,
      account = this.data.account,
      num = this.data.num,
      aromaNumber = this.data.aromaNumber;
      var cost = this.data.cost;
      var noCost = this.data.productPrice * num;
    if (res == '440000') {
      cost = 12;
    }
    else if (res == '810000' || res == '710000' 
      || res == '820000') {
       cost = 30;
    }
    else {
      cost = 22;
      total = this.data.productPrice * num + cost;
    }

    total = noCost + cost;
    if (noCost >= aromaNumber) {
      Deductible = aromaNumber;
      account = cal.accSub(total, Deductible);
    } else {
      account = cost;
      Deductible = noCost;
    }
    this.setData({
      account: account,
      cost: cost,
      total: total,
      Deductible: Deductible
    })
  },


  ToAddress:function(event){
    wx.navigateTo({
      url: '../select-address/select-address',
    })
  },

  /* 点击减号 */
  ReduceNumber: function () {
    var num = this.data.num,
      total = this.data.total,
      account = this.data.account,
      Deductible = this.data.Deductible,
      cost = this.data.cost,
      noCost = null;
    var checkedValue = this.data.checkedValue;
    var aromaNumber = this.data.aromaNumber;

    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
      noCost = num * this.data.productPrice;
      total = noCost + cost;
      if (checkedValue == true) {
      if (noCost >= aromaNumber) {
        Deductible = aromaNumber;
        account = cal.accSub(total, Deductible);
      } else {
        account = cost;
        Deductible = noCost;
      }
      }else{
        Deductible = 0;
        account = cal.accSub(total, Deductible);
      }
      // account = cal.accSub(total, Deductible);
    }

    // 将数值和价格写回  
    this.setData({
      num: num,
      total: total,
      account: account,
      Deductible: Deductible
    });
  },

  /* 点击加号 */
  AddNumber: function () {
    var num = this.data.num,
      total = this.data.total,
      account = this.data.account,
      Deductible = this.data.Deductible,
      cost = this.data.cost,
      noCost = null,
      aromaNumber = this.data.aromaNumber;
    var checkedValue = this.data.checkedValue;
    // 不作过多考虑自增1  
    num++;
    noCost = num * this.data.productPrice;
    total = noCost + cost;
    if (checkedValue==true){
    if (noCost >= aromaNumber) {
      Deductible = aromaNumber;
      account = cal.accSub(total, Deductible);
    } else {
      account = cost;
      Deductible = noCost;
    }
    }else{
      Deductible = 0;
      account = cal.accSub(total, Deductible);
    }

    // account = cal.accSub(total, Deductible);
    // 将数值和价格写回  
    this.setData({
      num: num,
      total: total,
      account: account,
      Deductible: Deductible
    });
  },

  /* switch按钮 */
  toChecked: function (e) {
    var checked = e.detail.value,
      Deductible = this.data.Deductible,
      aromaNumber = this.data.aromaNumber,
      account = this.data.account,
      total = this.data.total,
      cost = this.data.cost,
      noCost = this.data.num*this.data.productPrice;
    if (checked) {
      if (noCost >= aromaNumber) {
        Deductible = aromaNumber;
        account = cal.accSub(total, Deductible);
      } else {
        account = cost;
        Deductible = noCost;
      }
      this.setData({
        account: account,
        Deductible: Deductible,
        checkedValue:checked
      })
    }
    else {
      Deductible = 0;
      account = cal.accSub(total, Deductible);
      this.setData({
        account: account,
        Deductible: Deductible,
        checkedValue: checked
      })
    }
  },

  /* 留言 */
  getMessage:function(e){
    var message = e.detail.value;
    this.setData({
      message:message
    })
  },

  /*下单和付款*/
  pay: function () {
    if (!this.data.linkMan) {
      this.showTips('下单提示', '请填写您的收货地址');
      return;
    }
    if (this.data.orderStatus == 0) {
      this._firstTimePay();
    } else {
      this._execPay();
    }
  },


  _firstTimePay:function(){
    var that = this,
        id = 1,
        num = this.data.num,
        aromaNumber = this.data.aromaNumber,
        cost = this.data.cost,
        message = this.data.message,
        allAddress = this.data.selProvince + this.data.selCity + this.data.selDistrict + this.data.address;
    wx.request({
      url: baseUrl +'order?XDEBUG_SESSION_START=15696',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: {
        product_id:id,
        count:num,
        totalfrag: aromaNumber,
        delivery:cost,
        address:allAddress,
        message:message
      },
      success: (res) => {
        //支付分两步，第一步是生成订单号，然后根据订单号支付
        if (res.data.pass) {
          var id = res.data.order_id;
          that.data.id = id;
          //开始支付
          that._execPay(id);
        } else {
          that._orderFail(res);  // 下单失败
        }
      }
    })
  },

  /*
      *下单失败
      * params:
      * data - {obj} 订单结果信息
      * */
  _orderFail: function (data) {
    wx.showModal({
      title: '下单失败',
      content: '',
      showCancel: false,
      success: function (res) {
      }
    });
  },

  /*
*开始支付
* params:
* id - {int}订单id
*/
  _execPay: function (id) {
    var that = this;
    wx.request({
      url: baseUrl +'pay/pre_order',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: {
        id: id,
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
              that.getOrderStatus(2);
            },
            fail: function () {
              that.getOrderStatus(1);
            }
          });
        }
        else {
          that.getOrderStatus(0);
          wx.showModal({
            title: '支付失败',
            content: '未知错误',
          })
        }
      }
    })
  },

  getOrderStatus:function(res){
    var that = this;
    wx.request({
      url: baseUrl +'getStatus?XDEBUG_SESSION_START=14546',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: {
        status: res,
        id: that.data.id
      },
      success: function(){
        if(res!=0){
          wx.navigateTo({
            url: '/pages/order-list/order-list',
          })
        } else {
          wx.showModal({
            title: '支付失败',
            content: '未知错误',
          })
        }
      }
    })
  },



  /* 提示窗口*/
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {

      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: '孵化中国优质产品，用参与取代消费',
      path: '/pages/aroma/aroma',
      imageUrl: 'https://api.txzyzjm.xyz/imgs/share-only.jpg'
    }
  }
})