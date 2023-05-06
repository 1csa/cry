import {
  ORDER_STATUS_OPTIONS,
  DELIVERY_TYPE_OPTIONS,
  ORDER_SOURCE_TYPE_OPTIONS,
} from '@/constants/order';

export const searchFormFn = () => {
  return {
    order_id: {
      type: 'input',
      initValue: '',
      label: '订单编号',
    },
    // 'nickname': {
    //   type: 'input',
    //   label: "用户昵称",
    //   initValue: '',
    // },
    user_mobile: {
      type: 'input',
      label: '用户手机',
      initValue: '',
    },
    receiver_mobile: {
      type: 'input',
      label: '收货手机',
      initValue: '',
    },
    tracking_number: {
      type: 'input',
      label: '快递单号',
      initValue: '',
    },
    order_stat: {
      type: 'select',
      initValue: '',
      label: '订单状态',
      originAttrs: {
        options: ORDER_STATUS_OPTIONS,
      },
    },
    source: {
      type: 'select',
      initValue: '',
      label: '订单来源',
      originAttrs: {
        options: ORDER_SOURCE_TYPE_OPTIONS,
      },
    },

    waist_type: {
      type: 'select',
      initValue: '',
      label: '配送方式',
      originAttrs: {
        options: DELIVERY_TYPE_OPTIONS,
      },
    },
    suit_id: {
      type: 'input',
      label: '套装ID',
      initValue: '',
    },
    sku: {
      type: 'input',
      label: '商品编号',
      initValue: '',
    },
    date: {
      type: 'range-picker',
      initValue: undefined,
      label: '下单时间',
      originAttrs: {},
    },
  };
};

export interface detailFormFnType {
  title: string;
  value: string;
  type?: string;
  group: {
    [key: string]: string;
  };
}
export const detailFormFn = (): detailFormFnType[] => {
  return [
    {
      title: '订单信息',
      value: 'order_info',
      group: {
        order_id: '订单编号',
        type: '配送方式',
        tag_amount_total: '订单金额',
        service_charge: '服务费',
        postage: '快递费用',
        coupon_amount: '优惠券',
        pay_amount_total: '实付金额',
        create_time: '下单时间',
        order_stat_value: '订单状态',
        source: '订单来源',
        profit_margin: '订单利润率',
      },
    },
    {
      title: '套装名称/商品信息',
      type: 'table',
      value: 'product_info',
      group: {},
    },
    {
      title: '买家信息',
      value: 'user_info',
      group: {
        avatar_url: '买家头像',
        nickname: '买家昵称',
        mobile: '联系方式',
        level: '会员等级',
        expire_time: '会员有效期',
        create_time: '注册时间',
        share_id: 'share ID',
      },
    },
    {
      title: '支付信息',
      value: 'pay_info',
      group: {
        prepay_id: '交易流水号',
        cash_out_time: '支付时间',
        amount: '支付金额',
        pay_mode: '支付方式',
        status: '支付状态',
      },
    },
    {
      title: '快递信息',
      value: 'logistics_info',
      type: 'array',
      group: {
        receiver_name: '收货人姓名',
        receiver_mobile: '手机号',
        address: '收货地址',
        tracking_number: '快递单号',
        express: '快递公司',
        create_time: '发货时间',
        newest_info: '快递动态',
      },
    },
    {
      title: '售后记录',
      value: 'after_sale_info',
      group: {
        create_time: '日期',
        op_user: '操作人',
        sku: '商品编号',
        content: '详细说明',
      },
    },
  ];
};
