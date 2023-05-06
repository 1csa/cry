import React, { useState, useEffect } from 'react';
import {Table, Divider, PageHeader, message, Spin, Row, Input, Button} from 'antd';
import XLSX from 'xlsx';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import {ConnectState, UserModelState} from '@/models/connect';
import moment from 'moment';
import {STATUS_CN, PAGE, PAGE_SIZE,  USE_STATUS, USE_STATUS_CN, CATCH_TIME_ITEM_NAME, CRAWL_TYPE_TO_EN, CRAWL_MODE_MAP, IMPORTANT_ACCOUNT_MAP, IS_CRAWL_COMMENT_MAP} from '@/config/constant';
import {Link} from 'react-router-dom';
import { openDownloadDialog, sheet2blob } from '@/utils/dev_helper';
// import './index.less';
interface TaskManagerProps{
  user: UserModelState,
  dispatch: Dispatch,
  location: any
}


const TaskManager: React.FC<TaskManagerProps> = ({location, user, dispatch}) => {
  const parent_id = location.query.id;
  const status = location.query.status;
  const params = {count: PAGE_SIZE, page: 1, parent_task_id: parent_id, task_id: ''};
  const [childTask, setChildTask] = useState<any[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [subTaskID, setSubTaskID] = useState<string>('');
  let [subTask, setSubTask] = useState<any>(null);
  useEffect(() => {
    requestData();
  }, [parent_id]);
  const onPageChange = (page: any) => {
    params["page"] = page;
    requestData();
  }
  const requestData = async () => {
    // console.log(params);
    setLoading(true);
    const {code, reason, tasks, total} = await dispatch({
      type: 'TaskList/searchChildTask',
      payload: {
        ...params
      }
    });
    subTask = tasks && tasks[0];
    setSubTask({...subTask});
    const postTask = tasks && tasks.map((item: any) => {
      let temp = Object.assign({}, item.template);
      temp.all_count = item.all_count;
      temp.count_yesterday = item.count_yesterday;
      temp.count_7days = item.count_7days;
      temp.storage_count = item.storage_count;
      temp.id = item.id;
      temp.status = item.status;
      temp.use_status = item.use_status;
      temp.error = item.error;
      temp.error_timestamp = item.error_timestamp;
      return temp;
    });
    if(code === 0){
      setTotal(total);
      setChildTask(postTask);
    } else {
      message.info(`子任务获取失败,稍后重试; ${reason}`);
    }
    setLoading(false);
  }
  const onSetTaskStatus = async (id: any, status: number) => {
    const {currentUser = {}} = user;
    const operator = currentUser.email || currentUser.name || null;
    if(!operator){
      console.error(`operator: {operator}为空, 禁止操作`);
      return
    }
    const payload = {
      task_id: id,
      use_status: status,
      operator,
      reason: ''
    };
    const {code, reason} = await dispatch({
      type: 'TaskList/setTaskStatus',
      payload
    });
    if(code === 0){
      message.success(`操作成功!`);
      requestData();
    } else {
      message.info(`操作失败,请稍后重试! ${reason}`);
    }
  }
  const onSearch = async () => {
    params['task_id'] = subTaskID;
    requestData();
  }
  const columns = [{
    title: '子任务ID',
    dataIndex: 'id',
    key: 'id',
    render: (text: string, record: any) => {
      return <Link
        to={`/taskManager/detail/docs?id=${text}&status=${record['use_status']}`}
      >
        {text}
      </Link>
    }
  },
  {
    title: '账号/话题/关键词/doc',
    render: (text: string, record: any) => {
      return record['crawler_name'] || record['crawler_url']
    }
  },
  {
    title: '马甲号',
    dataIndex: 'media_name',
    key: 'media_name',
    render: (text: string, record: any) => {
      return <div>
        <div>{text}</div>
        <div>{record['media_id'] ? `UID: ${record['media_id']}` : ''}</div>
      </div>
    }
  },{
    title: '话题',
    dataIndex: 'talk_name',
    key: 'talk_name',
    render: (text: string, record: any) => {
      return <div>
        <div>{text}</div>
        <div>{record['talk_id']? `话题ID: ${record['talk_id']}`: ''}</div>
      </div>
    }
  },{
    title: '城市',
    dataIndex: 'cityname',
    key: 'cityname',
    render: (text: string, record: any) => {
      return <div>
        <div>{text}</div>
        <div>{record['city_id']? `城市ID: ${record['city_id']}`: ''}</div>
      </div>
    }
  },{
    title: '自定义',
    dataIndex: 'self',
    key: 'self',
  },{
    title: '个性化过滤条件',
    dataIndex: 'filter',
    key: 'filter',
  },{
    title: '数量',
    dataIndex: 'all_count',
    key: 'all_count',
  },{
    title: '昨日抓取量',
    dataIndex: 'count_yesterday',
    key: 'count_yesterday',
  },{
    title: '7日抓取量',
    dataIndex: 'count_7days',
    key: 'count_7days',
  },{
    title: '入库量',
    dataIndex: 'storage_count',
    key: 'storage_count',
  },{
    title: '状态',
    dataIndex: 'use_status',
    key: 'use_status',
    render:(text: any, record: any) => <span >{USE_STATUS_CN[text]}</span>
  },{
    title: '原因',
    dataIndex: 'error',
    key: 'error',
    width: 60,
  },{
    title: '出现时间',
    dataIndex: 'error_timestamp',
    key: 'error_timestamp',
    width: 100,
    render: (text: any) => text? moment(text * 1000).format("YYYY-MM-DD HH:MM:SS"): ''
  },
  {
    title: '操作',
    dataIndex: 'Action',
    key: 'Action',
    width: 120,
    render: (text: string, record: any) => {
      const useStatus = record['use_status'];
      const useButton = <a onClick={() => onSetTaskStatus(record['id'], USE_STATUS[1])}>{USE_STATUS_CN[1]}</a>;
      const notUseButton = <a onClick={() => onSetTaskStatus(record['id'], USE_STATUS[2])}>{USE_STATUS_CN[2]}</a>;
      if(USE_STATUS.indexOf(useStatus) === -1){
        return <>
          {useButton}
          <Divider type="vertical"></Divider>
          {notUseButton}
        </>
      }else if(useStatus === USE_STATUS[1]){
        return notUseButton;
      } else {
        return useButton;
      }
    }
  }];
  const pagination = {
    defaultCurrent: PAGE,
    pageSize: PAGE_SIZE,
    onChange: onPageChange,
    total
  };
  function getDay(sec: number){
    return sec/60/60/24;
  }
  function getDetail(obj: any, key: any, options?: any){
    if(!options){
      return obj && obj[key]
    }
    if(key === 'crawl_time' && obj && obj[key] ){
      let {duanneirong, news, video} = obj[key];
      return `图文${getDay(news)}天 视频${getDay(video)}天 短内容${getDay(duanneirong)}天`
    }
    return obj && obj[key]  && options[obj[key]];
  }
  const downloadFile = async (e: React.MouseEvent) => {
    e.preventDefault();
    // console.log(123);
     const {code, reason, tasks, total} = await dispatch({
      type: 'TaskList/searchChildTask',
      payload: {
        parent_task_id :parent_id,
        count: 10000
      }
    });
    if(code === 0){
      const result = tasks && tasks.map((item: any) => item['template']);
      const sheet = XLSX.utils.json_to_sheet(result);
      openDownloadDialog(sheet2blob(sheet, undefined), `主任务ID-${parent_id}.xlsx`)
    } else {
      console.info("数据获取失败");
    }
  }
  return (
    <>
      <div className="main-content">
        <PageHeader
          title={`主任务id: ${parent_id}, 状态: ${STATUS_CN[status] || '未知状态'} `}
        />
        <div style={{display: 'flex', justifyContent: 'space-between', width:'100%', lineHeight: '50px', flexWrap: 'wrap'}}>
          <div><strong>详情: </strong></div>
          <div>平台: {getDetail(subTask, 'platform')} </div>
          <div>内容类型: {getDetail(subTask, 'content_type', CATCH_TIME_ITEM_NAME)} </div>
          <div>抓取方式: {getDetail(subTask, 'crawl_type', CRAWL_TYPE_TO_EN)} </div>
          <div>是否抓取评论: {getDetail(subTask, 'is_crawl_comment', IS_CRAWL_COMMENT_MAP)} </div>
          <div>抓取量级: {getDetail(subTask, 'crawl_mode', CRAWL_MODE_MAP)} </div>
          <div>抓取时间: {getDetail(subTask, 'crawl_time', CATCH_TIME_ITEM_NAME)} </div>
          <div>导入账号: {getDetail(subTask, 'import_account', IMPORTANT_ACCOUNT_MAP)} </div>
          <a onClick={downloadFile}>文件下载</a>
        </div>
        <div>搜索条件:&nbsp;子任务ID: <Input
            placeholder="请输入子任务ID"
            onChange={(e: any) => setSubTaskID(e.target.value)}
            value={subTaskID}
            style={{width: '200px'}}
          /> &nbsp;
          <Button onClick={onSearch} type="primary">查询</Button></div>
        <Divider>
          <span style={{fontSize: 10}}>列表区域</span>
        </Divider>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            pagination={pagination}
            dataSource = {childTask}
            rowKey="id"
          />
        </Spin>
      </div>
    </>
  );
}

export default connect(({user}: ConnectState)=>({
  user
}))(TaskManager);

