import { checkHost, pageName } from './utils/dev_helper';

process.env.NODE_ENV === 'production' &&
  import('./rum').then(apm => {
    // 接入客户端的 apm 监控
    apm.default.setInitialPageLoadName(pageName());
  });

checkHost();
export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      // 捕获 subscriptions done 触发的 error
      // console.error('dva onError >>>>', err.message);
    },
  },
};
