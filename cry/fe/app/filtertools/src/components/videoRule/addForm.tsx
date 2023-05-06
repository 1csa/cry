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
  Divider,
  Typography,
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
  VideoFormLayout,
  videoFieldReferenceList,
  FilterEscape,
} from '@/config/constant';
import { saveKibana, saveStaticLog } from '@/utils/log';
import { fieldReference } from '@/utils/rule_level';
import { exportIdData } from '@/utils/export_data';
import './video.less';

interface Defaultform {
  micro_yd_porny: number;
  micro_yd_sexy: number;
  _id: any;
  video_tags: string;
  yd_sexy: number;
  yd_porny: number;
  name: String;
  desc: String;
  security: Array<any>;
  channelList: any;
  logic: String;
  vct: String;
  vsct: String;
  ncat_class: String;
  nsubcat_class: String;
  ttkey: String;
  dirtyTag: Boolean;
  mild_dirty: Boolean;
  vlevel: String | Array<any>;
  new_sourcelevel: String | Array<any>;
  batch: Number;
  blur: Number;
  unclarity: Number;
  sc_dirty: Number;
  bait: Number;
  sick: Number;
  c_imgs_dirty: Number;
  c_imgs_sexy: Number;
  c_imgs_disgusting: Number;
  female_sexy: Number;
  male_sexy: Number;
  intimacy: Number;
  yd_general_sexy: Number;
  sc_yd_general_sexy: Number;
  yd_disgusting: Number;
  yd_intimacy: Number;
  over_image_baidu_unclarity: Number;
  over_image_blur: Number;
  cover_image_yd_sexy: Number;
  video_image_baidu_unclarity: Number;
  video_image_blur: Number;
  micro_sc_dirty: Number;
  micro_bait: Number;
  micro_sick: Number;
  micro_c_imgs_dirty: Number;
  micro_c_imgs_sexy: Number;
  micro_c_imgs_disgusting: Number;
  micro_female_sexy: Number;
  micro_male_sexy: Number;
  micro_intimacy: Number;
  micro_yd_general_sexy: Number;
  micro_yd_disgusting: Number;
  micro_yd_intimacy: Number;
  micro_over_image_baidu_unclarity: Number;
  micro_over_image_blur: Number;
  micro_cover_image_yd_sexy: Number;
  micro_video_image_baidu_unclarity: Number;
  micro_video_image_blur: Number;
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
  title_quality: Array<any>;
  videoType: Array<any>;
  smilVideoType: Array<any>;
  micro_title_quality: Array<any>;
  cover_stretch: Number;
  cover_frame: Number;
  cover_mosaic_piece: Number;
  cover_mosaic_proportion: Number;
  micro_cover_stretch: Number;
  micro_cover_frame: Number;
  micro_cover_mosaic_piece: Number;
  micro_cover_mosaic_proportion: Number;
  filter_escape: Array<any>;
  micro_duration: Number;
  duration: Number;
  yd_porny_animal: Number;
  micro_yd_porny_animal: Number;
  review_protect: Boolean;
  enable_derives: Boolean;
  topview_quality_tags: Array<any>;
}
interface AddCoverFormProps {
  form: {
    getFieldDecorator: any;
    validateFieldsAndScroll: any;
    resetFields: any;
    setFieldsValue: any;
    getFieldValue: any;
  };
  adddrawervisible: boolean;
  setAdddrawervisible?: (param: Boolean) => void;
  setResult?: (param: Array<any>) => void;
  result: Array<any>;
  defaultform: Defaultform;
  threshold: Object;
  isDev: boolean;
}

const formOptionList: any = ruleformOptionList;

const fieldReferenceList = videoFieldReferenceList;

const AddCoverForm: FC<AddCoverFormProps> = (props: AddCoverFormProps) => {
  const [saving, setSaving] = useState<Boolean>(false);
  const [filterVideoList, setfilterVideoList] = useState([]);
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
    resetFields,
    setFieldsValue,
    getFieldValue,
  } = props.form;
  const {
    adddrawervisible,
    setAdddrawervisible,
    setResult,
    result,
    defaultform,
    threshold,
    isDev,
  } = props;
  const { Title } = Typography;
  useEffect(() => {
    getAllVideoRuleList();
  }, []);
  //获取数据库中的所有视频过滤规则
  const getAllVideoRuleList = async () => {
    //因需求着急 暂时写到1000
    const res = await request.get(`/api/filtertools/getAllVideoRules?isdev=${isDev}&pageSize=1000`);
    if (res.code === 0) {
      setfilterVideoList(res.result.data);
    }
  };
  const isVideoNameExist = (name: any) => {
    return filterVideoList.find(item => item.name === name);
  };
  // console.log(defaultform);
  const submitAction = async values => {
    values.sex = '无'; // 涉性废弃
    values.channelList.content = values.channelList.content.split(',') || ['best'];
    values.src = defaultform.src.length > 0 ? defaultform.src.split(',') : [];
    values.wm_ids = values.wm_ids.length > 0 ? values.wm_ids.split(',') : [];
    values.protect_source =
      values.protect_source.length > 0 ? values.protect_source.split(',') : [];
    // values.new_sourcelevel =
    //   values.new_sourcelevel.length > 0 ? values.new_sourcelevel.join('、') : '无';
    values.source = '无'; // 使用率不高且与desc字段功能重复 来源废弃
    // console.log(values.video_tags.toString(),'222222');
    values.video_tags = values.video_tags.length > 0 ? values.video_tags.toString().split(',') : [];
    const act = 'save',
      value = values;
    const { log_domain, log_secret, video_rule_key } = LogInfo;
    const userName = localStorage.getItem('userName');
    value.location = window.location.href;
    value.debug = isDev ? 1 : 0;
    if (values.distributionTime === '') {
      // 生效时间不填则不存
      delete values.distributionTime;
    }
    if (values.ruleId === undefined || values.ruleId === -1) {
      if (isVideoNameExist(values.name) === undefined) {
        const ret = await request.post(`/api/filtertools/addVideoRule?isdev=${isDev}`, {
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

              key: video_rule_key,
              value: value ? JSON.stringify(value) : '',
              fromid: '',
              comment: '',
            },
          ]);
          saveKibana('save-add', video_rule_key, value);
        } else {
          message.error(ret.message);
        }
      } else {
        message.warning('视频过滤规则名字重复，请更改！！！！！');
      }
    } else {
      values._id = defaultform._id;
      const ret2 = await request.post(`/api/filtertools/updateVideoRule?isdev=${isDev}`, {
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
        closeDrawer();

        saveStaticLog(log_domain, log_secret, [
          {
            action: act,
            key: video_rule_key,
            value: value ? JSON.stringify(value) : '',
            fromid: '',
            comment: '',
          },
        ]);
        saveKibana('save-edit', video_rule_key, value);
      } else {
        message.error(ret2.message);
      }
    }
    setSaving(false);
  };
  const handleSubmit = e => {
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
            // console.log(values);
          },
          onCancel() {
            setSaving(false);
          },
        });
      }
    });
  };
  const closeDrawer = () => {
    setSaving(false);
    setAdddrawervisible(false);
    resetFields();
  };

  // 自媒体ID/白名单账号数据导入
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
    // 清空value 避免相同文件名无法重复上传
    document.getElementById(elementId).value = '';
  };

  const exportExcel = (fileName: string, columnHeader: string, columnName: string) => {
    let column = getFieldValue(columnName);
    exportIdData('视频' + fileName, columnHeader, column);
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

          {/* <Form.Item label="来源">
            {getFieldDecorator('source', {
              initialValue: defaultform.source || '',
            })(<Input placeholder="请填写规则来源" />)}
          </Form.Item> */}

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
              rules: [{ required: true, message: '频道(黑/白)名单不能为空!', whitespace: true }],
            })(<Input.TextArea style={{ height: 80 }} allowClear />)}
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

          <Form.Item label="一级分类">
            {getFieldDecorator('vct', {
              initialValue: defaultform.vct || '',
            })(<Input.TextArea placeholder="请填写一级分类" style={{ height: 50 }} />)}
          </Form.Item>

          <Form.Item label="二级分类">
            {getFieldDecorator('vsct', {
              initialValue: defaultform.vsct || '',
            })(<Input.TextArea placeholder="请填写二级分类" style={{ height: 50 }} />)}
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
            {getFieldDecorator('ttkey', {
              initialValue: defaultform.ttkey || '',
            })(
              <Input.TextArea
                style={{ height: 80 }}
                placeholder="填写关键词请遵从提示中的添加方式"
              />,
            )}
          </Form.Item>

          <Form.Item
            label={
              <span>
                标签&nbsp;
                <Tooltip title="多个标签请用英文逗号分隔">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('video_tags', {
              initialValue: defaultform.video_tags || '',
            })(<Input.TextArea style={{ height: 80 }} placeholder="请填写需过滤标签" />)}
          </Form.Item>

          <Form.Item label="低俗/血腥/重口味标签">
            {getFieldDecorator('dirtyTag', {
              initialValue: defaultform.dirtyTag,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>

          <Form.Item label="轻度低俗">
            {getFieldDecorator('mild_dirty', {
              initialValue: defaultform.mild_dirty,
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>,
            )}
          </Form.Item>

          <Form.Item label="视频等级">
            {getFieldDecorator('vlevel', {
              initialValue: defaultform.vlevel || '无',
            })(
              <Select>
                {formOptionList.vlevel.map(item => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

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
          <Form.Item label="视频标题低质" className="videoQuality">
            {getFieldDecorator('title_quality', {
              initialValue: defaultform.title_quality || [],
            })(
              <Select mode="multiple" showSearch allowClear placeholder="请选择视频标题低质">
                {formOptionList.videoType.map(item => (
                  <Select.Option value={item.value} key={item.key}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="小视频标题低质">
            {getFieldDecorator('micro_title_quality', {
              initialValue: defaultform.micro_title_quality || [],
            })(
              <Select mode="multiple" showSearch allowClear placeholder="请选择小视频标题低质">
                {formOptionList.smilVideoType.map(item => (
                  <Select.Option value={item.value} key={item.key}>
                    {item.key}
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
                一点模糊图&nbsp;
                <Tooltip title="0-1小数，其他数字无效，过滤blur>=阈值的内容">
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
          {/*      <Tooltip title="0-1小数，其他数字无效，过滤unclarity>=阈值的内容">*/}
          {/*        <Icon type="question-circle-o" />*/}
          {/*      </Tooltip>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  {getFieldDecorator('unclarity', {*/}
          {/*    initialValue: defaultform.unclarity || 0,*/}
          {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
          {/*</Form.Item>*/}
          <Divider dashed />
          <div id="video">
            <Title level={4} style={{ marginLeft: '35%' }}>
              视频规则
            </Title>
            <Form.Item
              label={
                <span>
                  标题低俗&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤sc_dirty>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('sc_dirty', {
                initialValue: fieldReference('sc_dirty', defaultform.sc_dirty, fieldReferenceList),
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  视频时长过滤&nbsp;
                  <Tooltip title="示例：若配置7，则过滤duration在1-6s的视频；若配置6，则过滤过滤duration在1-5s的视频，以此类推">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('duration', {
                initialValue: defaultform.duration || 0,
              })(<InputNumber />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  标题党&nbsp;
                  <Tooltip title="0-2小数，其他数字无效，过滤text_qltys.sc_bait>=阈值的内容">
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
                  标题重口&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤sc_sicky>=阈值的内容">
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
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤sc_bd_imgs_porny>=阈值的内容">*/}
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
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤sc_bd_imgs_sexy>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }>*/}
            {/*  {getFieldDecorator('c_imgs_sexy', {*/}
            {/*    initialValue: defaultform.c_imgs_sexy || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      恶心图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤sc_imgs_baidu_disgusting>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('c_imgs_disgusting', {*/}
            {/*    initialValue: defaultform.c_imgs_disgusting || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      女性性感图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.female_sexy>=阈值的内容">*/}
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
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.male_sexy>=阈值的内容">*/}
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
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.intimacy>=阈值的内容">*/}
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
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.yd_general_sexy>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('yd_general_sexy', {
                initialValue: defaultform.yd_general_sexy || defaultform.sc_yd_general_sexy || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  自研重口味图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.yd_disgusting>=阈值的内容">
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
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.yd_intimacy>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('yd_intimacy', {
                initialValue: defaultform.yd_intimacy || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      封面模糊图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.over_image_baidu_unclarity>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('over_image_baidu_unclarity', {*/}
            {/*    initialValue: defaultform.over_image_baidu_unclarity || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            <Form.Item
              label={
                <span>
                  自研封面模糊图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.over_image_blur>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('over_image_blur', {
                initialValue: defaultform.over_image_blur || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  自研封面性感图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.cover_image_yd_sexy>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('cover_image_yd_sexy', {
                initialValue: defaultform.cover_image_yd_sexy || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      百度内容模糊&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤video_image_baidu_unclarity>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('video_image_baidu_unclarity', {*/}
            {/*    initialValue: defaultform.video_image_baidu_unclarity || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

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

            <Form.Item
              label={
                <span>
                  自研内容模糊&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤video_image_blur>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('video_image_blur', {
                initialValue: defaultform.video_image_blur || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  封面拉伸&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.cover_stretch>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('cover_stretch', {
                initialValue: defaultform.cover_stretch || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  封面边框&nbsp;
                  <Tooltip title="0-1之间的小数，代表模型识别出视频边框占封面的面积，过滤imgs_qltys.cover_frame>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('cover_frame', {
                initialValue: defaultform.cover_frame || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  封面马赛克块数&nbsp;
                  <Tooltip title="0，1，2等整数，代表模型识别出视频封面存在的马赛克块数，过滤imgs_qltys.cover_mosaic_piece>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('cover_mosaic_piece', {
                initialValue: defaultform.cover_mosaic_piece || 0,
              })(<InputNumber min={0} max={2} step={1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  封面马赛克面积&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.cover_mosaic_proportion>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('cover_mosaic_proportion', {
                initialValue: defaultform.cover_mosaic_proportion || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
          </div>
          <div id="micro-video">
            {/* <Form.Item> */}
            <Title level={4} style={{ marginLeft: '30%' }}>
              小视频规则
            </Title>
            {/* </Form.Item> */}

            <Form.Item
              label={
                <span>
                  标题低俗&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤micro_sc_dirty>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_sc_dirty', {
                initialValue: defaultform.micro_sc_dirty || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  视频时长过滤&nbsp;
                  <Tooltip title="示例：若配置7，则过滤duration在1-6s的视频；若配置6，则过滤过滤duration在1-5s的视频，以此类推">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_duration', {
                initialValue: defaultform.micro_duration || 0,
              })(<InputNumber />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  标题党&nbsp;
                  <Tooltip title="0-2小数，其他数字无效，过滤micro_bait>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_bait', {
                initialValue: defaultform.micro_bait || 0,
              })(<InputNumber min={0} max={2} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  标题重口&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤micro_sick>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_sick', {
                initialValue: defaultform.micro_sick || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      低俗图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤micro_c_imgs_dirty>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('micro_c_imgs_dirty', {*/}
            {/*    initialValue: defaultform.micro_c_imgs_dirty || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      涉性图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤micro_c_imgs_sexy>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }>*/}
            {/*  {getFieldDecorator('micro_c_imgs_sexy', {*/}
            {/*    initialValue: defaultform.micro_c_imgs_sexy || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      恶心图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤micro_c_imgs_disgusting>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('micro_c_imgs_disgusting', {*/}
            {/*    initialValue: defaultform.micro_c_imgs_disgusting || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      女性性感图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤micro_female_sexy>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('micro_female_sexy', {*/}
            {/*    initialValue: defaultform.micro_female_sexy || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      男性性感图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤micro_male_sexy>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('micro_male_sexy', {*/}
            {/*    initialValue: defaultform.micro_male_sexy || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      亲密行为图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤micro_intimacy>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('micro_intimacy', {*/}
            {/*    initialValue: defaultform.micro_intimacy || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            <Form.Item
              label={
                <span>
                  自研色情图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.micro_yd_porny>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_yd_porny', {
                initialValue: defaultform.micro_yd_porny || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  自研低俗图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.micro_yd_sexy>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_yd_sexy', {
                initialValue: defaultform.micro_yd_sexy || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  自研一般性感图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤micro_yd_general_sexy>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_yd_general_sexy', {
                initialValue: defaultform.micro_yd_general_sexy || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  自研重口味图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤micro_yd_disgusting>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_yd_disgusting', {
                initialValue: defaultform.micro_yd_disgusting || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  自研亲密行为图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤micro_yd_intimacy>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_yd_intimacy', {
                initialValue: defaultform.micro_yd_intimacy || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      封面模糊图&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤	micro_over_image_baidu_unclarity>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('micro_over_image_baidu_unclarity', {*/}
            {/*    initialValue: defaultform.micro_over_image_baidu_unclarity || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}

            <Form.Item
              label={
                <span>
                  自研封面模糊图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤	micro_over_image_blur>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_over_image_blur', {
                initialValue: defaultform.micro_over_image_blur || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  自研封面性感图&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤	micro_cover_image_yd_sexy>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_cover_image_yd_sexy', {
                initialValue: defaultform.micro_cover_image_yd_sexy || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            {/*<Form.Item*/}
            {/*  label={*/}
            {/*    <span>*/}
            {/*      百度内容模糊&nbsp;*/}
            {/*      <Tooltip title="0-1小数，其他数字无效，过滤micro_video_image_baidu_unclarity>=阈值的内容">*/}
            {/*        <Icon type="question-circle-o" />*/}
            {/*      </Tooltip>*/}
            {/*    </span>*/}
            {/*  }*/}
            {/*>*/}
            {/*  {getFieldDecorator('micro_video_image_baidu_unclarity', {*/}
            {/*    initialValue: defaultform.micro_video_image_baidu_unclarity || 0,*/}
            {/*  })(<InputNumber min={0} max={1} step={0.1} />)}*/}
            {/*</Form.Item>*/}
            <Form.Item
              label={
                <span>
                  自研动物交配模型&nbsp;
                  <Tooltip title="0-1小数，过滤micro_yd_porny_animal>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_yd_porny_animal', {
                initialValue: defaultform.micro_yd_porny_animal || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  自研内容模糊&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤micro_video_image_blur>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_video_image_blur', {
                initialValue: defaultform.micro_video_image_blur || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>

            <Form.Item
              label={
                <span>
                  封面拉伸&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤micro_cover_stretch>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_cover_stretch', {
                initialValue: defaultform.micro_cover_stretch || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  封面边框&nbsp;
                  <Tooltip title="0-1之间的小数，代表模型识别出视频边框占封面的面积，过滤imgs_qltys.micro_cover_frame>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_cover_frame', {
                initialValue: defaultform.micro_cover_frame || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  封面马赛克块数&nbsp;
                  <Tooltip title="0，1，2等整数，代表模型识别出视频封面存在的马赛克块数，过滤imgs_qltys.micro_cover_mosaic_piece>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_cover_mosaic_piece', {
                initialValue: defaultform.micro_cover_mosaic_piece || 0,
              })(<InputNumber min={0} max={2} step={1} />)}
            </Form.Item>
            <Form.Item
              label={
                <span>
                  封面马赛克面积&nbsp;
                  <Tooltip title="0-1小数，其他数字无效，过滤imgs_qltys.micro_cover_mosaic_proportion>=阈值的内容">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('micro_cover_mosaic_proportion', {
                initialValue: defaultform.micro_cover_mosaic_proportion || 0,
              })(<InputNumber min={0} max={1} step={0.1} />)}
            </Form.Item>
          </div>

          <Divider dashed />
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
                {formOptionList.wemediaType.map(item => (
                  <Select.Option value={item.value} key={item.key}>
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
                onInput={() => {
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
