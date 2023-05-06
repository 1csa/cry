import React, { Component } from 'react';
import { Layout, Breadcrumb, Divider } from 'antd';

import './index.less';

const { Content } = Layout;

interface Props {
  home?: string;
  current?: string;
  children?: any;
}

class PageHeader extends Component<Props, {}> {
  static defaultProps = {
    home: '首页',
    current: '当前页面标题未指定',
  };

  render() {
    const props = this.props;
    return (
      <div className="page-header">
        <Content>
          <div className="layout-container" style={{position: 'relative'}}>
            <Breadcrumb>
              <Breadcrumb.Item>{props.home}</Breadcrumb.Item>
              <Breadcrumb.Item>{props.current}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{position: 'absolute', right: '0', top: '0'}}>
              {props.children}
            </div>
          </div>
          <Divider dashed />
        </Content>
      </div>
    );
  }
}

export default PageHeader;
