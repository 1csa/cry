import React, { useEffect, useRef, useState } from 'react';
import { Select, Input, Spin, message, Button, Modal, Tag } from 'antd';
import { useSelector } from 'dva';
import { useFormikContext, Formik } from 'formik';
import { Form } from 'formik-antd';

import { tag_type_map } from '@/data';
import { useDebounceFunc, useTempContext, useValueContext } from '@/hooks';
import { parseselect } from '@/utils';

import { IntagFormItem, ExtagFormItem } from '@/components/PushUser/forms';
import { getPushUsers, getTags } from '@/services/editorpushService';
import { saveStoredTags } from '@/services/accountService';
import { storedInTagSelector, storedExTagSelector } from '@/selectors/editorpush';
import { engnumWithSerpValidate } from '@/validation/editorpush';
import './index.less';

interface TagForm {
  type: 'include' | 'exclude';
}

type TagType = keyof typeof tag_type_map;

const default_tag_type: TagType = 'pushtag';
const default_push_user: number = 0;
const default_select_tags: string[] = [];
const default_search_tags: Record<string, string> = {};
const default_option_tags: Record<string, string> = {};

export const TagForm: React.FC<TagForm> = React.memo(({ type }) => {
  const targetName = type === 'include' ? 'tags' : 'excludeTags';
  const contrayName = type === 'include' ? 'excludeTags' : 'tags';

  const formik = useFormikContext();
  const temp = useTempContext();
  const tempValue = useValueContext();

  const targetTags = formik.getFieldMeta<string[]>(targetName).value;
  const contrayTags = formik.getFieldMeta<string[]>(contrayName).value;
  const storedIntags = useSelector(storedInTagSelector);
  const storedExtags = useSelector(storedExTagSelector);

  const [tagType, setTagType] = useState<TagType>(default_tag_type);
  const [pushUsers, setPushUsers] = useState<number>(default_push_user);
  const [selectTag, setSelectTag] = useState<string[]>(default_select_tags);
  const [searchTags, setSearchTags] = useState<Record<string, string>>(default_search_tags);
  const [optionTags, setOptionTags] = useState<Record<string, string>>(default_option_tags);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  // 防止selectTag一直变导致
  const debounceSetTags = useDebounceFunc((tags: string[]) => {
    formik.setFieldValue(targetName, tags);
  }, 50);

  // input输入 防止一直更新tag值
  const debounceSetSelect = useDebounceFunc(selects => {
    setSelectTag(selects);
  }, 500);

  // 获取并更新推送用户数
  const fetchPushUsers = useDebounceFunc(async (tags: string[] = [], extags: string[] = []) => {
    if (tags.length === 0 && extags.length === 0) {
      return setPushUsers(0);
    }
    try {
      const fetchRes = await getPushUsers(tags, extags);

      if (fetchRes.status === 'success') {
        setPushUsers(fetchRes.result.together);
      } else {
        throw new Error(fetchRes.message);
      }
    } catch (err) {
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
    } catch (err) {
      message.error(err.message);
    } finally {
      setFetchLoading(false);
    }
  }, 500);

  const debounceSetOption = useDebounceFunc((input: string[]) => {
    try {
    } catch (err) {}
  }, 500);

  // 下拉标签变化
  const handleTagSelect = (value: string, label: string) => {
    setOptionTags({ ...optionTags, [value]: label });
    setSelectTag(selectTag.includes(value) ? selectTag.filter(tag => tag !== value) : [...selectTag, value]);
  };

  // 备选标签变化
  const handleTagChange = (checked: boolean, tag: string) => {
    setSelectTag(checked ? [...selectTag, tag] : selectTag.filter(tagItem => tagItem !== tag));
  };

  const handleInputChange = ({ target: { value = '' } }: React.ChangeEvent<HTMLInputElement>) => {
    const error = engnumWithSerpValidate(value, type === 'include' ? '圈选标签' : '排除圈选标签');
    const input = value.split(',');

    if (error) {
      return message.error(error);
    }

    debounceSetSelect(input);
    debounceSetOption(input);
  };

  useEffect(() => {
    if (type === 'include') {
      setOptionTags(storedIntags);
    } else {
      setOptionTags(storedExtags);
    }
  }, []);

  // 模版变化时selectTag默认变化为模版的默认值
  useEffect(() => {
    if (type === 'include') {
      setSelectTag(tempValue.tags || default_select_tags);
    } else {
      setSelectTag(tempValue.excludeTags || default_select_tags);
    }
  }, [temp]);

  useEffect(() => {
    let tags: string[] = [],
      extags: string[] = [];

    if (type === 'include') {
      tags = selectTag;
      extags = contrayTags;
    } else {
      extags = selectTag;
      tags = contrayTags;
    }

    fetchPushUsers(tags, extags);
    debounceSetTags(selectTag);
  }, [selectTag, contrayTags]);

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
                onChange={setSelectTag}
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
                onChange={setSelectTag}
              >
                {parseselect(searchTags)}
              </Select>
            ),
            fromid: <Input className="tagform-content" placeholder="请输入fromid，用英文逗号分隔" onChange={handleInputChange} />,
          }[tagType]
        }
        <Select className="tagform-type" value={tagType} onChange={setTagType}>
          {parseselect(tag_type_map)}
        </Select>
        <span className="tagform-count">{`推送人数: ${pushUsers}`}</span>
      </div>
      <div className="tagitem">
        {Object.entries(optionTags).map(([value, label]) => (
          <Tag.CheckableTag key={value} checked={selectTag.includes(value)} onChange={checked => handleTagChange(checked, value)}>
            {label}
          </Tag.CheckableTag>
        ))}
      </div>
    </>
  );
});

type StoredTags = {
  tags: Record<string, string>;
  excludeTags: Record<string, string>;
};

export const TagFormModal: React.FC = React.memo(() => {
  const storedIntags = useSelector(storedInTagSelector);
  const storedExtags = useSelector(storedExTagSelector);

  const submitRef = useRef<HTMLButtonElement>(null);
  const [showCol, setShowCol] = useState<boolean>(false);
  const [initIntags, setInitIntags] = useState<Record<string, string>>({});
  const [initExtags, setInitExtags] = useState<Record<string, string>>({});

  const summitStoredTags = async (values: StoredTags) => {
    try {
      const { tags, excludeTags } = values;
      // const submitRes = await saveStoredTags(tags, excludeTags);

      // if (submitRes.status === 'success') {
      //   message.success('保存成功');
      // } else {
      //   throw new Error(submitRes.message);
      // }
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
    setInitIntags(storedIntags);
    setInitExtags(storedExtags);
  }, [storedExtags, storedIntags]);

  return (
    <>
      <Button size="small" type="link" onClick={() => setShowCol(true)}>
        设置常用标签
      </Button>
      <Modal visible={showCol} title="设置常用标签" width={684} onCancel={() => setShowCol(false)} onOk={handleSaveConfirm}>
        <Formik<StoredTags> initialValues={{ tags: initIntags, excludeTags: initExtags }} onSubmit={() => {}} enableReinitialize>
          {({ values }) => (
            <Form>
              <IntagFormItem />
              <ExtagFormItem />
              <button style={{ display: 'none' }} ref={submitRef} onClick={() => summitStoredTags(values)} />
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
});
