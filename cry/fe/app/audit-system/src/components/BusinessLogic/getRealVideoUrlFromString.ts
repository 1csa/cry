import handleNewVideoUrl from '@/components/BusinessLogic/fetchNewVideoUrl';
import { isJSON } from '@/utils/dev_helper';

// 截取字符中的options="url:的数据
const videoRegExp = /options=\"url:([^\"^\;]+?)\;/;

type ReturnTaskData = Promise<{
  data: any[];
}>;

// 利用正则处理图文视频内容
const getContent = (data: any[]) => {
  // 解析json
  const material =
    data[0].material && typeof data[0].material === 'string' && JSON.parse(data[0].material);
  const isVideoStr = '<yd-tag-component type="video"';
  // 拆出来options的第一个
  const videoSrcUrl = material?.content
    ? material?.content?.includes(isVideoStr) &&
      Array.isArray(material?.content?.match(videoRegExp))
      ? material?.content?.match(videoRegExp)[1]
      : ''
    : '';
  return { videoSrcUrl, content: material?.content || '', isVideoStr };
};

export const handleNewTask = (callback: ReturnTaskData, isVideo?: boolean): ReturnTaskData => {
  // callback 是对应的页面领取或者获取历史任务，.then可以获取对应的数据
  // 先去获取当前点击的数据，拿到结果之后在回调里处理获取视频url，没有url的话就直接返回data 后面要用
  return new Promise((resolve, reject) => {
    const initData = callback.then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const { videoSrcUrl } = getContent(data);
        if (videoSrcUrl) {
          return { videoSrcUrl, data };
        }
        return { data };
      }
    });

    // 第二步 判断原来的视频url是否存在，请求接口转换新的可播放的url
    initData
      .then(res => {
        // 因为视频审核在页面已经处理了，看一下那块的逻辑 是不是也可以在这里调用
        if (res?.videoSrcUrl && !isVideo) {
          return handleNewVideoUrl(res?.videoSrcUrl).then(url => {
            return { ...res, videoSrcUrl: url };
          });
        }
        return res;
      })
      .then(res => {
        if (res?.data) {
          // 请求成功之后解析data下的数据，结合视频的url做原始数据替换
          let materials = isJSON(res?.data[0].material)
            ? JSON.parse(res?.data[0].material)
            : res?.data[0].material;
          let { content, isVideoStr } = getContent(res?.data || []);
          const regExp = /<yd-tag-component[^>]+>/;
          if (res?.videoSrcUrl) {
            // 得到新的content
            const newContent =
              content.includes(isVideoStr) &&
              content.replace(regExp, (str: string) => {
                return str.replace(videoRegExp, () => {
                  return `options="url:${res?.videoSrcUrl};`;
                });
              });
            // 原始数据替换
            materials.content = newContent;
            res.data[0].material = JSON.stringify(materials);

            resolve({ data: res?.data });
          }
          resolve({ data: res?.data });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
