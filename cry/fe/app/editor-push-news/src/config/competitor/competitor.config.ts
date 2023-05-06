import moment from 'moment';
import { SearchProps, MonitorScreen, CompetitorMonitorProps } from './competitor';

export const Monitor_Time_Format = 'YYYY-MM-DD HH:mm:ss';

export const defaultSearch: SearchProps = {
  date: [moment().subtract(1, 'days'), moment()],
  app_name: '',
  hotspot: '',
  kws: '',
  device_id: '',
  order: "desc",
  pub_status: '-1',
}

export const defaultScreen: MonitorScreen = {
  start_date: moment().subtract(1, 'days').format(Monitor_Time_Format),
  end_date: moment().format(Monitor_Time_Format),
  app_name: '',
  hotspot: '',
  kws: '',
  device_id: '',
  order: 'desc',
}

export const defaultMonitorItem: CompetitorMonitorProps = {
  id: -1,
  mid: '',
  push_title: '',
  push_abstract: '',
  push_channel: null,
  content_link: null,
  hotspot: null,
  app_name: '',
  date: '',
  brand: null,
  device_id: null,
  bundle_version: null,
  ct: null,
  sct: null,
  pub_status: 0,
  pub_memo: '',
  doc_id: ''
}

// export const MonitorSocketUrl = 'ws://dev.yidian-inc.com:5000/api/push/monitor';
export const MonitorSocketUrl = "http://10.60.110.137:8080/push/socket"
