import React, { FC, useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

import { Card, Input, Form, Button, Table, Tooltip, message, Tag, Switch, Modal } from 'antd';
import './index.less'
import { getTaskUser } from '../../services/recommended'
const { TextArea } = Input;
interface Props {
    location: { state: any }
}

function newsPloem(props: Props) {
    const { } = props
    const [flag, setFlag] = useState<any>(undefined)
    const [loading, setLoading] = useState<any>(false)
    const [filters, setFilter] = useState<any>([])
    const [recalls, setRecalls] = useState<any>([])
    const [preprocessorAfterDocs, setPreprocessorAfterDocs] = useState<any>([])
    const [packager, setPackager] = useState<any>([])
    const [blender, setBlender] = useState<any>([])
    const [profile, setProfile] = useState<any>([])
    const [opsToolsFilter, setOpsToolsFilter] = useState<any>([])
    const [blenderListNum, setBlenderListNum] = useState<any>({
        totalNum: 0,
        recallsNum: 0,
        preprocessorAfterDocsNum: 0,
        dedup_after_num: 0,
        packager_docs_num: 0,
        blenderNum: 0,
        startTime: Date.parse(new Date()) / 1000
    })
    const [formRef] = Form.useForm();
    const history = useHistory();
    useEffect(() => {
        let blender = props.location.state ? props.location.state.url : null
        blender == null ? null : formRef.setFieldsValue({ URL: blender })
    }, [])
    const onFinish = async () => {
        let res = await formRef.validateFields()
        handTaskList(res)
    }
    const handTaskList = async (data: any) => {
        setLoading(true)
        let res = await getTaskUser({ params: { url: data.URL.trim(), _t: blenderListNum.startTime } })
        if (res?.code == 0) {
            //列表
            setRecalls(res.result[0].recalls)
            setFilter(res.result[0].history)
            setPreprocessorAfterDocs(res.result[0].after_history)
            setPackager(res.result[0].preprocessor)
            setBlender(res.result[0].blender)
            setProfile(res.result[0].profile)
            setOpsToolsFilter(res.result[0].opsToolsFilter)
            //数值
            setBlenderListNum((item: any) => ({
                ...item,
                totalNum: res.result[0].recall_num,
                recallsNum: res.result[0].history_num,
                preprocessorAfterDocsNum: res.result[0].after_history_num,
                dedup_after_num: res.result[0].dedup_after_num,
                packager_docs_num: res.result[0].preprocessor_num,
                blenderNum: res.result[0].blender_num
            }))
            setLoading(false)
            message.success(res.message)
        } else {
            message.error(res.message)
        }
    }
    const totalSwitch = (checked: boolean, value: any) => {
        checked ?
            Modal.confirm({
                title: '文章列表',
                content: (
                    <div className='result'>
                      {value instanceof Array ? value.join(',') : value || "暂无文章"}
                    </div>
                ),
                width: 700,
                maskClosable: true,
                destroyOnClose: true,
                onCancel: () => { setFlag(false), setTimeout(() => { setFlag(undefined) }, 20) },
                cancelText: "取消",
                onOk: () => { setFlag(false), setTimeout(() => { setFlag(undefined) }, 20) }
            })
            : null
    }
    const getRecalls = [
        {
            title: '召回',
            dataIndex: 'name',
            width: 150,
            key: 'id',
        },
        {
            title: '数量',
            dataIndex: 'size',
            width: 150,
            key: 'id',
        },
        {
            title: 'url',
            dataIndex: 'url',
            width: 150,
            key: 'id',
            render: (value: any, record: any) => {
                if (record.name.indexOf("beacon") != -1) {
                    return (
                        <div style={{ display: "flex" }} key={record.id}>
                            <Tooltip placement="bottom" title={value} >
                                <a className="ellipsis" style={{ cursor: "pointer" }} onClick={() => history.push({pathname : '/recommended/cbPloem' , state:{url : value}})}>
                                    cb问题排查
                                </a>
                            </Tooltip>
                        </div>
                    )
                } else if (record.name.indexOf("aiorecall") != -1 || record.name.indexOf("allInOne") != -1 || record.name.indexOf("allInone") != -1)  {
                    return (
                        <div style={{ display: "flex" }} key={record.id}>
                            <Tooltip placement="bottom" title={value} >
                                <a className="ellipsis" style={{ cursor: "pointer" }} onClick={() => history.push({pathname : '/recommended/aioPloem' , state:{url : value}})}>
                                    aio问题排查
                                </a>
                            </Tooltip>
                        </div>
                    )
                } else {
                    return (
                        <div style={{ display: "flex" }} key={record.id}>
                            <Tooltip placement="bottom" title={value} >
                                <a className="ellipsis" style={{ cursor: "pointer" }} >
                                    {value && value.substring(0, 20)}
                                </a>
                            </Tooltip>
                        </div>
                    );
                }

            },
        },
        {
            title: '文章列表',
            width: 150,
            dataIndex: 'docs',
            key: 'id',
            render: (value: any, record: any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked, value)} /> : "无"
            }
        },
    ];
    const getFilters = [
        {
            title: '召回',
            dataIndex: 'name',
            width: '80%',
            key: 'id',
        },
        {
            title: '数量',
            width: '15%',
            dataIndex: 'size',
            key: 'id',
        },
        {
            title: '文章',
            width: '15%',
            dataIndex: 'docs',
            key: 'id',
            render: (value: any, record: any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked, value)} /> : "无"
            }
        },
    ];
    const preprocessorAfterDoc = [
        {
            title: '召回',
            dataIndex: 'name',
            width: 150,
            key: 'id',
        },
        {
            title: '过滤后剩余的文章数',
            width: 150,
            dataIndex: 'size',
            key: 'id',
        },
        {
            title: '过滤后剩余文章',
            width: 150,
            dataIndex: 'docs',
            key: 'id',
            render: (value: any, record: any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked, value)} /> : "无"
            }
        },
    ];
    const getOpsToolsFilter = [
        {
            title: '被过滤文章',
            dataIndex: 'name',
            width: 150,
            key: 'id',
        },
        {
            title: '命中规则',
            width: 150,
            dataIndex: 'ruleId',
            key: 'id',
        },
    ];
    const getPackager = [
        {
            title: '召回',
            dataIndex: 'name',
            width: 150,
            key: 'id',
        },
        {
            title: '打包后剩余的文章数',
            width: 150,
            dataIndex: 'size',
            key: 'id',
        },
        {
            title: '打包后剩余文章',
            width: 150,
            dataIndex: 'docs',
            key: 'id',
            render: (value: any, record: any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked, value)} /> : "无"
            }
        },
    ];
    const getBlender = [
        {
            title: 'blender之后数量',
            width: 150,
            dataIndex: 'size',
            key: 'id',
        },
        {
            title: 'blender之后的文章',
            width: 150,
            dataIndex: 'docs',
            key: 'id',
            render: (value: any, record: any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked, value)} /> : "无"
            }
        },
    ];
    const getProfile = [
        {
            title: '最后展示文章数量',
            width: 150,
            dataIndex: 'size',
            key: 'id',
        },
        {
            title: '最后展示文章',
            width: 150,
            dataIndex: 'docs',
            key: 'id',
            render: (value: any, record: any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked, value)} /> : "无"
            }
        },
    ];
    return (
        <div className="BlenderPloem-content" >
            <Card bordered={false} style={{ minHeight: 380 }}>
            <h4 style={{ paddingLeft: 10 }}>user2news问题排查</h4>
                <Form name="nest-messages" form={formRef} style={{ display: "flex" }}>
                    <Form.Item name='URL' rules={[{ required: true }]} style={{ width: '100%', paddingLeft: 10 }}>
                        <TextArea rows={3} placeholder="请输入请求URL" style={{ width: '95%' }} />
                    </Form.Item>
                    <Form.Item style={{ paddingTop: 20 }}>
                        <Button type="primary" onClick={onFinish}>
                            查询
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ padding: 10 }}>
                    <Tag style={{ fontSize: 14, marginBottom: 10 }} color="cyan">第一步:召回 > {blenderListNum.totalNum}</Tag>
                    <Table dataSource={recalls} columns={getRecalls} pagination={false} loading={loading} />
                </div>
                <div style={{ padding: 10 }}>
                    <Tag style={{ fontSize: 14, marginBottom: 10 }} color="cyan">第二步：去重 > {blenderListNum.recallsNum}</Tag>
                    <Table style={{ width: "100%" }} scroll={{ x: 1200 }} dataSource={filters} columns={getFilters} pagination={false} loading={loading} />
                </div>
                <div style={{ padding: 10 }}>
                    <Tag style={{ fontSize: 14, marginBottom: 10 }} color="cyan">去重后剩余文章数 > {blenderListNum.preprocessorAfterDocsNum}</Tag>
                    <Table dataSource={preprocessorAfterDocs} columns={preprocessorAfterDoc} pagination={false} loading={loading} />
                </div>
                <div style={{ padding: 10 }}>
                    <Tag style={{ fontSize: 14, marginBottom: 10 }} color="cyan">第三步：blender > {blenderListNum.blenderNum}</Tag>
                    <Table dataSource={blender} columns={getBlender} pagination={false} loading={loading} />
                </div>
                <div style={{ padding: 10 }}>
                    <Tag style={{ fontSize: 14, marginBottom: 10 }} color="cyan">第四步：过滤 > {blenderListNum.packager_docs_num}</Tag>
                    <Table dataSource={packager} columns={getPackager} pagination={false} loading={loading} />
                </div>
                <div style={{ padding: 10 }}>
                    <Tag style={{ fontSize: 14, marginBottom: 10 }} color="cyan">被过滤工具过滤的文章命中的规则 > {blenderListNum.preprocessorAfterDocsNum}</Tag>
                    <Table dataSource={opsToolsFilter} pagination={false} columns={getOpsToolsFilter} loading={loading} />
                </div>
                <div style={{ padding: 10 }}>
                    <Tag style={{ fontSize: 14, marginBottom: 10 }} color="cyan">最终文章展示</Tag>
                    <Table dataSource={profile} columns={getProfile} pagination={false} loading={loading} />
                </div>
            </Card>
        </div>
    )
}

export default newsPloem
