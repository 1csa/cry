import { saveLog } from '../../../common/Logger.js';
import axios from 'axios';

// 保存kibana link: http://clay.yidianzixun.com:5602/app/kibana#/discover?_g=(refreshInterval:(pause:!t,value:0),time:(from:'2020-12-22T08:00:00.000Z',mode:absolute,to:'2020-12-22T09:00:00.000Z'))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:e3d02f50-bd91-11e9-84bd-f1e61f2dc8e1,key:log_source.tag,negate:!f,params:(query:filtertools,type:phrase),type:phrase,value:filtertools),query:(match:(log_source.tag:(query:filtertools,type:phrase))))),index:e3d02f50-bd91-11e9-84bd-f1e61f2dc8e1,interval:auto,query:(language:lucene,query:''),sort:!('@timestamp',desc))
const saveKibana = (actionMethod, target_data, data) =>{
  saveLog({
    log_source: { tag: 'filtertools' },
    target_data: { detail: JSON.stringify(data) },
    action_method: actionMethod,
    action_source: target_data,
  });
}

// 保存静态日志
const saveStaticLog = async(domain, secret, logData) => {
  const ret2 = await axios.post(`/api/proxy/http://m.v.yidian-inc.com/auth/save_log?domain=${domain}&secret=${secret}`,logData)
}

export { saveKibana, saveStaticLog }
