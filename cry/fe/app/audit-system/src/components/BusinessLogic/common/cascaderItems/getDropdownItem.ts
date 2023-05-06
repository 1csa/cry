import produce from 'immer';

import { Dispatch } from '@/models/connect';
import { SelectOptionsType, BaseFormModelType } from '@/types';

type auditLevelType = {
  [K: string]: number;
};

/**
 * 获取 业务类型、子业务、内容类型的联动数据以及待审核数量
 * 接口地址【http://ydwiki.yidian-inc.com/pages/viewpage.action?pageId=54730863】
 * @param material_type 内容类型
 * @param countAuditWait 是否需要待审核数量
 */
export async function saveDropdownListInDva(dispatch: Dispatch, material_type: number[], countAuditWait?: number): Promise<any> {
  try {
    const selectList = await dispatch({
      type: 'commonLogic/fetchBusinessFormItemCascaderDropDownList',
      payload: {
        material_type,
        countAuditWait,
      },
    });
    if (Array.isArray(selectList)) {
      return selectList;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取所属业务 标准化数据 只获取第一个 后面的是需要联动的 数据做一个从大到小的排序方便选择
 * @param selectItem
 */
export function getSelectedItem(selectItem: any[], needCount: boolean = false): SelectOptionsType[] {
  return selectItem
    ?.map((ele: any) => {
      return {
        label: needCount ? `${ele.cn ?? ele.displayText ?? ele.text} - ${ele.count || 0}` : ele.cn ?? ele.displayText ?? ele.text,
        value: ele.id ?? ele.code ?? ele.value,
        sort: ele.count || 0,
      };
    })
    .sort((x, y) => y.sort - x.sort);
}

/**
 * 设置所属业务 赋值
 * @param initFormModel
 * @param itemObj
 */
export function setCascaderItem(initFormModel: BaseFormModelType[], itemObj: Object, auditLevelCountObj?: auditLevelType): BaseFormModelType[] {
  const newState = produce(initFormModel, (draft: any) => {
    draft.forEach((item: BaseFormModelType) => {
      if (item.name && item.name !== 'audit_level' && item.sourceData && itemObj[item.name]) {
        item.sourceData = itemObj[item.name];
      }
      // 为审核阶段设置count
      if (auditLevelCountObj && item.name === 'audit_level') {
        Array.isArray(item.sourceData) &&
          item.sourceData.forEach((ele, idx) => {
            ele.label = ele.label.includes(' - ')
              ? `${ele.label.split(' - ')[0]} - ${auditLevelCountObj[`audit_level${idx + 1}`]}`
              : `${ele.label} - ${auditLevelCountObj[`audit_level${idx + 1}`]}`;
          });
      }
    });
  });

  return newState;
}
