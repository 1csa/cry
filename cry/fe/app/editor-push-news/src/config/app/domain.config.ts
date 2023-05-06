import { getEnv } from '@/utils/dev_helper';

const domainMap = {
  dev: {
    PUSH_USER_TAG_HOST: 'http://10.103.16.250:8080',
  },
  prod: {
    PUSH_USER_TAG_HOST: 'http://push-data.int.yidian-inc.com',
  },
};

export default domainMap[getEnv()];
