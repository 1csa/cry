  // 1级 -> 无
  // 2级 -> 2级、3级、4级、...n-1级、n级
  // 3级 -> 3级、4级、...n-1级、n级
  // ...
  // n-1级 -> n-1级、n级
  // n级 -> n级
export function convertLevel(levelArr) {
  if (!levelArr || !(levelArr instanceof Array)) return [];
  // 过滤掉格式不对的level，正确格式: 1级
  levelArr = levelArr.filter(item => /^\d+级$/.test(item.level));
  // 1级返回无
  if (levelArr.length === 1 && levelArr[0].level === "1级") return ["无"];

  const numArr = [];
  levelArr.map(item => numArr.push(parseInt(item.level)));
  const max = Math.max.apply(null, numArr);
  const res = [];
  // 初始值;
  let currentFullLevel = `${max}级`;
  // 从max开始遍历
  let iterator = max;

  while(iterator > 1) {
    res.unshift(currentFullLevel);
    currentFullLevel = `${--iterator}级、` + currentFullLevel;
  }
  // 带上'无'
  res.unshift('无');
  return res;
}