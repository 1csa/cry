interface AppConfig {
  appId: string;
  appName: string;
  logo?: string;
  toolId?: number;
  homeName: string
  miscellaneous: { defaultAvatar: string }
};

const appConfig: AppConfig = {
  appId: 'touch-open',
  appName: 'touch-open',
  logo: 'https://si1.go2yd.com/get-image/0zTdGpmFtMe',
  homeName: 'Home',
  miscellaneous: {
    // 配置当用户头像不存在时使用的fallback头像图URL
    defaultAvatar: '//s.go2yd.com/a/thead_meiguoduizhang.png',
  },
};

export default appConfig;
