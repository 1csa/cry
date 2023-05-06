import React, { memo } from 'react'
import { connect } from 'react-redux'
import { Card } from 'antd';
import '../../pages/index.less'

interface Props {}

function UserDebug(props: Props) {
    const {} = props

    return (
        <>
          <div className="main-content" >
            <Card bordered={false} style={{ minHeight: 380}}>
              <iframe
                  src="http://dataplatform.yidian-inc.com/panda/userDebug"
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



export default UserDebug
