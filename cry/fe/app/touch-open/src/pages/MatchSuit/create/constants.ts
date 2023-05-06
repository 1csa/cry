import {
  SUIT_LABEL_OPTIONS,
  TONE_CODE_OPTIONS,
  silhouette_options,
  CURING_INSTRUCTION_OPTIONS,
} from '@/constants/index';
import type { RuleObject, StoreValue } from 'ant-design-vue/lib/form/interface';
interface ImgDescGroupItemType {
  img: [];
  word: string;
}

export const FORMDATA = [
  {
    title: '基本信息',
    group: {
      suit_name: {
        type: 'input',
        initValue: '',
        label: '套装名称',
        rules: [
          {
            required: true,
            message: '请填写套装名称',
          },
        ],
      },
      description: {
        type: 'input',
        initValue: '',
        label: '套装简介',
        rules: [
          {
            required: false,
            message: '请填写套装简介',
          },
        ],
      },
      suit_label: {
        type: 'radio',
        initValue: '0',
        label: '套装推广',
        rules: [
          {
            required: true,
            message: '请选择套装推广类型',
          },
        ],
        options: SUIT_LABEL_OPTIONS,
      },
      silhouette: {
        type: 'radio',
        initValue: '0',
        label: '套装廓形',
        rules: [
          {
            required: true,
            message: '请选择套装廓形',
          },
        ],
        options: silhouette_options,
      },
      tone_code: {
        type: 'radio',
        initValue: '0',
        label: '套装肤色色调',
        rules: [
          {
            required: true,
            message: '请选择套装肤色色调',
          },
        ],
        options: TONE_CODE_OPTIONS,
      },
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
      sample_product_urls: {
        type: 'img-upload',
        initValue: [],
        label: '单品图',
        maxCount: 8,
        validateFirst: true,
        rules: [
          {
            required: false,
            message: '单品图必须上传',
          },
          // {
          //   validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
          //     return new Promise((resolve, reject) => {
          //       if (value.length >= 1) {
          //         resolve('')
          //       } else {
          //         reject('单品图至少上传1张')
          //       }
          //     })
          //   },
          //   message: '单品图至少上传1张',
          // }
        ],
      },
      model_img_urls: {
        type: 'img-upload',
        initValue: [],
        label: '真人图',
        maxCount: 9,
        // validateFirst: true,
        // rules: [
        //   {
        //     required: false,
        //     message: '真人图必须上传',
        //   },
        //   {
        //     validator: (rule: RuleObject, value: StoreValue) => {
        //       return new Promise((resolve, reject) => {
        //         if (value.length >= 3) {
        //           resolve('')
        //         } else {
        //           reject('真人图至少上传三张')
        //         }
        //       })
        //     },
        //     message: '真人图至少上传三张',
        //   }
        // ]
      },
      selection: {
        type: 'img-desc-group',
        initValue: [{ img: [], word: '' }],
        label: '搭配要点',
      },
      process_description: {
        type: 'img-desc-group',
        initValue: [{ img: [], word: '' }],
        label: '工艺说明图',
      },
      curing_instruction: {
        type: 'checkbox-group',
        initValue: [],
        label: '养护说明',
        rules: [
          {
            required: false,
            // message: '请填写套装名称',
          },
        ],
        options: CURING_INSTRUCTION_OPTIONS,
        //   validateFirst: true,
        //   rules: [
        //     {
        //       required: true,
        //       message: '养护说明图必须上传',
        //     },
        //     {
        //       validator: (rule: RuleObject, value: StoreValue) => {
        //         return new Promise((resolve, reject) => {
        //           const res = value.every((item: ImgDescGroupItemType) => {
        //             return item.img.length > 0 && item.desc !== '';
        //           });
        //           if (res) {
        //             resolve('')
        //           } else {
        //             reject('请填写已新增行的图片和描述')
        //           }
        //         })
        //       },
        //       message: '请填写已新增行的图片和描述',
        //     },
        //   ]
      },
    },
  },
];
