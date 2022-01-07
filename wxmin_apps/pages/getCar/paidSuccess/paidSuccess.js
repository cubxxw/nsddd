// pages/getCar/paidSuccess/paidSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successTemplateData: {
      title: "支付成功",
      tip: "    您已支付成功，请您在30分钟内将车辆开出。超时将按照车辆停入继续计费。您可点击“查看车辆位置”查看车场地图、定位您当前位置。",
      confirmBtnText:"查看车辆位置"
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '支付结果'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  confirmBtnAction:function(){
    wx.navigateTo({
      url: '../../parkinglotMap/parkinglotMap',
    })
  }
})