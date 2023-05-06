import React, { useState, useEffect, Fragment, MouseEvent } from 'react';
import { connect } from 'dva';
import produce from 'immer';

import { Popover, Button, Space, Modal, Tag, message } from 'antd';

import { userprofileToApiParams, MACHINE_STATUS, MACHINE_NOT_PASS_STR } from '@/components/BusinessLogic/userprofilePanelData';
import Iconfont from '@/components/Dumb/Iconfont';
import highlightHtml from '@/components/BusinessLogic/highlightHtml';
import { compatibleSensitiveWords } from '@/components/Smart/MediaContentMainPanel/utils';

import { ConnectState, UserModelState } from '@/models/connect';
import { get, getEmailName } from '@/utils/dev_helper';
import { btnGroup } from '@/data/constants';
import { submitTask } from '@/services/commonServices';
import { getApolloSetting } from '@/services/apolloSetting';

import './index.less';

type SensCatType = { type: string; word: string; wordRemark: string };

interface IUserprofilePanelProps {
  taskList: Array<any>;
  user: UserModelState;
  isModal?: boolean;
  updateList?: (v: Array<any>) => void;
  reloadCallBack?: () => void;
}

const UserprofilePanel: React.FC<IUserprofilePanelProps> = ({ taskList, updateList, user, isModal, reloadCallBack }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [taskListProps, setTaskListProps] = useState<Array<any>>(taskList || []);

  // 点击放大镜逻辑
  const handleZoom = (url: string, event: MouseEvent) => {
    setVisible(true);
    setImgUrl(url);
    event.stopPropagation();
  };

  // 设置边框色值
  const setDangerBorder = (update_status: Array<string>, type: string): string => {
    return update_status.includes(type) ? 'danger-border' : 'normal-border';
  };

  useEffect(() => {
    getApolloSetting().then(res => {
      const list = taskListProps.map(itemData => {
        const item = formatItemData(itemData, res);
        return {
          ...itemData,
          ...item,
        };
      });
      setTaskListProps(list);
    });
  }, [JSON.stringify(taskList)]);

  // 返回高亮的敏感词 html的形式 需要render
  const highlighComment = (matchWordsToHtml: any[], content: string) => {
    return highlightHtml(matchWordsToHtml, content, 'title', {}).htmlText;
  };

  /**
   * 格式化数据 审核任务|历史列表 除审核结果的数据
   * @param item 当前数据
   * @param res  apolloSetting res
   * @returns object item
   */
  const formatItemData = (item: any, res: any) => {
    const nickWords = item?.machine_result?.sensitive?.nick?.words ?? [];
    const brieftWords = item?.machine_result?.sensitive?.brief?.words ?? [];
    const { matchWordsToHtml: matchNickWords2Html } = getMatchWords(nickWords, res.sensitiveHighlightList);
    const { matchWordsToHtml: matchBriefWords2Html } = getMatchWords(brieftWords, res.sensitiveHighlightList);
    if (nickWords.length > 0) {
      item.user_nick = highlighComment(matchNickWords2Html, item?.user_nick);
    }
    if (brieftWords.length > 0) {
      item.user_brief = highlighComment(matchBriefWords2Html, item?.user_brief);
    }
    return item;
  };

  /**
   * 获取html或者评论内容涉及到的 命中的需要 高亮的敏感词 以及敏感词的分类和鼠标划上去之后显示敏感词和备注信息
   * @param commentWords              需要匹配的文字
   * @param sensitiveHighlightList    apollo 接口相应数据
   * @returns
   */
  const getMatchWords = (commentWords: any[], sensitiveHighlightList: string) => {
    // console.log('apollo 接口 sensitiveHighlightList json', JSON.parse(sensitiveHighlightList));
    const { matchWordsToHtml } = compatibleSensitiveWords(commentWords, JSON.parse(sensitiveHighlightList));
    // 处理敏感词分类、备注、以及命中敏感词在Tag中的展示
    // 先按照敏感词去重
    const words = [...new Set(matchWordsToHtml?.map(ele => ele?.word) || [])];
    let category: SensCatType[] = [];
    // 遍历当前敏感词 去 所有敏感词中找当前敏感词所对应的 分类以及备注
    for (let i = 0; i < words.length; i++) {
      const wv = words[i];
      for (let j = 0; j < matchWordsToHtml.length; j++) {
        const mv = matchWordsToHtml[j];
        if (mv?.word === wv) {
          // 如果已经存在 跳出本次循环
          const hasWord = category?.find(data => data?.word === wv);
          if (hasWord) {
            continue;
          } else {
            // 否则将数据插入
            category.push({
              type: `${mv?.cateOneName}/${mv?.cateTwoName}`,
              word: wv,
              wordRemark: mv?.wordRemark,
            });
          }
        }
      }
    }
    return { matchWordsToHtml, category };
  };

  // 渲染nickname昵称
  const renderNickname = (item: any, machineStatus?: boolean) => {
    return (
      <div className={`nickname ${setDangerBorder(item.update_status, 'nick')}`}>
        <div className="label-title">昵称：</div>
        <div className="nick-name-text">
          <span dangerouslySetInnerHTML={{ __html: item.user_nick }} />
        </div>
        {machineStatus
          ? renderTextModal(MACHINE_NOT_PASS_STR)
          : Array.isArray(item.result_tags_nick) && item.update_status.length !== 1
          ? renderTextModal(item.result_tags_nick.length ? item.result_tags_nick[0].type : null)
          : null}
      </div>
    );
  };

  // 渲染头像
  const renderAvatar = (item: any) => {
    return (
      <div className="img-box">
        <img className={`avatar ${setDangerBorder(item.update_status, 'header_img')}`} src={item.user_head_image_url || null} alt="" />
        {/* {<div className="zoom-avatar" onClick={(event) => handleZoom(item.user_head_image_url, event)} >{item.user_head_image_url && <ZoomInOutlined className="zoom-icon" />}</div>} */}
        {item.user_head_image_url && (
          <span className="zoom-icon" onClick={event => handleZoom(item.user_head_image_url, event)}>
            <Iconfont name="iconicon--" />
          </span>
        )}
        {Array.isArray(item.result_tags_header_img) && item.update_status.length !== 1
          ? renderTextModal(item.result_tags_header_img.length ? item.result_tags_header_img[0].type : null)
          : null}
      </div>
    );
  };

  // 渲染简介
  const renderBrief = (item: any, machineStatus?: boolean) => {
    return (
      <div className={`profile ${setDangerBorder(item.update_status, 'brief')}`}>
        <div className="label-title">简介：</div>
        <div style={{ minHeight: 50 }}>
          <span dangerouslySetInnerHTML={{ __html: item.user_brief }} />
        </div>
        {machineStatus
          ? renderTextModal(MACHINE_NOT_PASS_STR)
          : Array.isArray(item.result_tags_brief) && item.update_status.length !== 1
          ? renderTextModal(item.result_tags_brief.length ? item.result_tags_brief[0].type : null)
          : null}
      </div>
    );
  };

  // 渲染标记词
  const renderTextModal = (renderTags: string) => {
    return (
      <>
        {renderTags ? (
          <div className="tags-modal">
            <p className="tags-name">{renderTags}</p>
          </div>
        ) : null}
      </>
    );
  };

  // 转换标记词
  const changeStatus = (key: string): Object => {
    let status: number = 0;
    switch (key) {
      case '广告营销':
      case '政治敏感':
      case '淫秽色情':
      case '血腥恐爆':
      case '其他':
      case '涉领导人':
        status = 3002;
        break;
    }
    return {
      type: key,
      status,
    };
  };

  // 按钮点击事件，切换状态
  const handleBtnStatus = (item: any, name: string, type: string, index: number): void => {
    // 如果当前点击的状态和已经显示的相同则取消
    // let newState: Array<any> = [];
    if (taskListProps[index][type].length && taskListProps[index][type][0].type === name) {
      // newState = produce(taskListProps, draft => {
      //   draft[index][type] = [];
      // });
      taskListProps[index][type] = [];
    } else {
      // newState = produce(taskListProps, draft => {
      //   draft[index][type] = [changeStatus(name)];
      // });
      taskListProps[index][type] = [changeStatus(name)];
    }
    // newState = JSON.parse(JSON.stringify(taskListProps));
    isModal && updateList && updateList([...taskListProps]);
    setTaskListProps([...taskListProps]);
  };

  // 渲染好多审核按钮 如果选择了之后就切换按钮状态并且还可以取消
  const content = (item: any, idx: number, type: string) => {
    const renderBtn = () => {
      return btnGroup().map((ele: any, index: number) => {
        return (
          <Fragment key={index}>
            {item[type].length && item[type][0].type === ele ? (
              <Button type="primary" size="small" onClick={() => handleBtnStatus(item, ele, type, idx)}>
                {ele}
              </Button>
            ) : (
              <Button type="primary" size="small" danger onClick={() => handleBtnStatus(item, ele, type, idx)}>
                {ele}
              </Button>
            )}
          </Fragment>
        );
      });
    };
    return <Space>{renderBtn()}</Space>;
  };

  // 只有一个标记的时候使用此组件，无论头像、昵称、简介哪一个
  const hoverContentPanel = (item: any, index: number) => {
    return (
      <div className="content">
        <div className="basic-info">
          {renderNickname(item)}
          {renderAvatar(item)}
        </div>
        {renderBrief(item)}
      </div>
    );
  };

  /**
   * 分情况
   * 1）用户修改了之后，无论机审过不过，都要变红来表示修改
   * 2）机审过来才可以Popover 来 trigger 操作下结论
   * 3）机审不过(3102. 机核不通过)只能浏览，不可以下结论
   * @param item 当前需要审核的item
   * @param index 当前的索引
   * 大于两个修改标记的时候使用点击触发，但是需要判断当前的这个不通过的时候才能加点击的弹层和事件
   * 先判断update_status有没有更新，更新就变红，再判断更新之后能不能点
   */
  const clickContentPanel = (item: any, index: number) => {
    const machine_result_not_pass_brief: boolean = get(item, 'machine_result.sensitive.brief.result', 0) === MACHINE_STATUS;
    const machine_result_not_pass_nick: boolean = get(item, 'machine_result.sensitive.nick.result', 0) === MACHINE_STATUS;
    const NICK: string = 'nick';
    const BRIEF: string = 'brief';
    const IMG: string = 'header_img';
    const TAGS: string = `result_tags`;
    return (
      <div className="content">
        <div className="basic-info">
          {/* 只有爆红的时候点击才显示Popover */}
          {item.update_status.includes(NICK) ? (
            machine_result_not_pass_nick ? (
              <>{renderNickname(item, machine_result_not_pass_nick)}</>
            ) : (
              <Popover content={content(item, index, `${TAGS}_${NICK}`)} trigger="click">
                {renderNickname(item)}
              </Popover>
            )
          ) : (
            renderNickname(item)
          )}
          {item.update_status.includes(IMG) ? (
            <Popover content={content(item, index, `${TAGS}_${IMG}`)} trigger="click">
              {renderAvatar(item)}
            </Popover>
          ) : (
            renderAvatar(item)
          )}
        </div>
        {item.update_status.includes(BRIEF) ? (
          machine_result_not_pass_brief ? (
            <>{renderBrief(item, machine_result_not_pass_brief)}</>
          ) : (
            <Popover placement="bottom" content={content(item, index, `${TAGS}_${BRIEF}`)} trigger="click">
              {renderBrief(item)}
            </Popover>
          )
        ) : (
          renderBrief(item)
        )}
      </div>
    );
  };

  const handleSubmitInfo = () => {
    // 审核参数
    const options = taskListProps.map(item => {
      return userprofileToApiParams(item);
    });
    submitTask({ ...{ auditor_id_will: getEmailName() }, data: options })
      .then(res => {
        const { errorno, desc } = res;
        if (errorno === 0) {
          message.success(`提交本页数据成功，领取下次任务！`);
          setTaskListProps([]);
          reloadCallBack && reloadCallBack();
        } else {
          message.error(`提交失败，原因：${desc}`);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const renderContent = () => {
    return taskListProps.length
      ? taskListProps.map((item, index) => {
          return (
            <Fragment key={index}>
              {/* 当修改的信息只有一个的时候 hover的时候展示Popover */}
              {item.update_status.length === 1 ? (
                <Popover
                  placement={item.update_status[0] === 'brief' ? 'bottom' : 'top'}
                  content={content(item, index, `result_tags_${item.update_status[0]}`)}
                >
                  <div
                    className={`user-profile-panle-common ${user.collapsed ? 'user-profile-panle-collapsed-true' : 'user-profile-panle'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.sourceInfo && (
                      <Tag color="orange" className="device-tag">
                        {item.sourceInfo}
                      </Tag>
                    )}
                    {/* <Tag color="orange" className="device-tag">{item.sourceInfo}</Tag> */}
                    {hoverContentPanel(item, index)}
                    {renderTextModal(
                      item[`result_tags_${item.update_status[0]}`].length ? item[`result_tags_${item.update_status[0]}`][0].type : null,
                    )}
                  </div>
                </Popover>
              ) : (
                <div className={`user-profile-panle-common ${user.collapsed ? 'user-profile-panle-collapsed-true' : 'user-profile-panle'}`}>
                  {item.sourceInfo && (
                    <Tag color="orange" className="device-tag">
                      {item.sourceInfo}
                    </Tag>
                  )}
                  {/* <Tag color="orange" className="device-tag">{item.sourceInfo}</Tag> */}
                  {clickContentPanel(item, index)}
                </div>
              )}
            </Fragment>
          );
        })
      : null;
  };

  return (
    <>
      {taskListProps.length ? (
        <>
          <div className="user-box">
            <div className="user-profile">{renderContent()}</div>
            {isModal ? null : (
              <div className="do-operation">
                <Button type="primary" onClick={handleSubmitInfo}>
                  本页提交
                </Button>
              </div>
            )}
          </div>
        </>
      ) : null}
      <Modal title="预览" centered visible={visible} footer={null} width={700} onCancel={() => setVisible(false)}>
        <img width="100%" src={imgUrl} alt="" />
      </Modal>
    </>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(UserprofilePanel);
