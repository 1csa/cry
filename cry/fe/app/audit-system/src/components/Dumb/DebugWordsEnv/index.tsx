/**
 * 增加debugWordsEnv
 */
import React from 'react';

const debugWordsEnv = {
  test: {
    name: '敏感词测试环境',
    url: `http://10.120.18.31:7001`,
  },
  prd: {
    name: '敏感词线上环境',
    url: `http://barrage.int.yidian-inc.com`,
  },
};

const DebugWordsEnv: React.FC<{}> = () => {
  return (
    <>
      {'test, prd'.includes(localStorage.debugWordsEnv) ? (
        <>
          <a href={debugWordsEnv[localStorage.debugWordsEnv].url} target="_blank" rel="noopener noreferrer">
            {debugWordsEnv[localStorage.debugWordsEnv].name}
          </a>
        </>
      ) : null}
    </>
  );
};
export default DebugWordsEnv;
