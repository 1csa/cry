import React, { useContext } from 'react';
import { Tag, Popover } from 'antd';

import initFeaturesInfo from '@/components/BusinessLogic/getFeaturesInfo';

import { CreateMediaInfoContext, ICreateMediaInfoContext, MachineTags } from '@/context';
import { ComposeWordsType } from '@/types';

import './index.less';

interface MachineInfoPanelProps {
  handleTagChangeProps: (item: any) => void;
  features: string;
}
const preCls = `word_`;

const MachineInfoPanel: React.FC<MachineInfoPanelProps> = ({ handleTagChangeProps, features }) => {
  const mediaInfoContext = useContext<ICreateMediaInfoContext>(CreateMediaInfoContext);
  const { machineTags } = mediaInfoContext?.machineModel;

  /**
   * 切换高亮词
   * @param item
   */
  const toggleHighlightColor = (item: ComposeWordsType) => {
    const ele = document.querySelector(`[class=word_${item.wordId}]`);
    const broNode = ele?.parentNode?.childNodes ?? [];
    const borderStyle = '2px solid #e9e9e9';
    const styleNone = 'none';
    const dis = '4px';
    broNode.forEach((element: any, idx: number) => {
      // 重新添加
      if (element.style.backgroundColor === 'rgb(255, 255, 255)') {
        // 中间的词没有左右边框 没有左边间距和圆角
        if (idx === 0 || idx === broNode.length - 1) {
          if (idx === 0) {
            // 第一个词没有右边框，有左，并且圆角只有↖️和↙️
            element.style.borderRight = styleNone;
            element.style.borderLeft = borderStyle;
            element.style.borderRadius = '4px 0 0 4px';
            element.style.paddingLeft = dis;
          } else {
            // 最后一个词没有左边框，有右边框，圆角↗️↘️
            element.style.borderLeft = styleNone;
            element.style.borderRight = borderStyle;
            element.style.borderRadius = '0 4px 4px 0';
            element.style.paddingLeft = 0;
          }
        } else {
          element.style.borderLeft = styleNone;
          element.style.borderRight = styleNone;
          element.style.borderRadius = 0;
        }
        // 通用样式
        element.style.color = '#fff';
        element.style.backgroundColor = item.highlightColor;
        element.style.paddingTop = dis;
        element.style.paddingBottom = dis;
        element.style.borderTop = borderStyle;
        element.style.borderBottom = borderStyle;
        element.style.display = 'inline-block';
        element.style.marginTop = dis;
        element.style.marginBottom = dis;
      } else {
        // 点击按钮清掉style样式
        element.style.color = '#000000a6';
        element.style.backgroundColor = '#fff';
        element.style.paddingTop = '';
        element.style.paddingBottom = '';
        element.style.borderTop = '';
        element.style.borderBottom = '';
        element.style.paddingLeft = '';
        element.style.borderLeft = '';
        element.style.borderRight = '';
        element.style.borderRadius = '';
        element.style.display = 'inline-block';
        element.style.marginTop = '';
        element.style.marginBottom = '';
      }
    });
    // console.log('ele?.parentNode?.childNodes', ele?.parentNode?.childNodes);
  };

  /**
   * 点击敏感词跳转
   * 旧的词的点击事件在./index中，新的在当前页面 判断一下item的类型从而执行不同的回调
   * 初始化的时候设置自定义属性为-1，没点击一次++1，然后再将新的index设置为data-index的属性值
   * 需要跳几次其实利用dom获取的classname的数组知道
   * @param item 旧敏感词返回的是word内容 新敏感词返回的是word_wordid
   */
  const handleTagChange = (item: string) => {
    if (item.includes(preCls)) {
      const dataClickIndexEle = document.querySelector(`[data-wordid=${item}]`);
      var index = parseInt(dataClickIndexEle?.getAttribute('data-index')!);

      var spans = document.getElementsByClassName(item);
      var hitCount = spans.length;

      var newIndex = ++index % hitCount;
      var span = spans[newIndex];
      span?.scrollIntoView({ behavior: 'smooth' });
      // 获取所有的被命中的敏感词，清除掉样式
      const allSpanWords = document.querySelectorAll('[data-sensitive]');
      allSpanWords.forEach(e => e.classList.remove(`word-tips`));
      // 为当前的span增加样式
      span?.classList.add(`word-tips`);
      var as = document.querySelectorAll(`[data-index]`);
      // 重置其他的属性
      for (var i = 0, len = as.length; i < len; i++) {
        if (as[i] != dataClickIndexEle) {
          // span.classList.remove(`word-tips`)
          as[i].setAttribute('data-index', '-1');
        }
      }
      dataClickIndexEle?.setAttribute('data-index', `${newIndex}`);
    } else {
      handleTagChangeProps && handleTagChangeProps(item);
    }
  };

  const renderSens = () => {
    return mediaInfoContext?.sensitiveGroup?.map((item: ComposeWordsType, index: number) => {
      return (
        <div key={item?.categoryName + item.words + index}>
          <h4 style={{ cursor: 'pointer', color: `rgba(0, 0, 0, .45)`, marginBottom: 0 }}>
            <span>{item?.categoryName}</span>
          </h4>
          {renderSensiBtn(item)}
        </div>
      );
    });
  };

  const machineAlgorithmModel = () =>
    initFeaturesInfo(features, mediaInfoContext?.leader).length > 0
      ? initFeaturesInfo(features, mediaInfoContext?.leader).map((item: string) => {
          return (
            <Tag color="error" style={{ marginBottom: 10 }} key={item}>
              {item}
            </Tag>
          );
        })
      : '暂无信息';

  const promotionModel = (key: string) => {
    const filterData = machineTags?.filter(ele => ele[key]) || [];
    return machineTags!?.length > 0
      ? filterData?.map((item: MachineTags) => {
          return (
            <Tag style={{ marginBottom: 10 }} key={item?.key}>
              {item?.value}：{key === 'scAd' ? typeof item[key].length && Number(item[key]).toFixed(3) : item[key]}
            </Tag>
          );
        })
      : '暂无信息';
  };

  const renderSensiBtn = (item: ComposeWordsType) => {
    // 如果是数组并且数组长度为1 且包括黑色，表示没命中颜色，那就用黑色兜底，否则就用配置的颜色

    // const highlightColorArr = () => {
    //   if (Array.isArray(item.highlightColor)) {
    //     if (item.highlightColor.length === 1 && item.highlightColor.includes('#000')) {
    //       return ['#000'];
    //     } else {
    //       return item.highlightColor.filter(e => e !== '#000');
    //     }
    //   } else {
    //     return ['#000'];
    //   }
    // };

    return (
      <>
        {Array.isArray(item.words) &&
          item.words.map((ele: string, index: number) => {
            const [wordText, wordId] = ele?.split(`^_&`);
            const [wordRemark] =
              Array.isArray(item?.wordRemark) && item?.wordRemark?.length
                ? item?.wordRemark[index]
                  ? item?.wordRemark[index]?.split(`^_&`) || ['']
                  : ['']
                : [''];
            return (
              <Popover
                mouseEnterDelay={0.5}
                key={ele}
                content={item?.actionType && item?.actionType[index]?.charAt(0) === `4` ? `[提示]: ${wordRemark || ''}` : wordRemark || ''}
                title="备注"
              >
                <Tag
                  style={{ cursor: 'pointer', marginBottom: 10 }}
                  data-index="-1"
                  data-wordid={`${preCls}${wordId}`}
                  color={(item?.actionType && item?.actionType[index]?.split('&_^')[1]) || '#000'}
                  onClick={item.wordId ? () => handleTagChange(`${preCls}${wordId}`) : () => handleTagChange(ele)}
                >
                  <span>{item.wordId && wordText}</span>
                </Tag>
              </Popover>
            );
          })}
      </>
    );
  };

  return (
    <>
      <div className="mb10">
        <h3>机审：关键词命中</h3>
        {mediaInfoContext?.sensitiveGroup.length ? renderSens() : '无关键词命中'}
      </div>
      <div className="mb10">
        <h3>机审：模型算法命中</h3>
        {machineAlgorithmModel()}
      </div>
      {Array.isArray(machineTags) && machineTags?.filter(ele => ele.scAd).length > 0 && (
        <div className="mb10">
          <h3>机审：恶意推广模型</h3>
          {promotionModel('scAd')}
        </div>
      )}
      {Array.isArray(machineTags) && machineTags?.filter(ele => ele.tag).length > 0 && (
        <div className="mb10">
          <h3>机审：图片黑样本识别</h3>
          {promotionModel('tag')}
        </div>
      )}
    </>
  );
};

export default MachineInfoPanel;
