import React from 'react';

interface ArticleVideoPanelProps {
  type: number | string; // 图文视频审核子业务id | 'default'
}

const ArticleVideoPanel: React.FC<ArticleVideoPanelProps> = ({ type = 'default' }) => {
  const panel = () => {
    const panelMap = {
      default: () => <span>图文视频面板正在配置...</span>,
    };

    return panelMap[type] ? panelMap[type]() : panelMap.default();
  };

  return panel();
};

export default ArticleVideoPanel;
