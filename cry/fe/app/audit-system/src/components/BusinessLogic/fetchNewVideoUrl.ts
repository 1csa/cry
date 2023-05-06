import { urlConvert } from '@/services/videoReview';

// 调接口换取可以播放视频的地址
// 将视频url解析为一个有过期时间的临时播放地址，可以拿到不同分辨率的url。内容不会改变
export default (videoSrcUrl: string, k?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const key = k ?? '';
    const data = {
      url: videoSrcUrl,
      key,
    };
    urlConvert(data).then(res => {
      const { errorno, data, desc } = res;
      if (errorno === 0) {
        resolve(data);
      } else {
        reject(desc);
      }
    });
  });
};
