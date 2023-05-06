import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import { Radio, Checkbox, Input, Tag } from 'antd';
import { REVIEWPANEL } from '@/config/constant';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

interface IOperationalGroup {
  defaultValue: IFormValue;
  isHis: boolean;
}
export interface IFormValue {
  operation: string;
  score: number;
  reason?: CheckboxValueType[];
  high_quality_reason?: CheckboxValueType[];
  low_quality_reason?: CheckboxValueType[];
  attribute?: string;
  otherV?: string;
  scope?: number;
}
export interface IHandler {
  onSubmit: () => IFormValue;
  onReset: () => void;
}
const OperationalGroup = React.forwardRef<IHandler, IOperationalGroup>(
  ({ defaultValue, isHis }, ref) => {
    const [reasonValue, setReasonValue] = useState<string>(defaultValue?.otherV || '');
    const [lowQualityInputValue, setLowQualityInputValue] = useState<string>(
      defaultValue?.otherV || '',
    );
    const [levelOneTag, setLevelOneTag] = useState<string[]>();
    const [levelTwoTag, setLevelTwoTag] = useState<
      {
        label: string;
        value: string;
      }[]
    >();
    const [formValue, setFormValue] = useState<IFormValue>(defaultValue);
    const [oldHisCheckbox, setOldHisCheckbox] = useState<CheckboxValueType[]>([]);
    const [gop, setGop] = useState<string>();

    const reasonRef = useRef(null);
    const lowQualityRef = useRef(null);

    const onChangeOperationRadio = (e: RadioChangeEvent) => {
      setFormValue({
        ...formValue,
        ...{ operation: e.target.value },
        // ...{ operation: e.target.value, attribute: '' },
      });

      const { levelOne, levelTwo } = REVIEWPANEL.reviewReason[e.target.value];
      setLevelOneTag(levelOne);
      setLevelTwoTag(levelTwo);
    };

    const initOperationRadio = (op: string) => {
      const { levelOne, levelTwo } =
        op === 'notfront' ? REVIEWPANEL.reviewReason['low'] : REVIEWPANEL.reviewReason[op];
      // defaultValue.high_quality_reason = ['影响力12', '丰富性', '实用性', '趣味性'];
      let oldC: CheckboxValueType[] = [];
      if (
        Array.isArray(defaultValue?.high_quality_reason) &&
        defaultValue?.high_quality_reason!.length > 0
      ) {
        defaultValue?.high_quality_reason.forEach((element: CheckboxValueType) => {
          if (!levelOne?.includes(element)) {
            oldC = [...oldC, element];
          }
        });
        setOldHisCheckbox(oldC);
      }
      setLevelOneTag(levelOne);
      setLevelTwoTag(levelTwo);
    };

    // 优质原因 多选改变的时候
    const onChangeTopReason = (data: CheckboxValueType[]) => {
      setFormValue({
        ...formValue,
        ...{ high_quality_reason: data },
      });
    };

    // 标注项 改变
    const onChangeReason = (data: CheckboxValueType[]) => {
      if (!data?.includes('其他')) {
        setReasonValue('');
      } else {
        // @ts-ignore
        reasonRef?.current?.focus();
      }
      setFormValue({ ...formValue, ...{ reason: data } });
    };
    const onReasonInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setReasonValue(e.target.value);
    };

    // 低质原因
    const onChangeLowQualityReason = (data: CheckboxValueType[]) => {
      if (!data?.includes('其他')) {
        setLowQualityInputValue('');
      } else {
        // @ts-ignore
        lowQualityRef?.current?.focus();
      }
      setFormValue({ ...formValue, ...{ low_quality_reason: data, score: 2 } });
    };
    const onLowQualityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLowQualityInputValue(e.target.value);
    };

    const onChangeArticleAttr = (e: RadioChangeEvent) => {
      setFormValue({ ...formValue, ...{ attribute: e.target.value } });
    };

    const onSubmit = () => {
      // 父组件调用子组件，获取参数
      if (formValue?.operation === 'pass') {
        const { low_quality_reason, reason, ...other } = formValue;
        return { ...other, scope: 0 };
      } else if (formValue?.operation === 'low') {
        const { operation, reason, score } = formValue;
        return { operation, reason, score, otherV: reasonValue, scope: 67108864 };
      } else if (formValue?.operation === 'deep') {
        const { low_quality_reason, score, operation } = formValue;
        return { operation, low_quality_reason, score, otherV: lowQualityInputValue, scope: 256 };
      } else {
        const { low_quality_reason, score, operation } = formValue;
        return { operation, low_quality_reason, score, otherV: lowQualityInputValue, scope: 1 };
      }
    };

    const onReset = () => {
      setFormValue({
        operation: '',
        reason: [],
        attribute: '',
        score: 3,
        low_quality_reason: [],
        high_quality_reason: [],
        otherV: '',
      });
      setReasonValue('');
      setLowQualityInputValue('');
    };
    useImperativeHandle(ref, () => ({
      onSubmit: onSubmit,
      onReset: onReset,
    }));

    useEffect(() => {
      defaultValue?.operation && initOperationRadio(defaultValue?.operation);
    }, []);

    const passRender = () => (
      <div>
        <div style={{ display: 'flex' }}>
          <h4 className="opt-title">优质原因:</h4>
          <div className="opt-wrapper">
            <Checkbox.Group onChange={onChangeTopReason} value={formValue?.high_quality_reason}>
              {Array.isArray(levelOneTag)
                ? levelOneTag?.map(item => {
                    return (
                      <Checkbox key={item} value={item}>
                        {item}
                      </Checkbox>
                    );
                  })
                : null}
              {isHis && oldHisCheckbox.toString() && (
                <Tag color="magenta">历史标签：{oldHisCheckbox.toString()}</Tag>
              )}
            </Checkbox.Group>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <h4 className="opt-title">
            <span style={{ color: 'red' }}>*</span>文章属性:
          </h4>
          <div className="opt-wrapper">
            <Radio.Group onChange={onChangeArticleAttr} value={formValue?.attribute}>
              {Array.isArray(levelTwoTag)
                ? levelTwoTag?.map(item => {
                    return (
                      <Radio key={item.value} value={item.value}>
                        {item.label}
                      </Radio>
                    );
                  })
                : null}
            </Radio.Group>
          </div>
        </div>
      </div>
    );

    const reasonRender = () => (
      <div>
        <div style={{ display: 'flex' }}>
          <h4 className="opt-title">
            <span style={{ color: 'red' }}>*</span>
            标注项:
          </h4>
          <div className="opt-wrapper">
            <Checkbox.Group onChange={onChangeReason} value={formValue?.reason}>
              {Array.isArray(levelOneTag)
                ? levelOneTag?.map(item => {
                    return (
                      <Checkbox key={item} value={item}>
                        {item}
                      </Checkbox>
                    );
                  })
                : null}
              <span>
                <Input
                  placeholder="请输入其他原因"
                  onChange={onReasonInput}
                  value={reasonValue}
                  style={{ width: 240 }}
                  ref={reasonRef}
                />
              </span>
            </Checkbox.Group>
          </div>
        </div>
      </div>
    );
    const lowQualityReason = () => (
      <div>
        <div style={{ display: 'flex' }}>
          <h4 className="opt-title">
            <span style={{ color: 'red' }}>*</span>
            负向操作原因:
          </h4>
          <div className="opt-wrapper">
            <Checkbox.Group
              onChange={onChangeLowQualityReason}
              value={formValue?.low_quality_reason}
            >
              {Array.isArray(levelOneTag)
                ? levelOneTag?.map(item => {
                    return (
                      <Checkbox key={item} value={item}>
                        {item}
                      </Checkbox>
                    );
                  })
                : null}
              <span>
                <Input
                  placeholder="请输入其他原因"
                  onChange={onLowQualityInput}
                  value={lowQualityInputValue}
                  style={{ width: 240 }}
                  ref={lowQualityRef}
                />
              </span>
            </Checkbox.Group>
          </div>
        </div>
      </div>
    );

    const renderTypePanel = (type: string) => {
      const obj = {
        pass: passRender,
        low: reasonRender,
        deep: lowQualityReason,
        removed: lowQualityReason,
      };
      return obj[type] && obj[type]();
    };

    return (
      <>
        <div>
          <h4 className="opt-title">
            <span style={{ color: 'red' }}>*</span> 操作:
          </h4>
          <div className="opt-wrapper">
            <Radio.Group onChange={onChangeOperationRadio} value={formValue?.operation}>
              {REVIEWPANEL.operationalGroup.map(item => {
                return (
                  <Radio key={item.value} value={item.value}>
                    {item.label}
                  </Radio>
                );
              })}
            </Radio.Group>
          </div>
        </div>
        {formValue?.operation ? renderTypePanel(formValue?.operation) : null}
      </>
    );
  },
);
export default OperationalGroup;
