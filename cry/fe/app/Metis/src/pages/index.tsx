import React, {useEffect , useState} from 'react';
import { Card } from 'antd';

import './index.less';

export default function() {
  useEffect(() => {
    
  },[])
 
  return (
    <>
      <div className="main-content" >
        <Card bordered={false} style={{ minHeight: 380 }}>
          <div className="index-welcome" style={{textAlign:'center' , fontSize:25, lineHeight:20}}>
            Hi <span style={{color: '#40a9ff'}}></span>
            welcome to use Metis!
          </div>
        </Card>
      </div>
    </>
  );
}
