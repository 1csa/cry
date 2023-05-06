import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import { Modal, Tag, Icon, Row, Col } from 'antd';
import { PushData } from '@/config/editorpush/push';
import { localtagsSelector } from '@/selectors/editorpush';
import '../index.less';
type IProps = {
  visible: boolean;
  values: Partial<PushData>;
  onSubmit: () => void;
  onClose: () => void;
  btnLoading?: boolean;
};
export const SubmitModal: React.FC<IProps> = React.memo(({ visible, values, onSubmit, onClose, btnLoading }) => {
  // console.log('推送类型:' + values['rstype']) // url 就是推送的 url
  const contentType = values['rstype'] // 内容类型
  const localTags = useSelector(localtagsSelector);
  const { title = '', summary = '', pushType, open_sectional = false, section, tags, excludeTags, doc_id = '' } = values;
  // const iframeUrl = 'https://m.yidianzixun.com/hybrid/main/article?debug=1&docid=' + doc_id;
  let iframeUrl = ''
  if (contentType === 'url') { // 直接访问 url
    iframeUrl =  doc_id;
  } else {
    iframeUrl = 'http://pandora.yidian-inc.com/article/' + doc_id;
  }
  const renderClientPreview = (): React.ReactNode => {
    return (
      <div className="preview-container">
        <Row type="flex" justify="space-around">
          <Col span={8}>
            <div className="preview-wrap">
              <div className="preview-bg"></div>
              <div className="preview-content">
                <ul className="preview-push-list">
                  {open_sectional ? (
                    <>
                      {section &&
                        Object.values(section).map((item, index) => {
                          return (
                            <li className="preview-push-item">
                              <span className="preview-push-item__left"></span>
                              <div className="preview-push-item__right">
                                <div className="title">
                                  <span> {item.title?.substring(0, 10) || '没有填写标题!'}</span> <span>09:00</span>
                                </div>
                                <div className="summary"> {item.summary?.substring(0, 46) || '没有填写摘要!'}</div>
                              </div>
                            </li>
                          );
                        })}
                    </>
                  ) : (
                    <li className="preview-push-item">
                      <span className="preview-push-item__left"></span>
                      <div className="preview-push-item__right">
                        <div className="title">
                          <span> {title?.substring(0, 10) || '没有填写标题!'}</span> <span>09:00</span>
                        </div>
                        <div className="summary"> {summary?.substring(0, 46) || '没有填写摘要!'}</div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Col>
          {/* 分段式分发不需要预览 */}
          {!open_sectional && doc_id && (
            <Col span={8}>
              <div className="preview-wrap iframe">
                <div className="preview-bg"></div>
                <iframe className="preview-iframe" frameBorder="0" width="260" height="450" src={iframeUrl}></iframe>
              </div>
            </Col>
          )}
        </Row>
      </div>
    );
  };
  return (
    <Modal
      title={
        <>
          <Icon type="info-circle" theme="twoTone" twoToneColor="red" />
          <span> 确定推送文章给用户?</span>
        </>
      }
      width="65%"
      centered
      className="custom-submit-modal"
      visible={visible}
      confirmLoading={btnLoading}
      onOk={() => onSubmit()}
      onCancel={onClose}
    >
      {open_sectional ? (
        <>
          {section &&
            Object.values(section).map((item, index) => {
              return (
                <>
                  <h5>{`实验${index}`}</h5>
                  <h5>
                    标题: <span className="text-style">{item.title || '没有填写标题!'}</span>
                  </h5>
                  <h5>
                    摘要: <span className="text-style">{item.summary || '没有填写摘要!'}</span>
                  </h5>
                  <h5>
                    推送类别: <span className="text-style">{pushType || '没有选择推送类别!'}</span>
                  </h5>
                  <h5>
                    圈选标签:
                    {tags?.map(item => (
                      <Tag color="green" key={item}>
                        {localTags[item]}
                      </Tag>
                    ))}
                  </h5>
                  <h5>
                    排除标签:
                    {excludeTags?.map(item => (
                      <Tag color="red" key={item}>
                        {localTags[item]}
                      </Tag>
                    ))}
                  </h5>
                </>
              );
            })}
          {/test|测试/.test(title.toLowerCase()) && <h5 style={{ color: 'red' }}>标题中包含 test 或 测试字眼，请谨慎推送</h5>}
        </>
      ) : (
        <>
          <h5>
            标题: <span className="text-style">{title || '没有填写标题!'}</span>
          </h5>
          <h5>
            摘要: <span className="text-style">{summary || '没有填写摘要!'}</span>
          </h5>
          <h5>
            推送类别: <span className="text-style">{pushType || '没有选择推送类别!'}</span>
          </h5>
          {/test|测试/.test(title.toLowerCase()) && <h5 style={{ color: 'red' }}>标题中包含 test 或 测试字眼，请谨慎推送</h5>}
          <h5>
            圈选标签:
            {tags?.map(item => (
              <Tag color="green" key={item}>
                {localTags[item]}
              </Tag>
            ))}
          </h5>
          <h5>
            排除标签:
            {excludeTags?.map(item => (
              <Tag color="red" key={item}>
                {localTags[item]}
              </Tag>
            ))}
          </h5>
        </>
      )}
      {renderClientPreview()}
    </Modal>
  );
});
