import React from 'react';

import MediaContentReview from '@/pages/commonPages/taskReview';
import { ContentType } from '@/data/constants';

import './index.less';

interface IVideoMarking {}

const VideoMarking: React.FC<IVideoMarking> = () => {
  const contentType: string = 'videoTags';

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

export default VideoMarking;
