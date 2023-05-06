import { useMemo } from 'react';
import { History } from 'history';
import { useParams, useHistory, useRouteMatch, useLocation } from 'react-router-dom';

type RouteReturn<PT, QT = Record<string, string>> = {
  path: string; // 返回当前route锁匹配的路由信息
  params: PT;
  history: History;
  query: QT;
}

const useRoute = <PT = Record<string, string>, QT = Record<string, string>>(): RouteReturn<PT, QT> => {
  const history = useHistory();
  const { params } = useRouteMatch<PT>();
  const { search, pathname } = useLocation();

  const query = useMemo<QT>(() => {
    const match = search.match(/([^?=&])+=([^?&=])+/g);
    return match ? Object.fromEntries(match.map(item => item.split('='))) : {};
  }, [search]);

  return {
    history: history,
    path: pathname,
    params: params,
    query: query
  }
}

export default useRoute;
