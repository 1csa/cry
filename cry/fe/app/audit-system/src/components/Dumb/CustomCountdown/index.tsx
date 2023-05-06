import React from 'react';

import { Statistic } from 'antd';

import Iconfont from '@/components/Dumb/Iconfont';

import './index.less';

const { Countdown } = Statistic;
interface ICustomCountdown {
  deadline: number;
  countDownFinish: () => void;
}

const CustomCountdown: React.FC<ICustomCountdown> = ({ deadline, countDownFinish }) => {
  return (
    <Countdown
      prefix={<Iconfont name="icondaojishi" />}
      className="statistic"
      value={deadline}
      onFinish={countDownFinish}
      format="mm:ss"
      valueStyle={{ color: 'red' }}
    />
  );
};

export default CustomCountdown;
