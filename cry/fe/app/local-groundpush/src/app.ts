import { checkHost } from './utils/dev_helper';
import 'core-js/es/object/from-entries';
import 'core-js/es/array/flat';

checkHost();

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      // console.error(err.message);
    },
  },
};
