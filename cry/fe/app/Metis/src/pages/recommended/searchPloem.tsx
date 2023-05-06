import React, { FC, useState, useEffect, useMemo } from 'react'
import { useHistory } from "react-router-dom";
import { Card, Button, Form, Select, Input, Table, Tooltip, message } from 'antd'
import './index.less'
import { CopyToClipboard } from 'react-copy-to-clipboard';
const { Option } = Select;
interface Props { }
const layout = {
    labelCol: { span: 8 },
};

function SearchPloem(props: Props) {
    const { } = props
    const [logList, setLogList] = useState<any>([])
    const [actions, setActions] = useState<any>([])
    const [data, setData] = useState<any>([])
    const [socket, setSocket] = useState<any>([])
    const [path, setPath] = useState<string>('ws://logview.ha.in.yidian.com:9100')
    const [haproxy, setHaproxy] = useState<string>('{"basicSetting":{"logType":"haproxy","services":["EblenderAPP"],"count":20},"timeSetting":{"beginTime":1622514139909,"endTime":1622514199909},"filterSetting":{"grep":"123"},"outputSetting":{"format":"json","percent":true}}')
    const [nginx, setNginx] = useState<string>('{"basicSetting":{"logType":"nginx","services":["e_blender_mibrowser_int"],"count":20},"timeSetting":{"beginTime":1622533019774,"endTime":1622533079774},"filterSetting":{},"outputSetting":{"format":"json","percent":true}}')
    const [formRef] = Form.useForm();
    const history = useHistory(); 
    useEffect(() => {
        return componentWillUnmount;
    }, []);
    function componentWillUnmount() {
        socket.onclose = close()
    }
    const onFinish = async () => {
        setData(haproxy)
        setSocket(new WebSocket(path))
        socket.onopen = open()
    }
    const open = async () => {
        let res = await formRef.validateFields()
        let imp_idS = trim(res.imp_id).split('_')
        setActions(imp_idS)
        actions.length > 0 ? message.success("socket连接成功 数据会实时更新 不需多次触发 请稍等...") :  message.error("socket连接失败 请再次请求!")
        if (res.env == "e_blender_mibrowser_int") {
            setData(nginx)
            console.log("socket连接成功" + res.env)
        }
        if ((res.env == "EblenderAPP" || res.env == "e-blender" || res.env == "EblenderMI" || res.env == "EblenderOPPO") && res.channelid == "relevantcards") {
            setData(nginx)
            console.log("socket连接成功" + res.env)
        }
        var param = JSON.parse(data);
        param.timeSetting.beginTime = (Number(actions[1]) - 30000).toString();
        param.timeSetting.endTime = (Number(actions[1]) + 30000).toString();
        param.filterSetting.grep = actions[0];
        if ((res.env == "EblenderAPP" || res.env == "e-blender" || res.env == "EblenderMI" || res.env == "EblenderOPPO") && res.channelid == "relevantcards") {
            param.basicSetting.services[0] = "e_blender_relevant_content";
        } else {
            param.basicSetting.services[0] = res.env;
        }
        send(JSON.stringify(param));
    }
    socket.onmessage = async (msg:any) => {
        let res = await formRef.validateFields()
        if (msg.data.indexOf(res.channelid) != -1) {
            var param = JSON.parse(msg.data)
            param.date = timestampToTime(param.time);
            var server_name;
            if (((res.env == "EblenderAPP" || res.env == "e-blender" || res.env == "EblenderMI" || res.env == "EblenderOPPO") && res.channelid == "relevantcards") || res.env == "e_blender_mibrowser_int") {
                server_name = param['nginx-upstream-addr'];
            } else {
                server_name = param.server_name;
            }
            param.url = 'http://' + server_name + param['http-uri'];
            console.log(param , 'param')
            setLogList((item:any) => [...item , param])
        }
    }
    const send = function (params:any) {
        socket.send(params)
    }
    const close = function () {
        message.info("socket已经关闭")
    }
    const timestampToTime = function (timestamp:any) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
    }
    const trim = (str:any) => {
        str = str.replace(/^(\s|\u00A0)+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }
    const columns = [
        {
            title: '时间',
            dataIndex: 'date',
            width: 250,
            key: 'date',
        },
        {
            title: '跳转',
            width: 200,
            key: 'date',
            render:(value:any , record:any) => {
                return <a onClick={() => history.push({pathname:'/recommended/blenderPloem' , state:{url:value.url}})}>blender问题排查</a>
            }
        },
        {
            title: '请求url',
            width: 500,
            dataIndex: 'url',
            key: 'url',
            render: (value: any, record: any) => {
                return (
                    <div style={{ display: "flex" }}>
                        <Tooltip placement="bottom" title={value} >
                            <div className="ellipsis" style={{ cursor: "pointer" }} >
                                {value.substring(0, 50)}
                            </div>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="SearchPloem-content" >
            <Card bordered={false} style={{ minHeight: 380 }}>
                <Form name="nest-messages" form={formRef} style={{ display: "flex" }}>
                    <Form.Item name='env' label="appId" rules={[{ required: true }]} style={{ paddingLeft: 10 }}>
                        <Select defaultValue=" " style={{ width: 140 }} allowClear>
                            <Option value=" ">请选择</Option>
                            <Option value="EblenderAPP">主端android</Option>
                            <Option value="e-blender">主端ios</Option>
                            <Option value="EblenderMI">主端xiaomi</Option>
                            <Option value="EblenderOPPO">主端oppo</Option>
                            <Option value="e-blender-oppobrowser">oppobrowser</Option>
                            <Option value="e-blender-vivobrowser">vivobrowser</Option>
                            <Option value="e_blender_mibrowser_int">mibrowser</Option>
                            <Option value="e-blender-3rd-small">其他</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name='channelid' label="场景" rules={[{ required: true }]} style={{ paddingLeft: 10 }}>
                        <Select defaultValue=" " style={{ width: 140 }} allowClear>
                            <Option value=" ">请选择</Option>
                            <Option value="usercards">首页推荐流</Option>
                            <Option value="relevantcards">相关推荐</Option>
                            <Option value="channelcards">频道</Option>
                            <Option value="themecards">关注频道</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name='imp_id' label="impid" rules={[{ required: true }]} style={{ paddingLeft: 10 }}>
                        <Input style={{ width: 300 }} placeholder="请输入请求imp_id或者userid_时间戳(毫秒)的形式，例如1201250585_1622786428653" />
                    </Form.Item>
                    <Form.Item style={{ paddingLeft: 10 }}>
                        <Button type="primary" onClick={onFinish}>
                            查询
                        </Button>
                    </Form.Item>
                </Form>
                <Table style={{ padding: 10 }} dataSource={logList || []} columns={columns}  pagination={false} />
            </Card>
        </div>
    )
}

export default SearchPloem
