import { PushHistoryItem } from '@/config/editorpush/history';
import { ConnectState } from '@/models/connect';

export const pushStatisticSelect = ({ editorpush }: ConnectState): Record<string, number> => {
  const map = {};
  for (let { task_name, count } of editorpush.statistics) {
    map[task_name] = count;
  }

  return map;
};

// 获取push task列表
export const pushTaskListSelector = ({ editorpush }: ConnectState): PushHistoryItem[] => {
  return editorpush.taskList;
};

// 获取push task列表总数
export const countAllSelector = ({ editorpush }: ConnectState): number => {
  return editorpush.countAll;
};

// 获取分类的映射关系
export const catemapSelector = ({ editorpush }: ConnectState) => {
  const tagMap = {};

  for (let { name, id } of editorpush.cateList) {
    tagMap[id] = name;
  }

  return tagMap;
};

export const storedcatesSelector = ({ accountEnum }: ConnectState) => {
  return accountEnum.cates;
};

// 用户层级映射
export const userelayermapSelector = ({ editorpush }: ConnectState): Record<string, string> => {
  const userlayerList = editorpush.userlayerList;
  const userlayerMap = {};

  for (let { name, id } of userlayerList) {
    userlayerMap[id] = name;
  }

  return userlayerMap;
};

// 收藏的标签：带数据---调用次数不太对
export const storedInTagSelector = ({ editorpush }: ConnectState): Record<string, string> => {
  return editorpush.storedIntags;
};

// 收藏的交集标签
export const storedInterTagSelector = ({ editorpush }: ConnectState): Record<string, string> => {
  return editorpush.storedIntertags
};

// 收藏的排除标签: 带数据
export const storedExTagSelector = ({ editorpush }: ConnectState): Record<string, string> => {
  return editorpush.storedExtags;
};

// doc相关的标签：带数据
export const docrecInTagSelector = ({ editorpush }: ConnectState): Record<string, string> => {
  return editorpush.docrecInTags;
};

// 推送人数
export const pushuserSelector = ({ editorpush }: ConnectState): string => {
  return editorpush.pushUserCount;
};

// 同步触达端
export const syncplatformSelector = ({ editorpush }: ConnectState) => {
  const syncplatformList = editorpush.syncPlatforms;
  const syncplatformMap = {};

  for (let { name, id } of syncplatformList) {
    syncplatformMap[id] = name;
  }

  return syncplatformMap;
};

// 获取输入docid对应的内容
export const pushdocInfoSelector = ({ editorpush }: ConnectState) => {
  return editorpush.pushdocInfo;
};
// 获取输入docid对应的内容
export const pushsectiondocInfoSelector = ({ editorpush }: ConnectState) => {
  return editorpush.pushsectiondocInfo;
};

// 获取图片有关的内容
export const articleInfoSelector = ({ editorpush }: ConnectState) => {
  return editorpush.articleInfo;
};

// 获取本地的保存tags集合
export const localtagsSelector = ({ editorpush }: ConnectState) => {
  return editorpush.localTags;
};