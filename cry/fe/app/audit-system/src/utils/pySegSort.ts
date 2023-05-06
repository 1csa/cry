export interface ITagsTypes {
  tag: string;
  pinyin: string;
}

export interface IfinaData {
  letter: string;
  data: string[];
}

const pySegSort = (arr: ITagsTypes[]) => {
  let wordsMap: Map<string, boolean> = new Map();
  let moreWords: IfinaData[] = [];
  arr.forEach(item => {
    // 取首字母
    const initials = item.pinyin.charAt(0).toLowerCase();
    // 哈希表中不存在，直接push
    if (!wordsMap.has(initials)) {
      moreWords.push({
        letter: initials,
        data: [item.tag],
      });
      wordsMap.set(initials, true);
    } else {
      // 否则就寻找去拼接
      moreWords.forEach(e => {
        if (e.letter === initials) {
          e.data = [...new Set([...e.data, item.tag])];
        }
      });
    }
  });

  return moreWords.sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0));
};
export default pySegSort;
