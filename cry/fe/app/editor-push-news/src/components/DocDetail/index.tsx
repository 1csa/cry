import React, { useState, useEffect } from 'react'
import { Table, Radio, message } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { AppDocDetailProps, PushDocDetailProps } from '@/config/analyse/analyse'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

interface IProps {
  columns: ColumnProps<any>[]
  data: Array<AppDocDetailProps | PushDocDetailProps>
  showCondition: boolean
  userid?: string
  isExpandable: boolean // 表格是否可展开
  getDocDetail: (userid: string, type?: string) => Promise<any>
}

const DocDetail: React.FC<IProps> = ({ columns, data, showCondition, userid, isExpandable, getDocDetail }) => {
  // type
  const [type, setType] = useState<string>('THREE_MONTH')

  useEffect(() => {
    async function getDocDetailFn () {
      const { status, docs } = await getDocDetail(userid!, type)
      if (status === 'success') { 
        data = docs
      } else {
        message.error('获取主端文章数据失败!')
      }
    }

    if (userid) {
      getDocDetailFn()
    }
  }, [type])

  return (
    <>
      {
        showCondition &&
        <RadioGroup 
          defaultValue={ type } 
          buttonStyle="solid" 
          style={{ marginBottom: '25px' }}
          onChange={ (e) => setType(e.target.value) }
        >
          <RadioButton value="THREE_MONTH">三个月</RadioButton>
          <RadioButton value="HALF_YEAR">半年</RadioButton>
          <RadioButton value="ONE_THOUSAND">近 1000 条</RadioButton>
          <RadioButton value="ALL">全部</RadioButton>
        </RadioGroup>
      } 
      {
        isExpandable ? 
        <Table 
          scroll={{ x: '100%' }}
          // scroll={{ x: '100%', y: window.innerWidth >= 1920 ? 700 : 480 }}
          columns={ columns }
          dataSource={ data }
          rowKey={ (render: AppDocDetailProps | PushDocDetailProps, index: number) => render.doc_id + index }
          expandedRowRender={ record => <p style={{ margin: 0 }}>{ record.kws.join(', ') }</p> }
          size="small"
        /> :
        <Table 
          scroll={{ x: '100%' }}
          // scroll={{ x: '100%', y: window.innerWidth >= 1920 ? 700 : 480 }}
          columns={ columns }
          dataSource={ data }
          rowKey={ (render: AppDocDetailProps | PushDocDetailProps, index: number) => render.doc_id + index }
          size="small"
        />
      }    
    </>
  )
}

export default DocDetail