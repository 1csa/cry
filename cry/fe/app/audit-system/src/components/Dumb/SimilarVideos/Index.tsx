import React, { useContext, useMemo } from 'react';

import { CreateMediaInfoContext, ICreateMediaInfoContext } from '@/context';
import BasicCopyToClipboard from '../CopyToClipboard';

import './index.less';

type SimilarVideosArrayItems = 'docId' | 'url' | 'coverImage' | 'videoId' | 'accuracy';

export type similarVideosArrayType = Record<SimilarVideosArrayItems, string> & {
  hasBorder?: boolean;
};

const riskVideoHost = `http://civilization.yidian-inc.com/system/video`;
export interface ISimilarVideos {
  similarVideosArray: similarVideosArrayType[];
  similarVideoType: string;
}

const SimilarVideos: React.FC<{}> = () => {
  const mediaInfoContext = useContext<ICreateMediaInfoContext>(CreateMediaInfoContext);
  const videosSampleObj = mediaInfoContext?.similarVideos;
  const videoIdUrlArray = videosSampleObj?.data?.filter(item => item.videoId) || [];
  const normalUrlArray = videosSampleObj?.data?.filter(item => item.url) || [];

  const isNeedShow = videosSampleObj?.data && videosSampleObj?.data?.length > 0 && (videoIdUrlArray?.length > 0 || normalUrlArray.length > 0);

  const baseRenderVideoBlock = (data: similarVideosArrayType[]) => {
    return data.map(ele => {
      const url = ele.url ? ele.url : ele.videoId && `${riskVideoHost}/${ele.videoId.split('/')[1]}`;
      return (
        <>
          {ele.coverImage ? (
            <div key={url} className={`mb10 similar-content ${ele?.hasBorder ? 'danger-border' : 'opacity-border'}`}>
              <a href={url} target="_blank">
                <img className="sim-pic" src={ele.coverImage} alt="相似命中封面图" title="相似命中封面图" />
              </a>
              <p style={{ marginBottom: 0 }}>
                <BasicCopyToClipboard data={ele?.docId} title="docid" renderChild={() => <span className="cp">{ele?.docId}</span>} />
                <span>
                  {ele?.docId ? ` : ${typeof ele?.accuracy === 'string' && ele?.accuracy.length > 0 ? Number(ele?.accuracy).toFixed(3) : ''}` : ''}
                </span>
              </p>
            </div>
          ) : (
            <p>
              命中视频URL：
              <a href={url} target="_blank">
                {url}
              </a>
            </p>
          )}
        </>
      );
    });
  };

  const videoData = useMemo(() => {
    if (videosSampleObj?.type === 'risk') {
      return baseRenderVideoBlock(videoIdUrlArray || normalUrlArray || []);
    } else {
      return baseRenderVideoBlock(normalUrlArray || []);
    }
  }, [videosSampleObj?.type]);

  return (
    <>
      {isNeedShow && (
        <div className="mb10">
          {videosSampleObj?.type === 'risk' ? <h3>机审：黑样本相似命中</h3> : <h3>机审：历史内容相似命中</h3>}
          <div className="similar-img-box">{videoData}</div>
        </div>
      )}
    </>
  );
};

export default React.memo(SimilarVideos);
