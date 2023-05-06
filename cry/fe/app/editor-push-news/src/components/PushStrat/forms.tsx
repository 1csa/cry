// TODO 这里的表单校验对所有类型采取了一刀切的形式，如果不同模版校验方式不一样，这里就会有问题，尤其是对于必须和非必须的处理

import React, { useEffect, useState, ReactNode } from 'react';
import { Tooltip, Icon, Switch } from 'antd';
import { useField, useFormikContext } from 'formik';
import { Select, Radio, DatePicker, FormItem } from 'formik-antd';
import { useSelector } from 'dva';

import { business_map, push_type_map, speed_level_map, expire_time_map, yes_no_map, break_hot_level_map, auto_hot_level_map, quota_code_list } from '@/data';
import { parseselect, parseradio } from '@/utils';
import { useValueContext } from '@/hooks';

import { currentTemplateSelector } from '@/selectors/template';
import { requiredValidate, cateValidate } from '@/validation/editorpush';
import { CatesForm } from '@/components/CatesForm';
import { PushType } from '@/config/editorpush/push';
import { getPushStatistics } from "@/services/editorpushService";

interface FormikItemProps {
  fieldname: string;
  fielditem: React.ReactElement;
}

export const FormikPushStrat: React.FC<FormikItemProps> = React.memo(({ fieldname, fielditem }) => {
  const [_, { value }] = useField(fieldname);

  return React.cloneElement(fielditem, { [fieldname]: value });
});

// 业务类型
export const BizFormItem: React.FC = React.memo(() => {
  return (
    <FormItem className="form-item" name="biz_id" label="推送业务线">
      <Select name="biz_id">{parseselect(business_map)}</Select>
    </FormItem>
  );
});

// 推送类型
export const PushtypeFormItem: React.FC = React.memo(() => {
  return (
    <FormItem className="form-item" name="pushType" label="推送类型">
      <Radio.Group name="pushType">{parseradio(push_type_map)}</Radio.Group>
      <Tooltip
        title={
          <div>
            <p>1、全量突发（all_break）：推送给全平台用户，立即到；</p>
            <p>2、全量个性化（all）：全量用户个性化推送，在有效时间内竞争匹配用户，并非所有用户都能收到；</p>
            <p>3、局部突发（auto_break）：推给圈选的人群，立即到；</p>
            <p>4、局部个性化（auto）：推给圈选的人群，在有效时间内竞争匹配用户；</p>
            <p>5、用户-ID（userid）：给指定的用户ID发送，立即到；</p>
            <p>6、APP-ID（appids）：给指定的appid发送，立即到；</p>
          </div>
        }
      >
        <Icon type="question-circle" />
      </Tooltip>
    </FormItem>
  );
});

// 推送优先级:仅推送类型为all_break的时候有该配置
const SpeedlevelContent: React.FC<{ pushType?: keyof typeof push_type_map }> = React.memo(({ pushType }) => {
  return pushType === 'all_break' ? (
    <FormItem className="form-item" name="speed_level" label="推送优先级">
      <Select name="speed_level" placeholder="请选择推送优先级">
        {parseselect(speed_level_map)}
      </Select>
      <Tooltip
        title={
          <div>
            <p>即时：重大突发事件，最高优先级，所有环节放行</p>
            <p>紧急：一般紧急事件，不用抢第一时间</p>
            <p>快速：热点新闻</p>
            <p>一般：指现有的早晨、人工、定时、全量推送</p>
          </div>
        }
      >
        <Icon type="question-circle" />
      </Tooltip>
    </FormItem>
  ) : null;
});
export const SpeedlevelFormItem: React.FC = () => <FormikPushStrat fieldname="pushType" fielditem={<SpeedlevelContent />} />;

// 过期时间：适配所有推送类型
export const ExpiretimeFormItem: React.FC = React.memo(() => {
  return (
    <FormItem className="form-item" name="expireTime" label="过期时间">
      <Select name="expireTime" placeholder="请选择推送优先级">
        {parseselect(expire_time_map)}
      </Select>
      <Tooltip title="指该条push在push通道中的过期时间">
        <Icon type="question-circle" />
      </Tooltip>
    </FormItem>
  );
});
 const isLastDateOfCurrentMonth = (dateData: Date) => {
  if (!dateData) return false;
  const date: Date = new Date(dateData);
  const next_date = new Date(date?.getTime() + 24 * 60 * 60 * 1000)?.getDate();
  if (next_date === 1) {
    return true;
  }
  return false;
};
// 小米高优推送：适配所有推送类型
export const PriorityFormItem: React.FC = React.memo(() => {
  const formik = useFormikContext();
  const templateId = useSelector(currentTemplateSelector)
  const validator = (value: string) => requiredValidate(value, '小米高优推送');
  const [_, { value: xiaomi_priority }] = useField('xiaomi_priority');
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(xiaomi_priority === '1' ? true : false)
  }, [xiaomi_priority]);
 
  useEffect(() => {
   const currentDate = new Date();
   const oneDay = 24 * 60 * 60 * 1000*7;
   const nextDate = new Date(currentDate?.getTime() + oneDay).getDate();
   if (nextDate === 1) {
    getPushStatisticsWarning()
   }
   
  }, [xiaomi_priority,templateId])
  
  //获取预警小米接口
  const getPushStatisticsWarning = async ()=>{
    const res:any = await getPushStatistics()
    if (res.status === 'success') {
      stauts(res.result.result.xiaomi)
    }
  }
  //小米预警判断
  const stauts = (warn:any)=>{
    let data = new Date().getHours()
     switch (warn) {
      case '无预警':
        break;
      case '低预警':
        if (11<=data&&data<16) {
          setChecked(false)
          formik.setFieldValue('xiaomi_priority','0');
        }
        break;
      case '中预警':
        if (8<=data&&data<9||11<=data&&data<12) {
          setChecked(false)
          formik.setFieldValue('xiaomi_priority','0');
        }
        break;
      case '高预警':
        if (8<=data&&data<9||10<=data&&data<12) {
          setChecked(false)
          formik.setFieldValue('xiaomi_priority','0');
        }
        break;
      case '超高预警':
        if (data<8) {
          setChecked(false)
          formik.setFieldValue('xiaomi_priority','0');
        }
        break;
      default:
        break;
    }
    
  }
  const handleChange = (checked: boolean) => {
    if (templateId === '001' || templateId === '002' || templateId === '003') {
      if (checked) {
        let currnetExcludeTags = formik.getFieldProps('excludeTags').value
        if (currnetExcludeTags && currnetExcludeTags.indexOf('e3138922') < 0) {
          formik.setFieldValue('excludeTags', [...currnetExcludeTags, 'e3138922']);
        }
      } else {
        let currnetExcludeTags = formik.getFieldProps('excludeTags').value
        let index = currnetExcludeTags.indexOf('e3138922')
        if (currnetExcludeTags && index > -1) {
          currnetExcludeTags.splice(index, 1)
          formik.setFieldValue('excludeTags', currnetExcludeTags);
        }
      }
    }
    
    formik.setFieldValue('xiaomi_priority', checked ? '1' : '0');
    setChecked(checked);
  }
  return (
    <FormItem className="form-item" name="xiaomi_priority" label="小米高优推送" required validate={validator}>
      <Switch onChange={handleChange} defaultChecked={false} checked={checked} />
    </FormItem>
  );
});

// oppo-付费推送：适配所有推送类型
export const OppopayFormItem: React.FC = React.memo(() => {
  const formik = useFormikContext();
  const templateId = useSelector(currentTemplateSelector)
  const validator = (value: string) => requiredValidate(value, 'oppo付费推送');
  const [_, { value: oppo_pay }] = useField('oppo_pay');
  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
   
  }, [])
  
  useEffect(() => {
   const currentDate = new Date();
   const oneDay = 24 * 60 * 60 * 1000*7;
   const nextDate = new Date(currentDate?.getTime() + oneDay).getDate();
   if (nextDate === 1) {
      getPushStatisticsWarning()
   }
    setChecked(oppo_pay === '1' ? true : false);
  }, [oppo_pay,templateId]);
 //获取预警oppo接口
 
  const getPushStatisticsWarning = async ()=>{
    const res:any = await getPushStatistics()
    if (res.status === 'success') {
      stauts(res.result.result.oppo)
    }
  }
  //oppo预警判断
  const stauts = (warn:any)=>{
    let data = new Date().getHours()
    switch (warn) {
      case '无预警':
        break;
      case '低预警':
        if (15<=data&&data<16) {
          setChecked(false)
           formik.setFieldValue('oppo_pay','0');
        }
        break;
      case '中预警':
        if (14<=data&&data<16||21<=data&&data<23) {
          setChecked(false)
           formik.setFieldValue('oppo_pay','0');
        }
        break;
      case '高预警':
        if (14<=data&&data<17||21<=data&&data<23) {
          setChecked(false)
           formik.setFieldValue('oppo_pay','0');
        }
        break;
      case '超高预警':
        if (data<21) {
          setChecked(false)
           formik.setFieldValue('oppo_pay','0');
        }
        break;
      default:
        break;
    }
  }
  const handleChange = (checked: boolean) => {
    formik.setFieldValue('oppo_pay', checked ? '1' : '0');
    setChecked(checked);
  }
  return (
    <FormItem className="form-item" name="oppo_pay" label="oppo付费推送" required validate={validator}>
      <Switch onChange={handleChange} defaultChecked={false} checked={checked} />
    </FormItem>
  );
});

//重大全量：打开后排除小米重度沉默和小米沉默90天以上用户
export const MajorFormItem: React.FC = React.memo(()=>{
  const formik = useFormikContext();
  const templateId = useSelector(currentTemplateSelector)
  const validator = (value: string) => requiredValidate(value, '重大全量');
  const [_, { value: major_quantity }] = useField('major_quantity');
  const [checked, setChecked] = useState<boolean>(false);
  
  useEffect(() => {
   setChecked(major_quantity === '1' ? true : false);
  }, [major_quantity]);
 
  const handleChange = (checked: boolean) => {
    if (templateId === '001' || templateId === '002' || templateId === '003') {
       let currnetExcludeTags = formik.getFieldProps('excludeTags').value
      if (checked) {
        localStorage.setItem('currnetExcludeTag',currnetExcludeTags.toString())
        currnetExcludeTags = ['e2465900', 'e2465918']
        formik.setFieldValue('excludeTags', currnetExcludeTags);
      } else {
        let currnetExcludeTag =  localStorage.getItem('currnetExcludeTag')?.split(',')
        formik.setFieldValue('excludeTags',currnetExcludeTag);
      }
    }
    
    formik.setFieldValue('major_quantity', checked ? '1' : '0');
    setChecked(checked);
  }
  return (
    <FormItem className="form-item" name="major_quantity" label="重大全量" required validate={validator}>
      <Switch onChange={handleChange} defaultChecked={false} checked={checked} />
    </FormItem>
  );
})
// 推送分类：适配所有推送类型
export const CateFormItem: React.FC = React.memo(() => {
  const { pushType = 'userids' } = useValueContext();
  const validator = (value: string) => cateValidate(value, pushType as PushType);

  return (
    <>
      <FormItem className="form-item" name="cate" label="推送分类" required={['auto', 'auto_break'].includes(pushType)} validate={validator}>
        <CatesForm name="cate" />
      </FormItem>
    </>
  );
});

// 是否延迟推送：适配所有推送类型
export const DelayFormItem: React.FC = React.memo(() => {
  const formik = useFormikContext();
  const [_, { value: delay_push }] = useField('delay_push');
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    formik.setFieldValue('delay_push', checked ? '1' : '0');
    setChecked(checked);
  }

  useEffect(() => {
    setChecked(delay_push === '1' ? true : false);
  }, [delay_push]);

  return (
    <FormItem className="form-item" name="delay_push" label="是否延迟推送">
      <Switch onChange={handleChange} defaultChecked={false} checked={checked} />
    </FormItem>
  );
});

// 延迟推送时间：仅在延迟推送值为1时出现
const DelaytimeContent: React.FC<{ delay_push?: '0' | '1' }> = React.memo(({ delay_push }) => {
  return delay_push === '1' ? (
    <FormItem className="form-item" name="delay_push_time" label="定时推送时间">
      <DatePicker name="delay_push_time" format="YYYY-MM-DD HH:mm:ss" showTime />
    </FormItem>
  ) : null;
});
export const DelaytimeFormItem: React.FC = () => <FormikPushStrat fieldname="delay_push" fielditem={<DelaytimeContent />} />;

// 热点等级
const HotpotContent: React.FC<{ pushType?: keyof typeof push_type_map }> = React.memo(({ pushType }) => {
  let hot_level_map = {};

  if (pushType === 'auto_break') {
    hot_level_map = break_hot_level_map;
  }

  if (pushType === 'auto') {
    hot_level_map = auto_hot_level_map;
  }

  return (
    <FormItem className="form-item" name="hot_level" label="热点等级">
      <Radio.Group name="hot_level">{parseradio(hot_level_map)}</Radio.Group>
    </FormItem>
  );
});

// 配额业务选择
export const QuotaFormItem: React.FC = React.memo(() => {
   const renderQuotaCodeOptions = (): ReactNode => {
    return quota_code_list.map((item: any) => {
      return <Select.Option key={ item.value } value={ item.value }>{ item.label }</Select.Option>
    })
  }
  return (
    <>
      <FormItem className="form-item" name="quota_code" label="配额业务选择">
      <Select
          name="quota_code"
        >
          { renderQuotaCodeOptions() }
        </Select>
      </FormItem>
    </>
  );
});
export const HotpotFormItem: React.FC = () => <FormikPushStrat fieldname="pushType" fielditem={<HotpotContent />} />;
