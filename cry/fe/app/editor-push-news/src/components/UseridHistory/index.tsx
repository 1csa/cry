import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { Form, DatePicker } from 'formik-antd'
import { Table, message } from 'antd'
import moment from 'moment'
import { ColumnProps } from 'antd/es/table'
import { SampleUsersProps } from '@/config/analyse/analyse'
import * as AnalyseService from '@/services/analyseService'

import 'antd/dist/antd.css'

const FormItem = Form.Item

const columns: ColumnProps<SampleUsersProps>[] = [{
  title: '日期',
  dataIndex: 'day',
  key: 'day'
}, {
  title: 'userid',
  dataIndex: 'user_id',
  key: 'user_id'
}, {
  title: '用户分层',
  dataIndex: 'ch_label',
  key: 'ch_label'
}]


const UseridHistory: React.FC = () => {
  // day
  const [day, setDay] = useState<string>(moment().subtract(1, 'days').format('YYYY-MM-DD'))
  // table
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<SampleUsersProps>([])

  useEffect(() => {
    setLoading(true)
    async function getSampleUsers () {
      const { status, data, total } = await AnalyseService.getSampleUsers(day)
      if (status === 'success') {
        setData(data)
        setLoading(false)
      } else {
        message.error(`获取最近抽样用户失败!`)
        setLoading(false)
      }
    }

    getSampleUsers()
  }, [day])

  return (
    <>
      <Formik
        initialValues={{ day }}
        onSubmit={ (values) => console.log(values) }
      >
        {
          () => (
            <Form>
              <FormItem name="day">
                <DatePicker
                  onChange={ (date: moment.Moment, dateString: string) => setDay(dateString) }
                  name="day"
                />
              </FormItem>
            </Form>
          )
        }
      </Formik>
      <Table 
        loading={ loading }
        columns={ columns }
        dataSource={ data }
      />
    </>
  )
}

export default UseridHistory