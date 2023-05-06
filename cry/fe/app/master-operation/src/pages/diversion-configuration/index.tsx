import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import PopMaxNum from './components/PopMaxNum';
import UploadImage from './components/UploadImage';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import { ModalDataState } from './models/index';
import './index.less';

interface IIndex {
  dispatch: Dispatch;
  modalSetting: ModalDataState;
}

const Index: React.FC<IIndex> = ({ dispatch, modalSetting }) => {
  const [newBtnText, setNewBtnText] = useState<string>('');
  const [activeBtnText, setActiveBtnText] = useState<string>('');
  const [channel_url, setChannelUrl] = useState<string>('');
  const [article_url, setArticleUrl] = useState<string>('');
  const [photo_wall_url, setPWUrl] = useState<string>('');
  useEffect(() => {
    initData();
  }, []);
  async function initData() {
    try {
      let { status, result } = await dispatch({
        type: 'modalSetting/initData',
      });
      if (status === 'failed') {
        message.error('获取导流信息失败！');
      } else if (status === 'success') {
        if (result.new) {
          setNewBtnText(result.new.text);
          setChannelUrl(result.new.local_apk_channel_url);
          setArticleUrl(result.new.local_apk_article_url);
          setPWUrl(result.new.photo_wall_url);
        }
        result.active && setActiveBtnText(result.active.text);
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  function handleSave() {
    let { pop_max_num, enable_close, active, continuous_close_max_num } = modalSetting;
    if (!modalSetting.new || !modalSetting.new.image) {
      message.warning('拉新弹窗配置图片不可为空！');
    } else if (newBtnText === '') {
      message.warning('拉新弹窗配置按钮文案不可为空！');
    } else if (channel_url === '') {
      message.warning('拉新频道渠道包链接不可为空！');
    } else if (article_url === '') {
      message.warning('拉新文章渠道包链接不可为空！');
    } else if (!photo_wall_url) {
      message.warning('拉新照片墙链接不可为空！');
    } else if (activeBtnText === '') {
      message.warning('拉活弹窗配置按钮文案不可为空！');
    } else if (!active || !active.image) {
      message.warning('拉活弹窗配置图片不可为空！');
    } else if (newBtnText && activeBtnText && channel_url && article_url) {
      if (newBtnText.length > 11 || activeBtnText.length > 11) {
        message.warning('按钮文案不可超过11个字符！');
      } else {
        let payload = {
          continuous_close_max_num,
          pop_max_num,
          enable_close,
          new: {
            text: newBtnText,
            image: modalSetting.new.image,
            local_apk_channel_url: channel_url,
            local_apk_article_url: article_url,
            photo_wall_url,
          },
          active: {
            text: activeBtnText,
            image: active.image,
          },
        };
        Modal.confirm({
          title: '提示',
          content: '您确定要设置配置吗？',
          async onOk() {
            let { status, reason } = await dispatch({
              type: 'modalSetting/setData',
              payload,
            });
            if (status === 'failed') {
              message.error(`设置失败！原因${reason}`);
            } else if (status === 'success') {
              message.success('设置成功！');
              initData();
            }
          },
        });
      }
    }
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 3 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 },
    },
  };
  return (
    <>
      <div className="main-content">
        <Card bordered={false} bodyStyle={{ height: '100%', position: 'relative' }}>
          <div className="times">
            <h4>用户频次：</h4>
            <PopMaxNum modalSetting={modalSetting} dispatch={dispatch} />
          </div>
          <div className="new-modal-config">
            <h4>拉新弹窗配置：</h4>
            <UploadImage
              imageUrl={(modalSetting.new && modalSetting.new.image) || ''}
              dispatch={dispatch}
              name="new"
            />
            <Form {...formItemLayout}>
              <Form.Item label="按钮文案">
                <Input
                  placeholder="请输入按钮文案"
                  onChange={e => setNewBtnText(e.target.value)}
                  allowClear={true}
                  value={newBtnText}
                />
              </Form.Item>
              <Form.Item label="频道渠道包链接">
                <Input
                  placeholder="请输入频道渠道包链接"
                  onChange={e => setChannelUrl(e.target.value)}
                  allowClear={true}
                  value={channel_url}
                />
              </Form.Item>
              <Form.Item label="文章渠道包链接">
                <Input
                  placeholder="请输入文章渠道包链接"
                  onChange={e => setArticleUrl(e.target.value)}
                  allowClear={true}
                  value={article_url}
                />
              </Form.Item>
              <Form.Item label="照片墙链接">
                <Input
                  placeholder="请输入照片墙链接"
                  onChange={e => setPWUrl(e.target.value)}
                  allowClear={true}
                  value={photo_wall_url}
                />
              </Form.Item>
            </Form>
          </div>
          <div className="alive-modal-config">
            <h4>拉活弹窗配置：</h4>
            <UploadImage
              imageUrl={(modalSetting.active && modalSetting.active.image) || ''}
              dispatch={dispatch}
              name="active"
            />
            <Form {...formItemLayout}>
              <Form.Item label="按钮文案">
                <Input
                  placeholder="请输入按钮文案"
                  onChange={e => setActiveBtnText(e.target.value)}
                  allowClear={true}
                  value={activeBtnText}
                />
              </Form.Item>
            </Form>
          </div>
          <div className="btn-content">
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default connect(({ modalSetting, user }: any) => ({
  modalSetting,
  user,
}))(Index);
