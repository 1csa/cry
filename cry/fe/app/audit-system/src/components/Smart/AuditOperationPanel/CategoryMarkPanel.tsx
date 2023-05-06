/**
 * 质量审核模板
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Button, message, Tag, Radio, Select, Divider, Modal, Card } from 'antd';

import { fetchMainCategoryMarkLabels, fetchSubcategory } from '@/components/BusinessLogic/common/cascaderItems/categoryMarkLabelsItem';
import { submitTaskParamsInAuditOperation } from '@/components/BusinessLogic';
import { parseUserReviewResult } from '@/components/BusinessLogic/parseReshowData';
import handleTaskSubmit from './handleTaskSubmit';

import { OnlyStringSelectOptionsType } from '@/types';
import { ICategoryMarkingState, ConnectState, CommonLogicState } from '@/models/connect';
import { ILabelGroup, IlabelGroupDimensionVos, MainLabel } from '@/models/categoryMarking';
import pySegSort, { IfinaData, ITagsTypes } from '@/utils/pySegSort';
import { saftyTags } from '@/data/constants';

import './index.less';

const { CheckableTag } = Tag;
const { Option } = Select;

type ChildrenTags = 'userUploadTags' | 'machineTags' | 'saftyTags';
export type ITags = Record<ChildrenTags, string[]>;
interface ICategoryMarking {
  isVideo: boolean; // 根据视频和图文区分页面布局
  material: any; // 物料里的所有数据
  reloadCallBack: () => void;
}

const CategoryMarkingPanel: React.FC<ICategoryMarking> = ({ isVideo, material, reloadCallBack }) => {
  const dispatch = useDispatch();
  const commonLogic = useSelector<ConnectState, CommonLogicState>(state => state?.commonLogic);
  const categoryMarking = useSelector<ConnectState, ICategoryMarkingState>(state => state?.categoryMarking);

  const isHis = sessionStorage.isHis === 'true';
  const defaultValue = useMemo(() => {
    const { features } = material?.extraInfo;
    const { tag } = typeof features === 'string' && features.length > 0 ? JSON.parse(features) : features || { tag: {} };
    let initValue: Map<string, string | string[]> = new Map([
      ['allUserTag', tag?.user_tags || []],
      ['allVTag', tag?.vtags || []],
    ]);
    // 如果是历史数据，用户打标的结果应该从result_x中获取
    if (isHis) {
      const initResult = parseUserReviewResult(commonLogic);
      let dataKey = ['bigCategory', 'smallCategory', 'userUploadTags', 'machineTags', 'saftyTags', 'tags'];
      dataKey.forEach(ele => {
        initValue.set(ele, initResult[ele]);
      });
    } else {
      // 如果不是历史数据，则应该从material里获取初始化的数据
      initValue.set('bigCategory', (Array.isArray(tag?.ncat_class) && tag?.ncat_class.length > 0 && tag?.ncat_class[0]) || '');
      initValue.set('smallCategory', (Array.isArray(tag?.nsubcat_class) && tag?.nsubcat_class.length > 0 && tag?.nsubcat_class[0]) || '');
      let dataKey = ['userUploadTags', 'machineTags', 'saftyTags', 'tags'];
      dataKey.forEach(ele => {
        initValue.set(ele, []);
      });
    }
    return initValue;
  }, [material.id]);

  const [tags, setTags] = useState<ITags>({
    userUploadTags: defaultValue?.get('userUploadTags') as string[],
    machineTags: defaultValue?.get('machineTags') as string[],
    saftyTags: defaultValue?.get('saftyTags') as string[],
  }); // 'userUploadTags' | 'machineTags' | 'saftyTags' 三个标签的数据 这是用户打的
  const [oneLvContentTypes, setOneLvContentTypes] = useState<OnlyStringSelectOptionsType[]>([]); // 内容大类所有数据
  const [twoLvContentTypes, setTwoLvContentTypes] = useState<OnlyStringSelectOptionsType[]>([]); // 二级所有分类
  const [bigCategoryValue, setBigCategoryValue] = useState<string>(defaultValue?.get('bigCategory') as string); // 内容大类选中的数据
  const [smallCategoryValue, setSmallCategoryValue] = useState<string>(defaultValue?.get('smallCategory') as string); // 二级分类选中的数据
  const [labelGroups, setLabelGroups] = useState<ILabelGroup[]>([]); // 所有标签
  const [inputValue, setInputValue] = useState<string>(''); // 输入的数据
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [nowTagsItem, setNowTagsItem] = useState<IlabelGroupDimensionVos>(); // 当前当前more之后属于哪一个分类下的item
  const [currentModalMoreTags, setCurrentModalMoreTags] = useState<IfinaData[]>([]); // 点击更多之后弹窗里按照拼音排序的数据
  const [selectedItem, setSelectedItem] = useState<boolean>(false);

  /**
   * 用户上传标签、机器标注标签 触发方法
   * @param tag 标签选中的数据
   * @param checked 是否勾选
   * @param selectProps 选中的是二者中的哪个？
   */
  const handleTagChange = (tag: number | string, checked: boolean, selectProps: string) => {
    const nextSelectedTags = checked ? [...(tags[selectProps] || []), tag] : tags[selectProps]?.filter((t: number) => t !== tag);
    const updateTags = { ...tags, ...{ [selectProps]: nextSelectedTags } };
    setTags(updateTags);
  };

  /**
   * 切换大类的时候 获取小类和标签
   * @param tag 切换的时候标签的数据
   * @param type 大类还是小类
   */
  const handleTypesChange = (tag: string, type: string, isInit: boolean, arr?: MainLabel[]) => {
    // 设置大类菜单的选中
    if (type.toLowerCase() === 'one') {
      setBigCategoryValue(tag);
      setSmallCategoryValue('');
      const bigTypeArrs = isInit ? arr : oneLvContentTypes;
      const labelName = bigTypeArrs?.find(item => item.value === tag)?.label || '';

      // 获取小类菜单, 根据大类获取标签类型、维度、标签
      Promise.all([handleSubcategoryList(tag), handleLabels(labelName, tag)]).then(([sub, labels]) => {
        // 更新小类的所有后选项
        Array.isArray(sub) ? setTwoLvContentTypes(sub) : setTwoLvContentTypes(sub[tag]);
        if (isInit) {
          // 处理显示大小类
          // 这里处理一下，如果是初始化应该处理一下按照 "/" 来截取获取子类的value来回显数据
          // 否则就用"其他"来回显
          const initSV = smallCategoryValue.length > 0 && smallCategoryValue.includes('/') ? smallCategoryValue.split('/')[1] : smallCategoryValue;
          if (Array.isArray(sub[tag]) || Array.isArray(sub)) {
            const data = sub[tag] || sub;
            const subInitValue =
              data?.find((ele: MainLabel) => ele.label === initSV)?.value || data?.find((ele: MainLabel) => ele.label === '其他')?.value;
            subInitValue && setSmallCategoryValue(subInitValue);
          }

          // 接口返回的全量数据
          const initAllLabels = Array.isArray(labels) ? labels : labels[tag];
          // 这里回显标签 获取用户已经打的标签内容
          const userSelectedTags = defaultValue?.get('tags') as any[];
          // 这里深克隆一组数据，避免数据引用同一个地址导致打过打标签一只存在。
          const newAllLabels = JSON.parse(JSON.stringify(initAllLabels));

          // 这因为 全量和用户打的标签的数据都是树形结构，需要一层一层遍历判断，再将selected字段扩展到初始化的数据中，这样才能回显
          // console.time();
          /**
           * 四层循环实在是被逼无奈，但是效果还好，最慢可能就是0.2ms?
           * 这里如果要优化的话，可以利用空间换时间
           * 先遍历一次历史打过的标签，将树形的路径搞成字符串的形式，通过遍历识别路径
           */
          if (isHis) {
            userSelectedTags?.forEach(ele => {
              newAllLabels?.forEach((item: any) => {
                if (ele?.type === item.semantics) {
                  ele?.dimensions.forEach((selectedVal: any) => {
                    item.labelGroupDimensionVos.forEach((labelVal: any) => {
                      if (selectedVal?.dimension === labelVal?.name) {
                        labelVal.selected =
                          selectedVal?.tags?.map((tagItem: string) => {
                            return {
                              label: tagItem,
                              value: tagItem,
                            };
                          }) || [];
                      }
                    });
                  });
                }
              });
            });
          }
          // console.timeEnd();
          // 使用新处理的数据更新回显数据
          setLabelGroups([...newAllLabels]);
        } else {
          // 如果不是初始化的时候调用，就用获取新接口之后的数据更新
          Array.isArray(labels) ? setLabelGroups(labels) : setLabelGroups(labels[tag]);
        }
      });
    } else {
      setSmallCategoryValue(tag);
    }
  };

  /**
   * 切换展示的标签的选中和取消
   * @param checked 是否选中
   * @param item 当前选择的项目
   * @param fatherItem 父级项
   */
  const handleLabelChange = (checked: boolean, item: { tag: string }, fatherItem: IlabelGroupDimensionVos) => {
    const filterItem = [item].map(item => {
      return {
        label: item?.tag,
        value: item?.tag,
      };
    });
    const isExit = fatherItem?.selected?.filter(ele => ele.label === item.tag);
    if (!isExit?.length) {
      // 获取父级项的原因是需要给其下增加selected扩展
      if (checked) {
        fatherItem.selected = [...(fatherItem?.selected || []), ...filterItem];
      } else {
        fatherItem.selected = fatherItem?.selected?.filter((val: OnlyStringSelectOptionsType) => val?.value !== item?.tag) || [];
      }
    }
    setLabelGroups([...labelGroups]);
  };

  /**
   * 捕获查询事件
   * @param value
   * @param item
   */
  const handleSearch = (value: string) => {
    if (value.length > 50) {
      setInputValue(value.slice(0, 50));
      message.warning('输入的标签长度不能大于50！');
      return false;
    }
    // 重置掉状态
    setSelectedItem(false);
    value && setInputValue(value);
  };

  /**
   * 这是触发selected下拉菜单选中、和回车按键之后的处理逻辑
   * @param item
   * @param value
   */
  const updateSelectedLabels = (item: IlabelGroupDimensionVos, value: string) => {
    // 判断有的话就不再执行，因为selected事件在up之前
    if (!selectedItem) {
      // 查看现在的label里面有没有
      const findItem = item?.labels?.filter(ele => ele.tag?.includes(value))?.filter(ele => ele?.tag === value);
      handleLabelChange(true, findItem.length > 0 ? { tag: findItem[0]?.tag } : { tag: value }, item);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>, item: IlabelGroupDimensionVos) => {
    const findItem = item?.labels?.filter(ele => ele.tag?.includes(inputValue))?.filter(ele => ele?.tag === inputValue);

    if (!findItem) {
      // 重置掉状态
      setSelectedItem(false);
    }
    if (e.key === 'Enter' && inputValue) {
      updateSelectedLabels(item, inputValue);
    }
  };

  /**
   * selected选中的时候触发事件
   */
  const handleSelect = (value: any, item: IlabelGroupDimensionVos) => {
    const findItem = item?.labels?.filter(ele => ele.tag?.includes(value))?.filter(ele => ele?.tag === value);

    if (findItem?.length > 0) {
      // 重置掉状态
      setSelectedItem(false);
    } else {
      setSelectedItem(true);
    }
    updateSelectedLabels(item, value);
  };

  /**
   * 标签关闭之后触发回调函数
   * @param val
   * @param item
   */
  const handleTagClose = (val: OnlyStringSelectOptionsType, item: IlabelGroupDimensionVos) => {
    item.selected = item?.selected?.filter((ele: OnlyStringSelectOptionsType) => ele.value !== val.value) || [];
    setLabelGroups([...labelGroups]);
  };

  /**
   * 点击更多
   * @param item
   * @param index
   */
  const handleMore = (item: IlabelGroupDimensionVos, index: number) => {
    setCurrentModalMoreTags(pySegSort(item?.labels || [])!);
    setNowTagsItem(item);
    setIsModalVisible(true);
  };
  const handleModalOk = () => {};
  const handleModalTagChange = (val: string) => {
    handleLabelChange(true, { tag: val }, nowTagsItem!);
  };

  /**
   * 接口获取所有大类，这里处理了用缓存读缓存 否则采取请求
   */
  const handleAllCategoryList = async () => {
    const bigArr = await fetchMainCategoryMarkLabels(dispatch, categoryMarking);
    const bigCatInitValue = bigArr?.find(ele => ele.label === bigCategoryValue)?.value;
    // console.log('interface handleAllCategoryList fn 分类标注大类数据：', bigArr);
    setOneLvContentTypes(bigArr);
    if (bigCatInitValue) {
      setBigCategoryValue(bigCatInitValue);
      handleTypesChange(bigCatInitValue, 'one', true, bigArr);
    }
  };
  /**
   * 根据大类的code请求接口
   * @param code
   */
  const handleSubcategoryList = async (code: string) => {
    return await fetchSubcategory(dispatch, categoryMarking, code);
  };

  const handleLabels = (category: string, code: string): {} => {
    if (categoryMarking?.labelsMap && categoryMarking?.labelsMap[code]) {
      const newLabelsMap: ILabelGroup[] = [];
      // 这里重新设置一下数据，当切换大类之后，之前选择的selected就不需要了，并且更新dva中的数据避免引起错误
      categoryMarking?.labelsMap[code]?.forEach((item, idx) => {
        const v = {
          index: item?.index,
          semantics: item?.semantics,
          sort: item?.sort,
          labelGroupDimensionVos: item?.labelGroupDimensionVos.map(ele => {
            return {
              name: ele?.name,
              labels: ele?.labels,
            };
          }),
        };
        newLabelsMap[idx] = v;
      });
      // 更新一下内存中的数据
      dispatch({
        type: 'categoryMarking/saveLabels',
        payload: {
          [code]: newLabelsMap,
        },
      });
      return newLabelsMap;
    } else {
      return new Promise((resolve, reject) => {
        const data = dispatch({
          type: 'categoryMarking/fetchLabels',
          payload: {
            category,
            code,
          },
        });
        resolve(data);
      }).catch(err => {
        message.error('根据大类获取标签类型、维度、标签失败');
      });
    }
  };
  const getTagsOptions = () => {
    return {
      userUploadTags: tags?.userUploadTags,
      machineTags: tags?.machineTags,
      bigCategory: oneLvContentTypes.find(ele => ele.value === bigCategoryValue)?.label,
      smallCategory: twoLvContentTypes.find(ele => ele.value === smallCategoryValue)?.label,
      tags:
        labelGroups.map(item => {
          return {
            type: item?.semantics,
            dimensions:
              item?.labelGroupDimensionVos.map(ele => {
                return {
                  dimension: ele?.name,
                  tags: ele?.selected?.map(val => val.label) ?? [],
                };
              }) ?? [],
          };
        }) ?? [],
      saftyTags: saftyTags.filter(ele => tags?.saftyTags?.includes(ele)).map(item => item),
      // saftyTags: tags?.saftyTags
    };
  };
  const handleSumbit = () => {
    if (!bigCategoryValue || !smallCategoryValue) {
      message.warning('请选择大小类！');
      return false;
    }
    handleSubmitApi(getTagsOptions());
  };

  const handleSubmitApi = (labels: ReturnType<typeof getTagsOptions>) => {
    handleTaskSubmit([submitTaskParamsInAuditOperation(material, 3001, 'pass', [labels])], false, reloadCallBack);
  };

  useEffect(() => {
    handleAllCategoryList();
  }, []);

  /**
   * 渲染选择框
   */
  const renderSelect = (labels: ITagsTypes[], item: IlabelGroupDimensionVos) => {
    const srcData = Array.isArray(labels)
      ? labels?.map(ele => {
          return {
            label: ele.tag,
            value: ele.tag,
          };
        })
      : [];
    return (
      <Select
        allowClear={true}
        style={{ width: 200 }}
        placeholder="自定义标签"
        showSearch
        filterOption={(input, option) => (typeof option?.key === 'string' ? option?.key?.includes(input) : false)}
        notFoundContent={null}
        onSearch={val => handleSearch(val)}
        onKeyUp={val => handleKeyUp(val, item)}
        onSelect={val => handleSelect(val, item)}
        defaultActiveFirstOption={false}
      >
        {srcData.length
          ? srcData.map((ele: OnlyStringSelectOptionsType) => {
              return (
                <Option key={ele.label} value={ele.value}>
                  {ele.label}
                </Option>
              );
            })
          : null}
      </Select>
    );
  };

  /**
   * 渲染两组标签
   */
  const renderTags = (title: string, mapArray: string[], selectProps: string) => (
    <>
      <h4>{title}</h4>
      {mapArray?.map((item: string, index: number) => (
        <CheckableTag
          key={`${item} - ${index}`}
          checked={tags[selectProps]?.includes(item)}
          onChange={checked => handleTagChange(item, checked, selectProps)}
        >
          {item}
        </CheckableTag>
      ))}
    </>
  );

  /**
   * 渲染大类和小类
   */
  const renderTypes = (title: string, options: OnlyStringSelectOptionsType[], value: string, type: string) => (
    <>
      <h4>{title}</h4>
      <Radio.Group
        options={options}
        onChange={event => handleTypesChange(event.target.value, type, false)}
        value={value}
        optionType="button"
        buttonStyle="solid"
      />
    </>
  );

  return (
    <>
      <Card>
        <div className="category-panel-card">
          <h3>审核操作</h3>
          <div className="tags-group mb10">
            {defaultValue?.get('allUserTag')!?.length > 0 &&
              renderTags('用户上传标签', defaultValue?.get('allUserTag') as string[], 'userUploadTags')}
          </div>
          <div className="tags-group mb10">
            {defaultValue?.get('allVTag')!?.length > 0 && renderTags('机器标注标签', defaultValue?.get('allVTag') as string[], 'machineTags')}
          </div>
          <div className="content-type mb10">{renderTypes('内容大类', oneLvContentTypes, bigCategoryValue!, 'one')}</div>
          <div className="content-type mb10">{renderTypes('内容小类', twoLvContentTypes, smallCategoryValue!, 'two')}</div>
          <div className="label-group">
            {labelGroups?.map(item => {
              return (
                <div key={item.semantics} className="label-group-item">
                  <h4>{item?.semantics}</h4>
                  <div className="content-block">
                    {item.labelGroupDimensionVos
                      ?.filter(mainValue => mainValue.labels.length > 0)
                      ?.map((vals: IlabelGroupDimensionVos, index: number) => (
                        <div className={isVideo ? 'label-content label-content-video' : 'label-content label-content-article'} key={vals.name}>
                          <div className="init-tags mb10">
                            <div className="tags">
                              {vals?.labels?.slice(0, 5).map(eles => (
                                <CheckableTag
                                  key={eles.tag}
                                  checked={!!vals?.selected?.find(v => v.value === eles.tag)}
                                  onChange={checked => handleLabelChange(checked, eles, vals)}
                                >
                                  {typeof eles.tag === 'string' && eles.tag?.trim()?.replace(/\n\r/g, '')}
                                </CheckableTag>
                              ))}
                            </div>
                            {vals?.labels.length > 3 && (
                              <div className="more" onClick={() => handleMore(vals, index)}>
                                全部
                              </div>
                            )}
                          </div>
                          <div className="custom-tags mb10">
                            <div className="name">{vals?.name}：</div>
                            <div className="label-select">{renderSelect(vals?.labels, vals)}</div>
                          </div>
                          <div className="selected">
                            <span className="selected-name name">已选择</span>
                            {vals?.selected?.map((val: OnlyStringSelectOptionsType) => (
                              <Tag key={val.value} closable onClose={() => handleTagClose(val, vals)}>
                                {val?.label}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
          <Divider style={{ margin: '2px 0 20px 0' }} />
          <div className="safty-block">{renderTags('安全性', saftyTags, 'saftyTags')}</div>
          <Divider style={{ margin: '10px 0 20px 0' }} />
          <div className="submit-block">
            <Button size="large" type="primary" onClick={handleSumbit}>
              提交
            </Button>
          </div>
        </div>
      </Card>

      <Modal title="更多选择" visible={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)} footer={null}>
        {currentModalMoreTags?.map(item => {
          return (
            <div key={item.letter}>
              <h4>{item.letter.toUpperCase()}</h4>
              {item.data.map((ele: string) => (
                <CheckableTag key={ele} checked={false} onChange={() => handleModalTagChange(ele)}>
                  #{ele}
                </CheckableTag>
              ))}
            </div>
          );
        })}
      </Modal>
    </>
  );
};

export default React.memo(CategoryMarkingPanel);
