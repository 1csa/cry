import { init as initApm } from '@elastic/apm-rum';
var apm = initApm({
  serviceName: 'blizzard-web',
  serverUrl: 'http://10.126.154.122:8200',
});
export default apm;
