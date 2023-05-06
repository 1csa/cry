import request from '@/utils/request';
import queryString from 'query-string';

// 查询 频道类型
export async function getChannelProps(payload: any): Promise<any> {
  const query = queryString.stringify(payload);
  return request.get(`/api/channel/getChannelProps?${query}`);
}

// 获取 置顶列表
export async function getTopNewsByFromid(payload: any): Promise<any> {
  const query = queryString.stringify(payload);
  const res = await request.get(`/api/channel/getTopNewsByFromid?${query}`);
  // 这里很快就获取到数据了， 但是页面渲染的时间很长 需要优化
  // console.log('+++++=====___------')
  // console.log(res)
  return res
}

// 删除 推荐内容
export async function delNewsbyDocid(payload: any): Promise<any> {
  const fromid = payload.params.fromid;
  const docid = payload.params.recItem.docid;
  return request.get(`/api/channel/delNewsbyDocid?fromid=${fromid}&docid=${docid}`);
}

// 获取 推荐内容列表
export async function getRecNewsByFromid(payload: any): Promise<any> {
  const { fromid, appid = '', order = '', pageNum = 0, size = 20 } = payload.params;
  return request.get(
    `/api/channel/getRecList?id=${fromid}&appid=${appid}&order=${order}&page=${pageNum}&size=${size}`,
  );
}

// 搜索 推荐内容源的文章
export async function searchByKeyword(payload: any): Promise<any> {
  const { keyword, order = '', days = 1, src = '' } = payload.params;
  return request.get(
    `/api/channel/searchByKeyword?keyword=${keyword}&order=${order}&days=${days}&src=${src}`,
  );
}

// 查询 文章数据
export async function getDocData(payload: any): Promise<any> {
  const { fromid, display = 'default', docids } = payload;
  const query = queryString.stringify({ fromid, display });
  return request.post(`/api/channel/getDocData?${query}`, { data: { docids } });
}

// 查询 推荐内容源数据
export async function getRecData(payload: any): Promise<any> {
  const { fromid, display = 'default', docids } = payload;
  const query = queryString.stringify({ fromid, display });
  return request.post(`/api/channel/getDocData?${query}`, { data: { docids } });
}

// 查询 推荐内容源标签数据
export async function getRecDocProps(payload: any): Promise<any> {
  const { docids } = payload;
  return request.post(`/api/channel/getRecDocProps`, { data: { docids } });
}

// 保存 置顶列表
export async function saveTopNews(payload: any): Promise<any> {
  const { topInfo } = payload;

  return request.post(`/api/channel/saveTopNews`, { data: { topInfo: topInfo } });
}

// 搜索 docid or url
export async function search(payload: any): Promise<any> {
  if ('docid' in payload) {
    const { docid = '', fromid = '' } = payload;
    const query = queryString.stringify({ docid, fromid });
    return request.get(`/api/channel/searchByDocid?${query}`);
    // console.log(request.get(`/api/channel/searchByDocid?${query}`));
  } else {
    const { url = '', fromid = '' } = payload;
    const query = queryString.stringify({ url, fromid });
    return request.get(`/api/channel/searchByUrl?${query}`);
  }
}

export async function mulitSearch(payload: any): Promise<any> {
  const { docid = '' } = payload;
  const ids = docid.split(',');
  const searchAll: any[] = ids.reduce((pre: any, cur: string, _idx: string, _arr: any) => {
    if (cur) {
      pre.push(request.get(`/api/channel/searchByDocid?docid=${cur}`));
    }
    return pre;
  }, []);
  return new Promise((resolve, reject) => {
    Promise.all(searchAll).then(res => {
      return resolve(res);
    });
  });

  // console.log(request.get(`/api/channel/searchByDocid?${query}`));
}

// 获取 所有 大类
export async function getCategory(payload: any): Promise<any> {
  const query = queryString.stringify(payload);
  return request.get(`/api/channel/getCategory?${query}`);
}

// 根据二级热点 大类 获取 小类
export async function getSubCategoryByCategory(payload: any): Promise<any> {
  const query = queryString.stringify(payload);
  return request.get(`/api/channel/getSubCategoryByCategory?${query}`);
}

// 根据 频道名 获取 要同步的 下属频道
export async function getSubLocalChannels(payload: any): Promise<any> {
  const query = queryString.stringify(payload);
  return request.get(`/api/channel/getSubLocalChannels?${query}`);
}

// 根据 文章 获取 历史 同步的 下属频道
export async function getSyncedLocalChannels(payload: any): Promise<any> {
  const query = queryString.stringify(payload);
  return request.get(`/api/channel/getSyncedLocalChannels?${query}`);
}

// 保存 同步 历史
export async function saveSyncTopNews(payload: any): Promise<any> {
  // 打上日志
  return request.post(`/api/channel/saveSyncTopNews`, { data: { ...payload } });
}

// 更新 每个 下属频道的 置顶
export async function syncSubChannelTopNews(payload: any): Promise<any> {
  // 打上日志
  return request.post(`/api/channel/syncSubChannelTopNews`, { data: { ...payload } });
}
// 图片
export async function setImages({ docid, covertype, imageUrls }: any): Promise<any> {
  // let url = `http://i2-image-api.ha.in.yidian.com:8003/editor/php/docimage2.php?opt=set&docid=${docid}&covertype=${covertype}`;
  // return request.post(`/api/proxy/${url}`, {
  //   data: { images: imageUrls ? imageUrls.split(',') : [] },
  // });
  // 接口迁移2023-04-24
  let url = `http://cl-k8s.yidian-inc.com/apis/cpp-doc/prv/document/update?docid=${docid}&from=yanyalong@channel_front&key=a5c0602bf500793de7d4307862802ce9`;
  return request.post(`/api/proxy/${url}`, {
    data: { upload_images: imageUrls ? imageUrls.split(',') : [] },
  });
}
// 图片
export async function updateDocImage({ docid }: any): Promise<any> {
  let url = `http://lc1.haproxy.yidian.com:7001/feature/single/update?docid=${docid}&ops={\"$set\":{\"t_lastedit\":${Math.floor(
    Date.now() / 1000,
  )}}}`;
  return request.get(`/api/proxy/${url}`);
}
// 图片
export async function uploadImageOp(formData: any): Promise<any> {
  return request.post(`/api/upload`, { data: formData });
}

/**
 * @param docid
 * @returns 图片信息
 */
export async function getArticlePic(docid: any) {
  return request.get(`/api/channel/getArticlePic?docid=${docid}`);
}
