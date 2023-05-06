import React, {FC , useState , useEffect} from 'react'
import { Card, Input, Form ,Button , Table , Tooltip , message , Tag , Switch , Modal} from 'antd';
import './index.less'
import {getTaskChannel} from '../../services/recommended'
const { TextArea } = Input;
interface Props { }

function mircoPloem(props: Props) {
    const { } = props
    const [flag , setFlag] = useState<any>(undefined)
    const [loading , setLoading] = useState<any>(false)
    const [packager , setPackager] = useState<any>([])
    const [opsToolsFilter , setOpsToolsFilter] = useState<any>([])
    const [profile , setProfile] = useState<any>([])
    const [blenderListNum , setBlenderListNum] = useState<any>({
        totalNum : 0,
        recallsNum : 0,
        dedup_after_num : 0,
        packager_docs_num : 0,
        predictitem_num : 0,
        postprocessor_num : 0,
        startTime : Date.parse(new Date())/1000
    })
    const [formRef] = Form.useForm();
    const onFinish = async () => {
        let res = await formRef.validateFields()
        handTaskList(res)
    }
    const handTaskList = async(data:any) => {
        setLoading(true)
        let res = await getTaskChannel({params:{url:data.URL.trim() , _t:blenderListNum.startTime}})
        if(res?.code == 0) {
            //列表
            setPackager(res.result[0].preprocessor)
            setOpsToolsFilter(res.result[0].opsToolsFilter)
            setProfile(res.result[0].profile)
            //数值
            setBlenderListNum((item: any) => ({
                ...item,
                totalNum :res.result[0].recall_num,
                recallsNum : res.result[0].blender_num,
                dedup_after_num : res.result[0].merge_num,
                packager_docs_num : res.result[0].afterpreprocessor_num,
                predictitem_num : res.result[0].predictItems_num,
                postprocessor_num : res.result[0].postprocessor_num

            }))
            setLoading(false)
            message.success(res.message)
        }else {
            message.error(res.message)
        }
    }
    const totalSwitch = (checked:boolean ,  value:any) => {
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
            destroyOnClose:true,
            onCancel:()=> {setFlag(false) , setTimeout(() => {setFlag(undefined)},20)},
            cancelText:"取消",
            onOk:()=> {setFlag(false) , setTimeout(() => {setFlag(undefined)},20)}
        })
        : null
    }
    const getPackager = [
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
            render:(value:any , record:any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked , value)}/> : "无"
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
            render:(value:any , record:any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked , value)}/> : "无"
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
    return (
        <div className="BlenderPloem-content" >
            <Card bordered={false} style={{ minHeight: 380 }}>
            <h4 style={{ paddingLeft: 10 }}>channel2news问题排查</h4>
                <Form name="nest-messages" form={formRef} style={{ display: "flex" }}>
                    <Form.Item name='URL' rules={[{ required: true }]} style={{ width:'100%' , paddingLeft: 10 }}>
                        <TextArea rows={3} placeholder="请输入请求URL" style={{width:'95%'}}/>
                    </Form.Item>
                    <Form.Item style={{ paddingTop:20}}>
                        <Button type="primary" onClick={onFinish}>
                            查询
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">第一步:召回 > {blenderListNum.totalNum}</Tag>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">第二步：blender > {blenderListNum.recallsNum}</Tag>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">第三步：merge > {blenderListNum.dedup_after_num}</Tag>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">第四步：过滤 > {blenderListNum.packager_docs_num}</Tag>
                    <Table  dataSource={packager} columns={getPackager} pagination={false} loading={loading}/>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">被过滤工具过滤的文章命中的规则</Tag>
                    <Table  dataSource={opsToolsFilter}  pagination={false}  columns={getOpsToolsFilter} loading={loading}/>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">第五步：打分 > {blenderListNum.predictitem_num}</Tag>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">第六步：后处理 > {blenderListNum.postprocessor_num}</Tag>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">最终文章展示</Tag>
                    <Table  dataSource={profile} columns={getProfile} pagination={false} loading={loading}/>
                </div>
            </Card>
        </div>
    )
}

export default mircoPloem
