import React, { FC } from 'react';
import { Drawer, Descriptions, Icon, Badge } from 'antd';

interface AddCoverFormProps {
  viewpopvisible: boolean;
  setViewpopvisible?: (param: string) => void;
  viewDetail: Record<string, any>;
  recordstatus: string;
}

const viewFeature: FC<AddCoverFormProps> = (props: AddCoverFormProps) => {
  const { viewpopvisible, setViewpopvisible, viewDetail, recordstatus } = props;

  const closeModal = () => {
    setViewpopvisible(false);
  };
  const { userId, pDay, strategyInfo, ipInfo, phoneInfo, deviceInfo } = viewDetail;
  return (
    <>
      <Drawer
        title={
          <div>
            <Icon type="file-done" /> 决策详情
          </div>
        }
        visible={viewpopvisible}
        onClose={closeModal}
        placement="right"
        width={600}
      >
        <Descriptions
          title="风险决策"
          layout="vertical"
          bordered={true}
          size="small"
          style={{ marginBottom: '20px' }}
        >
          <Descriptions.Item label="状态" span={3}>
            <Badge
              status={recordstatus === '正常' ? 'success' : 'error'}
              text={recordstatus}
              style={{ color: recordstatus === '正常' ? '#87d068' : '#f50' }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="userid">{userId || '--'}</Descriptions.Item>
          <Descriptions.Item label="调用时间">{pDay || '--'}</Descriptions.Item>
        </Descriptions>

        {strategyInfo && Object.keys(strategyInfo).length > 0 && (
          <Descriptions
            title="风险详情"
            layout="vertical"
            bordered={true}
            size="small"
            style={{ marginBottom: '20px' }}
          >
            <Descriptions.Item label="业务名称">
              {strategyInfo.businessName || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="决策分数">{strategyInfo.score || '--'}</Descriptions.Item>
            <Descriptions.Item label="风险状态">
              {strategyInfo.riskStatus || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="风险类型">{strategyInfo.riskType || '--'}</Descriptions.Item>
            <Descriptions.Item label="命中规则">
              {strategyInfo.strategyName || '--'}
            </Descriptions.Item>
          </Descriptions>
        )}

        {ipInfo &&
          ipInfo.map((item, index) => (
            <Descriptions
              title={`IP信息${index + 1}`}
              layout="vertical"
              bordered={true}
              size="small"
              style={{ marginBottom: '20px' }}
            >
              <Descriptions.Item label="IP">{item.ip || '--'}</Descriptions.Item>
              <Descriptions.Item label="IP类型">{item.timezone || '--'}</Descriptions.Item>
              <Descriptions.Item label="基站">{item.base_station || '--'}</Descriptions.Item>
              <Descriptions.Item label="IP归属国家">{item.country || '--'}</Descriptions.Item>
              <Descriptions.Item label="经纬">
                {item.longitude},{item.latitude}
              </Descriptions.Item>
              <Descriptions.Item label="IP归属省份">{item.provicne || '--'}</Descriptions.Item>
              <Descriptions.Item label="运营商">{item.isp_domain || '--'}</Descriptions.Item>
              <Descriptions.Item label="IP归属城市">{item.city || '--'}</Descriptions.Item>
            </Descriptions>
          ))}

        {phoneInfo && Object.keys(phoneInfo).length > 0 && (
          <Descriptions title="手机号信息" layout="vertical" bordered={true} size="small">
            <Descriptions.Item label="手机号(MD5加密)">{phoneInfo.phone || '--'}</Descriptions.Item>
            <Descriptions.Item label="所属省份">{phoneInfo.province || '--'}</Descriptions.Item>
            <Descriptions.Item label="手机号运营商">
              {phoneInfo.phone_type || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="所属城市">{phoneInfo.city || '--'}</Descriptions.Item>
            <Descriptions.Item label="电话区号">{phoneInfo.area_code || '--'}</Descriptions.Item>
            <Descriptions.Item label="邮编">{phoneInfo.zip_code || '--'}</Descriptions.Item>
          </Descriptions>
        )}

        {deviceInfo && Object.keys(deviceInfo).length > 0 && (
          <Descriptions title="设备信息" layout="vertical" bordered={true} size="small">
            <Descriptions.Item label="设备ID">{deviceInfo.device_id || '--'}</Descriptions.Item>
            <Descriptions.Item label="系统版本">{deviceInfo.sys_version || '--'}</Descriptions.Item>
            <Descriptions.Item label="AndoridId">{deviceInfo.android_id || '--'}</Descriptions.Item>
            <Descriptions.Item label="设备品牌">{deviceInfo.brand || '--'}</Descriptions.Item>
            <Descriptions.Item label="MacId">{deviceInfo.mac_id || '--'}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{deviceInfo.device_name || '--'}</Descriptions.Item>
            <Descriptions.Item label="imei">{deviceInfo.imei || '--'}</Descriptions.Item>
            <Descriptions.Item label="应用版本">
              {deviceInfo.bundle_version || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="系统类型">{deviceInfo.platform || '--'}</Descriptions.Item>
            <Descriptions.Item label="idfa">{deviceInfo.idfa || '--'}</Descriptions.Item>
            <Descriptions.Item label="处理核数">
              {deviceInfo.processor_count || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="机器内存">
              {deviceInfo.physical_memory || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="网络类型">{deviceInfo.net_name || '--'}</Descriptions.Item>
            <Descriptions.Item label="屏幕密度">
              {deviceInfo.screen_density || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="屏幕像素">{deviceInfo.screen || '--'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
};
export default viewFeature;
