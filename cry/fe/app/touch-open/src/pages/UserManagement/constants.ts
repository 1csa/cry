export const userInfoLabel = {
  user_detail: {
    id: '用户id',
    nickname: '昵称',
    remake_name: '备注姓名',
    mobile: '手机号',
    user_flag: '用户类型', // 1-新用户 2-老用户 3-大客户 4-会员
    activity: '活动',
    channel: '渠道',
    create_time: '注册时间',
    shop: '门店名称',
    remake: '备注',
    avatar_url: '头像',
  },
  orderDetailLabel: [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '地址id',
      dataIndex: 'address_id',
      key: 'address_id',
    },
    {
      title: '收货地址',
      dataIndex: 'receiver_address',
      key: 'receiver_address',
    },
    {
      title: '收货电话',
      dataIndex: 'receiver_mobile',
      key: 'receiver_mobile',
    },
    {
      title: '套装id',
      dataIndex: 'suit_id',
      key: 'suit_id',
    },
    {
      title: '实付价格',
      dataIndex: 'pay_amount',
      key: 'pay_amount',
    },
    {
      title: '商品信息(商品id,商品封面,商品尺码,售后时间,退换货理由)',
      dataIndex: 'order_product_list',
      key: 'order_product_list',
    },
  ],
  orderProductList: [
    {
      title: '商品id',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: '商品封面图',
      dataIndex: 'cover_img_url',
      key: 'cover_img_url',
    },
    {
      title: '商品尺码',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '售后服务时间',
      dataIndex: 'after_sale_creaet_time',
      key: 'after_sale_creaet_time',
    },
    {
      title: '退换货理由',
      dataIndex: 'reason',
      key: 'reason',
    },
  ],
  reserveOrderDetailLabel: [
    {
      title: '预约单id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '预约发起时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '预约门店id',
      dataIndex: 'shop_id',
      key: 'shop_id',
    },
    {
      title: '试衣间id',
      dataIndex: 'reserve_room_id',
      key: 'reserve_room_id',
    },
    {
      title: '预约类型',
      dataIndex: 'reserve_type',
      key: 'reserve_type',
    },
    {
      title: '预约时间段',
      dataIndex: 'reserve_time',
      key: 'reserve_time',
    },
    {
      title: '到店时间',
      dataIndex: 'sign_time',
      key: 'sign_time',
    },
    {
      title: '离店时间',
      dataIndex: 'level_time',
      key: 'level_time',
    },
    {
      title: '套装(套装id,套装封面图,套装价格)',
      dataIndex: 'suit_detail',
      key: 'suit_detail',
    },
  ],
  reserveProductLabel: [
    {
      title: '套装id',
      dataIndex: 'suit_id',
      key: 'suit_id',
    },
    {
      title: '套装封面图',
      dataIndex: 'suit_cover_img_url',
      key: 'suit_cover_img_url',
    },
    {
      title: '套装价格',
      dataIndex: 'suit_amount',
      key: 'suit_amount',
    },
  ],

  measureOrderDetail: [
    {
      title: '量体预约单id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '预约门店id',
      dataIndex: 'shop_id',
      key: 'shop_id',
    },
    {
      title: '发起量体排队时间',
      dataIndex: 'sign_time',
      key: 'sign_time',
    },
    {
      title: '结束量体时间',
      dataIndex: 'finish_time',
      key: 'finish_time',
    },
    {
      title: '身高',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: '体重',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: '身型',
      dataIndex: 'carriage',
      key: 'carriage',
    },
    {
      title: '胸围',
      dataIndex: 'breast_size',
      key: 'breast_size',
    },
    {
      title: '腰围',
      dataIndex: 'waist_size',
      key: 'waist_size',
    },
    {
      title: '臀围',
      dataIndex: 'haunch_size',
      key: 'haunch_size',
    },
    {
      title: '大臂围',
      dataIndex: 'arm_size',
      key: 'arm_size',
    },
    {
      title: '大腿围',
      dataIndex: 'thigh_size',
      key: 'thigh_size',
    },
    {
      title: '小腿围',
      dataIndex: 'calf_size',
      key: 'calf_size',
    },
    {
      title: '肤色',
      dataIndex: 'skin_colour',
      key: 'skin_colour',
    },
  ],
  measure_order_detail: {
    id: '量体预约单id',
    shop_id: '预约门店id',
    sign_time: '发起量体排队时间',
    finish_time: '结束量体时间',
    height: '身高',
    weight: '体重',
    carriage: '身型',
    breast_size: '胸围',
    waist_size: '腰围',
    haunch_size: '臀围',
    arm_size: '大臂围',
    thigh_size: '大腿围',
    calf_size: '小腿围',
    skin_colour: '肤色',
  },
};

// 默认数据
export const defaultUserInfoData = {
  // 用户信息
  user_detail: {
    id: '',
    nickname: '',
    remake_name: '',
    mobile: '',
    user_flag: '', // 1-新用户 2-老用户 3-大客户 4-会员
    activity: '',
    channel: '',
    create_time: '',
    shop_name: '',
    remake: '',
  },
  //订单信息
  order_detail: [],
  // 预约单信息
  reserve_order_detail: [],
  measure_order_detail: [],
};
export const defaultUserInfoResult = {};
