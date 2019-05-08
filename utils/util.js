const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const Nav = {
  MAX_VALUE: 5, //页面栈最多5层
  /*
   * desc: 跳转页面
   * param:
   *  obj: {
   *    url: ''  //页面在app.json中的路径，路径前不要加'/'斜杠（也可以加，做了兼容）
   *    data: {}  //需要携带的参数，统一通过缓存携带
   *  }
   */
  goPage: function (obj) {
    console.log(obj)
    var pages = getCurrentPages(),  //页面栈
      len = pages.length,
      dlt = '',
      target = '/' + obj.url.replace(/^\//, ''), //如果有，将第一个‘/’去掉，然后再补上（开发者习惯不同，有些人会给url加/，有些则忘了，兼容处理
      navigation_key = target.replace(/\//g, '_'); //存储数据的下标，每个页面由自己的存储key，保证了页面间数据不会相互污染
    //查找目标页在页面栈的位置
    for (var i = 0; i < len; i++) {
      if (pages[i].route == target) { //
        dlt = i + 1; //目标页在栈中的位置
        break;
      }
    }
    //保存数据
    //由于navigateBack()回到指定页面，不会重新执行onLoad事件，所以加个标兵。
    //只有在isLoad = true;时，才会接收参数并执行类onLoad事件
    var nData = Object.assign({ referer: pages[len - 1].route, _is_load: true }, obj.data || {});
    wx.setStorageSync(navigation_key, JSON.stringify(nData));
    if (!dlt) { //页面不在栈中
      if (len < this.MAX_VALUE) {
        wx.navigateTo({
          url: target
        });
      } else {
        wx.redirectTo({
          url: target
        });
      }
    } else {
      wx.navigateBack({
        delta: len - dlt
      });
    }
  },
  /*
   * desc：在目标页接收数据
   * param：
   *    myOnLoad：回调方法，由于通过缓存传递数据，页面onLoad没办法接收，所以要自定义回调
   */
  inPage: function (myOnLoad) {
    var pages = getCurrentPages();
    var navigation_key = pages[pages.length - 1].route.replace(/\//g, '_');
    //从其他页面跳转过来的，那么isLoad肯定为true，因为goPage中设置了。如果是用户点击左上角后退的，那么isLoad=false，因为下面设置了
    //获取数据
    try {
      var raw = wx.getStorageSync('_'+navigation_key);
      var options = JSON.parse(raw);
      if (options._is_load) {  //用户点击左上角后退时，不会执行myOnLoad，因为此时_is_load是undefined
        myOnLoad(options);
      }
      wx.setStorage({ //清除数据
        key: navigation_key,
        data: ''  //这之后，_is_load是undefined了
      });
    } catch (e) {
      console.log(e)
    }
  }
};

module.exports = {
  formatTime: formatTime,
  gotoPage: Nav
}
