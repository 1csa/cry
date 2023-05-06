import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import { Button, Card, BackTop, Row, Col, Modal, message } from 'antd';
const { confirm } = Modal;
import './index.less';
import UserCertificationSearch from './components/UserSearch';
import UserCertificationTable from './components/UserTable';
import UserModalContent from './components/UserModalContent';
import { UserCertificationState } from './models/index';
import { getCookie } from '@/utils/cookie';
import appConfig from '@/config/app.config';
interface IUserCertificationProps {
  userCertification: UserCertificationState;
  dispatch: Dispatch;
  user: any;
}

const UserCertification: React.FC<IUserCertificationProps> = ({
  dispatch,
  userCertification,
  user,
}) => {
  let [loading, setLoading] = useState<boolean>(true);
  let [visible, setVisible] = useState<boolean>(false);
  let [modalTitle, setTitle] = useState<string>('');
  let [inputData, setInputData] = useState<any>({});
  let [tableLineInfo, setTableLineInfo] = useState<any>({});

  // 加载loading
  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  // 切换弹窗
  useEffect(() => {
    setVisible(visible);
  }, [visible]);
  // 导出excel初始化注入参数
  useEffect(() => {
    // @ts-ignore
    window.ydFile.set('sk', 'wKy3i0rEtHuGwRo2w4yJtZyVq4');
    // @ts-ignore
    window.ydFile.set('approved_by', getCookie('username'));
  }, []);

  function getFormData(v: any) {
    setInputData(v);
  }
  // 增加，修改，删除请求接口
  async function setUserCertification(payload: any) {
    let { code, status, reason } = await dispatch({
      type: 'certification/setUserCert',
      payload,
    });
    if (code === 0 && status === 'success') {
      message.info(`设置成功`);
      dispatch({
        type: 'certification/getUserCert',
        payload: inputData, // 获取search查询条件重新初始化查询
      });
      handleCancel();
    } else if (code !== 0) {
      message.info(`设置失败! 原因：${reason}`);
      handleCancel();
    }
  }

  // 设置用户认证请求参数处理以及调接口
  function setUserAuthRequest(v: any) {
    interface IParams {
      [propsName: string]: string;
    }
    // 当没写备注的时候为空，有备注的时候判断如果有 官方认证：的标示，就不拼接官方认证：，没有的话再拼接，有标示是修改没有是添加
    v.cert_message = v.cert_message
      ? v.cert_message.includes('官方认证：')
        ? v.cert_message
        : `官方认证：${v.cert_message}`
      : '';
    // 处理参数
    let obj: IParams = {
      userids: v.userids || '',
      op: v.op || '',
      cert_message: v.cert_message,
      tag: v.tag || '',
      title: v.title || '',
      city: v.city || '',
      operator_name: user.currentUser.name || '',
      operator_uid: getCookie('uid') || '',
      source: '人工添加',
    };
    obj.userids = obj.userids ? `${obj.userids}` : ``;
    setUserCertification(obj);
  }

  //弹窗ok按钮 ---- 添加/修改
  async function handleOk(v: any) {
    let { userids, title } = v;
    let len = `${userids}`.split(',').length;
    if (len < 100) {
      v.op = 'set';
      if (!userids) {
        message.warning('uid不可以为空，请输入');
        return false;
      }
      if (!title) {
        message.warning('称号不可以为空，请选择');
        return false;
      }
      setUserAuthRequest(v);
    } else {
      message.warning('uid数量过多！');
    }
  }

  // 修改按钮和cancel按钮切换数据是在子组件effects里根据这个状态更新弹窗数据
  // cancel按钮
  function handleCancel() {
    setVisible(false);
    setTableLineInfo({});
  }
  function exportData() {
    const { total } = userCertification;
    if (total > 20000) {
      return message.error('导出的数据不能超过2万条');
    }
    let struct = [
      {
        label: 'uid',
        value: 'userid',
      },
      {
        label: '昵称',
        value: 'nickname',
      },
      {
        label: '标签',
        value: 'tag',
      },
      {
        label: '备注',
        value: 'cert_message',
      },
      {
        label: '称号',
        value: 'title',
      },
      {
        label: '来源',
        value: 'source',
      },
      {
        label: '城市',
        value: 'city',
      },
      {
        label: '添加时间',
        value: 'createAt',
      },
      {
        label: '操作人',
        value: 'operator_name',
      },
    ];
    let option = {
      method: 'GET',
      url: `${appConfig.CERT_HOST}/cert/get-cert`,
      params: JSON.stringify(inputData),
      dir: 'result',
      struct: struct,
      filename: 'UGC达人认证表',
      fileType: 'xlsx',
      batchConfig: {
        totalKey: 'count', // 总数
        pageKey: 'offset',
        perPageCount: 1000,
      },
    };
    // @ts-ignore
    ydFile.start(option, (result: any) => {
      console.log('result', result);
    });
  }
  // 修改按钮
  function handleModify(v: any) {
    setVisible(true);
    setTableLineInfo(v);
    setTitle('修改达人');
  }
  // 点删除
  function handleDelete(v: any) {
    confirm({
      title: '删除',
      content: '确实是否删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        setUserAuthRequest(v);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  return (
    <>
      <div className="main-content">
        <Card title="达人认证" bordered={false}>
          <UserCertificationSearch
            setPageLoading={(v: boolean) => setLoading(v)}
            toggleModal={(v: boolean, t: string) => {
              setVisible(v);
              setTitle(t);
            }}
            getFormData={getFormData}
          />
        </Card>
        <Card>
          <Row>
            <Col offset={22} span={2}>
              <Button type="primary" onClick={exportData}>
                导出
              </Button>
            </Col>
          </Row>
        </Card>
        <Card>
          <UserCertificationTable
            tableData={userCertification}
            loading={loading}
            handleModify={(v: any) => handleModify(v)}
            handleDelete={handleDelete}
            searchData={inputData}
          />
        </Card>
        <UserModalContent
          visible={visible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={modalTitle}
          modalContent={tableLineInfo}
        />
        <BackTop></BackTop>
      </div>
    </>
  );
};

export default connect(({ certification: userCertification, user }: any) => ({
  userCertification,
  user,
}))(UserCertification);
