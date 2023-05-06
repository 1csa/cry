import React from 'react';
import MediaContentReview from '@/pages/commonPages/taskReview/index';
import { ContentType } from '@/data/constants';

const CommentReview: React.FC<{}> = () => {
  const contentType: string = 'comment';

  return (
    <MediaContentReview
      contentType={contentType}
      initialValues={{
        material_type: [ContentType[contentType]],
        audit_level: 1,
      }}
      isFive={true}
    />
  );
};

export default CommentReview;
