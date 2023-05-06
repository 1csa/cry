import React from 'react';

import MessageContentReview from '@/pages/commonPages/taskReview';
import { ContentType } from '@/data/constants';

const contentType = 'userAction';

const MessageReview = () => (
  <MessageContentReview
    contentType={contentType}
    initialValues={{
      material_type: [ContentType[contentType]],
      audit_level: 1,
    }}
  />
);

export default MessageReview;
