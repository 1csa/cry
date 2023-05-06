import React, { useState, useEffect, createContext } from 'react';
import { ConnectState, Dispatch, UserModelState } from '@/models/connect';
import { myContextTaskid } from '@/config/app.d';
import { Form, Input, Button, Table, Radio, Divider, Drawer, Modal } from 'antd';
import {message as aliasMessage} from 'antd';
import { PAGE, PAGE_SIZE, PQ_STATUS_CN } from '../../config/constant';
import './index.less';
import PqDetailInfo from '@/components/PqDetail';
import { ColumnProps } from 'antd/es/table'
import { connect } from 'dva';
const FormItem = Form.Item;
interface pqConfigProps {
    form: any,
    dispatch: Dispatch
    user: UserModelState
}
interface pqColumnsProps {
    key: string,
    id: number,
    task_name: string,
    create_auther: string,
    insert_time: number,
    remark: string,
    level: number,
    status: string
}

const pqConfig: React.FC<pqConfigProps> = ({ form, dispatch, user }) => {
    const requestTypeObj = {
        0: 'all',
        1: 'enable',
        2: 'notenable'
    }
    const [defaultParams, setDefaultParams] = useState<{ [propName: string]: any }>({
        page: PAGE,
        page_size: PAGE_SIZE,
        task_id: '',
        task_name: ''
    });
    const [taskid, setTaskid] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [taskStatus, setTaskStatus] = useState<number>(0);
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const { getFieldDecorator, resetFields } = form;
    const [detailType, setDetailType] = useState<string>('edit');

    const [dataSource, setDataSource] = useState<pqColumnsProps[]>([]);
    const [taskTotal, setTaskTotal] = useState<number>(0);

    const columns: ColumnProps<pqColumnsProps>[] = [
        {
            key: 'id',
            title: '任务ID',
            dataIndex: 'id',
            align: 'center',
            width: 100
        },
        {
            key: 'task_name',
            title: '任务名称',
            dataIndex: 'task_name',
            width: 140,
            align: 'center'
        },
        {
            key: 'create_auther',
            title: '创建人',
            dataIndex: 'create_auther',
            width: 140,
            align: 'center'
        },
        {
            key: 'insert_time',
            title: '创建时间',
            dataIndex: 'insert_time',
            align: 'center'
        },
        {
            key: 'remark',
            title: '任务说明',
            dataIndex: 'remark',
            align: 'center'
        },
        {
            key: 'level',
            title: '优先级',
            dataIndex: 'level',
            align: 'center'
        },
        {
            key: 'status',
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            render: (text: string, record: any) => {
                let showText = ~~record.status === 1 ? '启用' : '未启用';
                return <span>{showText}</span>
            }
        },
        {
            title: '操作',
            dataIndex: 'Action',
            key: 'Action',
            align: 'center',
            render: (text: string, record: any) => {
                let startButton = <Button type="link" onClick={() => startTaskEvent(record.id)}>不启用</Button>;
                let editButton = <Button type="link" onClick={() => editTask(record.id)}>编辑</Button>
                let deleteButton = <Button type="link" onClick={() => deleteTask(record)}>删除</Button>
                if (~~record.status === 0) {
                    startButton = <Button type="link" onClick={() => startTaskEvent(record.id)}>启用</Button>
                }
                return <>
                    {startButton}
                    {editButton}
                    {deleteButton}
                </>
            }
        }
    ]
    const startTaskEvent = async (id: number) => {
        const {code, data, message} = await dispatch({
            type: 'pqTaskList/resetTaskStatus',
            payload: {
                'task_id': ~~id
            }
        })
        if (~~code === 0) {
            let index = dataSource.findIndex((item: any) => {
                return item.id == id;
            })
            dataSource[index]['status'] = data['status_to'];
            setDataSource([...dataSource]);
        } else {
            aliasMessage.error(message);
        }
    }
    const deleteTask = (rowData: any) => {
        Modal.confirm({
            title: '确认删除该任务吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                let res = await dispatch({
                    type: 'pqTaskList/deleteTask',
                    payload: {task_id: ~~rowData.id}
                });
                if (res.code === 0) {
                    onRequestGetTaskList();
                } else {
                    Modal.error({
                        title: '错误',
                        content: '删除失败'
                    })
                }
            },
            onCancel: () => {

            }
        })
    }
    const addTask = () => {
        setTaskid('add');
        setDetailType('edit');
        setDetailVisible(!detailVisible);
    }
    const onReset = (e: any) => {
        resetFields(['task_id', 'task_name']);
        onSubmit(e);
    }
    const onSubmit = (e: any) => {
        e.preventDefault();
        handleSearchTaskStatus();
        form.validateFields((err: any, values: any) => {
            if (err) {
                return;
            }
            Object.assign(defaultParams, values, { page: 1 });
            onRequestGetTaskList();
        });
    }
    const onTabsChange = async (e: any) => {
        await setTaskStatus(e.target.value);
        defaultParams['page'] = PAGE;
        let a = e.target.value === 1 ? 1 : e.target.value === 2 ? 0 : '';
        defaultParams['task_status'] = e.target.value === 1 ? 1 : e.target.value === 2 ? 0 : '';
        onRequestGetTaskList();
    }
    useEffect(() => {
        onRequestGetTaskList();
        onGetDetaiSourceList();
    }, [])
    const pageChangeEvent = (page: any, pageSize: any) => {
        defaultParams['page'] = page;
        setDefaultParams({ ...defaultParams });
        onRequestGetTaskList();
    }
    const pagination = {
        defaultCurrent: PAGE,
        pageSize: PAGE_SIZE,
        total: taskTotal,
        current: defaultParams['page'],
        onChange: pageChangeEvent
    }
    const handleSearchTaskStatus = () => {
        if (taskStatus) {
            // 添加状态 
            /**
             * @param task_status
             * @value 1--->启用    0--->未启用
             */
            defaultParams['task_status'] = ~~taskStatus === 1 ? 1 : 0;
        } else {
            delete defaultParams['task_status'];
        }
    }
    const onGetDetaiSourceList = async () => {
        await dispatch({
            type: 'pqTaskList/getSourceList'
        });
    }
    const editTask = async (task_id: number) => {
        setTaskid(task_id);
        setDetailType('update');
        setDetailVisible(!detailVisible);
    }
    const onRequestGetTaskList = async () => {
        setLoading(true);
        let dataParam = JSON.parse(JSON.stringify(defaultParams));
        Object.keys(dataParam).forEach((item: any) => {
            if (dataParam[item] === '') {
                delete dataParam[item];
            }
        });
        const { code, message, data = [] } = await dispatch({
            type: 'pqTaskList/getPqTaskList',
            payload: {
                ...dataParam
            }
        });
        if (~~code === 0 || message === 'success') {
            setDataSource([...(data.tasks || [])]);
            setTaskTotal(data.total);
        } else {
            setDataSource([...[]]);
            setTaskTotal(0);
            aliasMessage.error(`${message}`);
        }
        setLoading(false);
    }
    return (
        <>
            <div className="main-content">
                <Button type="primary" className="newBtn" onClick={addTask}>新建任务</Button>
                <div>
                    <Form layout='inline' onSubmit={onSubmit}>
                        <FormItem label="任务ID">{getFieldDecorator('task_id')(<Input placeholder="输入任务ID" />)}</FormItem>
                        <FormItem label="任务名称">{getFieldDecorator('task_name')(<Input placeholder="输入任务名称" />)}</FormItem>
                        <FormItem><Button type="primary" htmlType="submit">搜索</Button></FormItem>
                        <FormItem><Button type="primary" onClick={onReset}>重置</Button></FormItem>
                    </Form>
                </div>
                <Divider />
                <div style={{ marginBottom: '10px' }}>
                    <span>状态：</span>
                    <Radio.Group onChange={onTabsChange} value={taskStatus}>
                        {
                            PQ_STATUS_CN.map((item: any, index: number) => {
                                return <Radio.Button value={item.value} key={index}>{item.label}</Radio.Button>
                            })
                        }
                    </Radio.Group>
                </div>
                <div>
                    <Table
                        key={dataSource.id}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={pagination}
                        rowKey="id"
                        loading={loading}
                    />
                </div>
                <Drawer
                    title="爬取任务编辑"
                    placement="right"
                    visible={detailVisible}
                    onClose={() => {setDetailVisible(false)}}
                    destroyOnClose={true}
                    width={800}
                    >
                        <PqDetailInfo taskid={taskid} type={detailType} isShow={detailVisible} addTask={addTask} onRequestGetTaskList={() => onRequestGetTaskList()} />
                </Drawer>
            </div>
        </>
    )
}
export default connect(({ user }: ConnectState) => ({
    user
}))(Form.create()(pqConfig));