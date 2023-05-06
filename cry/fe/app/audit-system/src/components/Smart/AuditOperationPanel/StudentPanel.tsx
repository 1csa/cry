import React, { memo, useState } from 'react';

import { Tag, Modal } from 'antd';

import UserInfo from '@/components/Dumb/UserInfo';
import Image from '@/components/Dumb/Image';
import AuditOperationBasicPanel from '@/components/Smart/AuditOperationPanel';
import Icon from '@/components/Dumb/Iconfont';

import { studentAuditOptions } from '@/data/constants';

import './StudentPanel.less';
interface StudentPanelProps {
  data: any; // material: { exampleImage, applicant, applicantImage, applicantTime, schoolName }, business_type, business_id, business_unit_type, business_unit_id,
  reloadCallBack: () => void;
  isPreview: boolean; // 预览 不展示操作面板 | 非预览 可以操作审核(提交/无效反馈)
  isEdit: boolean; // 是否编辑 默认false
}

const StudentPanel: React.FC<StudentPanelProps> = ({ data, reloadCallBack, isPreview, isEdit = false }) => {
  // 是否展示 标签
  const [showTags] = useState(isEdit || !isPreview);

  const {
    material: { exampleImage, applicant, applicantImage, applicantTime, schoolName },
    business_type,
    business_id,
    business_unit_type,
    business_unit_id,
  } = data;

  const exposurePanelData = {
    material: data.material,
    reloadCallBack,
    isVideo: false,
    jsonTagDataSource: studentAuditOptions,
    userReviewResult: data[`result_l${data.audit_level}`],
    btnCountPerRow: true,
    templateName: 'ExposurePanel',
    tagOptions: {
      business_type: [business_type || business_id],
      business_unit_type: [business_unit_type || business_unit_id],
    },
  };

  const [rotateValue, setRotateValue] = useState(0);
  const [imageZoomVisible, setImageZoomVisible] = useState(false);

  return (
    <div className="main-panel-card message-panel">
      <div className="card main-panel-card-left">
        <h3 className="head">
          <span>
            <span className="info">
              学校：<span className="red-color">{schoolName}</span>
            </span>
            <span className="info">
              姓名：<span className="red-color">{applicant?.nickname}</span>
            </span>
            <span className="info">
              申请时间：<span className="red-color">{applicantTime}</span>
            </span>
          </span>
          <span>
            <Tag>学生证认证</Tag>
            <Tag>默认分区</Tag>
          </span>
        </h3>
        <div className="student-head-part">
          <h3>
            <span></span>
            示例
            <span></span>
          </h3>
          <h3>
            <span className="icon-wrapper none">
              <span className="icon" onClick={() => setRotateValue(rotateValue - 90)}>
                <Icon name="iconrotate-90" />
              </span>
              <span className="icon" onClick={() => setRotateValue(rotateValue + 90)}>
                <Icon name="iconrotate90" />
              </span>
              <span className="icon" onClick={() => setImageZoomVisible(true)}>
                <Icon name="iconzoom" />
              </span>
            </span>
            用户认证信息
            <span className="icon-wrapper">
              <span className="icon" onClick={() => setRotateValue(rotateValue - 90)}>
                <Icon name="iconrotate-90" />
              </span>
              <span className="icon" onClick={() => setRotateValue(rotateValue + 90)}>
                <Icon name="iconrotate90" />
              </span>
              <span className="icon" onClick={() => setImageZoomVisible(true)}>
                <Icon name="iconzoom" />
              </span>
            </span>
          </h3>
        </div>
        <div className="student-main">
          <div className="content">
            {Array.isArray(exampleImage) &&
              exampleImage.length > 0 &&
              exampleImage.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <h4>示例{index + 1}：</h4>
                  <Image width="90%" src={item.imageUrl} preview={false} />
                </React.Fragment>
              ))}
          </div>
          <div className="content">
            {Array.isArray(applicantImage) &&
              applicantImage.length > 0 &&
              applicantImage.map((item: any, index: number) => (
                <div
                  key={index}
                  className="image-rotate-wrapper"
                  style={{
                    transform: `rotate(${rotateValue}deg)`,
                  }}
                >
                  <Image width="100%" src={item.imageUrl} preview={false} />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="main-panel-card-right">
        {showTags && <AuditOperationBasicPanel {...exposurePanelData} />}
        <div className="card">
          <UserInfo title="认证人信息" {...applicant} />
        </div>
      </div>

      <Modal visible={imageZoomVisible} footer={null} width={800} closable={false} onCancel={() => setImageZoomVisible(false)}>
        {Array.isArray(applicantImage) &&
          applicantImage.length > 0 &&
          applicantImage.map((item: any, index: number) => (
            <div
              key={index}
              className="image-rotate-wrapper"
              style={{
                transform: `rotate(${rotateValue}deg)`,
              }}
            >
              <Image width="100%" src={item.imageUrl} preview={false} />
            </div>
          ))}
      </Modal>
    </div>
  );
};

export default memo(StudentPanel);
