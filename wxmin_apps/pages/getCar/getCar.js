// pages/getCar/getCar.js
var app = getApp();
const serviceUrl = app.globalData.serviceUrl;
const apiUrl = serviceUrl + '/ordersapi'
const paymentUrl = apiUrl +"/setPaidStatus"
Page({
  data: {
    plateAreaCharset: ['京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼'],
    plateDigitCharset: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    inputBoxData: [{ char: '', hover: '' }, { char: '', hover: '' }, { char: '', hover: '' }, { char: '', hover: '' }, { char: '', hover: '' }, { char: '', hover: '' }, { char: '', hover: '' }],
    currentPos: null,
    showAreaKeyBoard: false,
    showKeyBoard: false,
    hasUnpaidOrders: false,
    orders: [],
    animationData: {},
    showLoading: true
  },
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '预约取车'
    })


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    animation.top('20rpx').step()
    this.setData({
      animationData: animation.export()
    })
    this.putPlateInputBox()
    this.query()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    this.query()
    
  },
  openParkingMap: function () {
    wx.navigateTo({
      url: '../parkinglotMap/parkinglotMap',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  bindDigitTap: function (res) {
    let inputBoxData = this.data.inputBoxData
    let id = res.currentTarget.id
    let currentPos = id
    console.log('res', res)
    if (id > 6) {
      id = 6
      currentPos = null;
    } else {
      inputBoxData[id].hover = 'plate-input-digit-hover'
    }
    if (this.data.currentPos != null) inputBoxData[this.data.currentPos].hover = ''

    this.setData({
      inputBoxData: inputBoxData,
      currentPos: currentPos
    })

  },
  bindKeyTap: function (res) {
    console.log(res)
    let char = res.currentTarget.dataset.char
    let inputBoxData = this.data.inputBoxData
    inputBoxData[this.data.currentPos].char = char
    let passOnData = {
      currentTarget: {
        id: parseInt(this.data.currentPos) + 1
      }
    }
    this.bindDigitTap(passOnData)
  },

  query: function () {
    let that = this
    let plateNumber = this.getPlateNumberString()
    this.setData({
      showLoading:true
    })
    wx.request({
      url: apiUrl,
      data: {
        plateDigit: plateNumber
      },
      success: function (res) {
        console.log(res)
        if (res.data.Status == 'ok') {
          console.log('ok')
          that.setData({
            orders: res.data.Data,
            hasUnpaidOrders: true
          })
          wx.setStorage({
            key: 'plateNumber',
            data: that.data.inputBoxData
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '未找到车牌为 '+plateNumber+' 的车辆数据，请重试。',
          })
        }
      },
      complete:function(res){
        that.setData({
          showLoading: false
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  getPlateNumberString: function () {
    return this.data.inputBoxData[0].char
      + this.data.inputBoxData[1].char
      + this.data.inputBoxData[2].char
      + this.data.inputBoxData[3].char
      + this.data.inputBoxData[4].char
      + this.data.inputBoxData[5].char
      + this.data.inputBoxData[6].char
  },
  putPlateInputBox: function () {
    var plateNumber = wx.getStorageSync('plateNumber')
    if (plateNumber != []) {
      this.setData({
        inputBoxData: plateNumber
    })
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入车牌来查询您的停车记录。',
      })
      let passOnData = {
        currentTarget: {
          id: 0
        }
      }
      this.bindDigitTap(passOnData)
    }
  },
  bindPaymentBtnTap: function(){
    var that=this
    wx.showModal({
      title: '请注意',
      content: '支付成功后，您将有30分钟时间将车辆驶出。超时将按照车辆停入时间继续计费，请您合理安排时间。',
      confirmText:"确认支付",
      success:function(res){
        if(res.confirm){
          wx.request({
            url: apiUrl + "/" + that.data.orders[0].ID,
            method:"PUT",
            success:function(res){
              console.log(res)
            },
            complete:function(res){
              console.log(res)
            }
          })
          console.log(that.data.orders[0])
          console.log(that.data.orders[0].ID)
          wx.navigateTo({
            url: './paidSuccess/paidSuccess',
          })
        }else if(res.cancel){
        }
      },

    })
  },
  queryOtherPlate:function(){
    this.setData({
      hasUnpaidOrders:false
    })
  }
})