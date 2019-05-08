import '../../utils/polyfill.js'
const util = require('../../utils/util.js')
const hz2py = require('../../libs/hz2py.js')
//获取应用实例
const app = getApp()
var datas = require('../../libs/city.js');

Page({
    data: {
        addressInfo:{},
        xiaoquData: [],
        _py: [ "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
        //搜索列表
        inputVal: '',
        searchList: [],
        xiaoquListShow: true,
        inputListShow: false,
        hidden: true,
        showPy: 'A'
    },
    pySegSort: function (arr) {
      var arr_t = [], dataarr = [], noname=[];
      //先转英文
      for (var i = 0; i < arr.length; i++) {
        arr_t[i] = [hz2py.getSpell(arr[i].name), arr[i]]
      }

      //排序后的数组重新赋值
      arr_t = arr_t.sort();
      //生成A-Z，并把对应字幕的姓名添加
      for (var i = 0; i < 26; i++) {
        var upperchar = String.fromCharCode(65 + i);
        var flag = false;
        dataarr.push({ 'letter': upperchar, 'data': [] })
        for (var j = 0; j < arr.length; j++) {
          var fristchar = arr_t[j][0].slice(0, 1).toUpperCase();
          if (upperchar == fristchar) {
            flag = true;
            dataarr[i]['data'].push(arr_t[j][1])
          }
        }
        //标记没有名字的字母
        if (flag == false) {
          noname.push(upperchar)
        }
      }
      //删除没有名字的item
      for (var k = 0; k < noname.length; k++) {
        for (var n = 0; n < dataarr.length; n++) {
          if (dataarr[n]['letter'] == noname[k]) {
            dataarr.splice(n,1)
          }
        }
      }
      console.log(dataarr)
      return dataarr;
    },
    onLoad: function() {
      if (Object.keys(app.globalData.addressInfo).length > 0) {
        this.setData({
          addressInfo: app.globalData.addressInfo,  //赋值
        })
      }
      let data_py = this.pySegSort(datas.xiaoqu)
        this.setData({
          xiaoquData: data_py
      });
    },
    onShow:function(){

    },
    //搜索关键字
    keyword: function(keyword) {
        var that = this;
        //todo searchList
      console.log(keyword)
      var newarr = datas.xiaoqu.filter(function (element, index, self) {
        console.log(element.name)
        return element.name.indexOf(keyword)>-1
        console.log(element.name.indexOf(keyword))
        });
      console.log(newarr)
      this.setData({
        searchList: newarr
      });
    },
    //选择小区
  selectXiaoqu: function(e) {
        var dataset = e.currentTarget.dataset;
         util.gotoPage.goPage({ url: '/pages/address/address', data: {name: dataset.name}})
    },
    touchstart: function(e) {
        this.setData({
            index: e.currentTarget.dataset.index,
            Mstart: e.changedTouches[0].pageX
        });
    },
    //获取文字信息
    getPy: function(e) {
        this.setData({
            hidden: false,
            showPy: e.target.id,
        })
    },

    setPy: function(e) {
        this.setData({
            hidden: true,
            scrollTopId: this.data.showPy
        })
    },

    //滑动选择
    tMove: function(e) {
        var y = e.touches[0].clientY,
            offsettop = e.currentTarget.offsetTop;

        //判断选择区域,只有在选择区才会生效
        if (y > offsettop) {
            var num = parseInt((y - offsettop) / 12);
            this.setData({
                showPy: this.data._py[num]
            })
        };
    },

    //触发全部开始选择
    tStart: function() {
        this.setData({
            hidden: false
        })
    },

    //触发结束选择
    tEnd: function() {
        this.setData({
            hidden: true,
            scrollTopId: this.data.showPy
        })
    },

    //输入
    input: function(e) {
        if (e.detail.value == '') {
            this.setData({
                inputVal: e.detail.value,
                inputListShow: false,
                xiaoquListShow: false,
            });
        } else {
            this.setData({
                inputVal: e.detail.value,
                inputListShow: true,
                xiaoquListShow: false,
            });
          this.keyword(e.detail.value)
        }
    },

    //清除输入框
    clear: function() {
        this.setData({
            inputVal: '',
            inputListShow: false
        })
    }
})