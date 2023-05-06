/**
 * 图文-内容媒体 | 视频-封面图
 * 展示数美提示内容 边框 & 提示语
 */
import React from 'react';

import { Popover } from 'antd';

import Iconfont from '@/components/Dumb/Iconfont';

import { PictureType } from './index';

interface AntiFrandPictureProps {
  contentMedia: Array<PictureType>; // 图文内容媒体图片 | 视频封面图片 url
  imgAlt?: string; // img alt 属性，默认'图片'
  canScroll?: boolean; // 点击 滚动，默认true
}

// 图片 数美机审 UI
// 图文-内容媒体 | 视频-封面图
const AntiFrandPicture: React.FC<AntiFrandPictureProps> = ({ contentMedia, imgAlt = '图片', canScroll = true }) => {
  const renderContent = (url: string) => (
    <img style={{ minWidth: 600, minHeight: 600, maxWidth: 1200, maxHeight: 700, objectFit: 'contain' }} src={url} alt="图片" />
  );

  /**
   * 点击右侧媒体图片跳转至页面的锚点处
   * @param id 图片id
   */
  const scrollToAnchor = (id: string) => {
    if (canScroll) {
      const ele = document.querySelector(`[image-id="${id}"]`) || document.querySelector(`[src="${id}"]`);
      // 如果对应id的锚点存在，就跳转到锚点
      if (ele) {
        ele.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="picture-box fb">
      {Array.isArray(contentMedia) && contentMedia.length
        ? contentMedia.map((item: PictureType, idx: number) => {
            const {
              score,
              antiFrandResult: { needTips: shuMeiStatus, tips },
            } = item;
            const riskStatus = typeof score === 'number' && score > 0.98;
            return (
              <Popover title={item?.tag} key={idx} content={renderContent(item.url)} placement="left">
                <div className={`media-img-wrapper ${riskStatus || shuMeiStatus ? 'danger-border' : ''}`}>
                  {shuMeiStatus && (
                    <Popover title="机审信息" content={tips} placement="right">
                      <div className="tips-icon-wrapper">
                        <Iconfont name="iconjinggao" />
                      </div>
                    </Popover>
                  )}
                  <img className="picture-box-img cp" src={item.url} alt={imgAlt} onClick={() => scrollToAnchor(item.id || item?.url)} />
                </div>
              </Popover>
            );
          })
        : `暂无${imgAlt}`}
    </div>
  );
};

export default AntiFrandPicture;
