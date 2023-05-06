import { ConnectState } from '@/models/connect';
import {
  ChannelProps,
  TopNewsProps,
  TopItemProps,
  SearchResultProps,
  TopMapProps,
  RecItemProps,
  RecNewsProps,
} from '@/config/topNews';

export default {
  channelType: (state: ConnectState): string => (state.topNews.channel as ChannelProps).type || '',
  channelName: (state: ConnectState): string =>
    (state.topNews.channel as ChannelProps).topicName || '',
  topNews: (state: ConnectState): TopNewsProps | {} => state.topNews.topNews,
  recNews: (state: ConnectState): RecNewsProps | {} => state.topNews.recNews,
  recList: (state: ConnectState): Array<RecItemProps> =>
    (state.topNews.recNews as RecNewsProps).rec_list || [],
  recListOrigin: (state: ConnectState): Array<RecItemProps> => state.topNews.recListOrigin,
  lastTopNews: (state: ConnectState): TopNewsProps | {} => state.topNews.lastTopNews,
  operationLog: (state: ConnectState): Array<TopItemProps> => state.topNews.operationLog || [],
  preTopNews: (state: ConnectState): TopNewsProps | {} => state.topNews.preTopNews,
  loading: (state: ConnectState): boolean => state.topNews.loading,
  loadingrec: (state: ConnectState): boolean => state.topNews.loadingrec,
  loadingDoc: (state: ConnectState): boolean => state.topNews.loadingDoc,
  topList: (state: ConnectState): Array<TopItemProps> =>
    (state.topNews.topNews as TopNewsProps).top_news || [],
  topListMap: (state: ConnectState): TopMapProps =>
    ((state.topNews.topNews as TopNewsProps).top_news &&
      (state.topNews.topNews as TopNewsProps).top_news.reduce(
        (prev: TopMapProps, cur: TopItemProps) => ((prev[cur.docid] = true), prev),
        {},
      )) ||
    {},
  lifespan: (state: ConnectState): number | undefined =>
    (state.topNews.topNews as TopNewsProps).lifespan,
  currentTopItem: (state: ConnectState): TopItemProps | RecItemProps | {} =>
    state.topNews.currentTopItem,
  searchResult: (state: ConnectState): SearchResultProps => state.topNews.searchResult,
  mulitSearchResult: (state: ConnectState): Array<SearchResultProps> =>
    state.topNews.mulitSearchResult,
  categoryList: (state: ConnectState): Array<string> => state.topNews.categoryList,
};
