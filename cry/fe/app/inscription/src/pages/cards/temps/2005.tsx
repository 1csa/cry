/**
 * 子卡片: 多专辑组合模版
 * 数据的嵌套是完整的，但是顺序的表达是有问题的
 * TODO: 这里的数据更新存在问题
 */

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Collapse, Button, message, Divider } from 'antd';
import { useFieldArray, useFormContext, ArrayField } from 'react-hook-form';
import { FormItem, YInput, YSelect } from '@/components';
import { isEmpty } from '@/utils';
import { Child_2003, Child_2006 } from '@/pages/cards/temps';
import { GetContentByDocId } from '@/pages/cards/forms';
import { FORM_CSS, FORM_ID, FORM_TITLE, FORM_TEMP, FORM_CHILDS, FORM_ACTIONS, TEMP_2005 } from '@/config/card.config';
import { TEMP_2006, TEMP_2003, FORM_CONTENT, cardCssList, child_options, defaultChild } from '@/config/card.config';
import { CardForm } from '@/types/card';
import { CardAction } from '@/pages/cards/forms';

interface Card_2005 {
  name: string;
  field: Partial<ArrayField<CardForm, 'id'>>;
  childName?: string;
}

const Card_2005: React.FC<Card_2005> = ({ name, field }) => {
  const { control } = useFormContext();
  const { fields, append, remove, swap } = useFieldArray<CardForm>({ control, name: `${name}[${FORM_CHILDS}]` });

  const typeNameMap = useMemo(() => Object.fromEntries(child_options.map(({ label, value }) => [value, label])), []);

  const [subtypes, setSubtypes] = useState<number[]>([-1]);
  const [subnames, setSubnames] = useState<string[]>(['']);

  const handleAppend = useCallback(() => {
    if (fields.length >= 10) {
      return message.warning('最多添加10个');
    }

    append(defaultChild);

    setSubtypes([...subtypes, -1]);
    setSubnames([...subnames, '']);
  }, [fields]);

  const handleSwapCard = (start: number, end: number) => {
    const newSubtypes = [...subtypes], newSubnames = [...subnames];
    const tempType = newSubtypes[start], tempName = newSubnames[start];

    newSubtypes[start] = newSubtypes[end];
    newSubnames[start] = newSubnames[end];
    newSubtypes[end] = tempType;
    newSubnames[end] = tempName;

    setSubtypes(newSubtypes);
    setSubnames(newSubnames);

    swap(start, end);
  }

  const handleTypeChange = (value: number, index: number) => {
    const targetname = child_options.find(item => item.value === value)?.label as string;

    const newSubtypes = [...subtypes];
    const newSubNames = [...subnames];

    newSubtypes.splice(index, 1, value);
    newSubNames.splice(index, 1, targetname);

    setSubtypes(newSubtypes);
    setSubnames(newSubNames);
  };

  const handleRemoveCard =(index: number)=> {
    const newSubtypes = [...subtypes], newSubnames = [...subnames];

    newSubtypes.splice(index, 1);
    newSubnames.splice(index, 1);

    setSubtypes(newSubtypes);
    setSubnames(newSubnames);
    
    remove(index);
  }

  useEffect(() => {
    if (isEmpty(fields) === true) {
      append(defaultChild);
    } else {
      const fieldTemps = fields.map(fielditem => fielditem.card_temp as number);
      const fieldNames = fields.map(fielditem => typeNameMap[fielditem.card_temp as number]);

      setSubtypes(fieldTemps);
      setSubnames(fieldNames);
    }
  }, []);

  return (
    <>
      <FormItem form name={`${name}[${FORM_ID}]`} label="卡片ID" defaultValue={field[FORM_ID]}>
        <YInput disabled placeholder="保存后自动生成" />
      </FormItem>

      <FormItem form name={`${name}[${FORM_CONTENT}][${FORM_CSS}]`} label="卡片样式">
        <YSelect options={cardCssList} />
      </FormItem>

      <FormItem form name={`${name}[${FORM_TITLE}]`} label="主题文案" defaultValue={field[FORM_TITLE]}>
        <YInput />
      </FormItem>

      <GetContentByDocId name={`${name}[${FORM_CONTENT}]`} />

      {/*  跳转 */}
      <CardAction name={`${name}[${FORM_ACTIONS}]`} defaultAction={field[FORM_ACTIONS]} />

      <section className="cardchild-header">
        <h5>子卡片配置</h5>
        <Button size="small" type="primary" onClick={handleAppend}>
          添加子卡片
        </Button>
      </section>
      <Collapse className="cardchild" defaultActiveKey={fields[0]?.id}>
        {fields.map((fieldItem, index) => {
          return (
            <Collapse.Panel
              forceRender={true} // react-hook-form依赖表单dom，取消forceRender会导致数据获取不成功等问题
              key={fieldItem.id!}
              header={`子卡片${subnames[index] ? '_' + subnames[index] : ''}_${index}`}
              extra={
                <>
                  {/* {index > 0 ? (
                    <Button size="small" type="link" onClick={e => handleSwapCard(index, index - 1)}>
                      上移
                    </Button>
                  ) : null}
                  {index < fields.length - 1 ? (
                    <Button size="small" type="link" onClick={e => handleSwapCard(index, index + 1)}>
                      下移
                    </Button>
                  ) : null} */}
                  <Button size="small" type="link" onClick={() => handleRemoveCard(index)}>
                    删除
                  </Button>
                </>
              }
            >
              <FormItem form name={`${name}[${FORM_CHILDS}][${index}][${FORM_TEMP}]`} label="子卡片类型" defaultValue={fieldItem[FORM_TEMP]}>
                <YSelect
                  options={child_options.filter(child => child.belongs.includes(TEMP_2005))}
                  onExtraChange={value => handleTypeChange(value, index)}
                />
              </FormItem>
              {subtypes[index] === TEMP_2003 ? (
                <Child_2003
                  name={`${name}[${FORM_CHILDS}][${index}]`}
                  field={fieldItem as ArrayField<CardForm, 'id'>}
                />
              ) : null}

              {subtypes[index] === TEMP_2006 ? (
                <Child_2006
                  name={`${name}[${FORM_CHILDS}][${index}]`}
                  field={fieldItem as ArrayField<CardForm, 'id'>}
                />
              ) : null}
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </>
  );
};

export default React.memo(Card_2005);
