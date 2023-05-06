/**
 * 将原始返回的词，组合成和颜色拼接等想要的格式
 */
import { SensitiveGroupType, ComposeWordsType } from '@/types';
import { compareFn } from '@/utils/dev_helper';
type WordItemType = Pick<SensitiveGroupType, 'highlightColor' | 'words'>;

const getHighlightColor = (act: number) => (act === 1 ? '#00A000' : act === 4 ? '#8B8378' : '');

/**
 * 遍历敏感词，将名字相同的敏感词归为一类
 * @param wordsList 命中的敏感词列表
 */
function composeWordsFn(wordsList: ComposeWordsType[]): ComposeWordsType[] {
  let composeWords: ComposeWordsType[] = [];
  const wordsMap = {};

  wordsList.forEach((item: ComposeWordsType) => {
    if (!wordsMap[item?.categoryName!]) {
      composeWords.push(item);
      wordsMap[item?.categoryName!] = true;
    } else {
      composeWords.forEach(ele => {
        if (ele.categoryName === item.categoryName) {
          ele.words = [...new Set([...(ele.words || []), ...item.words!])];
          ele.wordRemark = [...new Set([...(ele.wordRemark || []), ...item.wordRemark!])];
          ele.actionType = [...new Set([...(ele.actionType || []), ...(item.actionType! || [])])];
        }
      });
    }
  });
  return composeWords;
}

/**
 * 兼容敏感词 新的敏感词用索引 旧的不变
 * @param allWords 所有的敏感词 这里的数据是新旧都在一个字段里
 * @param sensitiveHighlightList Apollo获取的配置高亮的词
 */
export const compatibleSensitiveWords = (allWords: any[], sensitiveHighlightList: any[]) => {
  // 接口不支持用别的参数来判断，需要判断数组中的数据
  const isNewsensitiveWords = allWords.length > 0 && (!!allWords[0]?.wordRemark || !!allWords[0]?.expression);

  // 兼容旧的敏感词
  if (!isNewsensitiveWords) {
    // 获取匹配的敏感词 并且将其打散、过滤不为空的数据、按照颜色的sort从页面依次由上往下排序最终合并数据
    let oldWords: any[] = allWords
      .map(item => {
        return sensitiveHighlightList.map((ele: any) => {
          if (ele.sensitiveList.includes(`${item.cateOneName}-${item.cateTwoName}`)) {
            return {
              categoryName: `${item.cateOneName} - ${item.cateTwoName}`,
              words: [item.word],
              highlightColor: getHighlightColor(item.actionType) || ele.highlightColor,
              sort: ele.sort,
            };
          }
        });
      })
      ?.flat(5)
      .filter(item => item)
      .sort(compareFn('sort'));

    // 设置正文和标题的需要染色的文字格式
    const matchWordsToHtml = composeWordsFn(oldWords)
      .map((item: Partial<WordItemType>) => {
        return (
          item.words?.length &&
          item.words.map((ele: string) => {
            return {
              highlightColor: item.highlightColor,
              word: ele,
            };
          })
        );
      })
      ?.flat(5);

    return {
      composeWords: composeWordsFn(oldWords) || [],
      matchWordsToHtml: matchWordsToHtml || [],
    };
  } else {
    const newWords: any = allWords
      .map(item => {
        return sensitiveHighlightList.map((ele: any) => {
          let getColor = () => {
            if (ele.sensitiveList.includes(`${item.cateOneName}-${item.cateTwoName}`)) {
              return getHighlightColor(item.actionType) || ele.highlightColor;
            }
          };

          return {
            words: item.word ? [`${item.word}^_&${item.wordId}`] : [],
            categoryName: `${item.cateOneName} - ${item.cateTwoName}`,
            sort: ele.sort,
            start: item.start,
            end: item.end,
            wordId: item.wordId,
            text: item.text,
            wordRemark: item.wordRemark ? [`${item.wordRemark}^_&${item.wordId}`] : [],
            actionType: item.actionType ? [`${item.actionType}^_&${item.wordId}&_^${getColor()}`].filter(val => !val.includes('undefined')) : [],
          };
        });
      })
      ?.flat(5)
      .filter(item => item)
      .sort(compareFn('sort'));

    allWords.forEach(item => {
      sensitiveHighlightList.forEach(ele => {
        if (ele.sensitiveList.includes(`${item.cateOneName}-${item.cateTwoName}`)) {
          item.highlightColor = getHighlightColor(item.actionType) || ele.highlightColor;
        }
      });
    });

    return {
      composeWords: composeWordsFn(newWords),
      matchWordsToHtml: allWords,
    };
  }
};
