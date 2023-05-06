/**
 * 对请求做统一格式处理,只resolve状态为成功的请求，状态为fail
 */

import { RequestRes } from '@/types/app';
import { cloneDeep } from 'lodash';

type ResponseData = Record<string, any>
type ResponseDataKey = keyof ResponseData | Array<keyof ResponseData>;

const mapResponse = function(
	response: Promise<ResponseData>, dataKey: ResponseDataKey, errorKey: keyof ResponseData
): Promise<RequestRes> {
	let mappedRes = response.then((res)=>{
		const { status, code, ...resData} = res;
		if (res.status == "success") {
			let resData: any ={};

			if (typeof dataKey == "string") {
				resData = cloneDeep(res[dataKey])
			} else {
				for (let key of dataKey) {
					resData[key] = cloneDeep(res[key])
				}
			}

			return {
				code: 0,
				status: "success" as const,
				data: resData,
			}
		} else {
			throw new Error(res[errorKey]);
		}
	});
	return mappedRes;
}

export default mapResponse;
