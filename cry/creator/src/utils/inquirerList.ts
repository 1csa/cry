import { ChoicesTypes } from '../type';

const baseToolsName = (choices: ChoicesTypes[]) => [
  {
    type: 'list',
    name: 'appName',
    message: '请选择你的工具(appName)',
    choices,
    filter: (val: string) => val.toLowerCase(),
  },
];

const baseFileTypes = [
  {
    type: 'list',
    name: 'ctype',
    message: '请选择需要创建的文件类型',
    choices: [
      {
        name: '创建组件',
        value: 'components',
      },
      {
        name: '创建页面',
        value: 'pages',
      },
    ],
    filter: (val: string) => val.toLowerCase(),
  },
];

const inputFileName = (type: string) => [
  {
    type: 'input',
    message: `请输入要创建${
      type === 'pages' ? '页面' : '组件'
    }的文件夹或文件名称，默认创建index.tsx文件`,
    name: 'filePath',
  },
];

const inputRouteName = [
  {
    type: 'input',
    message: `请输入菜单名称，如有二级菜单请用中划线(-)分割，例：父-子`,
    name: 'routeName',
    require: true,
  },
];

export { baseToolsName, baseFileTypes, inputFileName, inputRouteName };
