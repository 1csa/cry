import { pipe } from '@/utils/dev_helper';
import { NewWordsListType } from '@/types';

const IMAGE_DOMAIN: string = 'http://i1.go2yd.com/image.php';
const CONTENT_DOMAIN: string = 'http://image1.hipu.com/image.php';

/**
 * 渲染高亮词
 * @param item 命中的高亮的一些审核词 带颜色的
 * @param idx
 * @param type 只起一个 data-id 的作用？？？
 */
const styleTag = (item: NewWordsListType, idx: number, type: string) => {
  return `<span data-id="${item.word}-${type}-${idx}" class="sen-words-highlight" style="background: ${item.highlightColor};">${item.word}</span>`;
};
const initMapList = (matchWords: any[]) => {
  let map = {};
  for (let i = 0, len = matchWords.length; i < len; i++) {
    let item = matchWords[i];
    let k = item.start;
    let v = map[k];
    if (!v) {
      map[k] = v = [];
    }
    v.push(item);
  }
  return map;
};

const splitText = (mapList: object, htmlText: string) => {
  const arr = [];
  if (htmlText) {
    // 遍历整个文本
    for (let i = 0, len = htmlText.length; i < len; i++) {
      // 将文字截取为单个的串 i为文字的索引（0，1，2，3.。。）， ch为取出来的text[i]的元素，即第i个字 单个的字
      let ch = htmlText.charAt(i);
      // 遇到了标签
      if (ch == '<') {
        // 从当前标签开始一直遍历到整个文本的最后
        // 如果现在开始，有了标签的话，一直循环到text的最后，直到遇到闭合标签再跳出并且将标签内容打上是标签的标志<xxx> 。
        while (i < len) {
          ch = htmlText.charAt(i);
          arr.push({
            str: ch,
            inTag: true,
          });
          // 如果期间遇到了闭合标签，跳出 说明<xxxx>两个尖括号里的东西遍历完了，例如<div> 则给d,i,v打上了是标签的属性，这个是标签里的东西不能处理
          if (ch == '>') {
            break;
          }
          i++;
        }
      } else {
        // 如果不是标签，需要分两种情况，一种是命中了敏感词，一种是没有命中敏感词 v是命中 else是未命中
        const k = i,
          v = mapList[k];
        // 命中了敏感词
        // 看看map下的索引是不是能匹配上，能匹配上数名当前的词是敏感词的范围。
        // 敏感词map的v不一定从0开始，所如果命中的map的v（v是map对应的 key为i的value {[i]: v} => {key: value}），也就是匹配到了词，接着用索引去第一步的map里找对应词
        if (v) {
          let max = 0;
          // 如果这个词存在，遍历当前这个词，v.length是map对应的vlaue的数组的长度 {13: [[{xxx},{xxx}]]} v.length == 2 是13对应的数组的length
          for (let vi = 0, vlen = v.length; vi < vlen; vi++) {
            // 获取当前词的每一项元素，以及每一项的长度
            const match = v[vi],
              mlen = match.end - match.start;
            if (mlen > max) {
              max = mlen;
            }
            // 这个{13: [{s:13,e:16,...xx},{s:13,e:14,...xxx}]}数组中的词不是有start,end嘛
            // match就是数组中的两项，因为上一步的循环是遍历了词的长度，所以13这个会走两轮循环，
            // 第一轮的时候，这里i是13, 遍历的是13的第一个元素（{s:13,e:16,...xx}）其中，第一个j可能是13,14,15,16，
            // 第二轮的时候i还是13，但是会走13的第二个元素({s:13,e:14,...xxx})其中，j是13，和14
            for (let j = i; j <= match.end && j < len; j++) {
              // 取出这个区间的所有的单个字符
              ch = htmlText.charAt(j);
              // 先初始化一个不知道是不是开始和结束对象
              const item = {
                match: match,
                isStart: false,
                isEnd: false,
              };
              // 所以从上一步知道，如果当前项下(i == j)两者相等的，就是这个词必然是词的开始
              if (j == i) {
                item.isStart = true;
              }
              if (j == match.end || j == len - 1) {
                // 索引等于最后当前词的end的时候必然就是结束
                item.isEnd = true;
              }
              // 对每一个命中的词都打标记 比如命中 习大大 ，则这三个字下边的打上下边的标记
              // 如果没有标记过，先标记一遍
              if (!arr[j]) {
                arr.push({
                  str: ch,
                  inTag: false,
                  hasSensitive: true,
                  sensitiveList: [item],
                });
              } else {
                // 如果标记过了，追加
                arr[j]['sensitiveList'] && arr[j]['sensitiveList'].push(item);
              }
            }
          }
          //i += max;
        } else {
          // 未命中敏感词直接打标记
          if (!arr[i]) {
            const item = {
              str: ch,
              inTag: false,
              hasSensitive: false,
            };
            arr.push(item);
          }
        }
      }
    }
  }
  return arr;
};

const itemToHtml = (item: any) => {
  // 这里的item都是被命中的敏感词拆开的单个字符
  var html;
  // 对 是标签的内容和没有命中敏感词的部分不作处理
  if (item.inTag || !item.hasSensitive) {
    html = item.str;
  } else {
    // 因为追加进来的元素的start,end数据是乱序的
    // 这里按照text的长度升序排，排前可能是顺序是按照text.length由小变大
    item.sensitiveList.sort(function(x: any, y: any) {
      return x.match.text.length - y.match.text.length;
    });

    // 遍历当前词下的敏感词组
    for (var i = 0, len = item.sensitiveList.length; i < len; i++) {
      var si = item.sensitiveList[i],
        match = si.match,
        padding = match.text.length;

      // 这里控制颜色，应该用敏感词的严重程度来匹配cls
      var cls = '';
      let highlightColor = match.highlightColor;
      if (si.isStart) {
        cls = 'word_' + match.wordId;
      }
      var text = html || item.str;
      const paddingPxStr = `${padding}px`;
      const borderStr = `2px solid #e9e9e9`;
      const borderRadius = 4;
      html = `<span class="${cls}" data-sensitive=true style="color: #fff; background-color: ${highlightColor ||
        '#000'}; padding-top: ${paddingPxStr}; padding-bottom: ${paddingPxStr}; border-top: ${borderStr}; border-bottom: ${borderStr}; `;

      if (si.isStart) {
        if (len == 1) {
          html += `padding-left: ${paddingPxStr}; `;
        }
        html += `border-left: ${borderStr}; border-radius: ${borderRadius}px 0 0 ${borderRadius}px; `;
      }
      if (si.isEnd) {
        if (len == 1) {
          html += `padding-right: ${paddingPxStr}; `;
        }
        html += `border-right: ${borderStr};`;
        if (si.isStart) {
          html += `border-radius: ${borderRadius}px; `;
        } else {
          html += `border-radius: 0 ${borderRadius}px ${borderRadius}px 0; `;
        }
      }
      if (i == len - 1) {
        html += `display: inline-block; margin-top: ${paddingPxStr}; margin-bottom: ${paddingPxStr}`;
      }
      html += `">${text}</span>`;
    }
  }
  return html;
};

const beginHighlightHtml = (arr: any) => {
  let html = '';

  for (var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    if (item.hasSensitive) {
      var div = '<span>';
      // var div = '<div style="display: inline; white-space: nowrap;">';
      do {
        item = arr[i];
        if (!item.hasSensitive) {
          i--;
          break;
        }
        div += itemToHtml(arr[i]);
      } while (++i < len);
      div += '</span>';
      html += div;
    } else {
      var temp = itemToHtml(arr[i]);
      html += temp;
    }
  }
  return html;
};

const replaceImgDomain = (html: string) => html?.replaceAll(CONTENT_DOMAIN, IMAGE_DOMAIN);

/**
 * TODO: wxj 获取高亮 html 字符串片段
 * 获取高亮 html 字符串片段
 * @param matchWords
 * @param htmlText
 * @param type  ??? 这个参数的作用？？？
 * @param anchorCount
 * @returns
 */
const highlightHtml = (
  matchWords: any[],
  htmlText: string,
  type: string = 'article',
  anchorCount?: {
    [K: string]: number;
  },
) => {
  const isNewSensitiveWords =
    matchWords.length > 0 &&
    (!!matchWords[0]?.wordRemark ||
      !!matchWords[0]?.cateOneCode ||
      typeof matchWords[0]?.end === 'number');
  if (isNewSensitiveWords) {
    // 每一个函数的返回值，作为下一个函数的参数，为了避免a(b(c()))嵌套调用，利用pipe函数处理
    return {
      htmlText: pipe(
        initMapList,
        (m: any) => splitText(m, htmlText),
        beginHighlightHtml,
        (s: string) => (typeof s === 'string' ? replaceImgDomain(s) : s),
      )(matchWords),
      anchorCount: {},
    };
  } else {
    if (matchWords.length) {
      matchWords.forEach(item => {
        // 按照命中的敏感词截断文本
        const splitArr = htmlText.split(item.word);

        // 为截断的每一个数据处理高亮
        splitArr.forEach((value, idx) => {
          if (idx < splitArr.length - 1) {
            splitArr[idx] = `${value} ${styleTag(item, idx + 1, type)} `;
          }
        });

        // 拼接
        htmlText = splitArr.join('');

        // 计算单个敏感词在html中命中的次数
        anchorCount &&
          Object.keys(anchorCount).length > 0 &&
          Object.assign(anchorCount, {
            [item.word]: splitArr.length - 1,
          });
      });
      return { htmlText: replaceImgDomain(htmlText), anchorCount };
    } else {
      return { htmlText: replaceImgDomain(htmlText), anchorCount: {} };
    }
  }
};
export default highlightHtml;
