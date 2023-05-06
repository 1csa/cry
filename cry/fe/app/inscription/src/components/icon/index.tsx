import React from 'react';
import { AntdIconProps } from '@ant-design/icons/es/components/AntdIcon';
import { IconType } from '@/types/comp';
import {
  AreaChartOutlined,
  ApartmentOutlined,
  CreditCardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SnippetsOutlined,
  RollbackOutlined,
  ProfileOutlined,
  HistoryOutlined,
  LoadingOutlined,
  CompassOutlined,
  HomeOutlined,
  PlusOutlined,
  MailOutlined,
  BankOutlined,
  BulbOutlined,
  FormOutlined,
  SearchOutlined,
  ReloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  HighlightFilled,
  AlertFilled
} from '@ant-design/icons';

export const iconmap = {
  home: HomeOutlined,
  bulb: BulbOutlined,
  plus: PlusOutlined,
  mail: MailOutlined,
  bank: BankOutlined,
  form: FormOutlined,
  reload: ReloadOutlined,
  search: SearchOutlined,
  closed: CloseCircleFilled,
  checked: CheckCircleFilled,
  compass: CompassOutlined,
  profile: ProfileOutlined,
  history: HistoryOutlined,
  loading: LoadingOutlined,
  rollback: RollbackOutlined,
  snippets: SnippetsOutlined,
  question: QuestionCircleOutlined,
  apartment: ApartmentOutlined,
  highlight: HighlightFilled,
  alert: AlertFilled,
  'menu-fold': MenuFoldOutlined,
  'area-chart': AreaChartOutlined,
  'credit-card': CreditCardOutlined,
  'menu-unfold': MenuUnfoldOutlined,
  'bar-chart': BarChartOutlined,
  'line-chart': LineChartOutlined,
  'info-circle': InfoCircleOutlined,
};

type YIcon = Omit<AntdIconProps, 'ref' | 'max'> & {
  type: IconType;
  ref?: ((instance: HTMLSpanElement | null) => void) | React.RefObject<HTMLSpanElement> | null | undefined;
};

const YIcon: React.FC<YIcon> = ({ type, ...props }) => {
  return iconmap[type] ? React.createElement(iconmap[type], props) : null;
};

export default React.memo(YIcon);
