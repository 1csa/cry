/*
 * @Author: your name
 * @Date: 2020-10-12 15:34:01
 * @LastEditTime: 2020-10-26 20:42:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /work/zeus/fe/app/access-content/src/services/pqtask.ts
 */
import request from '@/utils/request';
import { pqAPI } from '@/config/constant';

// 获取任务列表,接口重复了，这个废弃
// export async function getPqTaskList(data: any): Promise<any> {
//     return request.get(`/api/proxy/${pqAPI.getTaskList}`, {
//         params: data,
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8'
//         }
//     });
// }

// 根据条件，查找对应任务
export async function searchTaskList(params: any): Promise<any> {
    return request.get(`/api/proxy/${pqAPI.searchTaskList}`, {
        params
    })
}

// 获取任务信息
export async function getTaskInfoById(params: any): Promise<any> {
    return request.get(`/api/proxy/${pqAPI.getTaskInfoById}/${params.task_id}`);
}
// 更改任务状态
export async function resetTaskStatus(params: any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.resetTaskStatus}`, {
        data: params
    })
}
// 删除任务
export async function deleteTask(params: any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.deleteTask}`, {data: params});
}

// 获取source列表
export async function getSourceList(params: any): Promise<any> {
    return request.get(`/api/proxy/${pqAPI.getSourceList}`, {params});
}
// 创建source
export async function createSource(params: any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.getSourceList}`, {data: params});
}
// 更新source
export async function updateSource(params: any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.updateSource}`, {data: params});
}
// 删除source
export async function deleteSource(params: any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.deleteSource}`, {data: params});
}

// 获取链路列表
export async function getChainList(params: any): Promise<any> {
    return request.get(`/api/proxy/${pqAPI.getChainList}`, {
        params
    })
}
export async function getChainListGroup(params: any): Promise<any> {
    return request.get(`/api/proxy/${pqAPI.getChainListGroup}`, {
        params
    })
}
// 创建链路
export async function createChain(params: any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.getChainList}`, {data: params});
}
// 更新链路
export async function updateChain(params: any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.updateChain}`, {data: params});
}
// 删除链路
export async function deleteChain(params: any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.deleteChain}`, {data: params});
}

// 创建任务
export async function createTask(params:any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.createTask}`, {
        data: params,
        headers: {
            'IS-CHANGE-FORM': 'form-to-json'
        }
    });
}

// 更新任务
export async function updateTask(params:any): Promise<any> {
    return request.post(`/api/proxy/${pqAPI.updateTask}`, {
        data: params
    })
}