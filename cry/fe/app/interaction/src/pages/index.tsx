import React from 'react';
import { Redirect } from 'react-router-dom';

import './index.less';

export default function() {
  return (
    <Redirect to="query_fans"/>
  );
}
