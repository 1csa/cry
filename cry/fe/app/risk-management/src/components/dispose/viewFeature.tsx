import React, { FC } from 'react';
import { 
  Modal,
  Descriptions,
  Icon,
} from 'antd';


interface AddCoverFormProps {
  viewpopvisible: boolean;
  setViewpopvisible?: (param: string) => void;
  viewFeature: Object;
}


const viewFeature: FC<AddCoverFormProps> = (props: AddCoverFormProps) => {
  const {
    viewpopvisible,
    setViewpopvisible,
    viewFeature
  } = props;

  const closeModal = () => {
    setViewpopvisible(false);
  }
  const { id, featureCnName,featureEnName, aliasName, calMethod, level1Type, level2Type, rawTableName, calConditions, calFields, calInterval, createUser, createTime, status, countUnit } = viewFeature;
  return (
    <>
      <Modal
        title={<div><Icon type="file-done"></Icon> 特征详情</div>}
        visible={viewpopvisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <Descriptions  bordered size='small' column={1}>
          <Descriptions.Item label="特征ID">{id}</Descriptions.Item>
          <Descriptions.Item label="特征中文">{featureCnName}</Descriptions.Item>
          <Descriptions.Item label="特征英文">{featureEnName}</Descriptions.Item>
          <Descriptions.Item label="特征别名">{aliasName}</Descriptions.Item>
          <Descriptions.Item label="特征说明">{calMethod}</Descriptions.Item>
          <Descriptions.Item label="特征类型">{level1Type}/{level2Type}</Descriptions.Item>
          <Descriptions.Item label="来源表">{rawTableName}</Descriptions.Item>
          <Descriptions.Item label="字段名">{calFields}</Descriptions.Item>
          <Descriptions.Item label="限制条件">{calConditions}</Descriptions.Item>
          <Descriptions.Item label="计算频率">{calInterval}{countUnit}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{createTime}</Descriptions.Item>
          <Descriptions.Item label="创建人">{createUser}</Descriptions.Item>
          <Descriptions.Item label="特征状态">{status}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
}
export default viewFeature;
