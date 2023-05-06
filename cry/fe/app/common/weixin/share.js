/**
 * 微信分享
 * 分享到好友、分享到朋友圈
 */

class wxShare {
  constructor(options) {
    this.title = options.titie;
    this.desc = options.desc;
    this.link = options.link;
    this.pic = options.pic;

    const isWeixin = /MicroMessenger/i.test(navigator.userAgent);

    if (isWeixin) {
      this.init();
    }
  }

  init() {
    fetch('//atlas.yidianzixun.com/api/weixin?url=' + encodeURIComponent(window.location.href))
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') {
          console.log(data.result);
          this.initWx(data.result);
        }
      })
      .catch(e => console.log(e.toString()));
  }

  initWx(result) {
    wx.config({
      debug: false,
      appId: result.appid,
      timestamp: result.timestamp,
      nonceStr: result.noncestr,
      signature: result.signature,
      jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'],
    });

    wx.ready(() => {
      console.log('wx ready');
      this.shareHandler();
    });

    wx.error(() => {
      console.log('wx error');
    });
  }

  shareHandler() {
    wx.checkJsApi({
      jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'],
      success: function(res) {
        console.log(res);
      },
    });

    // 分享给朋友
    wx.onMenuShareAppMessage({
      title: this.title,
      desc: this.desc,
      link: this.link,
      imgUrl: this.pic,
      success: function() {
        // alert_msg('分享成功！');
        // location.href = share_link;
      },
    });

    // 分享到朋友圈
    wx.onMenuShareTimeline({
      title: this.title,
      desc: this.desc,
      link: this.link,
      imgUrl: this.pic,
      success: function() {
        // alert_msg('分享成功！');
        // location.href = share_link;
      },
    });

    wx.onMenuShareQQ({
      title: this.title,
      desc: this.desc,
      link: this.link,
      imgUrl: this.pic,
      success: function() {
        // alert_msg('分享成功！');
        // location.href = share_link;
      },
    });
  }
}

export default wxShare;
