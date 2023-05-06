import React, { useEffect } from 'react';
import { Modal, Table, Icon, Divider, Popconfirm, Button } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { FormikProps } from 'formik';
import { Form, FormItem } from 'formik-antd';

import { PushData } from '@/config/editorpush/push';
import { duplicate_columns } from '@/config/editorpush/push.config';
import { DuplicateCheckProps } from '@/config/pushForm/push';
import { FormikPushContent } from '@/components/pushContent';
import { PushStrat } from '@/components/PushStrat';
import { PushUser } from '@/components/PushUser';
import { PushArrival } from '@/components/PushArrival';
import { PushClient } from '@/components/PushClient';
import { templistSelector } from '@/selectors/account';
import { submitPush, checkDuplicate } from '@/services/editorpushService';

interface PushForm {
  biz?: string;
  tempConfig?: Record<string, string[]>;
  dupPushes: DuplicateCheckProps[];
  showDups: boolean;
  cancelDups: () => void;
  submitPush: (data: PushData) => void;
  pushData: PushData;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export const PushForm: React.FC<PushForm> = React.memo(
  ({ biz, tempConfig = {}, showDups = false, dupPushes, cancelDups, submitPush, pushData, setFieldValue }) => {
    // console.log(pushData, 'pushdata in pushform')

    useEffect(() => {
      setFieldValue('biz_id', biz);
    }, [biz]);

    const renderPushConfirmTitle = (values: Partial<PushData>): React.ReactNode => {
      const { title = '', summary, pushType } = values;
      const flag = /test|测试/.test(title.toLowerCase());
      return (
        <>
          <h4>确定推送文章给用户?</h4>
          <h5>标题: {values.title || '没有填写标题!'}</h5>
          <h5>摘要: {values.summary || '没有填写摘要!'}</h5>
          <h5>推送类别: {values.pushType || '没有选择推送类别!'}</h5>
          {flag && <h5 style={{ color: 'red' }}>标题中包含 test 或 测试字眼，请谨慎推送</h5>}
        </>
      );
    };

    return (
      <>
        <Form colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} labelAlign="left" layout="vertical" hideRequiredMark={false}>
          <section>
            <Divider orientation="left">推送内容</Divider>
            <FormikPushContent />
          </section>
          <section>
            <Divider orientation="left">推送配置</Divider>
            <PushStrat config={tempConfig?.strat} />
          </section>

          <section>
            <Divider orientation="left">推送用户</Divider>
            <PushUser config={tempConfig?.user} />
          </section>

          <section>
            <Divider orientation="left">推送到达</Divider>
            <PushArrival config={tempConfig?.arrival} />
          </section>

          <section>
            <Divider orientation="left">客户端到达配置</Divider>
            <PushClient config={tempConfig?.client} />
          </section>
          <Divider />

          <FormItem name="operate2">
            <Popconfirm title={renderPushConfirmTitle(pushData)}>
              <Button type="primary">提 交</Button>
            </Popconfirm>
          </FormItem>
        </Form>
        <Modal
          width={1000}
          title={
            <>
              <Icon type="warning" theme="twoTone" twoToneColor="#ff0000" />
              <span style={{ marginLeft: '5px', color: 'red' }}>重复推送</span>
            </>
          }
          visible={showDups}
          onCancel={cancelDups} // 仅关闭，因为没有人工查看的按钮，这里的内容在每次被打开都是更新的
          onOk={() => submitPush(pushData)}
          okText="强制推送"
          cancelText="修改推送配置"
        >
          <Table columns={duplicate_columns} dataSource={dupPushes} />
        </Modal>
      </>
    );
  },
);
