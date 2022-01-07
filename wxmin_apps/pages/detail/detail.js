// pages/detail/detail.js
Page({
  data:{
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494392460210&di=e2676cd3576ae88c8c528f0dfb8ffd5e&imgtype=0&src=http%3A%2F%2Fstc.zjol.com.cn%2Fg1%2FM0007FDCggSDVeOIZiAIDGbAAEfo007Rck797.jpg%3Fwidth%3D720%26height%3D431'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  openLocation:function(){
    wx.openLocation({
      latitude: 25.0821785206, // 纬度，范围为-90~90，负数表示南纬
      longitude: 102.6569366455, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例
      name: '武汉文理学院停车场001', // 位置名
      address: '武汉文理学院停车场002号'// 地址的详细说明
    })
  },
  preOrder:function(){
    wx.navigateTo({
      url: '../preOrder/preOrder'
    })
  }
  
})