import React from 'react';
import { Tag, Tooltip } from 'antd';

import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';
import Iconfont from '@/components/Dumb/Iconfont';
import highlightHtml from '@/components/BusinessLogic/highlightHtml';

import { IMatchWordsToHtml, SelectOptionsType } from '@/types';

import './index.less';

const initTitle = ['FeedbackPanel'];

// 要是觉得接口参数太多可以将同类型的整理在一起按照对象传入
interface MCTPProps {
  bussinessType: Array<string>; // 该文章所属业务模块
  qualityTags?: Array<SelectOptionsType>; // Tag标签展示 曝光 & 点击 & CTR 的数据
  reviewType: string; // 该文章所属审核分区
  title: string; // 文章标题
  subTitle: string; // 文章副标题
  matchTitleWords: Array<IMatchWordsToHtml>; // 匹配的敏感词列表用于标题命中飘红
  matchSubTitleWords: Array<IMatchWordsToHtml>; // 匹配的敏感词列表用于标题命中飘红
  logModalCallBack: (status: boolean) => void;
  templateName: string;
  summary: string;
}

/**
 * 负反馈审核文章/视频标题组件 标题的组件其实只是负责用标题命中的敏感词来刷
 */
const MediaContentTitlePanel: React.FC<MCTPProps> = ({
  bussinessType,
  qualityTags,
  reviewType,
  title,
  subTitle,
  matchTitleWords,
  matchSubTitleWords,
  logModalCallBack,
  templateName,
  summary,
}) => {
  const logStatus: boolean = false;

  let dangerMainTitle: string = title;
  let dangerSecondTitle: string = subTitle;

  const jump2Search = () => {
    window.open(`https://www.baidu.com/s?wd=${title}`, '_blank');
  };

  const toggleLogModal = () => {
    logModalCallBack && logModalCallBack(!logStatus);
  };

  const renderTitleDangerousText = (titleStr: string) => {
    return highlightHtml(matchTitleWords, titleStr, 'title', {}).htmlText;
  };

  const renderSubTitleDangerousText = (titleStr: string) => {
    const { htmlText = '' } = highlightHtml(matchSubTitleWords, titleStr, 'title', {});
    return htmlText ? `副标题：${htmlText}` : '';
  };

  // 公共的文章业务类型等
  const getTag = () => (
    <>
      {bussinessType.map((ele: string) => {
        return <Tag key={ele}>{ele}</Tag>;
      })}
    </>
  );

  // 质量打标的标签
  const getQulityTags = () =>
    Array.isArray(qualityTags) &&
    qualityTags.length &&
    qualityTags.map(ele => (
      <div key={ele.label} className="mr20">
        {ele.value ? (
          <Tag>
            {ele.label}:{ele.value}
          </Tag>
        ) : null}
      </div>
    ));

  const IconTagPanel = (className?: string) => {
    return (
      <div className={`icon-tag-panel ${className}`}>
        {getQulityTags()}
        <BasicCopyToClipboard
          data={title}
          title="标题"
          renderChild={() => (
            <span className="mr20 cp">
              <Iconfont name="iconbiaotilan" />
            </span>
          )}
        />
        <Tooltip title="查看审核历史记录">
          <span onClick={toggleLogModal} className="mr20 cp">
            <Iconfont name="iconlishi" />
          </span>
        </Tooltip>
        <Tooltip title="跳转百度搜索">
          <span onClick={jump2Search} className="mr20 cp">
            <Iconfont name="iconsousuo" />
          </span>
        </Tooltip>
        {getTag()}
        {reviewType ? <Tag>{reviewType}</Tag> : null}
      </div>
    );
  };

  const commonUseTemplate = () => (
    <>
      {IconTagPanel('icon-tag-panel-1')}
      <div>
        {dangerMainTitle && <h2 className="title center-text" dangerouslySetInnerHTML={{ __html: renderTitleDangerousText(dangerMainTitle) }} />}
        {dangerSecondTitle && (
          <h3 className="title center-text" dangerouslySetInnerHTML={{ __html: renderSubTitleDangerousText(dangerSecondTitle) }} />
        )}
        {/* className={`${summary.length < 80 ? 'center-text' : 'left-text'}`} */}
        {summary && <p className="center-text" dangerouslySetInnerHTML={{ __html: summary }} />}
      </div>
    </>
  );

  /**
   * 根据模版类型返回对应的标题，有默认组件，除非特殊情况才需要处理
   * @returns () => JSX.Element
   */
  const renderComponents = () => {
    const panelMap = {
      FeedbackPanel: () => (
        <>
          {dangerMainTitle && <h3 className="title" dangerouslySetInnerHTML={{ __html: renderTitleDangerousText(dangerMainTitle) }}></h3>}
          {summary && <p className="center-text" dangerouslySetInnerHTML={{ __html: summary }} />}
          {IconTagPanel()}
        </>
      ),
      DEFAULT: () => commonUseTemplate(),
    };
    return panelMap[templateName] ? panelMap[templateName]() : panelMap['DEFAULT']();
  };

  return (
    <div className={`${initTitle.includes(templateName) ? 'feebback-title' : 'feebback-title flex-co'} `}>{templateName && renderComponents()}</div>
  );
};

export default MediaContentTitlePanel;
