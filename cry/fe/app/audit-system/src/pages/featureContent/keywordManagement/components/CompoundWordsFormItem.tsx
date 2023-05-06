import React from 'react';
import { Form, Popover, InputNumber } from 'antd';
import Iconfont from '@/components/Dumb/Iconfont';

interface IsToggleCompoundWordsProps {
  switchChecked: boolean;
  mixDistance: string;
  autoFormItemList: number[];
}

const ToggleCompoundWords: React.FC<IsToggleCompoundWordsProps> = ({ switchChecked, mixDistance, autoFormItemList }) => {
  /**
   * 需要自动增加的表单项
   * @param index
   */
  const basicAutoFormItem = (index: number, value?: number | string) => {
    return (
      <Form.Item
        key={index}
        label={
          <>
            {`组合词间距离${index}`}
            <Popover content={`表示组合词间间距的浮动距离，即从0到设定值的距离。`}>
              <span>
                <Iconfont name="iconbangzhu" />
              </span>
            </Popover>
          </>
        }
        name={`mixDistance_${index}`}
      >
        <InputNumber
          min={0}
          max={10}
          defaultValue={value || value === 0 ? value : 0}
          value={value}
          disabled={false}
          precision={0}
          parser={data => {
            return data ? data : 0;
          }}
        />
      </Form.Item>
    );
  };

  return (
    <>
      {switchChecked ? (
        <>
          {/* {typeof mixDistance === 'string'
            ? mixDistance?.split(',')?.map((item: string, index: number) => {
                return basicAutoFormItem(index, +item.split(':')[1]);
              })
            : null} */}
          {/* {autoFormItemList.map(item => basicAutoFormItem(item))} */}
          {autoFormItemList.map((item: number, index: number) => {
            return basicAutoFormItem(item, typeof mixDistance === 'string' ? +mixDistance?.split(',')[index]?.split(':')[1] : 0);
          })}
          {/* <Form.Item
            label={
              <>
                组合词总最大距离
                <Popover
                  content={`表示组合词第一个词到最后一个词之间的总字符数，当设置该值时，“组合词间距离”将不再生效。`}
                >
                  <span>
                    <Iconfont name="iconbangzhu" />
                  </span>
                </Popover>
              </>
            }
            name="mixMaxLength"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={30}
              disabled={false}
              precision={0}
              placeholder="0 表示不限制，设置该值后将忽略“组合词间距离”"
            />
          </Form.Item> */}
        </>
      ) : null}
    </>
  );
};

export default ToggleCompoundWords;
