/**
 * 这里处理一些公共的api
*/

const Base = require('../../base');

// 这里其实是不希望有跨域行为的
module.exports = class extends Base {
  constructor(props) {
    super(props);
    this.card = this.model('')

    this.ctx.set('Access-Control-Allow-Origin', this.ctx.header.origin);
    this.ctx.set('Access-Control-Allow-Method', 'GET,POST,OPTIONS');
    this.ctx.set('Access-Control-Allow-Credentials', 'true');
    this.ctx.set('Content-Type', 'application/json;charset=utf-8');
  }

  indexAction () {
    return this.ctx.json({
      status: 'hello'
    });
  }


  // 需要带cookie
  async authAction () {
    const tool_name = this.get('toolname');
    const tool_id = this.config("tools")[tool_name];

    try {
      if (!tool_id) {
        throw new Error('未找到tool_id');
      }

      const authRes = await this.fetch(`${this.config("url").pandora}/auth?tool=${tool_id}`, {
        headers: {
          'cookie': this.ctx.request.header.cookie,
          'Content-Type': this.ctx.request.header['Content-Type'] || 'application/json',
        },
      }).then(res => res.json());

      if (authRes.status === 'success') {
        return this.json({
          status: 'success',
          data: { user: authRes, authes: authRes.result },
        });
      } else {
        throw new Error(authRes.reason || '获取权限失败')
      }
    } catch (err) {
      return this.json({
        status: "failed",
        message: err.toString()
      });
    }
  }


  // 根据docid获取文章信息
  async docAction () {
    const docid = this.get('docid');
    const session_id = "constant-session-1";
    const doc_path = "/contents/content-meta?fields=title&fields=source&fields=date&fields=url&fields=image&fields=image_urls&fields=like&fields=comment_count&fields=security&version=999999";

    try {
      if (!docid) {
        throw new Error('参数错误，未找到docid');
      }

      const doc_res = await this.fetch(`${this.config('url').api_a1_prod}${doc_path}&docid=${docid}`, {
        headers: { cookie: `JSESSIONID=${session_id}` }
      }).then(res => res.json());

      console.log(doc_res, '======doc_res========');

      if (!doc_res || doc_res.status !== "success" || !doc_res.documents[0]) {
        throw new Error(doc_res && doc_res.status === "failed" ? `获取doc信息失败, ${doc_res.reason}` : "请求doc信息失败");
      }

      const doc_info = doc_res.documents[0];

      if (doc_info.scope === 1) {
        throw new Error("该文章已被删除");
      }

      return this.json({
        status: "success",
        data: {
          title: doc_info.title,
          image: doc_info.image
        }
      })
    } catch (err) {
      console.log(err.toString(), `======error happpened when fetching doc, docid is ${docid}=========`);

      return this.json({
        status: "failed",
        message: err.message
      })
    }
  }

  // 首页统计概览:返回所有的概览数据
  async statisticAction () {
  }
}
