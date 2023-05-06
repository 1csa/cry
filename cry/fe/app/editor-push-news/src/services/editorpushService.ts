import { request, parsequery } from '@/utils';
import { ResponseType, ResponseUpload } from '@/config/upload/upload';

// 获取push历史
export async function getUserlayerList() {
  return await request.get(`/api/push/editor/userlayer`);
}

// 获取标签
export const getTags = async (keyword: string, type: 'pushtag' | 'userset' | 'fromid') => {
  return await request.get(`/api/push/editor/tags?keyword=${encodeURIComponent(keyword)}&type=${type}`);
};

// 获取同步平台列表
export const getSyncPlatforms = async () => {
  return await request.get('/api/push/editor/syncplatform');
};

// 获取推送分类列表
export const getCatelist = async () => {
  return await request.get('/api/push/editor/catelist');
};

// 获取单个标签对应的用户数
export const getUserCount = async (channels: string[]) => {
  console.log(channels, 'channels');
  return await request.get('/api/push/editor/tagcount', { params: { fromid: channels.join(',') } });
};

// 获取多标签下累计的用户数 
// yyl
export const getPushUsers = async (tags: string[] = [], extags: string[] = [], inter_channels: string[]) => {
  return await request.get('/api/push/editor/pushusercount', { params: { tags, extags, inter_channels } });
};

// 上传图片 保证两个上传返回字段一致
export const updatePushImage = async (data: FormData, type: string): Promise<ResponseType<ResponseUpload>> => {
  if (type === "xiaomi") {
    return await request.post('/api/push/editor/pushimage', {
      data,
      params: { type },
    })
  } else {
    return await request.post('/api/upload', { data })
  }
};

// 提交推送
export const submitPush = async (data: Record<string, any>) => {
  return await request.post('/api/push/editor/push', { data, timeout: 20000 });
};

// 获取推送历史的推送数据字段
export const handleGetHistoryPushData = async (data: Record<string, any>) => {
  return await request.post('/api/push/editor/getPushData', { data, timeout: 20000 });
};

/**
 * @returns 分段式提交推送
 * @param data 分段式数据
 * @param isTest true为测试环境 false为正式环境
 */
export const submitSectionPush = async (data: Record<string, any>, isTest: boolean = true) => {
  return await request.post(`/api/push/editor/pushSection?${isTest && 'isTest=true'}`, { data, timeout: 20000 });
};

// 重复推送校验
export const checkDuplicate = async (docid: string, title: string, summary: string) => {
  return await request.get(`/api/push/editor/duplicate`, { params: { docid, title, summary } });
};

export const getOppoQuota = async () => {
  return await request.get('/api/push/editor/quota');
}

export const getDocinfo = async (docid: string, biz_id: string = "YDZX") => {
  return await request.get("/api/push/editor/docinfo", { params: { docid, biz_id } })
}

// 判断oppo push 是否用完了
export const getOppoPushIsOver = async () => {
  const res = await request.get("/api/push/editor/getOppoPushIsOver")

  try {
    request.post('http://web-rest.int.yidian-inc.com/api/v1/log-platform/log?schema=webuilog&service=pandora', {
      data: {
        "user": {
          "username": "推送管理系统 oppo 付费推送 后端返回的数据"
        },
        "log_source": {
          "tag": "edit-push"
        },
        "target_data": {
          "detail": JSON.stringify(res)
        },
        "action_method": "check-oppo-pay"
      },
    });
  } catch (error) {
    console.log(error)
  }
  let isOpenOppoPushButton = false
  if (res.status === 'success' && res.result.code === 0) {
    let currentResult = res.result.result
    if (currentResult.length) {
      currentResult.forEach((item: any) => {
        // 下面这个情况代表 配额用完了，就要开启oppo 付费推送开关，其他情况下代表没用完，不用打开
        if (item['appId'] === 'yidian' && item['channel'] === 'OPPO' && item['num'] === 0) {
          isOpenOppoPushButton = true
        }
      })
    }
  }
  return isOpenOppoPushButton
}

// oppo xiaomi 预算预警
export const getPushStatistics = async () => {
  return await request.get("/api/push/editor/getPushStatistics")
}
// 鸿蒙push推送
export const harmonyOSPushHistory = async (data: any): Promise<ResponseType<any>> => {
  let url = '/api/push/editor/harmonyOSPush'
  const res = await request.post(url, { data })
  return res
};