/**
* @augments {object, object>}
*/
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Select, Button, Radio, Divider, Row, Col, message as aliasMess, Upload, Icon, Cascader, Spin } from 'antd';
import { connect } from 'dva';
import { ConnectState, Dispatch, UserModelState } from '@/models/connect';
import { pqTaskList } from '@/pages/pqconfig/models';
import { PqDetail } from '@/config/app.d';
import { FormComponentProps } from "antd/lib/form/Form";
import { createTask } from '@/services/pqtask';
import './index.less';
import { XITONG_COMP_API, taskTypeOptions, disTypeOptions, dataTypeOptions, taskStartFrom } from '@/config/constant';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

interface formDetailType {
    [x: string]: any;
    id: any,
    task_name: string,    // 任务名称
    remarks: string,       // 任务说明
    source_id: string | number
    source_name: string
    source_label: string
    start_from: number,   // 任务起点
    chain: string[],      // 任务链路
    business: number,     // 任务类型
    schedule_type: number | string, // 调度类型
    schedule_info: string,// 调度信息
    level: number,          // 优先级
    meta: {
        task_configure: {     // 是否去重
            is_repeat: number,
            dedup_interval: number,    // 去重时间
            channel: string      // 数据来源
        },
        data_configure: {
            redis_key?: any
            redis_len?: number
            mongo_db?: string
            mongo_table?: string
            output_field?: any
            query_condition?: any
            common?: any
        }
    }
}
interface lazyOption {
    value: string;
    label?: string;
    disabled?: boolean;
    isLeaf: false,
    children?: lazyOption[];
}
interface IProps extends FormComponentProps {
    taskid?: number | string
    type?: string
    isShow: boolean
    dispatch: Dispatch
    sourceList: pqTaskList
    addTask: any,
    onRequestGetTaskList: any
    user?: UserModelState
}
interface IState {
    user: UserModelState
    sourceList: pqTaskList
}
// { type = 'edit', id = 0,  sourceList}
const PqDetailInfo: React.FC<IProps> = ({ taskid, type, isShow, dispatch, sourceList, addTask, onRequestGetTaskList, user, form }) => {
    const { currentUser } = user;
    const siteList = sourceList;
    let formDetailInfo = {
        'id': '',
        'task_name': '',    // 任务名称
        'remarks': '',       // 任务说明
        'source_id': '',
        'source_name': '',
        'source_label': '',
        'start_from': 0,   // 任务起点
        'chain': [],        // 任务链路
        'business': 0,     // 任务类型
        'schedule_type': 0, // 调度类型
        'schedule_info': '',// 调度信息
        'level': 1,          // 优先级
        'meta': {
            'task_configure': {     // 是否去重
                "is_repeat": 1,
                "dedup_interval": 3,    // 去重时间
                "channel": "redis"      // 数据来源
            },
            'data_configure': {
                'redis_key': '',
                'redis_len': 1,
                'mongo_db': '',
                'mongo_table': '',
                'output_field': '',
                'query_condition': '',
                'common': ''
            }
        }
    }
    let redisData = {
        'redis_key': '',
        'redis_len': 0
    }
    let mongoData = {
        'mongo_db': '',
        'mongo_table': '',
        'output_field': '',
        'query_condition': ''
    }
    let commonData = {
        'parameters': ''
    }
    const getDetailInfo = useCallback(() => {
        console.log(taskid);
        // onRequestTaskInfo(taskid);
    }, [taskid])
    const [filetxt, setFileTxt] = useState<any>(null);
    const [commonNextSelectData, setCommonNextSelectData] = useState<any>(null);
    const { getFieldDecorator, setFieldsValue } = form;
    let [formDetail, setFormDetail] = useState<formDetailType>(formDetailInfo);
    const [chain, setChain] = useState<any>(null);
    const [dateDisabled, setDateDisabled] = useState<boolean>(false);
    const [lazySelect, setLazySelect] = useState<lazyOption[]>([]);
    const [extraForm, setExtraForm] = useState<any>(redisData);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [isSchDis, setisSchDis] = useState<boolean>(true);
    const [scheduleValue, setScheduleValue] = useState<number>(0);

    const formItemLayout = {
        labelCol: {
            span: 4
        },
        wrapperCol: {
            span: 20
        }
    };
    const btnItemLayout = {
        wrapperCol: {
            sm: {
                span: 16,
                offset: 3,
            }
        },
    }
    const sourceHtmlLayout = {
        labelCol: {
            span: 4,
            pull: 2
        },
        wrapperCol: {
            span: 20,
            pull: 2
        }
    }
    const sourceHtmlLayout2 = {
        labelCol: {
            span: 8,
            pull: 2
        },
        wrapperCol: {
            span: 16,
            pull: 2
        }
    }
    const onRepeatChange = (e: any) => {
        setDateDisabled(e.target.value & 1 ? false : true);
    }
    const dataSourceChange = (e: any) => {
        switch (e.target.value) {
            case 'redis':
                setExtraForm(redisData);
                break;
            case 'mongo':
                setExtraForm(mongoData);
                break;
            case 'common':
                setExtraForm(commonData);
                break;
            default:
                break;
        }
    }
    const handleSourceChange = async (value: string) => {
        const { code, message, data = [] } = await dispatch({
            type: 'pqTaskList/getChainListGroup',
            payload: {
                'source_id': value
            }
        });
        if (~~code === 0 || message === 'Success') {
            let chainData = [];
            let resdata = data[0];
            chainData = resdata && resdata.map((item: any) => {
                function loopChild(item: any) {
                    let newItemIn = {};
                    newItemIn['value'] = item['chain'];
                    newItemIn['pid'] = item['pid'];
                    newItemIn['label'] = item['chain'];
                    newItemIn['disabled'] = false;
                    if (data[item['pid']]) {
                        newItemIn['isLeaf'] = false;
                        newItemIn['children'] = data[item['pid']].map((child: any) => loopChild(child));
                    } else {
                        newItemIn['isLeaf'] = true;
                        newItemIn['children'] = null;
                    }
                    return newItemIn;
                }
                return loopChild(item);
            })
            setLazySelect(chainData);
        } else {
            aliasMess.error(`${message}`);
        }
    }
    const onRequestTaskInfo = async (task_id: any) => {
        setSpinning(true);
        const { code, data, message } = await dispatch({
            type: 'pqTaskList/getTaskInfoById',
            payload: {
                task_id
            }
        })
        if (~~code === 0 || message === 'success') {
            formDetailInfo = {
                'id': data.id,
                'task_name': data.task_name,
                'remarks': data.remarks,
                'source_id': data.source_id,
                'source_name': data.source_name,
                'source_label': data.source_label,
                'start_from': data.start_from,
                'chain': data.chain.map((item: any) => item.chain),
                'business': data.business,
                'schedule_type': data.schedule_type,
                'schedule_info': data.schedule_info,
                'level': data.level,
                'meta': {
                    'task_configure': {
                        "is_repeat": data.meta.task_configure.is_repeat,
                        "dedup_interval": data.meta.task_configure.dedup_interval,
                        "channel": data.meta.task_configure.channel
                    },
                    'data_configure': data.meta.data_configure
                }
            }
            setDateDisabled(~~data.meta.task_configure.is_repeat & 1 ? false : true);
            if (data.meta.task_configure.channel == 'redis') {
                setExtraForm(redisData)
            } else if (data.meta.task_configure.channel == 'mongo') {
                setExtraForm(mongoData);
                formDetailInfo.meta.data_configure.output_field = data.meta.data_configure.mongo_sql.output_field;
                formDetailInfo.meta.data_configure.query_condition = data.meta.data_configure.mongo_sql.query_condition;
            } else if (data.meta.task_configure.channel == 'common') {
                setExtraForm(commonData);
            }
            setScheduleValue(data.schedule_type);
            setFormDetail(formDetailInfo);

            setSpinning(false);
        }
        if (data.source_id) {
            await handleSourceChange(data.source_id);
        }
    }
    const handleCronValidate = (rule: any, value: any, callback: any) => {
        if (!!value) {
            let parser = require('cron-parser');
            try {
                let interval = parser.parseExpression(value);
            } catch(e) {
                callback('输入corn不合法');
            }
        } else {
            callback('corn必填');
        }
        callback();
    }
    const scheduleTypeChange = (e: any) => {
        setisSchDis(e.target.value & 2 ? false : true);
        setScheduleValue(e.target.value);
    }
    useEffect(() => {
        if (isShow) {
            if (taskid != 'add') {
                onRequestTaskInfo(taskid);   
            } else {
                setFormDetail(formDetailInfo);
            }
        }
    }, [isShow])
    const submitDetail = () => {
        form.validateFields(async (err: any, values: any) => {
            if (err) {
                return;
            }
            let res = null;
            values['create_id'] = currentUser.userid;
            values['create_auther'] = currentUser.email.split('@')[0];
            values['meta']['data_configure']['mongo_sql'] = {
                output_field: values['meta']['data_configure']['output_field'],
                query_condition: values['meta']['data_configure']['query_condition']
            };
            values['task_id'] = formDetail.id;
            // if (values['meta']['task_configure']['is_repeat'] == 0) {
            //     values['meta']['task_configure']['dedup_interval'] = '';
            // }
            if (type == 'edit') {
                res = await dispatch({
                    type: 'pqTaskList/createTaskEvent',
                    payload: {
                        ...values
                    }
                })
            } else if (type == 'update') {
                res = await dispatch({
                    type: 'pqTaskList/updateTaskEvent',
                    payload: {
                        ...values
                    }
                })
            }
            if (~~res.code === 0) {
                // 添加更新数据逻辑
                onRequestGetTaskList();
            } else {
                aliasMess.error(`${res.message}`);
                return;
            }
            addTask();
        })
    }
    return (
        <>
            <Spin spinning={spinning} tip="加载中...">
            <div className="detail-info-content">
                <Form {...formItemLayout}>
                    <FormItem label="任务名称">
                        {getFieldDecorator('task_name', {
                            initialValue: formDetail.task_name,
                            rules: [{
                                required: true,
                                max: 30,
                                message: '必填项且最多可输入30个字'
                            }]
                        })(<Input />)}</FormItem>
                    <FormItem label="任务说明">{getFieldDecorator('remarks', {
                        initialValue: formDetail.remarks,
                        rules: [{
                            required: true,
                            max: 255,
                            message: '必填项且最多可输入255个字'
                        }]
                    })(<TextArea autoSize></TextArea>)}</FormItem>
                    <FormItem label="站点信息">
                        {getFieldDecorator('source', { initialValue: formDetail.source_label, rules: [{ required: true }] })(
                            <Select onChange={handleSourceChange}>
                                {
                                    siteList.map((item: any, index: number) => {
                                        return <Option value={item.source_id} key={index}>{item.source_label}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="任务起点">
                        {getFieldDecorator('start_from', { initialValue: formDetail.start_from, rules: [{ required: true }] })(<RadioGroup options={taskStartFrom} />)}
                    </FormItem>
                    <FormItem label="任务类型">{getFieldDecorator('business', { initialValue: formDetail.business, rules: [{ required: true }] })(<RadioGroup options={taskTypeOptions} />)}</FormItem>
                    <FormItem label="任务链路">
                        {
                            getFieldDecorator('chain', {
                                initialValue: formDetail.chain,
                                rules: [{
                                    required: true
                                }]
                            })(<Cascader options={lazySelect} changeOnSelect={true}></Cascader>)
                        }
                    </FormItem>
                    <FormItem label="优先级">{getFieldDecorator('level', {
                        initialValue: formDetail.level,
                        rules: [{
                            required: true ,
                            pattern: /^([1-9]|10)$/,
                            message: '必填项且level必须在1-9中间'
                        }]
                    })(<Input />)}</FormItem>
                    <FormItem label="调度类型">
                        {
                            getFieldDecorator('schedule_type', {
                                initialValue: formDetail.schedule_type,
                                rules: [{ required: true }] 
                            })(<RadioGroup options={disTypeOptions} onChange={scheduleTypeChange} />)
                        }
                    </FormItem>
                    {scheduleValue == 1 ? <FormItem label="调度信息">
                            {
                                getFieldDecorator('schedule_info', {
                                    initialValue: formDetail.schedule_info,
                                    rules: [{
                                        required: true,
                                        validator: (rule, value, callback) => {
                                            handleCronValidate(rule, value, callback);
                                        }
                                    }]
                                })(<Input />)
                            }
                        </FormItem> : null
                    }
                    {
                        scheduleValue == 0 ? <FormItem label="调度信息">
                        {
                            getFieldDecorator('schedule_info', {
                                initialValue: formDetail.schedule_info,
                                rules: [{
                                    required: true,
                                    pattern: /^[1-9]\d*$/
                                }]
                            })(<Input />)
                        }
                        </FormItem> : null
                    }
                    {/* <FormItem label="调度信息">
                        {
                            getFieldDecorator('schedule_info', {
                                initialValue: formDetail.schedule_info,
                                rules: [{
                                    required: true,
                                    validator: (rule, value, callback) => {
                                        handleCronValidate(rule, value, callback);
                                    }
                                }]
                            })(<Input disabled={isSchDis} />)
                        }
                    </FormItem> */}
                    <FormItem label="是否去重">
                        <Row>
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator('meta.task_configure.is_repeat', { initialValue: formDetail.meta.task_configure.is_repeat })(
                                        <RadioGroup onChange={onRepeatChange}>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={16}>
                                <FormItem>{getFieldDecorator('meta.task_configure.dedup_interval', {
                                    initialValue: formDetail.meta.task_configure.dedup_interval,
                                    rules: [{
                                        required: !dateDisabled,
                                        pattern: /^[1-9]\d*(\.\d+)?$/,
                                        message: '必须为正整数'
                                    }]
                                })(<Input addonBefore="去重有效时间:" disabled={dateDisabled} />)}</FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="数据来源">
                        {getFieldDecorator('meta.task_configure.channel', {
                            initialValue: formDetail.meta.task_configure.channel
                        })(<RadioGroup options={dataTypeOptions} onChange={dataSourceChange} />)}
                        {
                            Object.keys(extraForm).map((item: string, index: number) => {
                                if (item === 'redis_len') {
                                    return <FormItem label={item} {...sourceHtmlLayout} key={index}>
                                    {
                                        getFieldDecorator(`meta.data_configure[${item}]`, {
                                            initialValue: formDetail.meta.data_configure[item],
                                            rules: [{
                                                required: true,
                                                pattern: /^\+?[1-9]\d*$/,
                                                message: '必填项且为正整数'
                                            }]
                                        })(<Input  />)
                                    }
                                    </FormItem>
                                } else {
                                    return <FormItem label={item} {...sourceHtmlLayout} key={index}>
                                    {
                                        getFieldDecorator(`meta.data_configure[${item}]`, {
                                            initialValue: formDetail.meta.data_configure[item],
                                            rules: [{
                                                required: true
                                            }]
                                        })(<Input  />)
                                    }
                                    </FormItem>
                                }
                            })
                        }
                    </FormItem>
                    <FormItem {...btnItemLayout}>
                        <Button type="primary" onClick={submitDetail}>保存</Button>
                        <Button onClick={addTask}>取消编辑</Button>
                    </FormItem>
                </Form>
            </div>
            </Spin>
        </>
    )
}

export default connect(
    ({ pqTaskList, user }: { pqTaskList: any, user: ConnectState }) => {
        return {
            sourceList: pqTaskList.sourceList,
            user
        }
    })(Form.create<IProps>()(PqDetailInfo));
