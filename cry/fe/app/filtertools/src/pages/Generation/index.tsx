import React, { FC, useCallback, useState, useEffect, useRef } from 'react';
import {
  Card,
  message,
  Button,
  Form,
  Input,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';
import { defaultVideoRuleFormValue } from '@/config/constant';
import { getIsDev } from '@/utils/get_dev';
const { TextArea } = Input;
const isDev = getIsDev();
const defaultFormValue = defaultVideoRuleFormValue;
const { Search } = Input;
interface GenerationProps {
  form: { getFieldDecorator: any; validateFields: any; resetFields: any; setFieldsValue: any };
}
const Generation: FC<GenerationProps> = (props: GenerationProps) => {

  const [newsSql, setNewsSql] = useState<string>('');
  const [videoSql, setVideoSql] = useState<string>('');
  const [value, setValue] = useState<string>(
    `select
    doc_id,p_hour,user_id,app_id,page_id,action_src,context['flow_type'],sum(cnt_view) cnt_view
    from dw.user_event_metrics_hourly_new
    where p_day = cast(current_date as varchar)
    and doc_id in ('0Tu2nEME')  -- 此处添加要测试的doc_id
    and app_id like 's3rd_%'
    and user_id = '-3264594335'
    and page_id = 'Homepage'
    and context['flow_type']='normal'
    group by 1,2,3,4,5,6,7
    limit 100`);
  const [SqlValue, setSqlValue] = useState<string>(
    `select media_id,doc_id,post_date
      from
      (select
      media_id,doc_id,format_datetime(from_unixtime(date/1000),'yyyy-MM-dd hh:MM:ss') as post_date,
      row_number() over
      (partition by media_id order by format_datetime(from_unixtime(date/1000),'yyyy-MM-dd hh:MM:ss') desc)
      as ranking
      from
      wemedia.new_dim_doc_info_all_hourly
      where p_day = cast(date(now()) as varchar)
      and p_hour = if(length(cast(hour(now()) as int) -6) =2,
      cast(hour(now()) as int) -6, concat(0,cast(hour(now()) as int) -6))
      and doc_id is not null
      and media_id in ('2359361') -- 此处填写meida_id（查询当前时间6小时前数据）
      )
      where ranking = 1`);
  const { getFieldDecorator, validateFields, resetFields, setFieldsValue } = props.form;

  useEffect(() => {
  }, [value, SqlValue])

  const generate = (isVideo: Boolean) => {
    validateFields((err, values) => {
      console.log(values)
      if (typeof values.graphic !== 'undefined' || typeof values.graphics !== 'undefined') {
        axios.get(`/api/proxy/http://www.qatool.yidian-inc.com:8089/jeecg-boot/test/qatoolDemo/${isVideo ? 'getSqlByVideoRuleId' : 'getSqlByNewsRuleId'}`, {
          params: {
            ruleId: isVideo ? values.graphics : values.graphic
          }
        }).then(res => {
          if (res.data.code == 0) {
            isVideo? setVideoSql(res.data.result) : setNewsSql(res.data.result)
            isVideo ? setFieldsValue({ 'graphicCenters': res.data.result }) : setFieldsValue({ 'graphicCenter': res.data.result })
          }
        })
        isVideo ? setFieldsValue({'graphics': undefined}) : setFieldsValue({'graphic': undefined})
      } else {
        message.error('规则ID不能为空！')
      }
    })
  }
  const handleCopy = () => {
    message.success('复制成功');
  }

  return (
    <>
      <div className="main-Generation">
        <Card bordered={false} style={{ minHeight: 380 }}>
          <Form layout="inline">
            <Form.Item
              label="图文规则ID"
              style={{ margin: 8, minWidth: 500 }}
            >
              {getFieldDecorator('graphic', {
                initialValue: '',
              })(
                <Input placeholder='请输入要生成的SQL的规则ID' style={{ width: 300 }} />
              )}
              <Button type="primary" icon="search" style={{ marginLeft: 10 }} onClick={() => generate(false)}>
                生成SQl
              </Button>
            </Form.Item>

            <h3 style={{ marginLeft: 8 }}>图文规则SQL</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Form.Item
                style={{ margin: 8 }}
              >
                {getFieldDecorator('graphicCenter', {
                  initialValue: newsSql || '',
                })(
                  <Input.TextArea style={{ minWidth: 900, height: 70 }} ></Input.TextArea>
                )}
              </Form.Item>
              <CopyToClipboard
                text={newsSql}
                onCopy={handleCopy}
              >
                <Button style={{ width: 70, marginLeft: 6 }} type="primary">复制</Button>
              </CopyToClipboard>
            </div>
            <Form.Item label="视频规则ID"
              style={{ margin: 8, minWidth: 500 }}
            >
              {getFieldDecorator('graphics', {
                initialValue: '',
              })(
                <Input placeholder='请输入要生成的SQL的规则ID' style={{ width: 300 }} />
              )}
              <Button type="primary" icon="search" style={{ marginLeft: 10 }} onClick={() => generate(true)}>
                生成SQl
              </Button>
            </Form.Item>
            <h3 style={{ marginLeft: 8 }}>视频规则SQL</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Form.Item
                style={{ margin: 8 }}
              >
                {getFieldDecorator('graphicCenters', {
                  initialValue: videoSql || '',
                })(
                  <TextArea style={{ minWidth: 900, height: 70 }} />
                )}
              </Form.Item>
              <CopyToClipboard
                text={videoSql}
                onCopy={handleCopy}
              >
                <Button style={{ width: 70, marginLeft: 6 }} type="primary">复制</Button>
              </CopyToClipboard>
            </div>
          </Form>
          <h3 style={{ marginTop: 15, marginLeft: 8 }}>查询文章当天曝光量SQL</h3>
          <div style={{ marginLeft: 8, display: 'flex' }}>
            <MonacoEditor
              width="750"
              height="250"
              language="sql"
              theme="vs-dark"
              value={value}
            />
            <CopyToClipboard
              text={value}
              onCopy={handleCopy}
            >
              <Button style={{ width: 70, marginLeft: 6 }} type="primary">复制</Button>
            </CopyToClipboard>
          </div>
          <h3 style={{ marginTop: 15, marginLeft: 8 }}>查询自媒体当天新发文章SQL</h3>
          <div style={{ marginLeft: 8, display: 'flex' }}>
            <MonacoEditor
              width="750"
              height="300"
              language="sql"
              theme="vs-dark"
              value={SqlValue}
            />
            <CopyToClipboard
              text={SqlValue}
              onCopy={handleCopy}
            >
              <Button style={{ width: 70, marginLeft: 6 }} type="primary">复制</Button>
            </CopyToClipboard>
          </div>
          <div>
          </div>
        </Card>
      </div>
    </>
  );
};
const GenerationDemo = Form.create({ name: 'Check_other' })(Generation);
export default GenerationDemo
