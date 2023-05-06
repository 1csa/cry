import React from 'react';

import MessageContentReview from '@/pages/commonPages/taskReview';
import { ContentType } from '@/data/constants';

const StudentReview = () => {
  const contentType: string = 'student';

  return (
    <MessageContentReview
      contentType={contentType}
      initialValues={{
        material_type: [ContentType[contentType]],
        audit_level: 1,
      }}
    />
  );
};

export default StudentReview;
