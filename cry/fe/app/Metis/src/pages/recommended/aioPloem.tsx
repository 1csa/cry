import React, {FC , useState , useEffect} from 'react'
import { Card, Input, Form ,Button , Table , Tooltip , message , Tag , Switch , Modal} from 'antd';
import './index.less'
import { getTaskAio} from '../../services/recommended'
const { TextArea } = Input;
interface Props {
    location: { state: any }
}

function aioPloem(props: Props) {
    const { } = props
    const [flag , setFlag] = useState<any>(undefined)
    const [loading , setLoading] = useState<any>(false)
    const [filters , setFilter] = useState<any>([])
    const [recalls , setRecalls] = useState<any>([])
    const [profile , setProfile] = useState<any>([])
    const [blenderListNum , setBlenderListNum] = useState<any>({
        totalNum : 0,
        recallsNum : 0,
        startTime : Date.parse(new Date())/1000
    })
    const [formRef] = Form.useForm();
    useEffect(() => {
        let blender = props.location.state ? props.location.state.url : null
        blender == null ? null : formRef.setFieldsValue({ URL: blender })
    }, [])
    const onFinish = async () => {
        let res = await formRef.validateFields()
        handTaskList(res)
    }
    const handTaskList = async(data:any) => {
        setLoading(true)
        let res = await getTaskAio({params:{url:data.URL.trim() , _t:blenderListNum.startTime}})
        if(res?.code == 0) {
            //列表
            setRecalls(res.result[0].recalls)
            setFilter(res.result[0].preprocessor)
            setProfile(res.result[0].profile)
            //数值
            setBlenderListNum((item: any) => ({
                ...item,
                totalNum :res.result[0].recall_num,
                recallsNum : res.result[0].preprocessor_num,
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
        // {
        //     title: 'url',
        //     dataIndex: 'url',
        //     width: 150,
        //     key: 'id',
        //     render: (value: any, record: any) => {
        //         return (
        //             <div style={{display:"flex"}} key={value.url}>
        //                 <Tooltip placement="bottom" title={value} >
        //                     <a className="ellipsis" style={{ cursor: "pointer" }} >
        //                         {value.substring(0, 20)}
        //                     </a>
        //                 </Tooltip>
        //             </div>
        //         );
        //     },
        // },
        {
            title: '文章列表',
            width: 150,
            dataIndex: 'docs',
            key: 'id',
            render:(value:any , record:any) => {
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked , value)}/> : "无"
            }
        },
    ];
    const getFilters = [
        {
            title: '过滤器',
            dataIndex: 'name',
            width: 150,
            key: 'id',
        },
        {
            title: '被过滤文章数量',
            width: 150,
            dataIndex: 'size',
            key: 'id',
        },
        {
            title: '被过滤文章',
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
                let arr = value.map( (item:any) => {
                    return item.docid
                })
                return record.docs ? <Switch size="small" checked={flag} onClick={(checked) => totalSwitch(checked , arr)}/> : "无"
            }
        },
    ];
    return (
        <div className="BlenderPloem-content" >
            <Card bordered={false} style={{ minHeight: 380 }}>
            <h4 style={{ paddingLeft: 10 }}>aio问题排查</h4>
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
                    <Table  dataSource={recalls} columns={getRecalls} pagination={false} loading={loading}/>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">第二步：过滤 > {blenderListNum.recallsNum}</Tag>
                    <Table  dataSource={filters} columns={getFilters} pagination={false} loading={loading}/>
                </div>
                <div style={{padding:10}}>
                    <Tag style={{fontSize:14 , marginBottom:10}} color="cyan">最终文章展示</Tag>
                    <Table  dataSource={profile} columns={getProfile} pagination={false} loading={loading}/>
                </div>
            </Card>
        </div>
    )
}

export default aioPloem
