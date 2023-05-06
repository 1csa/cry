import React, { FC, useState, useEffect } from 'react';
import {
  message,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Radio,
  Modal,
  Tooltip,
  Icon,
  InputNumber,
  Checkbox,
} from 'antd';
import request from '@/utils/request';
import axios from 'axios';
import XLSX from 'xlsx';
import {
  FormItemLayout,
  TailFormItemLayout,
  ruleformOptionList,
  LogInfo,
  newsFieldReferenceList,
  FilterEscape,
} from '@/config/constant';
import { saveKibana, saveStaticLog } from '@/utils/log';
import { fieldReference } from '@/utils/rule_level';
import { exportIdData } from '@/utils/export_data';

interface AddCoverFormProps {
  form: {
    getFieldDecorator: any;
    validateFieldsAndScroll: any;
    resetFields: any;
    setFieldsValue: any;
    getFieldValue: any;
  };
  adddrawervisible: boolean;
  setAdddrawervisible?: (param: string) => void;
  setResult?: (param: Array<any>) => void;
  result: Array<any>;
  categoryList: Array<any>;
  defaultform: Defaultform;
  threshold: Object;
  isDev: boolean;
}

interface FormOptionList {
  channelList: Array<string>;
  new_sourcelevel: Array<string>;
  topview_quality_tags: Array<string>;
  wemediaType: Array<object>;
  vlevel: Array<string>;
  yd_watery: Object;
}

interface Defaultform {
  _id: any;
  yd_porny: number;
  yd_sexy: number;
  name: String;
  desc: String;
  security: Array<any>;
  channelList: any;
  logic: String;
  ncat_class: String;
  nsubcat_class: String;
  dirtyTag: Boolean;
  vlevel: String | Array<any>;
  new_sourcelevel: String | Array<any>;
  batch: Number;
  blur: Number;
  category: String | Array<any>;
  unclarity: Number;
  dirty: Number;
  bait: Number;
  sick: Number;
  spam: Number;
  c_imgs_dirty: Number;
  c_imgs_sexy: Number;
  c_imgs_disgusting: Number;
  female_sexy: Number;
  male_sexy: Number;
  intimacy: Number;
  yd_general_sexy: Number;
  yd_disgusting: Number;
  yd_intimacy: Number;
  editorProtect: Boolean;
  wemediaType: Array<any>;
  protect_source: Array<any>;
  src: Array<any>;
  wm_ids: Array<any>;
  sex: String;
  location: String;
  lastmodified: Number;
  ruleId: String;
  distributionTime: Number;
  titleKeywords: String;
  title_quality: Array<any>;
  noImage: Boolean;
  review_protect: Boolean;
  enable_derives: Boolean;
  yd_watery: any;
  filter_escape: Array<string>;
  yd_porny_animal: Number;
  topview_quality_tags: Array<any>;
}

const formOptionList: FormOptionList = ruleformOptionList;
const fieldReferenceList = newsFieldReferenceList;

const AddCoverForm: FC<AddCoverFormProps> = (props: AddCoverFormProps) => {
  const [saving, setSaving] = useState<Boolean>(false);
  const [filterNewsList, setFilterNewsList] = useState([]);
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
    resetFields,
    getFieldValue,
    setFieldsValue,
  } = props.form;
  const {
    adddrawervisible,
    setAdddrawervisible,
    setResult,
    result,
    defaultform,
    threshold,
    categoryList,
    isDev,
  } = props;
  // console.log(defaultform , 'defaultform')
  useEffect(() => {
    getAllNewsRuleList();
  }, []);
  // 用来获取数据库中所有的图文过滤规则
  const getAllNewsRuleList = async () => {
    //因需求着急 暂时写到1000
    const res = await request.get(`/api/filtertools/getAllNewsRules?isdev=${isDev}&pageSize=1000`);
    if (res.code === 0) {
      setFilterNewsList(res.result.data);
    }
  };
  const isNewsNameExist = (name: any) => {
    return filterNewsList.find(item => item.name === name);
  };
  const submitAction = async values => {
    values.yd_watery = {
      type: [
        Number(values.yd_watery.shui),
        Number(values.yd_watery.wen),
        Number(values.yd_watery.miss),
        Number(values.yd_watery.incomplete),
        Number(values.yd_watery.TooMuch),
        Number(values.yd_watery.Feed),
      ],
      score: [
        Number(values.yd_watery.chunNum),
        Number(values.yd_watery.wenNum),
        Number(values.yd_watery.Missing),
        Number(values.yd_watery.content),
        Number(values.yd_watery.TheText),
        Number(values.yd_watery.lineFeed),
      ],
    };
    if (eval(values.yd_watery.score.join('+')) == 0) {
      values.yd_watery = {};
    }
    values.timeRange = []; // 时间段废弃
    values.sex = '无'; // 涉性废弃
    values.channelList.content = values.channelList.content.replace(/\s*/g, '').split(',') || [
      'best',
    ];
    values.src = defaultform.src.length > 0 ? defaultform.src.split(',') : [];
    values.wm_ids = values.wm_ids.length > 0 ? values.wm_ids.split(',') : [];
    values.protect_source =
      values.protect_source.length > 0 ? values.protect_source.split(',') : [];
    const act = 'save',
      value = values;
    const { log_domain, log_secret, news_rule_key } = LogInfo;
    value.location = window.location.href;
    value.debug = isDev ? 1 : 0;
    const userName = localStorage.getItem('userName');
    console.log(values, '=======>values');

    if (values.distributionTime === '') {
      // 可分发时长不填则不存
      delete values.distributionTime;
    }
    if (typeof values.category === 'string') {
      values.category = values.category.length > 0 ? values.category.split(',') : [];
    }
    if (values.ruleId === undefined || values.ruleId === -1) {
      if (isNewsNameExist(values.name) === undefined) {
        const ret = await request.post(`/api/filtertools/addNewsRule?isdev=${isDev}`, {
          data: { ...values, userName },
        });
        if (ret.code === 0) {
          let newresult: any[] = [];
          newresult = newresult.concat(result);
          newresult.unshift(ret.result);
          setResult(newresult);
          message.success('添加成功');
          closeDrawer();
          saveStaticLog(log_domain, log_secret, [
            {
              action: act,
              key: news_rule_key,
              value: value ? JSON.stringify(value) : '',
              fromid: '',
              comment: '',
            },
          ]);
          saveKibana('save-add', news_rule_key, value);
        } else {
          message.error(ret.message);
        }
      } else {
        message.warning('图文规则名字重复，请更改！！！！！！');
      }
    } else {
      values._id = defaultform._id;
      // console.log(values);
      const ret2 = await request.post(`/api/filtertools/updateNewsRule?isdev=${isDev}`, {
        data: { ...values, userName },
      });
      if (ret2.code === 0) {
        let newresult: any[] = [];
        newresult = newresult.concat(result);
        newresult.map((item, index) => {
          if (item.ruleId === values.ruleId) {
            newresult[index] = values;
          }
        });
        setResult(newresult);
        message.success('保存成功');
        // window.location.reload();
        closeDrawer();
        saveStaticLog(log_domain, log_secret, [
          {
            action: act,
            key: news_rule_key,
            value: value ? JSON.stringify(value) : '',
            fromid: '',
            comment: '',
          },
        ]);
        saveKibana('save-edit', news_rule_key, value);
      } else {
        message.error(ret2.message);
      }
    }
    setSaving(false);
  };
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        setSaving(true);
        Modal.confirm({
          title: 'Confirm',
          content: '确定保存吗？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            submitAction(values);
            console.log(values);
          },
          onCancel() {
            setSaving(false);
          },
        });
      }
    });
  };
  const bucketPrefixSelector = getFieldDecorator('yd_watery.shui', {
    initialValue: defaultform.yd_watery
      ? Object.keys(defaultform.yd_watery).length == 0
        ? '1'
        : defaultform.yd_watery.type[0] + ''
      : '1',
  })(
    <Select style={{ width: 110 }} showArrow={false}>
      <Select.Option value="1">纯外文</Select.Option>
    </Select>,
  );

  const bucketPrefixSelectors = getFieldDecorator('yd_watery.wen', {
    initialValue: defaultform.yd_watery
      ? Object.keys(defaultform.yd_watery).length == 0
        ? '2'
        : defaultform.yd_watery.type[1] + ''
      : '2',
  })(
    <Select style={{ width: 110 }} showArrow={false}>
      <Select.Option value="2">文字缺失</Select.Option>
    </Select>,
  );

  const bucketPrefixSelectorsMissing = getFieldDecorator('yd_watery.miss', {
    initialValue: defaultform.yd_watery
      ? Object.keys(defaultform.yd_watery).length == 0
        ? '3'
        : defaultform.yd_watery.type[2] + ''
      : '3',
  })(
    <Select style={{ width: 110 }} showArrow={false}>
      <Select.Option value="3">标点缺失</Select.Option>
    </Select>,
  );

  const bucketPrefixSelectorsContent = getFieldDecorator('yd_watery.incomplete', {
    initialValue: defaultform.yd_watery
      ? Object.keys(defaultform.yd_watery).length == 0
        ? '4'
        : defaultform.yd_watery.type[3] + ''
      : '4',
  })(
    <Select style={{ width: 110 }} showArrow={false}>
      <Select.Option value="4">内容不完整</Select.Option>
    </Select>,
  );
  const bucketPrefixSelectorsTheText = getFieldDecorator('yd_watery.TooMuch', {
    initialValue: defaultform.yd_watery
      ? Object.keys(defaultform.yd_watery).length == 0
        ? '5'
        : defaultform.yd_watery.type[4] + ''
      : '5',
  })(
    <Select style={{ width: 110 }} showArrow={false}>
      <Select.Option value="5">文字占比过大</Select.Option>
    </Select>,
  );
  const bucketPrefixSelectorslineFeed = getFieldDecorator('yd_watery.Feed', {
    initialValue: defaultform.yd_watery
      ? Object.keys(defaultform.yd_watery).length == 0
        ? '6'
        : defaultform.yd_watery.type[5] + ''
      : '6',
  })(
    <Select style={{ width: 110 }} showArrow={false}>
      <Select.Option value="6">断行</Select.Option>
    </Select>,
  );
  const closeDrawer = () => {
    setSaving(false);
    setAdddrawervisible(false);
    resetFields();
  };

  // 自媒体ID数据导入
  const importExcel = (elementId: string) => {
    let file = document?.getElementById(elementId)?.files;
    const reader = new FileReader();
    reader.readAsBinaryString(file[0]);
    reader.onload = (evt: any) => {
      const bstr = evt.target.result;
      const WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsName = WorkBook.SheetNames[0];
      const ws = WorkBook.Sheets[wsName];
      let data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      if (data.split(',').length > 0) {
        setFieldsValue(
          elementId === 'protectFile'
            ? {
                protect_source: data.substring(0, data.lastIndexOf(',')).replace(/\s*/g, ''),
              }
            : {
                wm_ids: data.substring(0, data.lastIndexOf(',')).replace(/\s*/g, ''),
              },
        );
        message.success('导入成功');
      } else {
        message.error('导入失败,格式有误');
      }
    };
    document.getElementById(elementId).value = '';
  };

  const exportExcel = (fileName: string, columnHeader: string, columnName: string) => {
    let column = getFieldValue(columnName);
    exportIdData('图文' + fileName, columnHeader, column);
  };
  return (
    <>
      <Drawer
        title="添加数据"
        placement="right"
        width="750"
        closable={true}
        onClose={closeDrawer}
        visible={adddrawervisible}
      >
        <Form
          {...FormItemLayout}
          onSubmit={handleSubmit}
          style={{
            overflow: 'hidden',
          }}
        >
          {defaultform.ruleId && defaultform.ruleId !== '-1' && (
            <Form.Item label="编号">
              {getFieldDecorator('ruleId', {
                initialValue: defaultform.ruleId || '-1',
              })(<Input disabled />)}
            </Form.Item>
          )}
          <Form.Item label="过滤规则">
            {getFieldDecorator('name', {
              initialValue: defaultform.name || '',
            })(
              defaultform.name ? (
                <Input disabled placeholder="请填写规则名称" />
              ) : (
                <Input placeholder="请填写规则名称" />
              ),
            )}
          </Form.Item>
          <Form.Item label="说明">
            {getFieldDecorator('desc', {
              initialValue: defaultform.desc || '',
            })(<Input.TextArea placeholder="请填写规则简要说明" style={{ height: 50 }} />)}
          </Form.Item>
          <Form.Item label="逻辑">
            {getFieldDecorator('logic', {
              initialValue: defaultform.logic || 'or',
            })(
              <Select>
                <Select.Option value="or">or</Select.Option>
                <Select.Option value="and">and</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="涉领导人">
            {getFieldDecorator('security', {
              initialValue: defaultform.security || '',
            })(
              <Select placeholder="请涉领导人级别" mode="multiple">
                {[1, 2, 3, 4, 5, 6, 7].map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item
            label={
              <span>
                频道(黑/白)名单&nbsp;
                <Tooltip title="白名单：过滤逻辑在这些频道生效；黑名单：过滤逻辑在这些频道不生效；">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('channelList.type', {
              initialValue: defaultform.channelList.type || 'white_list',
            })(
              <Radio.Group>
                {formOptionList.channelList.map((item: any) => (
                  <Radio value={item} key={item}>
                    {item}
                  </Radio>
                ))}
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item
            label={
              <span>
                具体频道(黑/白)名单&nbsp;
                <Tooltip title="推荐:best、要闻:hot、视频频道:video，其他频道填fromid">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('channelList.content', {
              initialValue: defaultform.channelList.content || 'best',
              rules: [
                {
                  required: true,
                  message: '频道(黑/白)名单不能为空!',
                  whitespace: true,
                },
              ],
            })(<Input.TextArea style={{ height: 80 }} allowClear />)}
          </Form.Item>
          <Form.Item label="低俗/重口味标签">
            {getFieldDecorator('dirtyTag', {
              initialValue: defaultform.dirtyTag,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="是否过滤无图内容">
            {getFieldDecorator('noImage', {
              initialValue: defaultform.noImage,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {/* <Form.Item label="低俗">
            {getFieldDecorator('dirty', {
              initialValue: defaultform.dirty || '无',
            })(
              <Select>
                {threshold.dirty &&
                  threshold.dirty.map(item => <Select.Option value={item}>{item}</Select.Option>)}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="标题党">
            {getFieldDecorator('bait', {
              initialValue: defaultform.bait || '无',
            })(
              <Select>
                {threshold.bait &&
                  threshold.bait.map(item => <Select.Option value={item}>{item}</Select.Option>)}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="软文">
            {getFieldDecorator('spam', {
              initialValue: defaultform.spam || '无',
            })(
              <Select>
                {threshold.spam &&
                  threshold.spam.map(item => <Select.Option value={item}>{item}</Select.Option>)}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="重口味">
            {getFieldDecorator('sick', {
              initialValue: defaultform.sick || '无',
            })(
              <Select>
                {threshold.sick &&
                  threshold.sick.map(item => <Select.Option value={item}>{item}</Select.Option>)}
              </Select>,
            )}
          </Form.Item> */}
          <Form.Item label="类别">
            {getFieldDecorator('category', {
              initialValue: defaultform.category || '',
            })(
              // <Select
              //   mode="multiple"
              //   showSearch
              //   allowClear
              //   placeholder="请选择大类"
              // >
              //   {categoryList.map(item => <Select.Option value={item}>{item}</Select.Option>)}
              // </Select>
              <Input.TextArea style={{ height: 50 }} placeholder="请填写大类" />,
            )}
          </Form.Item>
          <Form.Item label="新一级分类">
            {getFieldDecorator('ncat_class', {
              initialValue: defaultform.ncat_class || '',
            })(
              <Input.TextArea
                style={{ height: 50 }}
                placeholder="请填写新一级分类，用英文逗号分隔"
              />,
            )}
          </Form.Item>
          <Form.Item label="新二级分类">
            {getFieldDecorator('nsubcat_class', {
              initialValue: defaultform.nsubcat_class || '',
            })(
              <Input.TextArea
                style={{ height: 50 }}
                placeholder="请填写新二级分类，用英文逗号分隔"
              />,
            )}
          </Form.Item>
          <Form.Item
            label={
              <span>
                标题关键词&nbsp;
                <Tooltip title="支持只对单个词过滤，或者多个词组合过滤，词/词组之间用英文逗号分隔；如果是词组，则多个词之间用英文竖线“|”分隔；例：填写“汽车,摩托”，会过滤①标题含“汽车”②标题含“摩托”的文章；填写“汽车,2019|汽车行业”，会过滤①标题含有“汽车”的文章，②标题含有“2019”并且含有“汽车行业“的文章">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('titleKeywords', {
              initialValue: defaultform.titleKeywords || '',
            })(
              <Input.TextArea
                style={{ height: 80 }}
                placeholder="填写关键词请遵从提示中的添加方式"
              />,
            )}
          </Form.Item>
          <Form.Item label="图文标题低质" className="newsQuality">
            {getFieldDecorator('title_quality', {
              initialValue: defaultform.title_quality || [],
            })(
              <Select mode="multiple" showSearch allowClear placeholder="请选择图文标题低质">
                {formOptionList.videoType.map(item => (
                  <Select.Option value={item.value} key={item.key}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          {/* <Form.Item label="源评级">
            {getFieldDecorator('authority', {
              initialValue: defaultform.authority,
            })(<InputNumber min={-1} />)}
          </Form.Item> */}
          <span style={{ paddingLeft: '16%', fontWeight: 500 }}>
            水文&nbsp;
            <Tooltip title="1:纯外文 , 2:文字缺失 ， 3:标点缺失 , 4:内容不完整 , 5:文字占比过大 , 6:断行 0-1小数，其他数字无效">
              <Icon type="question-circle-o" />
            </Tooltip>
            &nbsp;:
          </span>
          <div style={{ paddingLeft: '25%', width: '100%' }}>
            <Form.Item>
              {getFieldDecorator('yd_watery.chunNum', {
                initialValue: defaultform.yd_watery
                  ? Object.keys(defaultform.yd_watery).length == 0
                    ? 0
                    : defaultform.yd_watery.score[0]
                  : 0,
                // initialValue: defaultform.yd_watery  ?  defaultform.yd_watery.score[0] : 0,
              })(<Input addonBefore={bucketPrefixSelector} style={{ width: '135%' }} allowClear />)}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('yd_watery.wenNum', {
                initialValue: defaultform.yd_watery
                  ? Object.keys(defaultform.yd_watery).length == 0
                    ? 0
                    : defaultform.yd_watery.score[1]
                  : 0,
                // initialValue: defaultform.yd_watery  ?  defaultform.yd_watery.score[1] : 0,
              })(
                <Input addonBefore={bucketPrefixSelectors} style={{ width: '135%' }} allowClear />,
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('yd_watery.Missing', {
                initialValue: defaultform.yd_watery
                  ? Object.keys(defaultform.yd_watery).length == 0
                    ? 0
                    : defaultform.yd_watery.score[2]
                  : 0,
                // initialValue: defaultform.yd_watery  ?  defaultform.yd_watery.score[2] : 0,
              })(
                <Input
                  addonBefore={bucketPrefixSelectorsMissing}
                  style={{ width: '135%' }}
                  allowClear
                />,
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('yd_watery.content', {
                initialValue: defaultform.yd_watery
                  ? Object.keys(defaultform.yd_watery).length == 0
                    ? 0
                    : defaultform.yd_watery.score[3]
                  : 0,
                // initialValue: defaultform.yd_watery  ?  defaultform.yd_watery.score[2] : 0,
              })(
                <Input
                  addonBefore={bucketPrefixSelectorsContent}
                  style={{ width: '135%' }}
                  allowClear
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('yd_watery.TheText', {
                initialValue: defaultform.yd_watery
                  ? Object.keys(defaultform.yd_watery).length == 0
                    ? 0
                    : defaultform.yd_watery.score[4]
                  : 0,
                // initialValue: defaultform.yd_watery  ?  defaultform.yd_watery.score[2] : 0,
              })(
                <Input
                  addonBefore={bucketPrefixSelectorsTheText}
                  style={{ width: '135%' }}
                  allowClear
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('yd_watery.lineFeed', {
                initialValue: defaultform.yd_watery
                  ? Object.keys(defaultform.yd_watery).length == 0
                    ? 0
                    : defaultform.yd_watery.score[5]
                  : 0,
                // initialValue: defaultform.yd_watery  ?  defaultform.yd_watery.score[2] : 0,
              })(
                <Input
                  addonBefore={bucketPrefixSelectorslineFeed}
                  style={{ width: '135%' }}
                  allowClear
                />,
              )}
            </Form.Item>
          </div>
          <Form.Item label="自媒体等级">
            {getFieldDecorator('new_sourcelevel', {
              initialValue: defaultform.new_sourcelevel,
            })(
              <Select mode="multiple" placeholder="请选择自媒体等级">
                {formOptionList.new_sourcelevel.map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item
            label={
              <span>
                控制刷数&nbsp;
                <Tooltip title="输入大于等于 1 的整数 n，代表在前 n 刷过滤；输入 0，代表在所有刷过滤；输入其他数字，该条规则不生效">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('batch', {
              initialValue: defaultform.batch,
            })(<InputNumber min={-1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                标题低俗&nbsp;
                <Tooltip title="0-1小数，其他数字无效，过滤dirty>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('dirty', {
              initialValue: fieldReference('dirty', defaultform.dirty, fieldReferenceList),
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                标题党&nbsp;
                <Tooltip title="0-2小数，其他数字无效，过滤bait>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('bait', {
              initialValue: fieldReference('bait', defaultform.bait, fieldReferenceList),
            })(<InputNumber min={0} max={2} step={0.1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                软文&nbsp;
                <Tooltip title="0-2小数，其他数字无效，过滤sc_spam>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('spam', {
              initialValue: fieldReference('spam', defaultform.spam, fieldReferenceList),
            })(<InputNumber min={0} max={2} step={0.1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                标题重口&nbsp;
                <Tooltip title="0-1小数，其他数字无效，过滤sick>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('sick', {
              initialValue: fieldReference('sick', defaultform.sick, fieldReferenceList),
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          {/*<Form.Item*/}
          {/*  label={*/}
          {/*    <span>*/}
          {/*      低俗图&nbsp;*/}
          {/*      <Tooltip title="0-1小数，过滤sc_bd_imgs_porny>=阈值的内容">*/}
          {/*        <Icon type="question-circle-o" />*/}
          {/*      </Tooltip>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  {getFieldDecorator('c_imgs_dirty', {*/}
          {/*    initialValue: defaultform.c_imgs_dirty || 0,*/}
          {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  label={*/}
          {/*    <span>*/}
          {/*      涉性图&nbsp;*/}
          {/*      <Tooltip title="0-1小数，过滤sc_bd_imgs_sexy>=阈值的内容">*/}
          {/*        <Icon type="question-circle-o" />*/}
          {/*      </Tooltip>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  {getFieldDecorator('c_imgs_sexy', {*/}
          {/*    initialValue: defaultform.c_imgs_sexy || 0,*/}
          {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  label={*/}
          {/*    <span>*/}
          {/*      恶心图&nbsp;*/}
          {/*      <Tooltip title="0-1小数，过滤sc_imgs_baidu_disgusting>=阈值的内容">*/}
          {/*        <Icon type="question-circle-o" />*/}
          {/*      </Tooltip>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  {getFieldDecorator('c_imgs_disgusting', {*/}
          {/*    initialValue: defaultform.c_imgs_disgusting || 0,*/}
          {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
          {/*</Form.Item>*/}
          <Form.Item
            label={
              <span>
                一点模糊图&nbsp;
                <Tooltip title="0-1小数，过滤imgs_qltys.blur>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('blur', {
              initialValue: defaultform.blur || 0,
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          {/*<Form.Item*/}
          {/*  label={*/}
          {/*    <span>*/}
          {/*      百度模糊图&nbsp;*/}
          {/*      <Tooltip title="0-1小数，过滤imgs_qltys.unclarity>=阈值的内容">*/}
          {/*        <Icon type="question-circle-o" />*/}
          {/*      </Tooltip>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  {getFieldDecorator('unclarity', {*/}
          {/*    initialValue: defaultform.unclarity || 0,*/}
          {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  label={*/}
          {/*    <span>*/}
          {/*      女性性感图&nbsp;*/}
          {/*      <Tooltip title="0-1小数，过滤sc_bd_imgs_female_sexy>=阈值的内容">*/}
          {/*        <Icon type="question-circle-o" />*/}
          {/*      </Tooltip>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  {getFieldDecorator('female_sexy', {*/}
          {/*    initialValue: defaultform.female_sexy || 0,*/}
          {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  label={*/}
          {/*    <span>*/}
          {/*      男性性感图&nbsp;*/}
          {/*      <Tooltip title="0-1小数，过滤sc_bd_imgs_male_sexy>=阈值的内容">*/}
          {/*        <Icon type="question-circle-o" />*/}
          {/*      </Tooltip>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  {getFieldDecorator('male_sexy', {*/}
          {/*    initialValue: defaultform.male_sexy || 0,*/}
          {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  label={*/}
          {/*    <span>*/}
          {/*      亲密行为图&nbsp;*/}
          {/*      <Tooltip title="0-1小数，过滤sc_bd_imgs_intimacy>=阈值的内容">*/}
          {/*        <Icon type="question-circle-o" />*/}
          {/*      </Tooltip>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  {getFieldDecorator('intimacy', {*/}
          {/*    initialValue: defaultform.intimacy || 0,*/}
          {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
          {/*</Form.Item>*/}
          <Form.Item
            label={
              <span>
                自研色情图&nbsp;
                <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.yd_porny>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('yd_porny', {
              initialValue: defaultform.yd_porny || 0,
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                自研低俗图&nbsp;
                <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.yd_sexy>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('yd_sexy', {
              initialValue: defaultform.yd_sexy || 0,
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                自研一般性感图&nbsp;
                <Tooltip title="0-1小数，过滤yd_general_sexy>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('yd_general_sexy', {
              initialValue: defaultform.yd_general_sexy || 0,
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                自研重口味图&nbsp;
                <Tooltip title="0-1小数，过滤yd_disgusting>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('yd_disgusting', {
              initialValue: defaultform.yd_disgusting || 0,
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                自研亲密行为图&nbsp;
                <Tooltip title="0-1小数，过滤yd_intimacy>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('yd_intimacy', {
              initialValue: defaultform.yd_intimacy || 0,
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                自研动物交配模型&nbsp;
                <Tooltip title="0-1小数，过滤yd_porny_animal>=阈值的内容">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('yd_porny_animal', {
              initialValue: defaultform.yd_porny_animal || 0,
            })(<InputNumber min={0} max={1} step={0.1} />)}
          </Form.Item>
          <Form.Item label="是否保护编辑操作内容">
            {getFieldDecorator('editorProtect', {
              initialValue: defaultform.editorProtect,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item
            label={
              <span>
                人审内容保护&nbsp;
                <Tooltip title="质量召回中审核无问题的内容，可选择是进行保护">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('review_protect', {
              initialValue: defaultform.review_protect,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item
            label={
              <span>
                历史内容映射&nbsp;
                <Tooltip title="选“是”则走历史内容映射，选“否”则不走历史内容映射">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('enable_derives', {
              initialValue: defaultform.enable_derives,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="过滤的自媒体类型">
            {getFieldDecorator('wemediaType', {
              initialValue: defaultform.wemediaType || [],
            })(
              <Select mode="multiple" showSearch allowClear placeholder="请选择自媒体类型">
                {formOptionList.wemediaType.map((item: any) => (
                  <Select.Option value={item.value} key={item.value}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="审核内容过滤">
            {getFieldDecorator('topview_quality_tags', {
              initialValue: defaultform.topview_quality_tags || [],
            })(<Checkbox.Group options={formOptionList.topview_quality_tags}></Checkbox.Group>)}
          </Form.Item>
          <Form.Item label="是否豁免文章">
            {getFieldDecorator('filter_escape', {
              initialValue: defaultform.filter_escape || [],
            })(
              <Select mode="multiple" showSearch allowClear placeholder="请选择是否豁免文章">
                {FilterEscape.map((item: any) => (
                  <Select.Option value={item.key} key={item.key}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="白名单账号">
            {getFieldDecorator('protect_source', {
              initialValue: defaultform.protect_source || '',
            })(
              <Input.TextArea
                style={{ height: 80 }}
                placeholder="请填写media_id，用英文逗号分隔"
              />,
            )}
            <Button icon="plus" style={{ marginLeft: 10 }}>
              txt导入
              <input
                type="file"
                className="fileInput"
                onChange={() => {
                  importExcel('protectFile');
                }}
                id="protectFile"
                accept=".xls, .xlsx, .txt"
                style={{
                  opacity: '0',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                }}
              />
            </Button>
            <Button
              icon="cloud-download"
              style={{ marginLeft: 10 }}
              onClick={() => {
                exportExcel('白名单账号表', '白名单账号', 'protect_source');
              }}
            >
              导出数据
            </Button>
            <Tooltip title="导出数据如有格式问题：选中所有ID- 「数据」- 「分列」- 「完成」">
              <Icon style={{ paddingLeft: 25 }} type="question-circle-o" />
            </Tooltip>
          </Form.Item>
          <Form.Item
            label={
              <span>
                源名称&nbsp;
                <Tooltip title="源名称禁止填写或修改，如需调整，请填写对应的自媒体ID，必须修改请联系前端@马昱同学">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('src', {
              initialValue:
                (defaultform.src.length > 0 &&
                  `已配置${defaultform.src.split(',').length}个账号`) ||
                '',
            })(<Input placeholder="未配置源名称账号" disabled />)}
          </Form.Item>
          <Form.Item label="自媒体ID">
            {getFieldDecorator('wm_ids', {
              initialValue: defaultform.wm_ids || '',
            })(
              <Input.TextArea
                style={{ height: 80 }}
                placeholder="填写需要过滤的自媒体ID，用英文逗号分隔"
              />,
            )}
            <Button icon="plus" style={{ marginLeft: 10 }}>
              txt导入
              <input
                type="file"
                className="fileInput"
                onChange={() => {
                  importExcel('channelFile');
                }}
                id="channelFile"
                accept=".xls, .xlsx, .txt"
                style={{
                  opacity: '0',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                }}
              />
            </Button>
            <Button
              icon="cloud-download"
              style={{ marginLeft: 10 }}
              onClick={() => {
                exportExcel('自媒体ID表', '自媒体ID', 'wm_ids');
              }}
            >
              导出数据
            </Button>
            <Tooltip title="导出数据如有格式问题：选中所有ID- 「数据」- 「分列」- 「完成」">
              <Icon style={{ paddingLeft: 25 }} type="question-circle-o" />
            </Tooltip>
          </Form.Item>
          <Form.Item
            label={
              <span>
                可分发时长&nbsp;
                <Tooltip title="输入自然数（如1，12，24），最小为1，最大999，单位为小时，不填则长期有效">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('distributionTime', {
              initialValue: defaultform.distributionTime || '',
            })(
              <InputNumber
                min={1}
                max={999}
                step={1}
                formatter={value => (value === '' ? value : Math.round(value))}
              />,
            )}{' '}
            小时
          </Form.Item>
          <Form.Item {...TailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={saving}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
const WrappedDemo = Form.create({ name: 'validate_other' })(AddCoverForm);
export default WrappedDemo;
