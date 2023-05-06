import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Select, Input, Spin, message, Button, Modal, Tag } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useFormikContext, Formik, useField } from 'formik';
import { Form, FormItem } from 'formik-antd';

import { tag_type_map } from '@/data';
import { useDebounceFunc, useTempContext, useValueContext } from '@/hooks';
import { parseselect } from '@/utils';

import { getPushUsers, getTags, getOppoPushIsOver } from '@/services/editorpushService';
import { saveStoredTags } from '@/services/accountService';
import { storedInTagSelector, storedExTagSelector, storedInterTagSelector, docrecInTagSelector, pushTaskListSelector } from '@/selectors/editorpush';
import { engnumWithSerpValidate } from '@/validation/editorpush';
import { currentTemplateSelector } from '@/selectors/template';
import { defaultTags, defaultTags1, defaultTags2, arrayTags } from '@/config/editorpush/push.config';
import { pushdocInfoSelector } from '@/selectors/editorpush';

import './index.less';

interface TagForm {
  type: 'include' | 'exclude' | 'inter'; // 标签的类型
  form?: boolean; // 位置：true用于表单，false用于收藏
  tagOptions: Record<string, string>;
  onOptionChange: (tags: Record<string, string>) => void;
}

type TagType = keyof typeof tag_type_map;

const default_tag_type: TagType = 'pushtag';
const default_push_user: number = 0;
const default_select_tags: string[] = [];
const default_search_tags: Record<string, string> = {};

export const TagForm: React.FC<TagForm> = React.memo(({ type, form = false, tagOptions, onOptionChange }) => {
  // if (type === 'exclude') {
  //   console.log(tagOptions)
  // }
  let targetName = ''
  if (type === 'include') {
    targetName = 'tags'
  }
  if (type === 'exclude') {
    targetName = 'excludeTags'
  }
  if (type === 'inter') {
    targetName = 'inter_channel'
  }
  let contrayName = ''
  if (type === 'include') {
    contrayName = 'excludeTags'
  }
  if (type === 'exclude') {
    contrayName = 'tags'
  }
  const dispatch = useDispatch();
  const formik = useFormikContext();
  const temp = useTempContext();
  const tempValue = useValueContext();
  const [_, { value: tags }] = useField('tags');
  const [__, { value: excludeTags }] = useField('excludeTags');
  const [___, { value: inter_channel }] = useField('inter_channel');
  const contrayTags = formik.getFieldMeta<string[]>(contrayName).value;
  // const interChannelTags = formik['inter_channel'];
  const interChannelTags = formik.getFieldMeta<string[]>('inter_channel').value;
  const xiaomi_priority = formik.getFieldMeta<any>('xiaomi_priority').value;
  const major_quantity = formik.getFieldMeta<any>('major_quantity').value;
  const targetTags = formik.getFieldMeta<string[]>(targetName).value;
  const storedIntags = useSelector(storedInTagSelector);
  const storedExtags = useSelector(storedExTagSelector);
  const storedIntertags = useSelector(storedInterTagSelector);
  const docRecdInTags = useSelector(docrecInTagSelector);
  const taskLists = useSelector(pushTaskListSelector); // history历史数据

  const [tagType, setTagType] = useState<TagType>(default_tag_type);
  const [pushUsers, setPushUsers] = useState<number>(default_push_user);
  const [selectTag, setSelectTag] = useState<string[]>(default_select_tags);
  const [searchTags, setSearchTags] = useState<Record<string, string>>(default_search_tags);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  const [inTagsWarning, setInTagsWarning] = useState<boolean>(false); // 展示intags存在提示
  const [tagNameArr, setTagNameArr] = useState<Array<string>>([]); // 展示intags存在提示

  const pushdocInfo = useSelector(pushdocInfoSelector); //获取输入docid对应的内容

  const templateId = useSelector(currentTemplateSelector)

  useEffect(() => {
    if (type === 'include') {
      setSelectTag(tags || []);
    } else if (type === 'exclude') {
      setSelectTag(excludeTags || arrayTags[temp as string]);
    } else { // inter
      setSelectTag(inter_channel || []);
    }
  }, [targetTags]) // 当前的values tags或者excludetags 提交后清除数据强制更新选中的标签

  /**
   * @returns 获取一小时内的历史数据 太复杂了 history里的channel里的数组 数组扁平 获取括号里的内容 去重
   */
  let historyDocidArr = useCallback(() => {
    let ary = taskLists
      .filter(item => Date.now() - new Date(item.create_time).getTime() < 1800000)
      .map(item => item.channel)
      .flat()
      .map(item => item.substring(item.indexOf('(') + 1, item.indexOf(')')));
    let arr = Array.from(new Set(ary));
    return arr;
  }, [taskLists]);

  // 防止selectTag一直变导致
  const debounceSetTags = useDebounceFunc((tags: string[]) => {
    formik.setFieldValue(targetName, tags);
  }, 50);

  // input输入 防止一直更新tag值
  const debounceSetSelect = useDebounceFunc(selects => {
    const newSelectTag = Array.from(new Set([...selectTag, ...selects]));
    setSelectTag(newSelectTag);
  }, 500);

  // input输入，添加选项
  const debounceSetOption = useDebounceFunc((input: Record<string, string>) => {
    onOptionChange({ ...tagOptions, ...input });
  }, 500);

  // 获取并更新推送用户数
  const fetchPushUsers = useDebounceFunc(async (tags: string[] = [], extags: string[] = [], inter_channels: string []) => {
    if (tags && tags.length === 0 && extags && extags.length === 0 && inter_channels && inter_channels.length === 0) {
      return setPushUsers(0);
    }
    try {
      const fetchRes = await getPushUsers(tags, extags, inter_channels);

      if (fetchRes.status === 'success') {
        setPushUsers(fetchRes.result.together);
      } else {
        throw new Error(fetchRes.message);
      }
    } catch (err:any) {
      message.error(err.toString());
    }
  }, 500);

  // 根据关键词获取并更新选项
  const fetchSearchTags = useDebounceFunc(async (value: string) => {
    setFetchLoading(true);

    try {
      if (!value.trim()) {
        // 空格或者连续输入的空格
        throw new Error('请勿输入空格查找');
      }

      const fetchRes = await getTags(value, tagType);

      if (fetchRes.status === 'success') {
        const newSearchList = fetchRes.result;
        const newSearchMap: Record<string, string> = {};

        for (let { id, name, count } of newSearchList) {
          newSearchMap[id] = `${name}_${count}`;
        }

        setSearchTags(newSearchMap);
      } else {
        throw new Error(fetchRes.message);
      }
    } catch (err:any) {
      message.error(err.message);
    } finally {
      setFetchLoading(false);
    }
  }, 500);

  // 下拉标签变化
  const handleTagSelect = (value: string, label: string) => {
    onOptionChange({ ...tagOptions, [value]: label });
    let selectTags = selectTag.includes(value) ? selectTag.filter(tag => tag !== value) : [...selectTag, value];
    setSelectTag(selectTags);
    testTags(selectTags, 'search');
  };

  const handleTagClose = (tag: string) => {
    const newTags = JSON.parse(JSON.stringify(tagOptions));

    if (newTags[tag]) {
      delete newTags[tag];
    }
    onOptionChange(newTags);
  };

  // 备选标签变化
  const handleTagChange = (checked: boolean, tag: string) => {
    let selectTags = checked ? [...selectTag, tag] : selectTag.filter(tagItem => tagItem !== tag);
    setSelectTag(selectTags);
    testTags(selectTags, 'click');
  };

  /**
   *
   * @param selectTags 选中标签的key
   * @param type 触发的类型 搜索点击和下面tag点击 默认
   * @returns 触发检测是否提示一小时内已经推送此tags
   */
  const testTags = (selectTags: string[], typeEmit: 'click' | 'search' = 'click') => {
    if (type === 'include') {
      // 当点击圈定用户时 获取history中过滤的索引 过滤出-1 作为key获取标签对象的value
      let tagName = selectTags
        .map(item => historyDocidArr().indexOf(item))
        .filter(item => item !== -1)
        .map(item => (typeEmit === 'click' ? tagOptions : searchTags)[historyDocidArr()[item]]);
        // typeEmit  搜索是采用search里的数据 点击用tagoptions保存的数据
      if (tagName.length > 0) {
        // 当存在push过的标签时
        setInTagsWarning(true);
        setTagNameArr(tagName);
      } else {
        setInTagsWarning(false);
      }
    }
  };

  // 输入类型的标签变化
  const handleInputChange = (e: any) => {
    e.preventDefault();

    const value = e.target.value;

    const error = engnumWithSerpValidate(value, type === 'include' ? '圈选标签' : '排除圈选标签');
    const inputs: string[] = value.split(',');
    const inputOption = Object.fromEntries(inputs.map(item => [item, item]));

    if (error) {
      return message.error(error);
    }

    debounceSetSelect(inputs);
    debounceSetOption(inputOption);
  };

  // 初始加载：从收藏中加载标签
  useEffect(() => {
    handleInitFn()
    // console.log(xiaomi_priority)
  }, [docRecdInTags, xiaomi_priority,major_quantity]);

  // 模版变化时selectTag默认变化为模版的默认值,推送文章内容变化时变化为模版的默认值
  useEffect(() => {
    let tempTags: string[] | undefined = []
    if (type === 'include') {
      tempTags = tempValue.tags
    }
    if (type === 'exclude') {
      tempTags = tempValue.excludeTags
    }
    if (type === 'inter') {
      tempTags = (tempValue as any).inter_channel || []
    }
    // const newSelectTag = tempTags || (type === 'exclude' && arrayTags[temp || '004']) || default_select_tags; // 暂时前端写死  数据库不会改。。。
    const newSelectTag = tempTags || (type === 'exclude' && arrayTags[temp || '004']) || default_select_tags; // 可能有bug注意一下
    setSelectTag(newSelectTag);
  }, [tempValue, pushdocInfo]); // 原来是temp依赖有问题 tempvalue通过temp触发 所有用temp依赖 tempvalue是旧的值

  // 标签变化时获取对应的人数，同时更新选中的标签
  useEffect(() => {
    let tags: string[] = []
    let extags: string[] = []
    let inter_channels: string[] = []
    if (type === 'include') {
      tags = selectTag;
      extags = contrayTags;
      inter_channels = inter_channel
    } else if (type === 'exclude') {
      extags = selectTag;
      tags = contrayTags;
      inter_channels = inter_channel
    } else if (type === 'inter') {
      extags = tags;
      tags = excludeTags;
      inter_channels = selectTag
    }
    if (type === 'inter' && inter_channel && Array.isArray(inter_channel)) {
      let formInstance: any = formik
      let etagArr = formInstance['values']['excludeTags']
      let tagArr = formInstance['values']['tags']
      // let reqArr = [...selectTag, ...tagArr]
      // reqArr = [...new Set(reqArr)] // 去重
      fetchPushUsers(tagArr, etagArr, inter_channels);
    } else if (type === 'include') {
      fetchPushUsers(tags, extags, inter_channels);
    } else if (type === 'exclude') {
      fetchPushUsers(tags, extags, inter_channels);
    }
    debounceSetTags(selectTag); // 这里把tags和excludetags放到整个values中
  }, [selectTag, contrayTags, inter_channel]);

  useEffect(() => { // 当前d存到state中
    dispatch({
      type: 'editorpush/saveTags',
      payload: {
        localTags: tagOptions,
      },
    });
  }, [tagOptions])

  const handleInitFn = async () => {
    // console.log(templateId)
    let useDefaultTags: Record<string, string> = defaultTags
    if (templateId === '001' || templateId === '003') {
      useDefaultTags = defaultTags1
      // useDefaultTags['e3144742'] = '华为渠道所有用户'

    }
    if (templateId === '002') {
      useDefaultTags = defaultTags2
      // useDefaultTags['e3144742'] = '华为渠道所有用户'
    }

    const isOpenOppoPushButton = await getOppoPushIsOver() 
    useDefaultTags = JSON.parse(JSON.stringify(useDefaultTags))

    if (isOpenOppoPushButton) {
      if (templateId === '001' || templateId === '002' || templateId === '003') {
        useDefaultTags['e3138922'] = '当日已活跃用户_除北京'

      }
      if (templateId === '003') {
        useDefaultTags['e2465915'] = 'oppo渠道所有用户'
      }
    }
    // 打开重大的时候 选中
    if (major_quantity === '1') {
      if (templateId === '001' || templateId === '002' || templateId === '003') {
        useDefaultTags['e2465900'] = 'xiaomi重度沉默用户'
        useDefaultTags['e2465918'] = 'xiaomi沉默90天以上用户'
      }
    }

    // 打开小米高优的时候 选中这个标签
    if (xiaomi_priority === '1') {
      if (templateId === '001' || templateId === '002' || templateId === '003') {
        useDefaultTags['e3138922'] = '当日已活跃用户_除北京'
      }
    }

    let storedTags: Record<string, string> = {}
    if (type === 'include') {
      storedTags = storedIntags
    }
    if (type === 'exclude') {
      storedTags = storedExtags
    }
    if (type === 'inter') {
      storedTags = storedIntertags
    }
    if (form) { // 设置常用标签不需要默认排除项
      let newOptionTags: Record<string, string> = {}
      if (type === 'include') {
        newOptionTags = { ...storedTags, ...docRecdInTags }
        console.log(docRecdInTags,'=====docRecdInTags');
      }
      if (type === 'exclude') {
        newOptionTags = {...storedTags, ...useDefaultTags}
        console.log(newOptionTags,'=========newOptionTags');
      }
      if (type === 'inter') {
        newOptionTags = {...storedIntertags}
      }
      // console.log(newOptionTags)
      onOptionChange(newOptionTags);
    } else {
      const newOptionTags = storedTags;
      onOptionChange(newOptionTags);
    }
    // console.log(docRecdInTags)
  }

  return (
    <>
      <div className="tagform">
        {
          {
            pushtag: (
              <Select
                className="tagform-content"
                mode="multiple"
                showArrow
                allowClear
                filterOption={false}
                value={[]}
                notFoundContent={fetchLoading ? <Spin /> : '暂无数据'}
                onSearch={fetchSearchTags}
                onSelect={(value: string, option: React.ReactElement<any>) => handleTagSelect(value, option.props.children)}
              >
                {parseselect(searchTags)}
              </Select>
            ),
            userset: (
              <Select
                className="tagform-content"
                mode="multiple"
                showArrow
                allowClear
                filterOption={false}
                value={[]}
                notFoundContent={fetchLoading ? <Spin /> : '暂无数据'}
                onSearch={fetchSearchTags}
                onSelect={(value: string, option: React.ReactElement<any>) => handleTagSelect(value, option.props.children)}
              >
                {parseselect(searchTags)}
              </Select>
            ),
            fromid: (
              <Input
                className="tagform-content"
                placeholder="请输入fromid，用英文逗号分隔"
                onBlur={handleInputChange}
                onPressEnter={handleInputChange}
              />
            ),
          }[tagType]
        }
        <Select className="tagform-type" value={tagType} onChange={setTagType}>
          {parseselect(tag_type_map)}
        </Select>
        {form ? <span className="tagform-count">{`推送人数: ${pushUsers}`}</span> : null}
        {Boolean(form && type === 'include' && inTagsWarning) ? (
          <div className="tagform-count">
            近半小时内推送过该标签:
            {tagNameArr.map(item => (
              <span style={{ color: 'red', marginLeft: '5px' }} key={item}>
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="tagitem">
        {form
          ? Object.entries(tagOptions).map(([value, label]) => (
              <Tag.CheckableTag key={value} checked={selectTag.includes(value)} onChange={checked => handleTagChange(checked, value)}>
                {label}
              </Tag.CheckableTag>
            ))
          : Object.entries(tagOptions).map(([value, label]) => (
              <Tag key={value} closable onClose={() => handleTagClose(value)}>
                {label}
              </Tag>
            ))}
      </div>
    </>
  );
});
/**
 * @returns 设置常用标签
 */
export const TagFormModal: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const storedIntags = useSelector(storedInTagSelector);
  const storedExtags = useSelector(storedExTagSelector);
  const storedIntertags = useSelector(storedInterTagSelector);

  const submitRef = useRef<HTMLButtonElement>(null);
  const [showCol, setShowCol] = useState<boolean>(false);
  const [intagOpts, setIntagOpts] = useState<Record<string, string>>({});
  const [extagOpts, setExtagOpts] = useState<Record<string, string>>({});
  // const [intertagOpts, setIntertagOpts] = useState<Record<string, string>>({});
  const [interTagOpts, setInterTagOpts] = useState<Record<string, string>>({});

  const summitStoredTags = async () => {
    try {
      const submitRes = await saveStoredTags(intagOpts, extagOpts, interTagOpts);
      // 点击确定后更新model里的tags的值
      dispatch({
        type: 'editorpush/updateStoredTags',
        payload: {
          tags: intagOpts,
          extags: extagOpts,
          interTags: interTagOpts,
        },
      });
      if (submitRes.status === 'success') {
        message.success('保存成功');
      } else {
        throw new Error(submitRes.message);
      }
    } catch (err) {
      message.error(err.toString());
    } finally {
      setShowCol(false);
    }
  };

  const handleSaveConfirm = () => {
    if (!submitRef.current) {
      return message.error('未获取到提交节点');
    }
    submitRef.current.click();
  };

  useEffect(() => {
    setIntagOpts(storedIntags);
    setExtagOpts(storedExtags);
    setInterTagOpts(storedIntertags);
  }, [storedExtags, storedIntags, storedIntertags]);
  return (
    <>
      <Button size="small" type="link" onClick={() => setShowCol(true)}>
        设置常用标签
      </Button>
      <Modal visible={showCol} title="设置常用标签" width={684} onCancel={() => setShowCol(false)} onOk={handleSaveConfirm}>
        <Formik initialValues={{}} onSubmit={() => {}} enableReinitialize>
          <Form>
            <FormItem className="form-item" name="tags" label="推送圈选标签">
              <TagForm type="include" form={false} tagOptions={intagOpts} onOptionChange={setIntagOpts} />
            </FormItem>
            <FormItem className="form-item" name="excludeTags" label="排除圈选标签">
              <TagForm type="exclude" form={false} tagOptions={extagOpts} onOptionChange={setExtagOpts} />
            </FormItem>
            <FormItem className="form-item" name="interTags" label="推送交集标签">
              <TagForm type="inter" form={false} tagOptions={interTagOpts} onOptionChange={setInterTagOpts} />
            </FormItem>
            <button style={{ display: 'none' }} ref={submitRef} onClick={summitStoredTags} />
          </Form>
        </Formik>
      </Modal>
    </>
  );
});
