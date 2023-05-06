import { AppConfig } from './app';
import Home from '@/pages/Home.vue';
import SignIn from '@/pages/SignIn.vue';
import Lottery from '@/pages/Lottery.vue';
import Withdraw from '@/pages/Withdraw.vue';
import Invitation from '@/pages/Invitation.vue';

const appConfig: AppConfig = {
  appId: 'user-stimulation',
  appName: '用户激励管理',
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  menuItems: [
    {
      path: '/',
      name: '首页',
      component: Home,
      icon: 'home',
    },
    {
      path: '/sign-in',
      name: '签到红包',
      component: SignIn,
      icon: 'highlight',
    },
    {
      path: '/invitation',
      name: '邀请红包',
      component: Invitation,
      icon: 'user-add',
    },
    {
      path: '/lottery',
      name: '抽奖红包',
      component: Lottery,
      icon: 'red-envelope',
    },
    {
      path: '/withdraw',
      name: '提现配置',
      component: Withdraw,
      icon: 'money-collect',
    },
  ],
  miscellaneous: {
    // 配置当用户头像不存在时使用的fallback头像图URL
    defaultAvatar: '//s.go2yd.com/a/thead_meiguoduizhang.png',
  },
};

export default appConfig;
