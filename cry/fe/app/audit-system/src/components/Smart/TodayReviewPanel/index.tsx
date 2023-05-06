import React from 'react';

interface ITRPProps {
  count: number;
}

const TodayReviewPanel: React.FC<ITRPProps> = ({ count }) => {
  return (
    <div className="audit-panel-begin">
      <p>今天已完成审核量：{count}</p>
      {/* <p>今天已审核时长：{todayReviewData.time}</p> */}
      <p>打起精神，准备开始工作~</p>
    </div>
  );
};

export default TodayReviewPanel;
