import { checkHost } from './utils';
import "@/styles/global.less";

checkHost();

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      // console.error(err.message);
    },
  },
};
