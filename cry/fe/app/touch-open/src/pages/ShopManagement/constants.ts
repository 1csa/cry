import { CATEGORY_OPTIONS } from '@/constants/index';
import { REGION_OPTIONS } from '@/constants/region';
import { CARRIAGE_OPTIONS, SKIN_COLOUR_OPTIONS } from '@/constants/user';
import {
  FITTINGROOM_TYPE_OPTIONS,
  USER_TYPE_OPTIONS,
  STAFF_ROLE_OPTIONS,
  STAFF_STATUS_OPTIONS,
  staffRoleFilter,
} from '@/constants/shop';

const dateFormat = 'YYYY-MM-DD';
type OptionsType = { label: string; value: string | number }[];

export const inventorySearchFormFn = () => {
  return {
    sku: {
      type: 'input',
      initValue: '',
      label: '商品编码',
    },
    category: {
      type: 'cascader',
      initValue: [],
      label: '商品类目',
      originAttrs: {
        options: CATEGORY_OPTIONS,
        style: 'min-width: 250px',
      },
    },
  };
};
export const suitSearchFormFn = () => {
  return {
    sku: {
      type: 'input',
      initValue: '',
      label: '商品编码',
    },
    name: {
      type: 'input',
      initValue: '',
      label: '商品名称',
    },
    category: {
      type: 'cascader',
      initValue: [],
      label: '商品类目',
      originAttrs: {
        options: CATEGORY_OPTIONS,
        style: 'min-width: 250px',
      },
    },
    suit_name: {
      type: 'input',
      initValue: '',
      label: '套装名称',
    },
    op_user_name: {
      type: 'input',
      initValue: '',
      label: '创建人',
    },
    updateDate: {
      type: 'range-picker',
      initValue: [],
      label: '保存时间',
      originAttrs: {
        valueFormat: dateFormat,
      },
    },
    arriveDate: {
      type: 'range-picker',
      initValue: [],
      label: '上架时间',
      originAttrs: {
        valueFormat: dateFormat,
      },
    },
  };
};
export const staffSearchFormFn = () => {
  return {
    phone: {
      type: 'input',
      initValue: '',
      label: '手机号',
      originAttrs: {
        maxlength: 11,
      },
    },
    name: {
      type: 'input',
      initValue: '',
      label: '员工姓名',
    },
    birthday: {
      type: 'range-picker',
      initValue: undefined,
      label: '出生年月',
    },
    status: {
      type: 'select',
      initValue: undefined,
      label: '员工状态',
      originAttrs: {
        options: STAFF_STATUS_OPTIONS,
      },
    },
    entry_time: {
      type: 'range-picker',
      initValue: undefined,
      label: '入职时间',
    },
    leave_time: {
      type: 'range-picker',
      initValue: undefined,
      label: '离职时间',
    },
  };
};
export const staffAddFormFn = () => {
  return {
    phone: {
      type: 'input',
      initValue: '',
      label: '手机号',
      originAttrs: {
        maxlength: 11,
      },
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
    name: {
      type: 'input',
      initValue: '',
      label: '员工姓名',
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
    birthday: {
      type: 'date-picker',
      initValue: '',
      label: '出生年月',
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
    role: {
      type: 'radio',
      initValue: 2,
      label: '权限分配',
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
      originAttrs: {
        options: STAFF_ROLE_OPTIONS,
      },
      filtter: staffRoleFilter,
    },
  };
};

export const shopAddFormFn = () => {
  return {
    shop_name: {
      type: 'input',
      initValue: '',
      label: '门店名称',
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
    location: {
      type: 'cascader',
      initValue: '',
      label: '门店地址',
      rules: [
        {
          required: true,
          message: '请选择货源地',
        },
      ],
      originAttrs: {
        options: REGION_OPTIONS,
        fieldNames: { label: 'value' },
      },
    },
    address_detail: {
      type: 'textarea',
      initValue: '',
      label: '详细地址',
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
    cover_img_url: {
      type: 'img-upload',
      initValue: [],
      label: '门店图片',
      originAttrs: {
        'max-length': 1,
      },
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
  };
};

export const fittingRoomFormFn = () => {
  return {
    max_reserve_day: {
      type: 'number',
      initValue: null,
      label: '开放预约时间',
      unit: '天',
      originAttrs: {
        max: 7,
        min: 0,
        step: 1,
        precision: 0,
      },
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
    reserve_time: {
      type: 'time-range-picker',
      initValue: [],
      label: '预约时间',
      originAttrs: {
        format: 'HH:mm',
      },
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
    time_step: {
      type: 'number',
      initValue: null,
      label: '时间段时长',
      unit: '分钟',
      originAttrs: {
        max: 120,
        min: 30,
        step: 1,
        precision: 0,
      },
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
  };
};

export const rotationFormFn = () => {
  return {
    time: {
      type: 'range-picker',
      initValue: undefined,
      label: '预约时间',
      rules: [
        {
          required: true,
          message: '必填',
        },
      ],
    },
  };
};

interface StatisticsSearchProps {
  shopOptions: OptionsType;
}

export const statisticsSearchFormFn = ({ shopOptions = [] }: StatisticsSearchProps) => ({
  user_id: {
    type: 'input',
    initValue: '',
    label: '用户ID',
  },
  mobile_suffix: {
    type: 'input',
    initValue: '',
    label: '用户手机尾号',
  },
  nickname: {
    type: 'input',
    initValue: '',
    label: '昵称/备注',
  },
  user_flag: {
    type: 'select',
    initValue: [],
    label: '用户类型',
    originAttrs: {
      options: USER_TYPE_OPTIONS,
      style: 'min-width: 250px',
      mode: 'multiple',
    },
  },
  activity: {
    type: 'input',
    initValue: '',
    label: '活动',
  },
  channel: {
    type: 'input',
    initValue: '',
    label: '渠道',
  },
  reserveDate: {
    type: 'range-picker',
    initValue: [],
    label: '预约发起时间',
    originAttrs: {
      valueFormat: dateFormat,
    },
  },
  reserve_type: {
    type: 'select',
    initValue: '',
    label: '预约类型',
    originAttrs: {
      options: FITTINGROOM_TYPE_OPTIONS,
      style: 'min-width: 150px',
    },
  },
  shop_id: {
    type: 'select',
    initValue: '',
    label: '预约门店',
    originAttrs: {
      options: shopOptions,
      style: 'min-width: 200px',
    },
  },
  suit_id: {
    type: 'input',
    initValue: '',
    label: '套装ID',
  },
});

export const measureBodySearchFormFn = () => ({
  user_id: {
    type: 'input',
    initValue: '',
    label: '用户ID',
  },
  mobile_suffix: {
    type: 'input',
    initValue: '',
    label: '用户手机尾号',
  },
  nickname: {
    type: 'input',
    initValue: '',
    label: '昵称/备注',
  },
  user_flag: {
    type: 'select',
    initValue: [],
    label: '用户类型',
    originAttrs: {
      options: USER_TYPE_OPTIONS,
      style: 'min-width: 250px',
      mode: 'multiple',
    },
  },
  activity: {
    type: 'input',
    initValue: '',
    label: '活动',
  },
  channel: {
    type: 'input',
    initValue: '',
    label: '渠道',
  },
  queueDate: {
    type: 'range-picker',
    initValue: [],
    label: '量体排队时间',
    originAttrs: {
      valueFormat: dateFormat,
    },
  },
  carriage: {
    type: 'select',
    initValue: '',
    label: '身型',
    originAttrs: {
      options: CARRIAGE_OPTIONS,
      style: 'min-width: 120px',
    },
  },
  skin_colour: {
    type: 'select',
    initValue: '',
    label: '肤色',
    originAttrs: {
      options: SKIN_COLOUR_OPTIONS,
      style: 'min-width: 120px',
    },
  },
});
