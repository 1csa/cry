const Base = require('../base');
const qs = require('query-string');
const md5 = require('md5');

module.exports = class extends Base {
  constructor(props) {
    super(props);
    this.baseUrl = 'http://a4.go2yd.com/Website/user';
  }

  indexAction() {}

  async getUserinfoAction() {}

  /** 状态查询
   * @param phone: string
   */
  async queryStatusAction() {
    let phone = this.get('phone');

    if (phone.indexOf('+') >= 0) {
      phone = phone.slice(1);
    }

    if (phone.indexOf('86') < 0) {
      phone = '86' + phone;
    }

    const queryDetailUrl = `${this.baseUrl}/black-mobile?mobile=${phone}&opt=query_detail`;

    try {
      const queryDetailRes = await this.fetch(queryDetailUrl).then(res => res.json());

      if (queryDetailRes.status === 'success' && queryDetailRes.result !== false) {
        this.json(queryDetailRes);
      } else if (!queryDetailRes.result) {
        queryDetailRes.result = {
          mobile: '',
          userid: '',
          operator: '',
          op_from: '',
          state: '0',
          create_time: '',
          update_time: '',
        };
        this.json(queryDetailRes);
      } else {
        throw new Error('查询失败');
      }
    } catch (err) {
      this.json({
        code: -1,
        status: 'failed',
        reason: err.toString(),
      });
    }
  }

  /** 状态修改
   * @method get
   * @param phone string
   * @param username string
   * @param status '0' | '1'
   * @param from 'shenhe'
   * @param key 'ee5c7dd199bf70ccae02e2e0230853b1'
   */
  async changeStatusAction() {
    const from = 'shenhe';
    const key = 'ee5c7dd199bf70ccae02e2e0230853b1';

    const operator = this.get('username');
    const opt = Number(this.get('currentState')) === 1 ? 'delete' : 'add';
    let mobile = this.get('phone');

    if (mobile.indexOf('+') >= 0) {
      mobile = mobile.slice(1);
    }

    if (mobile.indexOf('86') < 0) {
      mobile = '86' + mobile;
    }

    const params = {
      opt,
      from,
      mobile,
      operator,
      key,
    };
    const changeStatusUrl = `${this.baseUrl}/black-mobile?${qs.stringify(params)}`;
    const changeStatusRes = await this.fetch(changeStatusUrl).then(res => res.json());
    this.json(changeStatusRes);
  }

  async queryBasicAction() {
    const basicsalt = '34A6E5D64ADE17EF4E51612C50DD72F5';
    const from = 'platform';
    const phoneRegex = /^(86|\+86)?(1[3,5,7,8]\d{9})/;

    const userid = this.get('userid').replace(/\s/g, '');
    let mobile = this.get('mobile').trim();
    let sign = basicsalt;

    if (userid.length !== 0) {
      sign = userid + sign;
    }

    if (mobile.length !== 0 && phoneRegex.test(mobile)) {
      mobile = mobile.replace(phoneRegex, (match, p1, p2) => `86${p2}`);
      sign = mobile + sign;
    }

    sign = md5((userid || mobile) + basicsalt);
    const params = {
      userid,
      mobile,
      from,
      sign,
    };
    const basicinfoUrl = `${this.baseUrl}/get-monitor-info?${qs.stringify(params)}`;

    try {
      const res = await this.fetch(basicinfoUrl).then(res => res.json());
      if (res.code === 0 || res.status === 'success') {
        this.json({
          code: 0,
          status: 'success',
          result: res.info,
        }); // 直接转发收到的数据
      } else {
        throw new Error(res.reason);
      }
    } catch (err) {
      this.json({
        code: -1,
        status: 'failed',
        reason: err.toString(),
      });
    }
  }
};
