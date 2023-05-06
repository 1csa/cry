import {
  CATEGORY_OPTIONS,
  MATERIAL_OPTIONS,
  STYLE_OPTIONS,
  WAIST_TYPE_OPTIONS,
  COLLAR_TYPE_OPTIONS,
  SLEEVE_LENGTH_OPTIONS,
  YEAR_OPTIONS,
  SEASON_OPTIONS,
  SIZE_CODE_OPTIONS,
  COLOUR_CODE_OPTIONS,
  UNIT_OPTIONS,
  SKIN_COLOUR_CODE_OPTIONS,
  TONE_CODE_OPTIONS,
  TIGHTNESS_OPTIONS,
  SILHOUETTE_OPTIONS,
  LENGTH_OPTIONS,
  THICKNESS_OPTIONS,
  SAG_OPTIONS,
  ELASTIC_FORCE_OPTIONS,
  VENTILATE_OPTIONS,
  WEAR_RESISTING_OPTIONS,
  GOODS_SOURCE_OPTIONS,
} from '@/constants/index';

export const formDataFn = () => {
  return [
    {
      title: '商品信息',
      group: {
        category: {
          type: 'cascader',
          initValue: '',
          label: '商品类目',
          rules: [
            {
              required: true,
              message: '请选择商品类目',
            },
          ],
          options: CATEGORY_OPTIONS,
        },
        material: {
          type: 'select',
          initValue: undefined,
          label: '材质',
          rules: [
            {
              required: true,
              message: '请选择材质',
            },
          ],
          options: MATERIAL_OPTIONS,
        },
        style: {
          type: 'select',
          initValue: undefined,
          label: '风格',
          rules: [
            {
              required: true,
              message: '请选择风格',
            },
          ],
          options: STYLE_OPTIONS,
        },
        collar_type: {
          type: 'select',
          initValue: undefined,
          label: '领型',
          options: COLLAR_TYPE_OPTIONS,
        },
        waist_type: {
          type: 'select',
          initValue: undefined,
          label: '腰型',
          options: WAIST_TYPE_OPTIONS,
        },
        clothes_detail: {
          type: 'input',
          label: '细节',
          initValue: '',
        },
        year: {
          type: 'select',
          initValue: undefined,
          label: '年份',
          rules: [
            {
              required: true,
              message: '请选择年份',
            },
          ],
          options: YEAR_OPTIONS,
        },
        season: {
          type: 'radio',
          initValue: undefined,
          label: '季节',
          rules: [
            {
              required: true,
              message: '请选择季节',
            },
          ],
          options: SEASON_OPTIONS,
        },
        size_code: {
          type: 'radio',
          initValue: undefined,
          label: '尺码',
          rules: [
            {
              required: true,
              message: '请选择尺码',
            },
          ],
          options: SIZE_CODE_OPTIONS,
        },
        sleeve_length: {
          type: 'select',
          initValue: undefined,
          label: '袖长',
          options: SLEEVE_LENGTH_OPTIONS,
        },
        colour_code: {
          type: 'select',
          initValue: undefined,
          label: '颜色',
          rules: [
            {
              required: true,
              message: '请选择颜色',
            },
          ],
          options: COLOUR_CODE_OPTIONS,
        },
        skin_colour_code: {
          type: 'select',
          initValue: undefined,
          label: '单品色系',
          rules: [
            {
              required: true,
              message: '请选择单品色系',
            },
          ],
          options: SKIN_COLOUR_CODE_OPTIONS,
        },
        tone_code: {
          type: 'select',
          initValue: undefined,
          label: '单品色调',
          rules: [
            {
              required: true,
              message: '请选择单品色调',
            },
          ],
          options: TONE_CODE_OPTIONS,
        },
        tightness: {
          type: 'radio',
          initValue: undefined,
          label: '松紧度',
          rules: [
            {
              required: true,
              message: '请选择松紧度',
            },
          ],
          options: TIGHTNESS_OPTIONS,
        },
        length: {
          type: 'radio',
          initValue: undefined,
          label: '长度',
          rules: [
            {
              required: true,
              message: '请选择长度',
            },
          ],
          options: LENGTH_OPTIONS,
        },
        silhouette: {
          type: 'radio',
          initValue: undefined,
          label: '廓形',
          rules: [
            {
              required: true,
              message: '请选择廓形',
            },
          ],
          options: SILHOUETTE_OPTIONS,
        },
        thickness: {
          type: 'radio',
          initValue: undefined,
          label: '厚度',
          rules: [
            {
              required: false,
              message: '请选择厚度',
            },
          ],
          options: THICKNESS_OPTIONS,
        },
        sag: {
          type: 'radio',
          initValue: undefined,
          label: '垂度',
          rules: [
            {
              required: false,
              message: '请选择垂度',
            },
          ],
          options: SAG_OPTIONS,
        },
        elastic_force: {
          type: 'radio',
          initValue: undefined,
          label: '弹力',
          rules: [
            {
              required: false,
              message: '请选择弹力',
            },
          ],
          options: ELASTIC_FORCE_OPTIONS,
        },
        ventilate: {
          type: 'radio',
          initValue: undefined,
          label: '透气度',
          rules: [
            {
              required: false,
              message: '请选择透气度',
            },
          ],
          options: VENTILATE_OPTIONS,
        },
        wear_resisting: {
          type: 'radio',
          initValue: undefined,
          label: '耐磨度',
          rules: [
            {
              required: false,
              message: '请选择耐磨度',
            },
          ],
          options: WEAR_RESISTING_OPTIONS,
        },
        fabric_description: {
          type: 'img-desc-group',
          initValue: [{ img: [], word: '' }],
          label: '面料说明图',
        },
        unit: {
          type: 'radio',
          initValue: undefined,
          label: '单位',
          rules: [
            {
              required: true,
              message: '请选择单位',
            },
          ],
          options: UNIT_OPTIONS,
        },
        stock_num: {
          type: 'number',
          initValue: '',
          label: '库存',
          step: 1,
          min: 0,
          max: 9999,
          rules: [
            {
              required: true,
              message: '请填写库存',
            },
          ],
        },
      },
    },
    {
      title: '商品尺码',
      group: {
        chest_circumference: {
          type: 'number',
          initValue: null,
          label: '胸围',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写胸围',
            },
          ],
        },
        shoulder_breadth: {
          type: 'number',
          initValue: null,
          label: '肩宽',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写肩宽',
            },
          ],
        },
        waistline: {
          type: 'number',
          initValue: null,
          label: '腰围',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写腰围',
            },
          ],
        },
        hipline: {
          type: 'number',
          initValue: null,
          label: '臀围',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写臀围',
            },
          ],
        },

        clothes_length: {
          type: 'number',
          initValue: null,
          label: '衣长',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写衣长',
            },
          ],
        },
        outside_sleeve: {
          type: 'number',
          initValue: null,
          label: '袖长',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写袖长',
            },
          ],
        },
        collar_to_sleeve: {
          type: 'number',
          initValue: null,
          label: '袖长',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写领袖',
            },
          ],
        },
        pants_length: {
          type: 'number',
          initValue: null,
          label: '裤长',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写裤长',
            },
          ],
        },
        crotch_length: {
          type: 'number',
          initValue: null,
          label: '裆长',
          step: 0.1,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: false,
              message: '请填写裆长',
            },
          ],
        },
      },
    },
    {
      title: '商品价格',
      group: {
        // 'tag_amount': {
        //   type: 'number',
        //   initValue: '',
        //   label: "吊牌价",
        //   step: 0.01,
        //   min: 0,
        //   max: Infinity,
        //   rules: [
        //     {
        //       required: true,
        //       message: '请填写吊牌价',
        //     },
        //   ]
        // },
        cost_amount: {
          type: 'number',
          initValue: '',
          label: '成本价',
          step: 0.01,
          min: 0,
          max: Infinity,
          rules: [
            {
              required: true,
              message: '请填写成本价',
            },
          ],
        },
        postage: {
          type: 'number',
          initValue: 10,
          label: '物流费',
          step: 0.01,
          min: 0,
          max: Infinity,
          // rules: [
          //   {
          //     required: true,
          //     message: '请填写物流费',
          //   },
          // ]
        },
        tag_amount: {
          type: 'number',
          initValue: '',
          label: '吊牌价',
          step: 1,
          min: 0,
          rules: [
            {
              required: true,
              message: '请填写吊牌价',
            },
          ],
        },
        profit_margin: {
          label: '单品利润率',
        },
      },
    },
    {
      title: '商品图片',
      group: {
        cover_img_url: {
          type: 'img-upload',
          initValue: [],
          label: '封面图',
          rules: [
            {
              required: true,
              message: '封面图必须上传且支持仅上传一张',
            },
          ],
        },
        original_draw_url: {
          type: 'img-upload',
          original: '1',
          initValue: [],
          label: '合成套装封面图',
          rules: [
            {
              required: true,
              message: '封面图必须上传且支持仅上传一张',
            },
          ],
        },
        thumbnail_url: {
          type: 'img-upload',
          initValue: [],
          label: '缩略图',
          rules: [
            {
              required: true,
              message: '缩略图必须上传且支持仅上传一张',
            },
          ],
        },
        clothes_img_urls: {
          type: 'img-upload',
          initValue: [],
          label: '细节图',
          maxCount: 3,
          rules: [
            {
              required: false,
              message: '细节图必须上传且支持至少一张，最多三张',
            },
          ],
        },
        screenshot_url: {
          type: 'img-upload',
          initValue: [],
          label: '裁切图',
          crop: true,
          rules: [
            {
              required: false,
              message: '裁切图必须上传且支持仅上传一张',
            },
          ],
        },
      },
    },
    {
      title: '供应商信息',
      group: {
        supplier: {
          type: 'input',
          initValue: '',
          label: '供应商',
          rules: [
            {
              required: true,
              message: '请填写供应商',
            },
          ],
        },
        goods_source: {
          type: 'cascader',
          initValue: '',
          label: '货源地',
          rules: [
            {
              required: true,
              message: '请选择货源地',
            },
          ],
          options: GOODS_SOURCE_OPTIONS(),
        },
      },
    },
  ];
};
