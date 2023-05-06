import { Button, Form, Icon, Input, message, Popover, Select, Tooltip, Upload } from 'antd';
import React, { useState } from 'react';
import '../index.less'
const FormItem = ({ ArticleSource, form ,kvList,coreTypesList}: any) => {
  const { getFieldDecorator } = form;
  const [articleNum, setArticleNum] = useState<number>();
  const [docIdList, setDocIdList] = useState<any>([]);
  const [fileName, setFileName] = useState<string>('')
  const cutTop = (arr: any) => {
    let newArr = arr.slice(0);
    newArr.shift();
    return newArr;
  };
  // const uploadExcel=()=> {
  //   var _this = this
  //   let file = document.getElementById("channelFile")?.files
  //   const reader = new FileReader();
  //   reader.onload = (evt) => {
  //       const bstr = evt.target?.result;
  //       const wb = XLSX.read(bstr, {type:'binary'});
  //       const wsname = wb.SheetNames[0];
  //       const ws = wb.Sheets[wsname];
  //       let data = XLSX.utils.sheet_to_csv(ws, {header:1});
  //       if(data.split(',').length > 0) {
  //         _this.setState({
  //           userList: data.split(',').length,
  //           list:data.trim()
  //         })
  //           message.info('导入成功')
  //         }else {
  //           message.error('导入失败,格式有误')
  //       }
  //   };
  //   reader.readAsBinaryString(file[0]);
  // }
  const UploadProps = {
    name: 'file',
    accept:".csv",
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        setFileName(info.file.name)
        message.success(`${info.file.name}上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file: any) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = result => {
        let targetNum = result?.target?.result;
        // targetNum是文件内容 type为string
        let array = targetNum?.split(/\s+/);
        setArticleNum(array.length);
        array[0].split(',');
        let index = array[0].split(',').indexOf('docId');
        let arr: any = [];
        array.map((item: any) => {
          arr.push(item.split(',')[index]);
        });
        setDocIdList(cutTop(arr));
      };
    },
    onRemove: (value: any) => {
      setArticleNum(0);
    },
  };
  const content = (
    <>
      <p>文件必须是.csv</p>
      <div className='imgs'></div>
    </>
  );

  return (
    <>
      {ArticleSource === 'kv' && (
        <>
          <Form.Item label="来源类型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('sourceName', {
              initialValue: '',
              rules: [{ required: true, message: '来源类型不能为空' }],
            })(
              <Select>
                { kvList && kvList.map(item => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="数量" style={{ marginBottom: 0 }}>
            {getFieldDecorator('totalNum', {
              initialValue: '',
              rules: [{ required: true, message: '数量不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
        </>
      )}
      {ArticleSource === 'knn' && (
        <>
          <Form.Item label="算法模型" style={{ marginBottom: 0 }}>
            {getFieldDecorator('sourceName', {
              initialValue: [],
              rules: [{ required: true, message: '核心库不能为空' }],
            })(
              <Select>
                  <Option value='graph' >
                    {"graph"}
                  </Option>
                  <Option value='dm2news' >
                    {"dm2news"}
                  </Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="数量" style={{ marginBottom: 0 }}>
            {getFieldDecorator('totalNum', {
              initialValue:'',
              rules: [{ required: true, message: '数量不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
        </>
      )}
      {ArticleSource === 'digPool' && (
        <>
          <Form.Item label="kv池id" style={{ marginBottom: 0 }}>
            {getFieldDecorator('sourceName', {
              initialValue: '',
              rules: [{ required: true, message: 'kv池id不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
          <Form.Item label="数量" style={{ marginBottom: 0 }}>
            {getFieldDecorator('totalNum', {
              initialValue: '',
              rules: [{ required: true, message: '数量不能为空' }],
            })(<Input></Input>)}
          </Form.Item>
        </>
      )}
      {ArticleSource === 'custom' && (
        <>
          <Form.Item label="源名称" style={{ marginBottom: 0 }}>
            {/* {getFieldDecorator('docIds', {
              initialValue:docIdList ,
            })( */}
            <Upload {...UploadProps}>
              <Button icon={'upload'}>点击上传</Button>
              <Popover content={content}>
               <Icon type="question-circle-o" />
              </Popover>
            </Upload>
            {/* )} */}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            {getFieldDecorator('sourceName', {
              initialValue:fileName ,
            })}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            {getFieldDecorator('docIds', {
              initialValue:docIdList ,
            })}
          </Form.Item>
          <Form.Item label="数量" style={{ marginBottom: 0 }}>
            {getFieldDecorator('totalNum', {
              initialValue:articleNum? articleNum-1:0,
            })(<Input></Input>)}
          </Form.Item>
        </>
      )}
    </>
  );
};
export default FormItem;
