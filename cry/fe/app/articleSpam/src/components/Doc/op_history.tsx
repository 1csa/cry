import React, { FC } from 'react';
import { KeyPair, HANDLE_OPTIONS } from '@/config/constant';
import "./index.less";

type OP_ITEM = {
  "operator_email": string,
  "op_time": string,
  "operation": string,
  "reason": string
}
// 审核记录
interface IOp_HistoryProps {
  data: OP_ITEM
}
function extractOperation(key: string, value: string){ // 找
  if(key !== 'operation'){
    return value;
  }
  const target = HANDLE_OPTIONS.filter(item => item.key === value);
  return target.length && target[0].value || value;
}
const historyMap: Array<KeyPair<string, string>> = [{
  key: "operator_email",
  value: "审核人"
},{
  key: "op_time",
  value: "审核时间"
},{
  key: "operation",
  value: "审核状态"
},{
  key: "reason",
  value: "审核负反馈类型"
}];
const Op_History: FC<IOp_HistoryProps> = ({data}) => {
  return (
    <div className="history-item">
      {historyMap.map(item => (
        <div key={item.value} className="each-item">
          <strong>{item.value}</strong>:&nbsp;
          {extractOperation(item.key, data[item.key])}
        </div>
      ))}
    </div>
  );
}

interface IOp_History_BoxPros {
  data: OP_ITEM[];
}
const Op_History_List: FC<IOp_History_BoxPros> = (props) => {
  const {data} = props;
  if(!data || !data.length){
    return null;
  }
  return (
    <div className="history-container">
      {/* <div className="history-header">
        <span>审核人数: {data.length || 0}</span>
        <span>收起</span>
      </div> */}
      <div className="history-body">
        {data.reverse().map(item => (
          <Op_History
            data={item}
            key={item.op_time}
          />
        ))}
      </div>
    </div>
  );
}

export default Op_History_List;
