import { message } from 'antd';
import { submitTask } from '@/services/commonServices';

/**
 * 提交-审核任务结果
 * @param data 数据
 * @param currentIsHis 当前页面是否从历史跳转进入
 * @param successCallback success callback
 * @param failCallback fail callback
 * @param errorCallback error callback
 */
const handleTaskSubmit = (
  data: any[],
  currentIsHis?: boolean,
  successCallback?: () => void,
  failCallback?: () => void,
  errorCallback?: () => void,
) => {
  // isHis的判断 因为有的页面是不需要进到新页面，所以需要有一个兜底的  TODO: wxj 具体的的使用场景？？？暂不清楚
  const isHis: boolean = currentIsHis || sessionStorage?.isHis === 'true' ? true : false;
  const forceObj = isHis ? { force_result: true } : {};
  const options = {
    data,
    ...forceObj,
  };
  submitTask(options)
    .then(res => {
      const { desc, errorno } = res;
      if (errorno === 0) {
        message.success('提交成功');
        successCallback && successCallback();
      } else {
        message.error(desc);
        failCallback && failCallback();
      }
    })
    .catch(err => {
      errorCallback && errorCallback();
      console.log('err', err);
    });
};

export default handleTaskSubmit;
