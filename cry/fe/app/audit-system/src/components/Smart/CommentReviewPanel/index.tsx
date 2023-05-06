import React, { useState } from 'react';
import { message, Card, Button, Tag, Modal, Drawer } from 'antd';
import './index.less';
import moment from 'moment';
import produce from 'immer';
import { get } from '@/utils/dev_helper';
import { submitTask } from '@/services/commonServices';
import BasicCopyToClipboard from '@/components/Dumb/CopyToClipboard';
import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
import { commentsUserBtnGroup } from '@/data/constants';
import { BtnGroupTypes } from '@/types';

interface ICAPProps {
  commentInfo: any;
  reloadCallBack: () => void;
}

const CommentAuditPanel: React.FC<ICAPProps> = ({ commentInfo, reloadCallBack }) => {
  const LEN = commentInfo ? commentInfo.length : 0;
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [commentIndex, setCommentIndex] = useState<number>(0);
  const [initCommentData, setInitCommentData] = useState<Array<any>>(commentInfo ? commentInfo : []);

  /**
   * 处理机审命中的一二级分类
   * @param machine_result 机审结果集
   */
  const machineWordsType = (machine_result: any) => {
    const words = machine_result?.sensitive?.context?.words.length
      ? machine_result?.sensitive?.context?.words
      : machine_result?.sensitive?.content?.words.length
      ? machine_result?.sensitive?.content?.words
      : [];
    return (
      words.length &&
      words.map((ele: any) => {
        return `${ele.cateOneName} - ${ele.cateTwoName}`;
      })
    );
  };

  /**
   * 传递审核结果 成功和失败的按钮状态切换
   * @param index
   * @param disabled
   * @param descType 失败的时候默认是cancel 其他正常状态是按钮点击的时候传递
   */
  const toggleUserBtnStatus = (index: number, disabled: boolean, descType: string) => {
    return produce(initCommentData, (draft: any) => {
      draft[index].conclusion = transformCCS(descType);
      draft[index].disabled = disabled;
    });
  };

  /**
   * 点击按钮类型方法，为每一条评论增加一个操作完的状态标签加在 敏感词分区前边
   * @param type 点击按钮类型
   */
  const transformCCS = (type: string) => {
    let obj = {
      pass: () => (
        <Tag className="mr20" color="#108ee9">
          已通过
        </Tag>
      ),
      delete: () => (
        <Tag className="mr20" color="#f50">
          已删除
        </Tag>
      ),
      forbid: () => <Tag>已禁封</Tag>,
      cancel: () => null,
    };
    return obj[type]();
  };

  /**
   * 抽屉方法
   * @param index 点击了哪个评论的抽屉
   */
  const handleDrawer = (index: number) => {
    setCommentIndex(index);
    setVisibleDrawer(true);
  };

  /**
   * 请求评论提交结论接口
   * @param type 评论提交结论类型
   * @param index 哪一个
   */
  const fetchSubmitTaskApi = (options: any, callback?: () => void) => {
    const fromList: boolean = sessionStorage?.isHis === 'true' ? true : false;
    const forceObj = fromList ? { force_result: true } : {};
    const { index, ...params } = options;
    // console.log('{...params, ...forceObj}', { ...params, ...forceObj });
    // return false;
    // console.log('params', params, index);
    submitTask({ ...params, ...forceObj })
      .then(res => {
        const { desc, errorno } = res;
        if (errorno === 0) {
          message.success('提交成功');
          callback && callback();
        } else {
          setInitCommentData(toggleUserBtnStatus(index, false, 'cancel'));
          message.error(desc);
        }
      })
      .catch(err => {
        setInitCommentData(toggleUserBtnStatus(index, false, 'cancel'));
        console.log('err', err);
      });
  };

  /**
   * 单个评论审核
   * @param type 结论类型
   * @param docId docId
   * @param index 索引-哪一个评论
   */
  const handlePerComment = (manual_status: number | string, item: any, index: number, descType: string) => {
    const options = {
      data: [submitTaskParamsInAuditOperation(item, manual_status, descType)],
      index,
    };
    // 设置已经审核的标签以及禁用按钮
    const newState = toggleUserBtnStatus(index, true, descType);
    setInitCommentData(newState);
    const otherList = newState.filter(ele => ele.conclusion);
    fetchSubmitTaskApi(options, () => {
      if (otherList.length === LEN) {
        console.log('做完最后一个之后，清空所有数据，并且初始化主动领取下一批新任务');
        reloadCallBack && reloadCallBack();
      }
    });
  };

  /**
   * 本页面提交，剩余的未做处理的评论，批量传给接口
   */
  const handleAllComment = () => {
    const otherList = initCommentData.filter(ele => !ele.conclusion);
    const options = otherList.map(item => {
      return submitTaskParamsInAuditOperation(item, 3001, 'pass');
    });
    fetchSubmitTaskApi(
      {
        page_id: otherList[0].page_id,
        item_num: otherList[0].item_num,
        // auditor_id_will: getEmailName(),
        data: options,
      },
      () => {
        reloadCallBack && reloadCallBack();
      },
    );
  };

  const renderMainContent = () =>
    initCommentData.map((item: any, index: number) => {
      // console.log('renderMainContent item', item);
      const initCommentsUserBtnGroup = item.business_id === 2 ? commentsUserBtnGroup.filter(val => val.label !== 'forbid') : commentsUserBtnGroup;
      return (
        <div key={index} className="comment-review-panel mt14">
          <Card bordered={false} className="item-card">
            <div className="comment-info">
              <div className="flex-box mt14 wall x-sp">
                <div className="flex-box">
                  <h3
                    className="mr40 mt0"
                    // dangerouslySetInnerHTML={{ __html: `${index + 1} 、${item.comment}` }}
                    dangerouslySetInnerHTML={{
                      __html: `${index + 1} 、${item.material?.comment || ''}`,
                    }}
                  ></h3>
                  <span className="mr40">{moment(item.tmrecord * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                  {item.business && (
                    <Tag color="orange" className="mr40">
                      {item.business}
                    </Tag>
                  )}
                </div>
                <span>
                  {item.material?.id && (
                    <BasicCopyToClipboard
                      data={item.material?.id}
                      title="评论id"
                      renderChild={() => <Tag className="cp">评论id：{item.material?.id}</Tag>}
                    />
                  )}
                  {item.part_zone_cn && <Tag>{item.part_zone_cn}</Tag>}
                </span>
              </div>
              <div className="mt14 wall">
                <span
                  className="link mr40"
                  dangerouslySetInnerHTML={{
                    // __html: item.title ? item.title : '点击查看原文',
                    __html: item.material.title ?? '点击查看原文',
                  }}
                  onClick={() => handleDrawer(index)}
                ></span>
                {item.docId && (
                  <BasicCopyToClipboard
                    data={item.docId}
                    title="docid"
                    renderChild={() => (
                      <Tag className="mr40 cp" color="orange">
                        {item.docId}
                      </Tag>
                    )}
                  />
                )}
                {item.category ? <Tag color="orange">{item.category}</Tag> : null}
              </div>
              <div className="flex-box wall x-sp">
                <div>
                  {item.conclusion ? item.conclusion : null}
                  <span>
                    命中 {machineWordsType(item.machine_result).length ? machineWordsType(item.machine_result).join('、') : null} {item.part_zone_cn}
                  </span>
                </div>
                <div>
                  {/* 身边去掉封禁 */}
                  {initCommentsUserBtnGroup.map((ele: BtnGroupTypes, idx: number) => {
                    return (
                      <Button
                        name={`评论审核-${ele.name}`}
                        key={idx}
                        className="mr20"
                        disabled={item.disabled}
                        type={ele.type || 'default'}
                        danger={ele.danger || false}
                        onClick={() => handlePerComment(ele.code, item, index, ele.label)}
                      >
                        {ele.name}
                      </Button>
                    );
                  })}
                </div>
                {/* <div>
              <Button className="mr20" disabled={item.disabled} type="primary" onClick={() => handlePerComment(3001, item, index, 'pass')}>通过</Button>
              <Button className="mr20" disabled={item.disabled} type="primary" danger onClick={() => handlePerComment(3002, item, index, 'delete')}>删除</Button>
              <Button disabled={item.disabled} onClick={() => handlePerComment(3002, item, index, 'forbid')}>封禁用户</Button>
            </div> */}
              </div>
            </div>
            <div className="user-avatar">
              {get(item, 'material.user.head_image_url', null) ? (
                <img
                  className="wall cp mt14 avatar-img"
                  src={get(item, 'material.user.head_image_url', null)}
                  alt="用户头像"
                  onClick={() => {
                    setVisible(true);
                    setCommentIndex(index);
                  }}
                />
              ) : (
                '头像为空'
              )}
              <h4 className="tc mt0">{get(item, 'material.user.nick', '')}</h4>
            </div>
          </Card>
        </div>
      );
    });

  return (
    <div className="cmt-container">
      {initCommentData && initCommentData.length > 0 ? renderMainContent() : null}
      <Modal title="预览头像" footer={null} visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
        {initCommentData[commentIndex] ? (
          <img className="wall" src={get(initCommentData[commentIndex], 'material.user.head_image_url', null)} alt="用户头像" />
        ) : null}
      </Modal>
      <Drawer title="文章预览" placement="right" width={800} closable={false} onClose={() => setVisibleDrawer(false)} visible={visibleDrawer}>
        <iframe
          src={`http://www.yidianzixun.com/article/${initCommentData && initCommentData[commentIndex] && initCommentData[commentIndex].docId}`}
          id="ifr-article"
          name="ifr-article"
          allowFullScreen={true}
        />
      </Drawer>
      <div className="do-operation">
        <Button name="评论审核-本页提交" type="primary" onClick={handleAllComment}>
          本页提交
        </Button>
      </div>
    </div>
  );
};

export default CommentAuditPanel;
