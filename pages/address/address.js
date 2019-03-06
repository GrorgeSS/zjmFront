var commonCityData = require('../../utils/city.js');
var baseUrl = require('../../app.js');
var bUrl = baseUrl.baseUrl;
var app = getApp();
//获取应用实例
Page({
  data: {
    provinces:[],
    citys:[],
    districts:[],
    selProvince:'请选择',
    selCity:'请选择',
    selDistrict:'请选择',
    selProvinceIndex:0,
    selCityIndex:0,
    selDistrictIndex:0
  },
  bindCancel:function () {
    wx.navigateBack({})
  },
  bindSave:function(e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

    if (linkMan === ""){
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel:false
      })
      return
    }
    if (mobile === ""){
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel:false
      })
      return
    }
    if (this.data.selProvince === "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    if (this.data.selCity === "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    var cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    var districtId;
    if (this.data.selDistrict === "请选择" || !this.data.selDistrict){
      districtId = '';
    } else {
      districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
    }
    // if (address === ""){
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写详细地址',
    //     showCancel:false
    //   })
    //   return
    // }
    if (code === ""){
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel:false
      })
      return
    }
    var apiAddoRuPDATE = "add";
    var apiAddid = that.data.id;
    if (apiAddid) {
      apiAddoRuPDATE = "update";
    } else {
      apiAddid = 0;
    }
    wx.request({
      url:  bUrl + 'address',
      method:'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        token: app.globalData.token
      },
      data: {
        // token: app.globalData.token,
        // id: apiAddid,
        provinceId: commonCityData.cityData[this.data.selProvinceIndex].id,
        cityId: cityId,
        districtId: districtId,
        linkMan:linkMan,
        address:address,
        mobile:mobile,
        code:code,
        isDefault:'true'
      },
      success: function(res) {
        // if (res.data.code !== 0) {
        //   // 登录错误 
        //   wx.hideLoading();
        //   wx.showModal({
        //     title: '失败',
        //     content: res.data.msg,
        //     showCancel:false
        //   })
        //   return;
        // }
        // 跳转到结算页面
        wx.navigateBack({})
      }
    })
  },
  initCityData:function(level, obj){
    if(level === 1){
      var pinkArray = [];
      for(var i = 0;i<commonCityData.cityData.length;i++){
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces:pinkArray
      });
    } else if (level === 2){
      var pinkArray = [];
      var dataArray = obj.cityList
      for(var i = 0;i<dataArray.length;i++){
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys:pinkArray
      });
    } else if (level === 3){
      var pinkArray = [];
      var dataArray = obj.districtList
      for(var i = 0;i<dataArray.length;i++){
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts:pinkArray
      });
    }
    
  },
  bindPickerProvinceChange:function(event){
    var selIterm = commonCityData.cityData[event.detail.value];
    this.setData({
      selProvince:selIterm.name,
      selProvinceIndex:event.detail.value,
      selCity:'请选择',
      selCityIndex:0,
      selDistrict:'请选择',
      selDistrictIndex: 0
    })
    this.initCityData(2, selIterm)
  },
  bindPickerCityChange:function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity:selIterm.name,
      selCityIndex:event.detail.value,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(3, selIterm)
  },
  bindPickerChange:function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
  onLoad: function (e) {
    var that = this;
    this.initCityData(1);
    var id = e.id;
    if (id) {
      // 初始化原数据
      wx.showLoading();
      wx.request({
        url: bUrl + 'getAddressOne',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded",
          token: app.globalData.token
        },
        data: {
          id: id
        },
        success: function (res) {
          wx.hideLoading();
          that.setData({
            id:id,
            addressData: res.data,
            });
          that.setDBSaveAddressId(res.data);
          return;
        }
      })
    }
  },
  setDBSaveAddressId: function(data) {
    var retSelIdx = 0;
    
    for (var i = 0; i < commonCityData.cityData.length; i++) {
      if (data.provinceId == commonCityData.cityData[i].id) {
        this.data.selProvinceIndex = i;
        console.log(this.data.selProvinceIndex);
        this.setData({
          selProvince: commonCityData.cityData[i].name
        });
        for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
          if (data.cityId == commonCityData.cityData[i].cityList[j].id) {
            this.data.selCityIndex = j;
            this.setData({
              selCity: commonCityData.cityData[i].cityList[j].name
            });
            for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
              if (data.districtId == commonCityData.cityData[i].cityList[j].districtList[k].id) {
                this.data.selDistrictIndex = k;
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
  selectCity: function () {
    
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: bUrl + 'deleteAddress',
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              /// token: app.globalData.token,
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
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
