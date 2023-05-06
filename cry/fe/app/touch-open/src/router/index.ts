import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import BasicLayout from '@/layout/BasicLayout.vue';
import Home from '@/pages/Home/index.vue';
import GoodsList from '@/pages/GoodsManagement/index.vue';
import GoodsCreate from '@/pages/GoodsManagement/create/index.vue';
import OrderList from '@/pages/OrderManagement/index.vue';
import OrderDetail from '@/pages/OrderManagement/detail.vue';
import InWarehouseManage from '@/pages/InventoryManagement/in.vue';
import OutWarehouseManage from '@/pages/InventoryManagement/out.vue';
import DefectManage from '@/pages/InventoryManagement/defect.vue';
import OutWarehouseDetail from '@/pages/InventoryManagement/outDetail.vue';
import MatchSuitList from '@/pages/MatchSuit/index.vue';
import SuitCreate from '@/pages/MatchSuit/create/index.vue';
import WxacodeTools from '@/pages/MarketingCenter/wxacodeTools.vue';
import CostManagement from '@/pages/MarketingCenter/costManagement.vue';
import PurchaseManage from '@/pages/PurchaseCenter/purchase.vue';
import PurchaseDetail from '@/pages/PurchaseCenter/purchaseDetail/index.vue';
import PurchaseGoodsManage from '@/pages/PurchaseCenter/goods.vue';
import HomePageSet from '@/pages/MarketingCenter/homePageSet.vue';
import UsersList from '@/pages/UserManagement/index.vue';
import UserDetail from '@/pages/UserManagement/detail.vue';

//静态路由页面
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        meta: { title: '首页', isMenu: false },
        component: Home,
      },
    ],
  },
  {
    path: '/usersManage',
    name: 'usersManage',
    component: BasicLayout,
    meta: { title: '用户管理', icon: 'UserOutlined' },
    redirect: '/usersManage/list',
    children: [
      {
        path: 'list',
        name: 'UsersList',
        meta: {
          title: '用户列表',
          keepAlive: true,
        },
        component: UsersList,
      },
      {
        path: 'detail',
        name: 'UserDetail',
        meta: {
          title: '用户详情',
          isMenu: false,
          keepAlive: false,
        },
        component: UserDetail,
      },
    ],
  },
  {
    path: '/goodsManage',
    name: 'goodsManage',
    component: BasicLayout,
    meta: { title: '商品管理', icon: 'SkinOutlined' },
    redirect: '/goodsManage/list',
    children: [
      {
        path: 'list',
        name: 'GoodsList',
        meta: {
          title: '商品列表',
          keepAlive: true,
        },
        component: GoodsList,
      },
      {
        path: 'create',
        name: 'GoodsCreate',
        meta: {
          title: '创建商品',
          isMenu: false,
          keepAlive: false,
        },
        component: GoodsCreate,
      },
    ],
  },
  {
    path: '/inventoryrManage',
    name: 'inventoryrManage',
    component: BasicLayout,
    meta: { title: '库存管理', icon: 'ShoppingCartOutlined' },
    redirect: '/inventoryrManage/in',
    children: [
      {
        path: 'in',
        name: 'InWarehouseManage',
        meta: {
          title: '入库管理',
          keepAlive: false,
        },
        component: InWarehouseManage,
      },
      {
        path: 'out',
        name: 'OutWarehouseManage',
        meta: {
          title: '出库管理',
          keepAlive: true,
        },
        component: OutWarehouseManage,
      },
      {
        path: 'defect',
        name: 'DefectManage',
        meta: {
          title: '次品管理',
          keepAlive: true,
        },
        component: DefectManage,
      },
      {
        path: 'outDetail',
        name: 'OutWarehouseDetail',
        meta: {
          title: '售后出库',
          keepAlive: false,
          isMenu: false,
        },
        component: OutWarehouseDetail,
      },
    ],
  },
  {
    path: '/matchSuit',
    name: 'matchSuit',
    component: BasicLayout,
    meta: { title: '套装搭配', icon: 'GiftOutlined' },
    redirect: '/matchSuit/list',
    children: [
      {
        path: 'list',
        name: 'MatchSuitList',
        meta: {
          title: '搭配列表',
          keepAlive: true,
        },
        component: MatchSuitList,
      },
      {
        path: 'create',
        name: 'SuitCreate',
        meta: {
          title: '创建套装',
          isMenu: false,
          keepAlive: false,
        },
        component: SuitCreate,
      },
    ],
  },
  {
    path: '/marketingCenter',
    name: 'marketingCenter',
    component: BasicLayout,
    meta: { title: '营销中心', icon: 'ToolOutlined' },
    redirect: '/marketingCenter/wxacodeTools',
    children: [
      {
        path: 'wxacodeTools',
        name: 'WxacodeTools',
        meta: {
          title: '营销工具',
          keepAlive: true,
        },
        component: WxacodeTools,
      },
      {
        path: 'cost',
        name: 'CostManagement',
        meta: {
          title: '成本管理',
          keepAlive: false,
        },
        component: CostManagement,
      },
      {
        path: 'homePageSet',
        name: 'HomePageSet',
        meta: {
          title: '首页展示',
          keepAlive: false,
        },
        component: HomePageSet,
      },
      {
        path: 'fissionTools',
        name: 'FissionTools',
        meta: {
          title: '裂变工具',
          keepAlive: false,
        },
        component: () => import('@/pages/MarketingCenter/fissionTools.vue'),
      },
    ],
  },
  {
    path: '/orderManage',
    name: 'orderManage',
    component: BasicLayout,
    meta: { title: '订单管理', icon: 'CreditCardOutlined' },
    redirect: '/orderManage/list',
    children: [
      {
        path: '/orderManage/list',
        name: 'OrderList',
        meta: {
          title: '订单列表',
          keepAlive: true,
        },
        component: OrderList,
      },
      {
        path: '/orderManage/detail',
        name: 'OrderDetail',
        meta: {
          title: '订单详情',
          keepAlive: false,
          isMenu: false,
        },
        component: OrderDetail,
      },
    ],
  },
  {
    path: '/shopManagement',
    name: 'shopManagement',
    component: BasicLayout,
    meta: { title: '门店管理', icon: 'ShopOutlined' },
    redirect: '/shopManagement/shopList',
    children: [
      {
        path: '/shopManagement/shopList',
        name: 'ShopList',
        meta: {
          title: '门店列表',
          keepAlive: true,
        },
        component: () => import('@/pages/ShopManagement/shopList.vue'),
      },
      {
        path: '/shopManagement/inventory',
        name: 'ShopInventory',
        meta: {
          title: '库存管理',
          keepAlive: true,
        },
        component: () => import('@/pages/ShopManagement/inventory.vue'),
      },
      {
        path: '/shopManagement/suit',
        name: 'ShopSuit',
        meta: {
          title: '套装管理',
          keepAlive: true,
        },
        component: () => import('@/pages/ShopManagement/suit.vue'),
      },
      {
        path: '/shopManagement/staff',
        name: 'ShopStaff',
        meta: {
          title: '员工管理',
          keepAlive: true,
        },
        component: () => import('@/pages/ShopManagement/staff.vue'),
      },
      {
        path: '/shopManagement/fittingroom',
        name: 'ShopFittingroom',
        meta: {
          title: '试衣间管理',
          keepAlive: false,
        },
        component: () => import('@/pages/ShopManagement/fittingroom.vue'),
      },
      {
        path: '/shopManagement/turnsOnDuty',
        name: 'ShopTurnsOnDuty',
        meta: {
          title: '轮值',
          keepAlive: false,
        },
        component: () => import('@/pages/ShopManagement/turnsOnDuty.vue'),
      },
      {
        path: '/shopManagement/operationalStatistics',
        name: 'OperationalStatistics',
        meta: {
          title: '运营数据统计',
          keepAlive: false,
        },
        component: () => import('@/pages/ShopManagement/operationalStatistics.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory
  routes,
});

export default router;
