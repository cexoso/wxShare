'use strict';
(function (util) {
  function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (function () {
        var ret = {
        },
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s;
        for (; i < len; i++) {
          if (!seg[i]) {
            continue;
          }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      }) (),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,
      '']) [1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,
      '']) [1],
      segments: a.pathname.replace(/^\//, '').split('/')
    };
  }
  function once(fn, context) {
    var result;
    return function () {
      if (fn) {
        result = fn.apply(context || this, arguments);
        fn = null;
      }
      return result;
    }
  }
  //-----
  util.parseURL = parseURL;
  util.once = once;
}) (window.util = window.util || {
});
(function ($) {
  var o = $({
  }); //自定义事件对象
  $.each({
    trigger: 'publish',
    on: 'subscribe',
    off: 'unsubscribe'
  }, function (key, val) {
    jQuery[val] = function () {
      o[key].apply(o, arguments);
    };
  });
}) (jQuery);
(function () {
  var params=util.parseURL(location.href).params;
  var wxSign = util.once(function () {
    $.ajax({
      dataType: 'JSON',
      type: 'GET',
      data: {
        type: 2
      },
      url: 'midautumnApi.php'
    }).success(function (res) {
      wx.config({
        debug: true,
        appId: res.appid, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名，见附录1
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage'
        ]
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      $.publish('wxconfig');
    });
  }) //end of wxSign
  function onMenuShare() {
    function onMenuShareTimeline(obj) {
      wx.onMenuShareTimeline({
        title: obj.title, // 分享标题
        link: obj.link, // 分享链接
        imgUrl: obj.imgUrl // 分享图标
      });
    }
    //end of onMenuShareTimeline

    function onMenuShareAppMessage(obj) {
      wx.onMenuShareAppMessage({
        title: obj.title || '', // 分享标题
        desc: obj.desc || '', // 分享描述
        link: obj.link || '', // 分享链接
        imgUrl: obj.imgUrl || '', // 分享图标    
      });
    }
    //end of onMenuShareAppMessage
    $.subscribe('wxconfig', function () {
      wx.ready(function () {
        var obj = {
          title: '中秋大礼',
          link: 'midautumn-h5.html?activecode='+params.activecode,
          imgUrl: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3836717562,2430487219&fm=58',
          desc: '这是一个大大大礼包'
        }
        onMenuShareTimeline(obj);
        onMenuShareAppMessage(obj);
      });
    });
  }
  //end of onMenuShare
  function displaycoupon(g) {
    $('#coupons').attr('src', 'img/'+g+'.jpg').animate({
      width: '100%'
    },1000).animate({
      width: '80%'
    },200)
  }
  //end of displaycoupon
  function postData(){
    return $.ajax({
      dataType: 'JSON',
      type: 'GET',
      data: {
        usercode:params.usercode,
        activeCode:params.activeCode,
        type:1
      },
      url: 'midautumnApi.php'
    })
  }//postData
  function init() {
    wxSign();
    onMenuShare();
    postData().success(function(d){
      console.log(d);
      displaycoupon(d.card_price);  
    });
    $('#shareBtn').on('click',function(){
        $('#share').show();
        $('#share').one('click',function(){
            $(this).hide();
        });
    });
  }
  $(function () {
    init();
    
  });
}) ();
