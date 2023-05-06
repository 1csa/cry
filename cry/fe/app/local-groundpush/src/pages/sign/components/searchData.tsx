import React, { memo,useEffect, useState, useCallback, ReactElement} from 'react';
import moment, { Moment } from 'moment';
import {Radio ,Select ,Button,Table,message} from 'antd';
import { PaginationConfig, SorterResult } from 'antd/es/table';
import { OptionProps } from 'antd/es/select';
const { Option } = Select;
import { YRangePicker,YSelect} from '@/components';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import {usePost,usePostAllData} from '@/services/common';
import { SignInColumn ,SignInKeyMap} from '@/config/signin/signin.config.tsx';
import { team_type, personnel_type,signIn_type } from './index.d';
import { process,exportData, stringifyDate } from '@/utils/dev_helper';
const SearchData: React.FC =(props)=> {
    const initialDate = moment(Date.now());

    const [ startDate, setStartDate ] = useState<Moment | undefined>(initialDate); // 这里做个特殊处理，如果startDate===endDate，就只发一个
    const [ endDate, setEndDate ] = useState<Moment | undefined>(initialDate);
    const [ teamType, setTeamType ] = useState<string>('1');
    // const [ signIn, setSignIn ] = useState<string>('1');
    const [ defaultValue, setDefaultValue ] = useState<number[]>([]);
    let select_Options;
    const { data: teamData, fetchData: fetchTeamData } = usePost<team_type[]>('/other/teams');
    const { data: personnelData, fetchData: fetchPersonnelData } = usePost<personnel_type[]>('/other/pushMans');
    const { data: signInData, fetchData: fetchSignInData } = usePost<signIn_type>('/sign/list');
    const pageSize = 10;

    useEffect(()=>{ // 默认数据
      let startTime = startDate && stringifyDate(startDate);
      let endTime = endDate && stringifyDate(endDate);

      fetchSignInData({offset: 0, limit: pageSize, startTime, endTime});
    }, []);

    useEffect(()=>{
        if(teamType==='1'){
            fetchTeamData()
        }else if(teamType==='2'){
            fetchPersonnelData()
        }
        setDefaultValue([])
    }, [teamType]);
    const handleTableChange = (
      { current =1, pageSize=10 }: PaginationConfig
    )=>{
        handleSignInData(pageSize,pageSize * (current -1))
    };

    function handleSignInData(limit:number,offset:number){
      fetchSignInData(process(handleParams(limit,offset)))
    }

    function handleParams(limit:number,offset:number) {
      const params = { limit:limit,
          offset:offset,
          startTime: startDate&&startDate.format('YYYY-MM-DD'),
          endTime: endDate&&endDate.format('YYYY-MM-DD'),
      }
      if(teamType==='1'){
          params["teamIds"] = defaultValue
      }else if(teamType==='2'){
          params["pushManIds"] = defaultValue
        }
        return params
    }
    const handleDownloadCsv = useCallback(async()=>{
        let total:number =  signInData? signInData.total : 0
        const params=handleParams(total,0)
        let signList = await usePostAllData<signIn_type>('/sign/list',process(params))
        const userData = signList&&signList.list
        if ( !userData || userData.length === 0 || total ===0 ){
          message.info('当前没有数据可导出');
          return;
        } else {
          let dataTransed = userData.map((
            {signInTime, teamName, teamId, pushManId, pushManName, signInDate, id,lngIn, latIn, lngOut, signOutDate,cityId,cityName,address})=>({
            signInTime,id, teamName, teamId, pushManId,pushManName, signInDate, signOutDate,address
          }))

          let mapedDataList = dataTransed.map((data)=>{
            let cnEntries = Object.entries(data).map(([key, val])=>[SignInKeyMap[key], val]);
            return Object.fromEntries(cnEntries)
          });

          exportData(mapedDataList, '用户详情数据');
        }
      }, [signInData]);
    if(teamType==='1'){
        select_Options  = teamData && teamData.map(({ id,value},index)=> <Option key={id} >{value}</Option>)

    }else if(teamType==='2'){
       select_Options = personnelData && personnelData.map(({id,name, phone},index)=>(
        <Option key={id}>{`${name}-${id}-${phone}`}</Option>
       ))
    }
    const handleRangeChange = useCallback((start?: Moment, end?: Moment)=>{
       setStartDate(start);
       setEndDate(end);
      }, []);

    function handleFilterSelect(input: string, option: ReactElement<OptionProps>): boolean {
      return option.props.children ? (option.props.children + '').indexOf(input) >= 0 : false
    };
    return <div>
            <h3>签到统计</h3>
            <div className="date">
                <label className="label">日期</label>
                <YRangePicker
                    fastSet={true}
                    defaultDate={0}
                    value={[startDate, endDate] as RangePickerValue}
                    onSelectChange={handleRangeChange}
                    includingToday = {true}
                />
            </div>
            <div className="query">
                <label className="label">筛选</label>
                <Radio.Group size="small" value={teamType} onChange={()=>teamType==='1'?setTeamType('2'):setTeamType('1')}>
                    <Radio.Button value="1">团队</Radio.Button>
                    <Radio.Button value="2">地推员</Radio.Button>
                </Radio.Group>
                <Select
                  size="small"
                  mode="multiple"
                  value = { defaultValue }
                  className="query_select"
                  placeholder="请选择"
                  filterOption={handleFilterSelect}
                  onChange={(value: number[])=>setDefaultValue(value)}
                >
                  { select_Options }
                </Select>
                <Button className = "button" size="small" type="primary" onClick={()=>handleSignInData(pageSize,0)}>
                    查看
                </Button>
            </div>
            <div className = "team">

            {/* <Radio.Group className = "radio" value={signIn} onChange={()=>signIn==='1'? setSignIn('2'):setSignIn('1')} style={{ marginBottom: 16 }}>
                <Radio.Button value="1">已签到</Radio.Button>
                <Radio.Button value="2">未签到</Radio.Button>
            </Radio.Group> */}
            <div className = "btn_content">
            <Button className = "down" size="small" type="primary" onClick={()=>handleDownloadCsv()}>
                下载csv
            </Button>
            </div>
      </div>
      <div>
        <Table
          columns={SignInColumn}
          dataSource={signInData && signInData.list}
          onChange={handleTableChange}
          scroll={{x: 'max-content'}}
          bordered
          pagination={{
              size: 'small',
              total: signInData&&signInData.total,
              pageSize: signInData && signInData.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: total=> `总计${total}条结果`,
            }}
          rowKey='id'
        />
      </div>
     </div>
  }

  export default memo(SearchData);
