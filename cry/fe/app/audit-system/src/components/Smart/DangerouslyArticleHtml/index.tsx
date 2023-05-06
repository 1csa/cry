import React, { useState, useEffect } from 'react';

import highlightHtml from '@/components/BusinessLogic/highlightHtml';

import { IMatchWordsToHtml } from '@/types';

interface TextContent {
  text: string;
  matchWords: Array<IMatchWordsToHtml>;
  handleAnchor: (anchorCount: { [K: string]: number }) => void;
}

/**
 * 渲染红色标记组件，传入数据参数
 * @parmas text={string} html字符串
 * @parmas matchWords=[] 当前文章命中的敏感词列表
 * @parmas handleAnchor fn 将锚点的数量在初始化的时候传到父组件供兄弟组件使用
 */
const DangerouslyArticleHtml: React.FC<TextContent> = ({ text, matchWords, handleAnchor }) => {
  const { htmlText, anchorCount } = highlightHtml(matchWords, text, 'article', {});

  const [initAnchorCount, setInitAnchorCount] = useState<any>(anchorCount);

  // 初始化命中的敏感词次数
  const initAllWordsAnchorCount = () => {
    for (const key in initAnchorCount) {
      const element = initAnchorCount[key];
      if (element === 0) {
        Reflect.deleteProperty(initAnchorCount, key);
      }
    }
    setInitAnchorCount(initAnchorCount);
    handleAnchor && handleAnchor(initAnchorCount);
  };

  useEffect(() => {
    initAllWordsAnchorCount();
  }, []);

  return (
    <div
      className="dangerous-content"
      dangerouslySetInnerHTML={{
        __html: htmlText,
      }}
    />
  );
};

export default DangerouslyArticleHtml;
