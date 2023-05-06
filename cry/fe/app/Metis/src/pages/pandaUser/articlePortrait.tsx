import React, { FC, useState, useEffect } from 'react'
import ReactToJson from 'react-json-view'
import { Card, message, BackTop, Input, Button, Checkbox, Form } from 'antd';
import axios from 'axios'
import '../../pages/index.less'
import request from '@/utils/request';

interface Props {

}

const ArticlePortrait = (props: Props) => {
    const { } = props
    const [list, setList] = useState<any>('')
    const onFinish = async (values: any) => {
        let res = await request.get(`/api/proxy/http://doc-feature-server.int.yidian-inc.com/service/feature?docids=${values.docId}&service=test`)
        if (res.code == 0) {
            setList(res)
            message.success("查询成功")
        } else {
            message.info("查询失败")
        }
    };
    return (
        <>
            <div className="Port-content" >
                <Card bordered={false} style={{ minHeight: 380}}>
                        <BackTop />
                        <Form
                            onFinish={onFinish}
                            style={{ display: "flex", padding: 15 }}
                        >
                            <Form.Item
                                label="docId"
                                name="docId"
                                rules={[{ required: true, message: 'docId不能为空' }]}
                            >
                                <Input style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" >确定</Button>
                            </Form.Item>
                        </Form>
                        <div style={{ paddingLeft: 15 }}>
                            <ReactToJson
                                src={list || []}
                                name={false}
                                iconStyle='圆圈'
                                indentWidth={4}
                            />
                        </div>
                </Card>
            </div>
        </>
    )
}



export default ArticlePortrait
