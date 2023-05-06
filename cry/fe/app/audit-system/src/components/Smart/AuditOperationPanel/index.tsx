/**
 * 审核操作面板 负责根据不同的模板类型分发或者映射对应的组件
 */
import React, { useState, useEffect } from 'react';

import { saveAuditRetUserReviewTags } from '@/components/BusinessLogic/common';

import ExposureOperationPanel from './ExposurePanel';
import FeedbackOperationPanel from './FeedbackPanel';
import CategoryMarkPanel from './CategoryMarkPanel';
import QualityPanel from './QualityPanel';
import UserAction from './UserAction';

import { BtnGroupTypes } from '@/types';

import './index.less';

type tagTypes = 'business_type' | 'business_unit_type';

const templateNameCollection = ['ConcertPanel', 'ExposurePanel'];
const REJECT = 'reject';
const PASS = 'pass';

const auditResultStatus = {
  [REJECT]: 3002,
  [PASS]: 3001,
};

interface IAOBPProps {
  material: any; // 审核任务物料
  isVideo: boolean; // 视频 | 图文
  templateName: string;
  userReviewResult: string; // 人审结果
  reloadCallBack: () => void; // submit 完成之后的回调
  tagOptions: Record<tagTypes, number[]>;
  jsonResTagDataSource?: any[]; // tag source 来源json 模拟接口的json
  jsonTagDataSource?: { [REJECT]: any; [PASS]: any }; // tag source 来源 接口 | json
  btnCountPerRow?: boolean; // 操作按钮
  btnGroupStatus?: boolean; // 操作按钮是否全部禁用
  panel: string; // video-视频 | article-图文 | live-生活圈
  isInspection: boolean; // 是否质检业务 // 透传到 图文、视频曝光 图文视频质量标注 组件
}

const AuditOperationBasicPanel: React.FC<IAOBPProps> = ({
  material,
  reloadCallBack,
  templateName,
  isVideo,
  tagOptions,
  userReviewResult,
  jsonResTagDataSource,
  jsonTagDataSource,
  btnCountPerRow,
  btnGroupStatus,
  panel,
  isInspection,
}) => {
  const { business_unit_type } = tagOptions;
  const [tagDataSource, setTagDataSource] = useState<Object>({});
  const composeInitTagGroup = (sourceTag: Array<Partial<BtnGroupTypes>>, group?: string) => {
    const newState = Array.isArray(sourceTag) ? sourceTag.slice() : [];
    newState.forEach((item: Partial<BtnGroupTypes>) => {
      item.type = 'default';
      item.disabled = false;
      item.danger = false;
      item.group = group || '';
    });
    return newState;
  };

  /**
   * 将数据重新设置添加一些字段 重新返回
   * @param labelMap 接口返回的数据格式
   */
  const addAttrToVideoTagData = (labelMap: any) => {
    let newObj = {};
    for (const key in labelMap) {
      const element = labelMap[key];
      Object.assign(newObj, {
        [key]: composeInitTagGroup(element, key),
      });
    }
    return newObj;
  };

  // 从接口获取 tag 数据
  const handleMenuTags = async (options: Record<tagTypes, number[]>) => {
    let data: any = [];
    if (jsonResTagDataSource) {
      data = jsonResTagDataSource;
    } else {
      data = await saveAuditRetUserReviewTags({
        business_type: options.business_type,
        business_unit_type: options.business_unit_type,
      });
    }
    const tagDataSourceMap = isVideo
      ? {
          [REJECT]: addAttrToVideoTagData(data.find((item: any) => item.code === auditResultStatus[REJECT])?.labelMap),
          [PASS]: addAttrToVideoTagData(data.find((item: any) => item.code === auditResultStatus[PASS])?.labelMap),
        }
      : {
          [REJECT]: addAttrToVideoTagData(data.find((item: any) => item.code === auditResultStatus[REJECT])?.labelMap),
          [PASS]: addAttrToVideoTagData(data.find((item: any) => item.code === auditResultStatus[PASS])?.labelMap),
        };

    setTagDataSource(tagDataSourceMap || {});
  };

  // 编辑时 按钮状态初始化（部分选中状态）
  const renderCommonTemplate = () => {
    return Object.keys(tagDataSource).length
      ? {
          component: ExposureOperationPanel,
          props: {
            isVideo,
            material,
            reloadCallBack,
            tagDataSource,
            userReviewResult,
            btnCountPerRow,
            btnGroupStatus,
            panel,
            isInspection,
          },
        }
      : null;
  };

  /**
   * 策略模式改进组件映射 增加的组件模版只需要增加对象key:value即可
   */
  const renderComponents = {
    // 图文 视频 负反馈操作组件
    FeedbackPanel: {
      component: FeedbackOperationPanel,
      props: { material, reloadCallBack, isVideo, userReviewResult, isInspection },
    },
    // 图文 视频 质量标注组件
    QualityPanel: {
      component: QualityPanel,
      props: {
        isVideo,
        material,
        userReviewResult,
        reloadCallBack,
        isInspection,
      },
    },
    // 图文 视频 曝光审核操作组件
    ExposurePanel: renderCommonTemplate(),
    // 沸点视频暂时用的是曝光审核的模板
    ConcertPanel: renderCommonTemplate(),
    // 分类(用户|机器...)标注 panel
    CategoryMarkPanel: {
      component: CategoryMarkPanel,
      props: {
        isVideo,
        material,
        reloadCallBack,
      },
    },
    // 啫喱图文、视频举报
    StoryPanel: {
      component: UserAction,
      props: {
        type: business_unit_type[0],
        data: {
          material,
          result_lx: userReviewResult,
        },
        reloadCallBack,
      },
    },
  };

  /**
   * 运行时选择组件 差不多也是利用策略模式降低修改风险
   */
  const getPanel = () => {
    const BlizzardOperationPanel = renderComponents[templateName]?.component;
    const props = renderComponents[templateName]?.props;
    return BlizzardOperationPanel ? <BlizzardOperationPanel {...props} /> : null;
  };

  useEffect(() => {
    if (jsonTagDataSource) {
      setTagDataSource(jsonTagDataSource);
    } else {
      if (templateNameCollection.includes(templateName)) {
        handleMenuTags(tagOptions);
      }
    }
  }, []);

  return <>{getPanel()}</>;
};

export default AuditOperationBasicPanel;
