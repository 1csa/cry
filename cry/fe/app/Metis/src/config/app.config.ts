import { AppConfig } from './app.d';
import {
  HomeOutlined , ShareAltOutlined , UserSwitchOutlined , ToolOutlined , ExceptionOutlined , FieldTimeOutlined ,ClusterOutlined
  ,FilePdfOutlined , PartitionOutlined , ReconciliationOutlined , UserAddOutlined  , UsergroupDeleteOutlined,FolderOpenOutlined
} from '@ant-design/icons';

const appConfig: AppConfig = {
  appId: 'Metis',
  appName: 'Metis',
  // 红 logo, 可以更换成你自己的图片地址，如果不需要注释掉即可
  logo: 'http://si1.go2yd.com/get-image/0ZAJxXeZ6iu',
  // 白 logo
  // logo: 'http://si1.go2yd.com/get-image/0Z8vMt5u4kS',
  menus: [
    {
      key: '/',
      icon: 'HomeOutlined',
      name: '首页',
    },
    {
      key: '/pandaUser',
      icon: 'ShareAltOutlined',
      name: '基础问题查询',
      subMenu: [
      {
        icon: 'ToolOutlined',
        key: '/pandaUser/userDebug',
        name: 'user debug'
      }
      ,{
        key: '/pandaUser/userPortrait',
        icon: 'UserSwitchOutlined',
        name: '用户画像',
      },{
        key: '/pandaUser/articlePortrait',
        icon: 'ExceptionOutlined',
        name: '文章画像',
      }
      ]
    },
    {
      icon: 'FieldTimeOutlined',
      key: '/recommended',
      name: '推荐问题排查',
      subMenu: [
        {
        key: '/recommended/searchPloem',
        icon: 'ClusterOutlined',
        name: '请求url 查询',
        },{
        key: '/recommended/blenderPloem',
        icon: 'FilePdfOutlined',
        name: 'blender 问题排查',
      }
      ,{
        key: '/recommended/newsPloem',
        icon: 'UserSwitchOutlined',
        name: 'user2news问题排查',
      },{
        key: '/recommended/videoPloem',
        icon: 'UsergroupDeleteOutlined',
        name: 'user2video问题排查',
      },{
        key: '/recommended/u2mircoPloem',
        icon: 'FolderOpenOutlined',
        name: 'user2micro问题排查',
      },{
        key: '/recommended/cbPloem',
        icon: 'PartitionOutlined',
        name: 'cb问题排查',
      }
      ,{
        key: '/recommended/aioPloem',
        icon: 'ReconciliationOutlined',
        name: 'aio问题排查',
      },{
        key: '/recommended/mircoPloem',
        name: 'channel2news问题排查',
        icon: 'UserAddOutlined',
      }
      ]
    },
  ],
  // 帮助文档，如果不需要注释掉即可
  // helpDoc: 'http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=27285993',
  layout: {
    hasSidebar: true,
    theme: 'dark',
  },
};

export default appConfig;
