/**
 * 二级子卡片,
 */

// TODO: fix子卡片交换位置时字段丢失问题，default value提供所有字段，对于非必须字段使用null值填充，提交时去掉null值
import React, { useState, useEffect, useMemo } from 'react';
import { Button, Collapse, Divider } from 'antd';
import { useFieldArray, ArrayField, useFormContext } from 'react-hook-form';
import { connect } from 'dva';
import { YSelect, FormItem, YInput } from '@/components';
import { isEmpty } from '@/utils';

import { TEMP_2002, TEMP_2003, TEMP_1002, TEMP_1003 ,TEMP_2007, TEMP_2008, TEMP_2005, TEMP_2004 } from '@/config/card.config';
import { defaultChild, child_options, FORM_TEMP, FORM_CONTENT, FORM_TOP } from '@/config/card.config';
import { Child_2002, Child_2003, Child_2004, Child_2005, Child_2007, Child_2008 } from '@/pages/cards/temps';
import { CardForm } from '@/types/card';
import { ConnectState, CardModelState } from '@/types/connect';
import '../index.less';

interface CardChild {
  parent: number;
  name: string;
  card: CardModelState;
}

const CardChild: React.FC<CardChild> = ({ parent, name }) => {
  const typeNameMap = useMemo(() => Object.fromEntries(child_options.map(({ label, value }) => [value, label])), []);
  const formContext = useFormContext();
  const { fields, append, remove, swap } = useFieldArray<CardForm>({ name, control: formContext.control });

  const [subtypes, setSubTypes] = useState<number[]>([-1]);
  const [subnames, setSubnames] = useState<string[]>(['']);

  const handleTypeChange = (value: number, index: number) => {
    const targetname = child_options.find(item => item.value === value)?.label as string;

    const newSubtypes = [...subtypes];
    const newSubNames = [...subnames];

    newSubtypes.splice(index, 1, value);
    newSubNames.splice(index, 1, targetname);

    setSubTypes(newSubtypes);
    setSubnames(newSubNames);
  };

  const handleAppendChild = () => {
    append(defaultChild);

    setSubTypes([...subtypes, -1]);
    setSubnames([...subnames, '']);
  };

  const handleSwapCard = (start: number, end: number) => {
    const newSubtypes = [...subtypes], newSubnames = [...subnames];
    const tempType = newSubtypes[start], tempName = newSubnames[start];

    newSubtypes[start] = newSubtypes[end];
    newSubnames[start] = newSubnames[end];
    newSubtypes[end] = tempType;
    newSubnames[end] = tempName;

    setSubTypes(newSubtypes);
    setSubnames(newSubnames);

    swap(start, end);
  }

  const handleRemoveCard = (index: number) => {
    const newSubtypes = [...subtypes], newSubnames = [...subnames];

    newSubtypes.splice(index, 1);
    newSubnames.splice(index, 1);

    setSubTypes(newSubtypes);
    setSubnames(newSubnames);

    remove(index);
  }

  useEffect(() => {
    if (isEmpty(fields) === true) {
      append(defaultChild);
    } else {
      const fieldTemps = fields.map(fielditem => fielditem.card_temp as number);
      const fieldNames = fields.map(fielditem => typeNameMap[fielditem.card_temp as number]);

      setSubTypes(fieldTemps);
      setSubnames(fieldNames);
    }
  }, []);

  return (
    <>
      <section className="cardchild-header">
        <h4>子卡片配置</h4>
        <Button size="small" type="primary" onClick={handleAppendChild}>
          添加子卡片
        </Button>
      </section>

      <Collapse className="cardchild" defaultActiveKey={fields[0]?.id}>
        {fields.map((fieldItem, index) => {
          return (
            <Collapse.Panel
              key={fieldItem.id!}
              forceRender={true}
              header={`子卡片${subnames[index] ? '_' + subnames[index] : ''}_${index}`}
              extra={
                <>
                  {index > 0 && parent !== TEMP_1003 ? ( // 3级卡片没有上下移
                    <Button size="small" type="link" onClick={() => handleSwapCard(index, index - 1)}>
                      上移
                    </Button>
                  ) : null}
                  {index < fields.length - 1 && parent !== TEMP_1003 ? ( // 3级卡片没有上下移
                    <Button size="small" type="link" onClick={() => handleSwapCard(index, index + 1)}>
                      下移
                    </Button>
                  ) : null}
                  <Button size="small" type="link" onClick={() => handleRemoveCard(index)}>
                    删除
                  </Button>
                </>
              }
            >
              <FormItem form={true} name={`${name}[${index}][${FORM_TEMP}]`} label="子卡片类型">
                <YSelect
                  options={child_options.filter(child => child.belongs.includes(parent))}
                  onExtraChange={value => handleTypeChange(value, index)}
                />
              </FormItem>
              {[TEMP_2004, TEMP_2005].includes(subtypes[index]) ? (
                <FormItem form label="置顶主题卡片序号" name={`${FORM_CONTENT}[${FORM_TOP}]`}>
                  <YInput />
                </FormItem>
              ) : null}
              {subtypes[index] === TEMP_2002 ? (
                <Child_2002 name={`${name}[${index}]`} field={fieldItem as ArrayField<CardForm, 'id'>} />
              ) : null}
              {subtypes[index] === TEMP_2003 ? (
                <Child_2003 name={`${name}[${index}]`} field={fieldItem as ArrayField<CardForm, 'id'>} />
              ) : null}
              {subtypes[index] === TEMP_2004 ? (
                <Child_2004 name={`${name}[${index}]`} field={fieldItem as ArrayField<CardForm, 'id'>} />
              ) : null}
              {subtypes[index] === TEMP_2005 ? (
                <Child_2005 name={`${name}[${index}]`} field={fieldItem as ArrayField<CardForm, 'id'>} />
              ) : null}
              {subtypes[index] === TEMP_2007 ? (
                <Child_2007 name={`${name}[${index}]`} field={fieldItem as ArrayField<CardForm, 'id'>} />
              ) : null}
              {subtypes[index] === TEMP_2008 ? (
                <Child_2008 name={`${name}[${index}]`} field={fieldItem as ArrayField<CardForm, 'id'>} />
              ) : null}
            </Collapse.Panel>
          );
        })}
      </Collapse>
      {[TEMP_1002].includes(parent) ? <Divider /> : null}
    </>
  );
};
export default connect(({ card }: ConnectState) => {
  return { card };
})(React.memo(CardChild));
