export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href =
      location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};

export const getUserName = (user: any) => {
  const { currentUser } = user;
  return currentUser && (currentUser.name || currentUser.email) || ''
}

export const computeDirty = (response: any): boolean => {
  if(response && response.status === 'success'){
    return true;
  }
  return false;
}

export const topicFilter = (topics: TOPIC[], condition: SEARCH_CONDITION): TOPIC[] => {
  if(!condition) {
    condition = {};
  }
  return topics.filter((topic: TOPIC) => contains(topic.id, condition.id || ''))
  .filter((topic: TOPIC) => contains(topic.name, condition.name || ''))
  .filter((topic: TOPIC) => contains(topic.creator, condition.creator || ''))
  .filter((topic: TOPIC) => filterStatus(topic.status, condition.status))
  .filter((topic: TOPIC) => filterByDate(topic.add_time, condition.createAt))
  .sort((topicA: TOPIC, topicB) => sortByDesc(topicA, topicB, condition.order));
}

export const isTopicExists = (topics: TOPIC[], topic: TOPIC) : boolean => {
  return topics.filter((item: TOPIC) => item.id === topic.id).length !== 0;
}

export const isDocid = (word: string): boolean => {
  if (word.length === 8 && word.search(/^\w+$/) === 0) {
    return true;
  }
  if (word.indexOf('news_') === 0) {
    return true;
  }
  if (/V_\w+$/.test(word) || /K_\w+$/.test(word) || /T_\w+$/.test(word) || /J_\w+$/.test(word)) {
    return true;
  }
  return false;
}

export const all = (arr: any[], fn: any) => arr.every(fn);

function contains(target: any, match: any){
  if(!target){
    return true;
  }
  return String(target).indexOf(match) > - 1;
}

function filterStatus(target: any, match: any){
  if(!target || !match){
    return true;
  }
  if(match == '0'){ // 全部
    return true;
  }
  return String(target) == match;
}

function filterByDate(target: any, match: any){
  if(!target || !match){
    return true;
  }
  const targetTime = new Date(target).getTime();
  const lTime = new Date(match[0]).getTime();
  const gTime = new Date(match[1]).getTime();

  return targetTime >= lTime && targetTime <= gTime;
}

function sortByDesc(t1: TOPIC, t2: TOPIC, match: any){
  const t1Time = new Date(t1.add_time!).getTime();
  const t2Time = new Date(t2.add_time!).getTime();
  if(match === 'ASCE'){
    return t1Time - t2Time;
  }
  return t2Time - t1Time;
}

export function saveLog(data: any, action_method: string): void{
  window['Logger'] && window['Logger']['saveLog']({
    log_source: {tag: "video_short_ugc"},
    target_data: {"detail": JSON.stringify(data)},
    action_method,
  });
}
