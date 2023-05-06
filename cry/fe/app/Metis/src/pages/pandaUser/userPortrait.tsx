import React, {useEffect , useState} from 'react';
import { Card } from 'antd';
import '../../pages/index.less'

 const UserPortrait = () =>{
  useEffect(() => {
    
  },[])
 
  return (
    <>
      <div className="main-content" >
        <Card bordered={false} style={{ minHeight: 380 }}>
          <iframe
              src="http://dataplatform.yidian-inc.com/panda/user2"
              width="100%"
              height="100%"
              border="0"
              frameBorder="0"
            ></iframe>
        </Card>
      </div>
    </>
  );
}
export default UserPortrait