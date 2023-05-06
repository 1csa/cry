import React from 'react';

import MediaContentReview from '@/pages/commonPages/taskReview';
import { ContentType } from '@/data/constants';

const contentType = 'articleQuality';
const ImageQualityMarking = () => {
  return (
    <MediaContentReview
      contentType={contentType}
      initialValues={{
        material_type: [ContentType[contentType]],
        audit_level: 1,
      }}
    />
  );
};

export default ImageQualityMarking;
