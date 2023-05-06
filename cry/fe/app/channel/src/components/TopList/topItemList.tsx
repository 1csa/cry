import React, { FC } from 'react';
import TopItem from '../TopItem';

import './index.less';

const TopItemList: FC<any> = React.memo((props) => {
  const { topList = [], todelList, checkAll, showCheckAll, setTodelList } = props
  return (
    <div>
      {
        topList.map((row, index) => (
          <TopItem
            key={row.docid}
            doc={row}
            index={index}
            style={{}}
            todelList={todelList}
            checkAll={checkAll}
            updateDellist={setTodelList}
            showCheckAll={showCheckAll}
          />
        ))
      }
    </div>
  );
});

export default TopItemList;
