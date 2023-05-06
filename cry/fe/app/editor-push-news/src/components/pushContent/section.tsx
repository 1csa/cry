import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Radio } from 'formik-antd';
import { push_type_schema, push_section_type, push_section_content, request_section_msg } from '@/config/editorpush/push.config';
import * as ContentForms from './secforms';
import './index.less';
const TypeFormItem = ContentForms.TypeFormItem;
interface IPropsSection {
  rstype: string;
}
/**
 * @returns 分段式分发内容
 * @params rstype
 */
const Section: React.FC<IPropsSection> = React.memo(({ rstype }) => {
  const formik = useFormikContext();
  const [value, setValue] = useState<'group1' | 'group2' | 'group3'>('group1');

  const genFormName = (name: string) => {
    return name.replace(/^[a-z]/, title => title.toUpperCase()) + 'FormItem';
  };

  const handleChangeValue = (value: 'group1' | 'group2' | 'group3') => {
    setValue(value);
    formik.setFieldValue('groupmsg', request_section_msg[value]); // 新的接口数据 传递实验组写死的数据
  };

  return (
    <div className="section">
      <Radio.Group
        buttonStyle="solid"
        value={value}
        name="group"
        onChange={e => {
          handleChangeValue(e.target.value);
        }}
      >
        {Object.values(push_section_type).map((item, index) => {
          return (
            <Radio.Button key={index} value={item.value} className="radio-button">
              {item.name}
            </Radio.Button>
          );
        })}
      </Radio.Group>

      {Object.values(push_section_content[value]).map((item, index) => {
        // console.log(item, 'item');
        return (
          <div key={`test${index + 1}`} className="section-item">
            <div className="testmsg">
              <span className="test">{item.name}</span>
              <span className="testcx">{item.flow}</span>
              <span className="testcx">{item.bucket}</span>
            </div>
            {Object.values(push_section_content[value]).length !== index + 1 && (
              <>
                <TypeFormItem index={index + 1} />
                {rstype
                  ? push_type_schema[rstype].forms.map(item => {
                      const name = genFormName(item);
                      return name
                        ? React.createElement(ContentForms[name], {
                            key: item,
                            name: push_type_schema[rstype].name,
                            rstype,
                            index: index + 1,
                          })
                        : null;
                    })
                  : null}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default Section;
