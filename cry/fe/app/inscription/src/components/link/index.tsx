import React from 'react';
import { Link, useHistory, LinkProps } from 'react-router-dom';
import { Button } from 'antd';
import { BATH_PATH } from '@/config/app.config';

interface YLink extends LinkProps {
  type: 'link' | 'button';
  to: string;         // 相对于base_path的路径
}

const YLink: React.FC<YLink> = ({ to, children, type = 'link', target }) => {
  const history = useHistory();

  const handleButtonJump = () => {
    if (target === "blank") {
      window.open(window.location.host + BATH_PATH + to);
    } else {
      history.push(to);
    }
  };

  return type === 'link' ? (
    <Link to={to} target={target}>{children}</Link>
  ) : (
    <Button size="small" type="primary" onClick={handleButtonJump}>
      {children}
    </Button>
  );
};

export default React.memo(YLink);
