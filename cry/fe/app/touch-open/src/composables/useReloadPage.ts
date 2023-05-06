import { onBeforeRouteUpdate, onBeforeRouteLeave, useRoute, RouteLocationNormalized } from 'vue-router'
import { useKeepAliveStore } from '@/store/moudles/keepAlive';

interface Props {
  [key: string]: any;
}

export default function useReloadPage() {
  const route = useRoute();
  const keepAliveStore = useKeepAliveStore()
  if (route.meta.keepAlive) {
    keepAliveStore.ADD(route.name)
  }
  const componentDistroy = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // 如果跳转的页面是菜单，就清除当前页缓存
    if (!(to.meta.isMenu === false)) {
      keepAliveStore.REMOVE(from.name)
    }
    if(to.meta.keepAlive) {
      keepAliveStore.ADD(to.name)
    }

  };
  onBeforeRouteUpdate((to, from, next) => {
    componentDistroy(to, from)
    next();
  })

  onBeforeRouteLeave((to, from, next) => {
    componentDistroy(to, from)
    next();
  })

  return {}
}

