import React, { useCallback } from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from "antd/lib/form/Form";

const FormItem = Form.Item;
interface formParamConfig {
    source_id: string | number
    source_sign: string | number
    source_label: string | number
}
interface SourceDetailConfig extends FormComponentProps {
    form: any
}

const SourceDetail: React.ForwardRefRenderFunction<{}, SourceDetailConfig> = (props, ref: any) => {
    const { getFieldDecorator, setFieldsValue } = props.form;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18}
    };
    return (
        <>
            <Form {...formItemLayout}>
                <FormItem label="source_label">
                    {
                        getFieldDecorator('source_label', {
                            rules: [{ required: true, message: 'source_label必填' }]
                        })(<Input />)
                    }
                </FormItem>
                <FormItem label="source_sign">
                    {
                        getFieldDecorator('source_sign', {
                            rules: [{ required: true, message: 'source_sign必填' }]
                        })(<Input />)
                    }
                </FormItem>
                <FormItem label="source_name">
                    {
                        getFieldDecorator('source_name', {
                            rules: [{ required: true, message: 'source_name必填' }]
                        })(<Input />)
                    }
                </FormItem>
            </Form>
        </>
    )
}
export default Form.create<SourceDetailConfig>()(SourceDetail);