import React, { Component } from 'react';
import { Card, Breadcrumb } from 'antd';
import ManualHistory from '@/components/ManualHistory';
import { connect } from 'dva';
import { ConnectState, UserModelState, AuthModelState } from '@/models/connect';

interface Props {
  location: any;
  user: UserModelState;
  auth: AuthModelState;
}

class LikeNews extends Component<Props, {}> {
  async componentDidMount () {
    const currentAuth = this.props.auth.currentAuth

    if (!currentAuth?.childAuths.includes('like_news')) {
      this.props.history.push('/no_auth')
    }
  }

  render() {
    return (
      <div className="main-content-with-page-header">
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>人工干预</Breadcrumb.Item>
            <Breadcrumb.Item>文章点赞数</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <ManualHistory pathname={ this.props.location.pathname.substring(1) }></ManualHistory>
      </div>
    );
  }
}

export default connect(({ user, auth }: ConnectState) => ({
  user, auth
}))(LikeNews)