import { useConfigStore } from '@/store/moudles/config'
const category_3 = [{
  value: '0',
  label: '外套',
  children: [
    {
      value: '00',
      label: '羽绒服',
    },
    {
      value: '01',
      label: '棉服',
    },
    {
      value: '02',
      label: '滑雪服',
    },
    {
      value: '03',
      label: '大衣',
    },
    {
      value: '04',
      label: '西服',
    },
    {
      value: '05',
      label: '风衣',
    },
    {
      value: '06',
      label: '皮衣',
    },
    {
      value: '07',
      label: '夹克',
    },
    {
      value: '08',
      label: '马甲',
    },
    {
      value: '09',
      label: '衬衫',
    },
    {
      value: '10',
      label: '针织衫',
    },
    {
      value: '11',
      label: '卫衣',
    },
    {
      value: '12',
      label: '罩衫',
    }
  ],
},
{
  value: '1',
  label: '上衣',
  children: [
    {
      value: '00',
      label: '内衣',
    },
    {
      value: '01',
      label: '背心',
    },
    {
      value: '02',
      label: '泳装',
    },
    {
      value: '03',
      label: '卫衣',
    },
    {
      value: '04',
      label: '衬衫',
    },
    {
      value: '05',
      label: '针织衫',
    },
    {
      value: '06',
      label: 'T恤',
    },
    {
      value: '07',
      label: '打底衫',
    },
    {
      value: '08',
      label: '雪纺衫',
    },
    {
      value: '09',
      label: '罩衫',
    }
  ],
},
{
  value: '2',
  label: '下装',
  children: [
    {
      value: '00',
      label: '卫裤',
    },
    {
      value: '01',
      label: '滑雪服',
    },
    {
      value: '02',
      label: '牛仔裤',
    },
    {
      value: '03',
      label: '打底裤',
    },
    {
      value: '04',
      label: '运动裤',
    },
    {
      value: '05',
      label: '加绒裤',
    },
    {
      value: '06',
      label: '西装裤',
    },
    {
      value: '07',
      label: '羽绒裤',
    },
    {
      value: '08',
      label: '休闲裤',
    },
    {
      value: '09',
      label: '半身裙',
    }
  ],
},
{
  value: '3',
  label: '连体服',
  children: [
    {
      value: '00',
      label: '连体裤',
    },
    {
      value: '01',
      label: '滑雪服',
    },
    {
      value: '02',
      label: '背带裤',
    }
  ],
},
{
  value: '4',
  label: '连衣裙',
  children: [
    {
      value: '00',
      label: '连衣裙',
    },
    {
      value: '01',
      label: '背带裙',
    }
  ],
},
{
  value: '5',
  label: '套装',
  children: [
    {
      value: '00',
      label: '西装套装',
    },
    {
      value: '01',
      label: '运动套装',
    },
    {
      value: '02',
      label: '内衣套装',
    },
    {
      value: '03',
      label: '泳装套装',
    },
    {
      value: '04',
      label: '家居服',
    }
  ],
},
// {
//   value: '6',
//   label: '袜子',
//   children: [
//     {
//       value: '00',
//       label: '连裤袜',
//     },
//     {
//       value: '01',
//       label: '高筒袜',
//     },
//     {
//       value: '02',
//       label: '膝盖袜',
//     },
//     {
//       value: '03',
//       label: '中筒袜',
//     },
//     {
//       value: '04',
//       label: '短袜',
//     },
//     {
//       value: '05',
//       label: '船袜',
//     }
//   ],
//   },
{
  value: '7',
  label: '配饰',
  children: [
    {
      value: '00',
      label: '围巾',
    },
    {
      value: '01',
      label: '帽子',
    },
    {
      value: '02',
      label: '腰带',
    },
    {
      value: '03',
      label: '手套',
    },
    {
      value: '04',
      label: '领子',
    },
    {
      value: '05',
      label: '袜子',
    },
    {
      value: '06',
      label: '旅行用品',
    },
    {
      value: '07',
      label: '雨伞',
    }
  ],
}
]
const category_2 = [
  {
    value: '0',
    label: '女士',
    children: []
  },
  {
    value: '1',
    label: '男士',
    children: []
  },
  {
    value: '2',
    label: '中性',
    children: []
  },
  {
    value: '3',
    label: '儿童',
    children: []
  },
]

const category_01 = [
  {
    value: '0',
    label: '女士',
    children: category_3
  },
  {
    value: '1',
    label: '男士',
    children: category_3
  },
  {
    value: '2',
    label: '中性',
    children: category_3
  },
  {
    value: '3',
    label: '儿童',
    children: category_3
  },
]
export const CATEGORY_OPTIONS = [
  {
    value: '0',
    label: '服装',
    children: category_01
  },
  // {
  //   value: '1',
  //   label: '鞋履',
  //   children: category_2
  // },
  // {
  //   value: '2',
  //   label: '饰品',
  //   children: category_2
  // },
  // {
  //   value: '3',
  //   label: '生活',
  //   children: category_2
  // },
]
// export const CATEGORY_OPTIONS = [
//   {
//     value: '0',
//     label: '服装鞋包',
//     children: [
//       {
//         value: '0',
//         label: '女装',
//         children: [
//           {
//             value: '0',
//             label: '外套',
//             children: [
//               {
//                 value: '00',
//                 label: '羽绒服',
//               },
//               {
//                 value: '01',
//                 label: '棉服',
//               },
//               {
//                 value: '02',
//                 label: '滑雪服',
//               },
//               {
//                 value: '03',
//                 label: '大衣',
//               },
//               {
//                 value: '04',
//                 label: '西服',
//               },
//               {
//                 value: '05',
//                 label: '风衣',
//               },
//               {
//                 value: '06',
//                 label: '皮衣',
//               },
//               {
//                 value: '07',
//                 label: '夹克',
//               },
//               {
//                 value: '08',
//                 label: '马甲',
//               },
//               {
//                 value: '09',
//                 label: '衬衫',
//               },
//               {
//                 value: '10',
//                 label: '针织衫',
//               },
//               {
//                 value: '11',
//                 label: '卫衣',
//               },
//               {
//                 value: '12',
//                 label: '罩衫',
//               }
//             ],
//           },
//           {
//             value: '1',
//             label: '上衣',
//             children: [
//               {
//                 value: '00',
//                 label: '内衣',
//               },
//               {
//                 value: '01',
//                 label: '背心',
//               },
//               {
//                 value: '02',
//                 label: '泳装',
//               },
//               {
//                 value: '03',
//                 label: '卫衣',
//               },
//               {
//                 value: '04',
//                 label: '衬衫',
//               },
//               {
//                 value: '05',
//                 label: '针织衫',
//               },
//               {
//                 value: '06',
//                 label: 'T恤',
//               },
//               {
//                 value: '07',
//                 label: '打底衫',
//               },
//               {
//                 value: '08',
//                 label: '雪纺衫',
//               },
//               {
//                 value: '09',
//                 label: '罩衫',
//               }
//             ],
//           },
//           {
//             value: '2',
//             label: '下装',
//             children: [
//               {
//                 value: '00',
//                 label: '卫裤',
//               },
//               {
//                 value: '01',
//                 label: '滑雪服',
//               },
//               {
//                 value: '02',
//                 label: '牛仔裤',
//               },
//               {
//                 value: '03',
//                 label: '打底裤',
//               },
//               {
//                 value: '04',
//                 label: '运动裤',
//               },
//               {
//                 value: '05',
//                 label: '加绒裤',
//               },
//               {
//                 value: '06',
//                 label: '西装裤',
//               },
//               {
//                 value: '07',
//                 label: '羽绒裤',
//               },
//               {
//                 value: '08',
//                 label: '休闲裤',
//               },
//               {
//                 value: '09',
//                 label: '半身裙',
//               }
//             ],
//           },
//           {
//             value: '3',
//             label: '连体服',
//             children: [
//               {
//                 value: '00',
//                 label: '连体裤',
//               },
//               {
//                 value: '01',
//                 label: '滑雪服',
//               },
//               {
//                 value: '02',
//                 label: '背带裤',
//               }
//             ],
//           },
//           {
//             value: '4',
//             label: '连衣裙',
//             children: [
//               {
//                 value: '00',
//                 label: '连衣裙',
//               },
//               {
//                 value: '01',
//                 label: '背带裙',
//               }
//             ],
//           },
//           {
//             value: '5',
//             label: '套装',
//             children: [
//               {
//                 value: '00',
//                 label: '西装套装',
//               },
//               {
//                 value: '01',
//                 label: '运动套装',
//               },
//               {
//                 value: '02',
//                 label: '内衣套装',
//               },
//               {
//                 value: '03',
//                 label: '泳装套装',
//               },
//               {
//                 value: '04',
//                 label: '家居服',
//               }
//             ],
//           },
//           {
//             value: '6',
//             label: '袜子',
//             children: [
//               {
//                 value: '00',
//                 label: '连裤袜',
//               },
//               {
//                 value: '01',
//                 label: '高筒袜',
//               },
//               {
//                 value: '02',
//                 label: '膝盖袜',
//               },
//               {
//                 value: '03',
//                 label: '中筒袜',
//               },
//               {
//                 value: '04',
//                 label: '短袜',
//               },
//               {
//                 value: '05',
//                 label: '船袜',
//               }
//             ],
//           },
//         ],
//       },
//       {
//         value: '1',
//         label: '男装',
//         children: [
//           {
//             value: '0',
//             label: '外套',
//             children: [
//               {
//                 value: '00',
//                 label: '羽绒服',
//               },
//               {
//                 value: '01',
//                 label: '棉服',
//               },
//               {
//                 value: '02',
//                 label: '滑雪服',
//               },
//               {
//                 value: '03',
//                 label: '大衣',
//               },
//               {
//                 value: '04',
//                 label: '西服',
//               },
//               {
//                 value: '05',
//                 label: '风衣',
//               },
//               {
//                 value: '06',
//                 label: '皮衣',
//               },
//               {
//                 value: '07',
//                 label: '夹克',
//               },
//               {
//                 value: '08',
//                 label: '马甲',
//               },
//               {
//                 value: '09',
//                 label: '衬衫',
//               },
//               {
//                 value: '10',
//                 label: '针织衫',
//               },
//               {
//                 value: '11',
//                 label: '卫衣',
//               },
//               {
//                 value: '12',
//                 label: '罩衫',
//               }
//             ],
//           },
//           {
//             value: '1',
//             label: '上衣',
//             children: [
//               {
//                 value: '00',
//                 label: '内衣',
//               },
//               {
//                 value: '01',
//                 label: '背心',
//               },
//               {
//                 value: '02',
//                 label: '泳装',
//               },
//               {
//                 value: '03',
//                 label: '卫衣',
//               },
//               {
//                 value: '04',
//                 label: '衬衫',
//               },
//               {
//                 value: '05',
//                 label: '针织衫',
//               },
//               {
//                 value: '06',
//                 label: 'T恤',
//               },
//               {
//                 value: '07',
//                 label: '打底衫',
//               },
//               {
//                 value: '08',
//                 label: '雪纺衫',
//               },
//               {
//                 value: '09',
//                 label: '罩衫',
//               }
//             ],
//           },
//           {
//             value: '2',
//             label: '下装',
//             children: [
//               {
//                 value: '00',
//                 label: '卫裤',
//               },
//               {
//                 value: '01',
//                 label: '滑雪服',
//               },
//               {
//                 value: '02',
//                 label: '牛仔裤',
//               },
//               {
//                 value: '03',
//                 label: '打底裤',
//               },
//               {
//                 value: '04',
//                 label: '运动裤',
//               },
//               {
//                 value: '05',
//                 label: '加绒裤',
//               },
//               {
//                 value: '06',
//                 label: '西装裤',
//               },
//               {
//                 value: '07',
//                 label: '羽绒裤',
//               },
//               {
//                 value: '08',
//                 label: '休闲裤',
//               },
//               {
//                 value: '09',
//                 label: '半身裙',
//               }
//             ],
//           },
//           {
//             value: '3',
//             label: '连体服',
//             children: [
//               {
//                 value: '00',
//                 label: '连体裤',
//               },
//               {
//                 value: '01',
//                 label: '滑雪服',
//               },
//               {
//                 value: '02',
//                 label: '背带裤',
//               }
//             ],
//           },
//           {
//             value: '4',
//             label: '连衣裙',
//             children: [
//               {
//                 value: '00',
//                 label: '连衣裙',
//               },
//               {
//                 value: '01',
//                 label: '背带裙',
//               }
//             ],
//           },
//           {
//             value: '5',
//             label: '套装',
//             children: [
//               {
//                 value: '00',
//                 label: '西装套装',
//               },
//               {
//                 value: '01',
//                 label: '运动套装',
//               },
//               {
//                 value: '02',
//                 label: '内衣套装',
//               },
//               {
//                 value: '03',
//                 label: '泳装套装',
//               },
//               {
//                 value: '04',
//                 label: '家居服',
//               }
//             ],
//           },
//           {
//             value: '6',
//             label: '袜子',
//             children: [
//               {
//                 value: '00',
//                 label: '连裤袜',
//               },
//               {
//                 value: '01',
//                 label: '高筒袜',
//               },
//               {
//                 value: '02',
//                 label: '膝盖袜',
//               },
//               {
//                 value: '03',
//                 label: '中筒袜',
//               },
//               {
//                 value: '04',
//                 label: '短袜',
//               },
//               {
//                 value: '05',
//                 label: '船袜',
//               }
//             ],
//           },
//         ],
//       },
//       {
//         value: '2',
//         label: '中性',
//         children: [
//           {
//             value: '0',
//             label: '外套',
//             children: [
//               {
//                 value: '00',
//                 label: '羽绒服',
//               },
//               {
//                 value: '01',
//                 label: '棉服',
//               },
//               {
//                 value: '02',
//                 label: '滑雪服',
//               },
//               {
//                 value: '03',
//                 label: '大衣',
//               },
//               {
//                 value: '04',
//                 label: '西服',
//               },
//               {
//                 value: '05',
//                 label: '风衣',
//               },
//               {
//                 value: '06',
//                 label: '皮衣',
//               },
//               {
//                 value: '07',
//                 label: '夹克',
//               },
//               {
//                 value: '08',
//                 label: '马甲',
//               },
//               {
//                 value: '09',
//                 label: '衬衫',
//               },
//               {
//                 value: '10',
//                 label: '针织衫',
//               },
//               {
//                 value: '11',
//                 label: '卫衣',
//               },
//               {
//                 value: '12',
//                 label: '罩衫',
//               }
//             ],
//           },
//           {
//             value: '1',
//             label: '上衣',
//             children: [
//               {
//                 value: '00',
//                 label: '内衣',
//               },
//               {
//                 value: '01',
//                 label: '背心',
//               },
//               {
//                 value: '02',
//                 label: '泳装',
//               },
//               {
//                 value: '03',
//                 label: '卫衣',
//               },
//               {
//                 value: '04',
//                 label: '衬衫',
//               },
//               {
//                 value: '05',
//                 label: '针织衫',
//               },
//               {
//                 value: '06',
//                 label: 'T恤',
//               },
//               {
//                 value: '07',
//                 label: '打底衫',
//               },
//               {
//                 value: '08',
//                 label: '雪纺衫',
//               },
//               {
//                 value: '09',
//                 label: '罩衫',
//               }
//             ],
//           },
//           {
//             value: '2',
//             label: '下装',
//             children: [
//               {
//                 value: '00',
//                 label: '卫裤',
//               },
//               {
//                 value: '01',
//                 label: '滑雪服',
//               },
//               {
//                 value: '02',
//                 label: '牛仔裤',
//               },
//               {
//                 value: '03',
//                 label: '打底裤',
//               },
//               {
//                 value: '04',
//                 label: '运动裤',
//               },
//               {
//                 value: '05',
//                 label: '加绒裤',
//               },
//               {
//                 value: '06',
//                 label: '西装裤',
//               },
//               {
//                 value: '07',
//                 label: '羽绒裤',
//               },
//               {
//                 value: '08',
//                 label: '休闲裤',
//               },
//               {
//                 value: '09',
//                 label: '半身裙',
//               }
//             ],
//           },
//           {
//             value: '3',
//             label: '连体服',
//             children: [
//               {
//                 value: '00',
//                 label: '连体裤',
//               },
//               {
//                 value: '01',
//                 label: '滑雪服',
//               },
//               {
//                 value: '02',
//                 label: '背带裤',
//               }
//             ],
//           },
//           {
//             value: '4',
//             label: '连衣裙',
//             children: [
//               {
//                 value: '00',
//                 label: '连衣裙',
//               },
//               {
//                 value: '01',
//                 label: '背带裙',
//               }
//             ],
//           },
//           {
//             value: '5',
//             label: '套装',
//             children: [
//               {
//                 value: '00',
//                 label: '西装套装',
//               },
//               {
//                 value: '01',
//                 label: '运动套装',
//               },
//               {
//                 value: '02',
//                 label: '内衣套装',
//               },
//               {
//                 value: '03',
//                 label: '泳装套装',
//               },
//               {
//                 value: '04',
//                 label: '家居服',
//               }
//             ],
//           },
//           {
//             value: '6',
//             label: '袜子',
//             children: [
//               {
//                 value: '00',
//                 label: '连裤袜',
//               },
//               {
//                 value: '01',
//                 label: '高筒袜',
//               },
//               {
//                 value: '02',
//                 label: '膝盖袜',
//               },
//               {
//                 value: '03',
//                 label: '中筒袜',
//               },
//               {
//                 value: '04',
//                 label: '短袜',
//               },
//               {
//                 value: '05',
//                 label: '船袜',
//               }
//             ],
//           },
//         ],
//       },
//     ],
//   }
// ]

export const MATERIAL_OPTIONS = [
  {
    label: '羊毛',
    value: '00'
  },
  {
    label: '驼毛',
    value: '01'
  },
  {
    label: '马海毛',
    value: '02'
  },
  {
    label: '毛混纺',
    value: '03'
  },
  {
    label: '羊绒',
    value: '04'
  },
  {
    label: '驼绒',
    value: '05'
  },
  {
    label: '棉',
    value: '06'
  },
  {
    label: '棉混纺',
    value: '07'
  },
  {
    label: '丝',
    value: '08'
  },
  {
    label: '丝混纺',
    value: '09'
  },
  {
    label: '麻',
    value: '10'
  },
  {
    label: '麻混纺',
    value: '11'
  },
  {
    label: '牛仔',
    value: '12'
  },
  {
    label: '丝绒',
    value: '13'
  },
  {
    label: '蕾丝',
    value: '14'
  },
  {
    label: '混纺（人造纤维）',
    value: '15'
  }, {
    label: '混纺（天然）',
    value: '16'
  },
  {
    label: '化纤',
    value: '17'
  },
  {
    label: '真皮',
    value: '18'
  },
  {
    label: '皮草',
    value: '19'
  },
  {
    label: '环保皮草',
    value: '20'
  },
  {
    label: '环保皮',
    value: '21'
  },
  {
    label: '填充材质',
    value: '22'
  }, {
    label: '亮片',
    value: '23'
  },
  {
    label: '金属',
    value: '24'
  },
]

export const STYLE_OPTIONS = [
  {
    label: '休闲',
    value: '00'
  },
  {
    label: '运动',
    value: '01'
  },
  {
    label: '正装',
    value: '02'
  },
  {
    label: '居家',
    value: '03'
  },
  {
    label: '度假',
    value: '04'
  },
  {
    label: '派对',
    value: '05'
  },
  {
    label: '街头',
    value: '06'
  },
]


export const CURING_INSTRUCTION_OPTIONS = [
  {
    label: '普通养护说明',
    value: '1'
  },
  {
    label: '特殊养护说明',
    value: '2'
  },

]

export const silhouette_options = [
  {
    label: '无',
    value: '0'
  },
  {
    label: '正三角A',
    value: '1'
  },
  {
    label: '沙漏型X',
    value: '2'
  },
  {
    label: '圆形O',
    value: '3'
  },
  {
    label: '长方形H',
    value: '4'
  },
  {
    label: '倒三角T',
    value: '5'
  },
]

export const SILHOUETTE_OPTIONS = [
  {
    label: '为空',
    value: '00'
  },
  {
    label: 'X型',
    value: '07'
  },
  {
    label: 'A型',
    value: '02'
  },
  {
    label: 'T型',
    value: '03'
  },
  {
    label: 'H型',
    value: '01'
  },
  // {
  //   label: 'V型',
  //   value: '04'
  // },
  // {
  //   label: 'Y型',
  //   value: '05'
  // },
  {
    label: 'O型',
    value: '06'
  },

  // {
  //   label: '裹身',
  //   value: '08'
  // },
  // {
  //   label: '大廓形',
  //   value: '09'
  // },
  // {
  //   label: '喇叭',
  //   value: '10'
  // },
  // {
  //   label: '鱼尾',
  //   value: '11'
  // },
]

export const WAIST_TYPE_OPTIONS = [
  {
    label: '为空',
    value: '00'
  },
  {
    label: '高腰',
    value: '01'
  },
  {
    label: '中腰',
    value: '02'
  },
  {
    label: '低腰',
    value: '03'
  },
]

export const COLLAR_TYPE_OPTIONS = [
  {
    label: '为空',
    value: '00'
  },
  {
    label: '翻领',
    value: '01'
  },
  {
    label: '立领',
    value: '02'
  },
  {
    label: '圆领',
    value: '03'
  },
  {
    label: 'V领',
    value: '04'
  },
  {
    label: '方领',
    value: '05'
  },
  {
    label: '连帽',
    value: '06'
  },
  {
    label: '开衫',
    value: '07'
  },
  {
    label: '花瓣领',
    value: '08'
  },
]

export const SLEEVE_LENGTH_OPTIONS = [
  {
    label: '为空',
    value: '00'
  },
  {
    label: '长袖',
    value: '01'
  },
  {
    label: '中长袖',
    value: '02'
  },
  {
    label: '中袖',
    value: '03'
  },
  {
    label: '短袖',
    value: '04'
  },
  {
    label: '无袖',
    value: '05'
  },
  {
    label: '抹胸',
    value: '06'
  },
  {
    label: '吊带',
    value: '07'
  },
]

export const YEAR_OPTIONS = [
  {
    label: '2022',
    value: '0'
  },
  {
    label: '2023',
    value: '1'
  },
  {
    label: '2024',
    value: '2'
  },
  {
    label: '2025',
    value: '3'
  },
  {
    label: '2026',
    value: '4'
  },
  {
    label: '2027',
    value: '5'
  },
  {
    label: '2028',
    value: '6'
  },
  {
    label: '2029',
    value: '7'
  },
  {
    label: '2030',
    value: '8'
  },
  {
    label: '2031',
    value: '9'
  },
]

export const SEASON_OPTIONS = [
  {
    label: '春',
    value: '0'
  },
  {
    label: '夏',
    value: '1'
  },
  {
    label: '秋',
    value: '2'
  },
  {
    label: '冬',
    value: '3'
  },
]

export const SIZE_CODE_OPTIONS = [
  {
    label: 'XXS',
    value: '00'
  },
  {
    label: 'XS',
    value: '01'
  },
  {
    label: 'S',
    value: '02'
  },
  {
    label: 'M',
    value: '03'
  },
  {
    label: 'L',
    value: '04'
  },
  {
    label: 'XL',
    value: '05'
  },
  {
    label: 'XXL',
    value: '06'
  },
  {
    label: 'XXXL',
    value: '07'
  },
  {
    label: 'F',
    value: '08'
  },
  {
    label: '36-40',
    value: '09'
  },
  {
    label: '41-46',
    value: '10'
  },
]

export const COLOUR_CODE_OPTIONS = [
  {
    label: '黑',
    value: '00'
  },
  {
    label: '白',
    value: '01'
  },
  {
    label: '灰',
    value: '02'
  },
  {
    label: '金',
    value: '03'
  },
  {
    label: '银',
    value: '04'
  },
  {
    label: '红',
    value: '05'
  },
  {
    label: '橙',
    value: '06'
  },
  {
    label: '黄',
    value: '07'
  },
  {
    label: '绿',
    value: '08'
  },
  {
    label: '蓝',
    value: '09'
  },
  {
    label: '紫',
    value: '10'
  },
  {
    label: '咖啡',
    value: '11'
  },
  {
    label: '卡其',
    value: '12'
  },
  {
    label: '米',
    value: '13'
  },
  {
    label: '粉',
    value: '14'
  },
  {
    label: '花',
    value: '15'
  }, {
    label: '格纹',
    value: '16'
  },
  {
    label: '拼色',
    value: '17'
  },
  {
    label: '图案',
    value: '18'
  },
  {
    label: '条纹',
    value: '19'
  },
]

export const UNIT_OPTIONS = [
  {
    label: '件',
    value: '00'
  },
  {
    label: '套',
    value: '01'
  },
  {
    label: '双',
    value: '02'
  },
]

export const SKIN_COLOUR_CODE_OPTIONS = [
  {
    label: '未选择',
    value: '0'
  },
  {
    label: '常用色',
    value: '1'
  },
  {
    label: '表现色',
    value: '2'
  },
  {
    label: '百搭中性色',
    value: '3'
  },
]

export const TONE_CODE_OPTIONS = [
  {
    label: '无',
    value: '0'
  },
  {
    label: '暖色（红、橙、黄）',
    value: '1'
  },
  {
    label: '冷色（绿、蓝、紫）',
    value: '2'
  },
  {
    label: '中性（黑、白、灰）',
    value: '3'
  },
]

export const TIGHTNESS_OPTIONS = [
  {
    label: '未选择',
    value: '0'
  },
  {
    label: '紧身',
    value: '1'
  },
  {
    label: '合体',
    value: '2'
  },
  {
    label: '宽松',
    value: '3'
  },
  {
    label: 'oversize',
    value: '4'
  },
]

export const LENGTH_OPTIONS = [
  {
    label: '未选择',
    value: '00'
  },
  {
    label: '超短',
    value: '05'
  },
  {
    label: '短',
    value: '04'
  },
  {
    label: '中',
    value: '03'
  },
  {
    label: '中长',
    value: '02'
  },
  {
    label: '长',
    value: '01'
  },
  {
    label: '超长',
    value: '06'
  },
]

export const THICKNESS_OPTIONS = [
  {
    label: '未选择',
    value: '0'
  },
  {
    label: '薄',
    value: '1'
  },
  {
    label: '适中',
    value: '2'
  },
  {
    label: '厚',
    value: '3'
  },
]


export const SAG_OPTIONS = [
  {
    label: '未选择',
    value: '0'
  },
  {
    label: '垂度低',
    value: '1'
  },
  {
    label: '正常',
    value: '2'
  },
  {
    label: '垂度高',
    value: '3'
  },
]


export const ELASTIC_FORCE_OPTIONS = [
  {
    label: '未选择',
    value: '0'
  },
  {
    label: '无弹力',
    value: '1'
  },
  {
    label: '微弹',
    value: '2'
  },
  {
    label: '有弹力',
    value: '3'
  },
]


export const VENTILATE_OPTIONS = [
  {
    label: '未选择',
    value: '0'
  },
  {
    label: '透气性佳',
    value: '1'
  },
  {
    label: '正常',
    value: '2'
  },
  {
    label: '不透气',
    value: '3'
  },
]

export const WEAR_RESISTING_OPTIONS = [
  {
    label: '未选择',
    value: '0'
  },
  {
    label: '耐磨度低',
    value: '1'
  },
  {
    label: '正常',
    value: '2'
  },
  {
    label: '耐磨度高',
    value: '3'
  },
]

export const SUIT_LABEL_OPTIONS = [
  {
    label: '无',
    value: '0'
  },
  {
    label: '新款',
    value: '1'
  },
  {
    label: '热销',
    value: '2'
  },
];

// export const tone_code_options = [
//   {
//     label: '无',
//     value: '0'
//   },
//   {
//     label: '暖色',
//     value: '1'
//   },
//   {
//     label: '冷色',
//     value: '2'
//   },
//   {
//     label: '中性色',
//     value: '3'
//   },
// ]

export const GOODS_SOURCE_OPTIONS = () => {
  return useConfigStore().getCityList
}
