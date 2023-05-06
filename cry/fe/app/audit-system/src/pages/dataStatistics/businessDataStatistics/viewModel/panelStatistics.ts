export interface IPanelStatisProps {
  label: string;
  count: number;
  iconName: string;
}

const data: IPanelStatisProps[] = [
  {
    label: '进审量',
    count: 0,
    iconName: 'iconshujutubiao',
  },
  {
    label: '审核完成量',
    count: 0,
    iconName: 'iconshujutubiao',
  },
  {
    label: '审核通过量',
    count: 0,
    iconName: 'iconshujutubiao',
  },
  {
    label: '审核完成率',
    count: 0,
    iconName: 'iconbingtu',
  },
  {
    label: '审核通过率',
    count: 0,
    iconName: 'iconbingtu',
  },
];

export default data;
