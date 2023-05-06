const TOOL_MAP = {
  // test: '3783134062'
  interaction: '2177401643',
  'local-groundpush': '4061343041', // 测试环境权限
  'access-content': '1269361673',
  'master-operation': '3253174172',
  articleSpam: '3493231678',
  ugcReview: '2568660512',
  userinfo: '3368643680',
  'user-stimulation': '2334399556',
  filtertools: '1023069301',
  'audit-system': '3727300643',
  // 'editor-push-news': '3541078614',
  // 'inscription': '2677830272', // 临时借用卡片的tool_id
};

// 权限放在middleware里搞会很有问题，这样每个请求都会走一遍
module.exports = (options = {}, app) => {
  return async (ctx, next) => {
    const urlPath = ctx.path;
    const reg = /(\/app\/([^/]*)\/?)|(\/api\/app\/(.*)\/)/;
    const matches = urlPath.match(reg);
    const name = matches[2] || matches[4] || '';

    if (name && TOOL_MAP[name]) { // 没找到name是会直接next的
      const token = ctx.cookie('YD_PANDORA_JWT_TOKEN');
      const url = `${think.config('API_CONFIG').PANDORA}/user/tools/${TOOL_MAP[name]}`;
      const data = await ctx
        .fetch(url, {
          headers: {
            Authorization: decodeURIComponent(token),
          },
        })
        .then(res => {
          if (res.status === 200) {
            return res.json();
          } else {
            return null;
          }
        });
      // 有权限
      if (data && data.active) {
        console.log(`access successfully to tool ${data.hashId}`);
        return next();
      } else {
        ctx.redirect('/?page=403');
      }
    } else {
      return next();
    }
  };
};
