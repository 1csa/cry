import React from 'react';

import log3 from '../../pubic/wen.png';

import './index.less';

const Home = () => {
  return (
    <div className="main-content">
      <div className="logo-box">
        <div className="logo2">
          <img src="http://si1.go2yd.com/get-image/0Z8vMt5u4kS" width={100} height={100} />
        </div>
        <div className="logo-text">
          {' '}
          <img src={log3} />
        </div>
      </div>
    </div>
  );
};
export default Home;
