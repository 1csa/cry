import React, { useState, useEffect, ReactNode, ChangeEvent } from 'react'
import { Formik } from 'formik'
import { Form, Input, Select, Switch, DatePicker } from 'formik-antd'
import { message } from 'antd'
import PushImage from '@/components/PushImage'
import moment from 'moment'
import { PushBasicFormProps, PushFormProps } from '@/config/pushForm/push'
import * as PushService from '@/services/pushService'
import * as Validate from '@/validation/push'
import * as Data from '@/data'

import 'antd/dist/antd.css'

const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option

interface IProps {
  values: PushFormProps
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  rstypeList: Array<{ name: string, id: string }>
  tvChannelList: Array<{ id: string, name: string }>
  tvChannelMap: {[key: string]: string}
  getRstypeList: () => void
  getTvChannelList: () => void
}

const PushBasicCopy: React.FC<IProps> = ({ values, setFieldValue, rstypeList, tvChannelList, tvChannelMap, getRstypeList, getTvChannelList }) => {
  // article images
  const [articleImages, setArticleImages] = useState<Array<string>>([])

  useEffect(() => {
    if (!rstypeList.length) {
      getRstypeList()
    }
    if (!tvChannelList || !Object.keys(tvChannelMap).length) {
      getTvChannelList()
    }
  }, [])

  // computed label
  const computedLabel = (rstype: string): string => {
    switch (rstype) {
      case 'normal':
      case 'hot_topic':
      case 'comic':
      case 'audio':
      case 'novel':
        return 'docid'
      case 'theme':
        return 'theme'
      case 'local_url':
        return 'url'
      default:
        return ''
    }
  }

  // handle change docid need todo
  // 1. get title and summary
  // 2. get push history judge if docid was pushed in an hour
  const handleChangeDocid = (e: ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void): void => {
    let docid = e.target.value.trim()
    // 1
    getArticleInfo(docid, setFieldValue)
    // 2 todo
  }

  // get title summary and article images
  const getArticleInfo = async (docid: string, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    let { status, title, articleImages, reason } = await PushService.getArticleInfo(docid)
    if (status === 'success') {
      setFieldValue('title', title)
      setFieldValue('summary', title)
      setArticleImages(articleImages)
    } else {
      message.error(reason)
    }
  }

  // judge if rstype is comic audio novel need update action params docid
  const handleUpdateDocidInActionParams = (e: ChangeEvent<HTMLInputElement>, rstype: string, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void): void => {
    let docid = e.target.value.trim()
    switch (rstype) {
      case 'comic':
        setFieldValue('comic_action_params.docid', docid)
        return
      case 'audio':
        setFieldValue('audio_action_params.docid', docid)
        return
      case 'novel':
        setFieldValue('novel_action_params.docid', docid)
        return
      default:
        return
    }
  }

  // render rstype option
  const renderRstypeOptions = (): ReactNode => {
    return rstypeList.map((item: any) => {
      return <Option value={ item.id } key={ item.id }>{ item.name }</Option>
    })
  }

  // render tvtype option
  const renderTvTypeOptions = (): ReactNode => {
    return Data.tv_type_list.map((item: any) => {
      return <Option value={ item.value } key={ item.value }>{ item.label }</Option>
    })
  }

  // render tvchannel option
  const renderTvChannelOptions = (): ReactNode => {
    return tvChannelList.map((item: any) => {
      return <Option value={ item.id } key={ item.id }>{ item.name }</Option>
    })
  }

  // render bottom tab tab option
  const renderBottomTabTabOption = (): ReactNode => {
    return Data.bottom_tab_list.map((item: any) => {
      return <Option value={ item.value } key={ item.value }>{ item.label }</Option>
    })
  }

  // render rank list type option
  const renderRankListTypeOption = (): ReactNode => {
    return Data.rank_list_type_list.map((item: any) => {
      return <Option value={ item.value } key={ item.value }>{ item.label }</Option>
    })
  }

  // render rank list rank type option
  const renderRankListRankTypeOption = (type: string): ReactNode => {
    let temp = type === 'ximaFM' ? Data.xima_rank_type_list : Data.comic_rank_type_list
    return temp.map((item: any) => {
      return <Option value={ item.value } key={ item.value }>{ item.label }</Option>
    })
  }

  // render tv station tv type option
  const renderTvStationTvTypeOption = (): ReactNode => {
    return Data.tv_station_type_list.map((item: any) => {
      return <Option value={ item.value } key={ item.value }>{ item.label }</Option>
    })
  }

  // render tv station action type option
  const renderTvStationActionTypeOption = (): ReactNode => {
    return Data.action_type_list.map((item: any) => {
      return <Option value={ item.value } key={ item.value }>{ item.label }</Option>
    })
  }

  // render tv jump channel open type option
  const renderTvJumpChannelOpenTypeOption = (): ReactNode => {
    return Data.open_type_list.map((item: any) => {
      return <Option value={ item.value } key={ item.value }>{ item.label }</Option>
    })
  }

  return (
    <>
      {/* <div>{ JSON.stringify(values) }</div> */}
      <FormItem name="rstype" label="类型" validate={ Validate.validateRstype } required>
        <Select
          name="rstype"
          placeholder="请选择类型"
        >
          { renderRstypeOptions() }
        </Select>
      </FormItem>
      {/* 文章 主题 热点专题 漫画 音频 小说 url(身边) */}
      {
        ['normal', 'theme', 'hot_topic', 'comic', 'audio', 'novel', 'local_url'].includes(values.rstype) &&
        <FormItem name="docid" label={ computedLabel(values.rstype) } validate={ (val) => Validate.validateDocid(val, computedLabel(values.rstype)) } required>
          <Input
            name="docid"
            placeholder={ `请输入 ${ computedLabel(values.rstype) }`}
            onChange={ (e) => handleUpdateDocidInActionParams(e, values.rstype, setFieldValue) }
            onBlur={ (e) => handleChangeDocid(e, setFieldValue) }
            onPressEnter={ (e) => handleChangeDocid(e, setFieldValue) }
          />
        </FormItem>
      }
      {/* 电视 */}
      {
        values.rstype === 'tv' &&
        <>
          <FormItem name="tv_action_params.tv_pre_type" label="tv_pre_type" validate={ (val) => Validate.validateTvType(val, 'tv_pre_type') } required>
            <Select 
              name="tv_action_params.tv_pre_type"
              placeholder="请选择 tv_pre_type"
            >
              { renderTvTypeOptions() }
            </Select>
          </FormItem>
          <FormItem name="tv_action_params.tv_pre_value" label="tv_pre_value" validate={ (val) => Validate.validateTvValue(val, 'tv_pre_value') } required>
            {
              ['', 'url', 'docid', 'channel', 'category', 'movie'].includes(values.tv_action_params.tv_pre_type) &&
              <Input 
                name="tv_action_params.tv_pre_value"
                placeholder="请输入 tv_pre_value" 
              />
            }
            {/* todo 记得 更新 tv_pre_channelid */}
            {
              values.tv_action_params.tv_pre_type === 'tvchannel' &&
              <Select
                name="tv_action_params.tv_pre_value"
                showSearch
                optionFilterProp="children"
              >
                { renderTvChannelOptions() }
              </Select>
            }
          </FormItem>
          <FormItem name="tv_action_params.tv_ing_type" label="tv_ing_type" validate={ (val) => Validate.validateTvType(val, 'tv_ing_type') } required>
            <Select 
              name="tv_action_params.tv_ing_type"
              placeholder="请选择 tv_ing_type"
            >
              { renderTvTypeOptions() }
            </Select>
          </FormItem>
          <FormItem name="tv_action_params.tv_ing_value" label="tv_ing_value" validate={ (val) => Validate.validateTvValue(val, 'tv_ing_value') } required>
            {
              ['', 'url', 'docid', 'channel', 'category', 'movie'].includes(values.tv_action_params.tv_ing_type) &&
              <Input 
                name="tv_action_params.tv_ing_value"
                placeholder="请输入 tv_ing_value" 
              />
            }
            {/* todo 记得 更新 tv_ing_channelid */}
            {
              values.tv_action_params.tv_ing_type === 'tvchannel' &&
              <Select
                name="tv_action_params.tv_ing_value"
                showSearch
                optionFilterProp="children"
              >
                { renderTvChannelOptions() }
              </Select>
            }
          </FormItem>
          <FormItem name="tv_action_params.tv_finish_type" label="tv_finish_type" validate={ (val) => Validate.validateTvType(val, 'tv_finish_type') } required>
            <Select 
              name="tv_action_params.tv_finish_type"
              placeholder="请选择 tv_finish_type"
            >
              { renderTvTypeOptions() }
            </Select>
          </FormItem>
          <FormItem name="tv_action_params.tv_finish_value" label="tv_finish_value" validate={ (val) => Validate.validateTvValue(val, 'tv_finish_value') } required>
            {
              ['', 'url', 'docid', 'channel', 'category', 'movie'].includes(values.tv_action_params.tv_finish_type) &&
              <Input 
                name="tv_action_params.tv_finish_value"
                placeholder="请输入 tv_finish_value" 
              />
            }
            {/* todo 记得 更新 tv_ing_channelid */}
            {
              values.tv_action_params.tv_finish_type === 'tvchannel' &&
              <Select
                name="tv_action_params.tv_finish_value"
                showSearch
                optionFilterProp="children"
              >
                { renderTvChannelOptions() }
              </Select>
            }
          </FormItem>
          <FormItem name="tv_action_params.tv_time_start" label="tv_time_start" validate={ (val) => Validate.validateTvTime(val, 'tv_time_start') } required>
            <DatePicker 
              name="tv_action_params.tv_time_start"
              showTime={ true }
              placeholder="请选择节目开始时间"
              disabledDate={ (val: moment.Moment) => val && val.valueOf() < Date.now() - 24 * 60 * 60 * 1000 }
              style={{ width: '100%' }}
            />
          </FormItem>
          <FormItem name="tv_action_params.tv_time_end" label="tv_time_end" validate={ (val) => Validate.validateTvTime(val, 'tv_time_end') } required>
            <DatePicker 
              name="tv_action_params.tv_time_end"
              showTime={ true }
              placeholder="请选择节目结束时间"
              disabledDate={ (val: moment.Moment) => val && val.valueOf() < Date.now() - 24 * 60 * 60 * 1000 }
              style={{ width: '100%' }}
            />
          </FormItem>
        </>
      }
      {/* 漫画 */}
      {
        values.rstype === 'comic' &&
        <FormItem name="comic_action_params.isDefaultSetToCatalog" label="是否默认定位到目录">
          <Switch
            name="comic_action_params.isDefaultSetToCatalog"
            checkedChildren="是"
            unCheckedChildren="否"
          />
        </FormItem>
      }
      {/* 底栏 tab */}
      {
        values.rstype === 'bottom_tab' &&
        <>
          <FormItem name="bottom_tab_action_params.tab" label="tab" validate={ Validate.validateBottomTabTab } required>
            <Select
              name="bottom_tab_action_params.tab"
              placeholder="请选择 tab"
            >
              { renderBottomTabTabOption() }
            </Select>
          </FormItem>
          <FormItem name="bottom_tab_action_params.from_id" label="from_id" validate={ Validate.validateBottomTabFromid } required>
            <Input 
              name="bottom_tab_action_params.from_id"
              placeholder="请输入 from_id"
            />
          </FormItem>
        </>
      }
      {/* 音频 */}
      { 
        values.rstype === 'audio' &&
        <>
          <FormItem name="audio_action_params.albumid" label="专辑 id" validate={ Validate.validateAudioAlbumid } required>
            <Input 
              name="audio_action_params.albumid"
              placeholder="请输入专辑 id"
            />
          </FormItem>
          <FormItem name="audio_action_params.trackid" label="节目 id">
            <Input 
              name="audio_action_params.trackid"
              placeholder="请输入节目 id"
            />
          </FormItem>
          <FormItem name="audio_action_params.orderNo" label="节目在页面中的顺序">
            <Input 
              name="audio_action_params.orderNo"
              placeholder="请输入节目在页面中的顺序"
            />
          </FormItem>
        </>
      }
      {/* 排行榜 */}
      {
        values.rstype === 'rank_list' &&
        <>
          <FormItem name="rank_list_action_params.type" label="type" validate={ Validate.validateRankListType } required>
            <Select
              name="rank_list_action_params.type"
              placeholder="请选择排行榜类型"
              onChange={ () => setFieldValue('rank_list_action_params.rank_type', '') }
            >
              { renderRankListTypeOption() }
            </Select>
          </FormItem>
          <FormItem name="rank_list_action_params.rank_type" label="rank_type" validate={ Validate.validateRankListRankType } required>
            <Select
              name="rank_list_action_params.rank_type"
              placeholder="请选择排行榜 rank_type"
            >
              { renderRankListRankTypeOption(values.rank_list_action_params.type) }
            </Select>
          </FormItem>
          {
            values.rank_list_action_params.type === 'ximaFM' &&
            <FormItem name="rank_list_action_params.rank_list_id" label="rank_list_id" validate={ Validate.validateRankListId } required>
              <Input
                name="rank_list_action_params.rank_list_id"
                placeholder="请输入排行榜 id"
              />
            </FormItem>
          }
        </>
      }
      {/* 频道 */}
      {
        values.rstype === 'channel_card' &&
        <>
          <FormItem name="channel_card_action_params.from_id" label="fromid" validate={ Validate.validateChannelCardFromid } required>
            <Input
              name="channel_card_action_params.from_id"
              placeholder="请选择 from_id"
            />
          </FormItem>
          <FormItem name="channel_card_action_params.doc_id" label="定位 docid">
            <Input 
              name="channel_card_action_params.doc_id"
              placeholder="请输入要定位的 docid"
            />
          </FormItem>
          <FormItem name="channel_card_action_params.force_to_home" label="是否从首页打开">
            <Switch
              name="channel_card_action_params.force_to_home"
              checkedChildren="是"
              unCheckedChildren="否"
            />
          </FormItem>
        </>
      }
      {/* 话题小视频 */}
      {
        values.rstype === 'talk' &&
        <FormItem name="talk_action_params.talk_id" label="话题 id" validate={ Validate.validateTalkId } required>
          <Input
            name="talk_action_params.talk_id"
            placeholder="请输入话题 id"
            // onBlur={}
            // onEnter={}
          />
        </FormItem>
      }
      {/* 话题身边 */}
      {
        values.rstype === 'local_topic' &&
        <FormItem name="local_topic_action_params.talk_id" label="话题 id (身边版)" validate={ Validate.validateLocalTopicTalkId } required>
          <Input
            name="local_topic_action_params.talk_id"
            placeholder="请输入话题 id (身边版)"
            // onBlur={}
            // onEnter={}
          />
        </FormItem>
      }
      {/* tv_station */}
      {
        values.rstype === 'tv_station' &&
        <>
          <FormItem name="tv_station_action_params.tv_type" label="分类" validate={ Validate.validateTvStationTvType } required>
            <Select
              name="tv_station_action_params.tv_type"
              placeholder="请选择分类"
            >
              { renderTvStationTvTypeOption() }
            </Select>
          </FormItem>
          <FormItem name="tv_station_action_params.action_type" label="打开方式" validate={ Validate.validateTvStationActionType } required>
            <Select
              name="tv_station_action_params.action_type"
              placeholder="请选择打开方式"
            >
              { renderTvStationActionTypeOption() }
            </Select>
          </FormItem>
          <FormItem name="tv_station_action_params.open_value" label="单条参数" validate={ Validate.validateTvStationOpenValue } required>
            <Input 
              name="tv_station_action_params.open_value"
              placeholder="请输入单条参数"
            />
          </FormItem>
        </>
      }
      {/* tv_jump_channel */}
      {
        values.rstype === 'tv_jump_channel' &&
        <>
          <FormItem name="tv_jump_channel_action_params.open_type" label="打开方式" validate={ Validate.validateTvJumpChannelOpenType } required>
            <Select
              name="tv_jump_channel_action_params.open_type"
              placeholder="请选择打开方式"
            >
              { renderTvJumpChannelOpenTypeOption() }
            </Select>
          </FormItem>
          <FormItem name="tv_jump_channel_action_params.category_id" label="分类 id" validate={ Validate.validateTvJumpChannelCategoryId } required>
            <Input
              name="tv_jump_channel_action_params.category_id"
              placeholder="请输入分类 id"
            />
          </FormItem>
          <FormItem name="tv_jump_channel_action_params.open_value" label="定位单条" validate={ Validate.validateTvJumpChannelOpenValue } required>
            <Input
              name="tv_jump_channel_action_params.open_value"
              placeholder="请输入定位单条"
            />
          </FormItem>
        </>
      }
      <FormItem name="ignoreTitleLimit" label="去除标题字数限制">
        <Switch
          name="ignoreTitleLimit"
          checkedChildren="是"
          unCheckedChildren="否"
        />
      </FormItem>
      <FormItem name="title" label="标题" validate={ Validate.validateTitle } required>
        <Input 
          name="title"
          placeholder="请输入标题，不超过 18 字"
        />
      </FormItem>
      <FormItem name="summary" label="摘要" validate={ Validate.validateSummary } required>
        <TextArea
          name="summary"
          placeholder="请输入摘要，不超过 62 字"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </FormItem>
      <FormItem name="img" label="配图">
        <PushImage
          name="img"
          articleImages={ articleImages }
          width={ 600 }
          height={ 300 }
          setFieldValue={ setFieldValue }
        />
      </FormItem>
      <FormItem name="xiaomi_img_url" label="小米配图">
        <PushImage
          name="xiaomi_img_url"
          articleImages={ articleImages }
          modalWidth={ 1330 }
          width={ 876 }
          height={ 324 }
          appid="xiaomi"
          setFieldValue={ setFieldValue }
        />
      </FormItem>
      <FormItem name="oppo_push_notification_img_url" label="oppo 通知栏配图">
        <PushImage
          name="oppo_push_notification_img_url"
          articleImages={ articleImages }
          width={ 288 }
          height={ 288 }
          borderRadius={ 66 }
          setFieldValue={ setFieldValue }
        />
      </FormItem>
      <FormItem name="xiaomi_priority" label="是否高优推送">
        <Switch
          name="xiaomi_priority"
          checked={ values.xiaomi_priority === '1' }
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={ (val) => setFieldValue('xiaomi_priority', val ? '1' : '0') }
        />
      </FormItem>
      {/* 领域突发爆文 应该不用了 */}
      {/* <FormItem name="explosiveDoc" label="领域突发爆文">
        <Switch
          name="explosiveDoc"
          checkedChildren="开"
          unCheckedChildren="关"
        />
      </FormItem> */}
      <FormItem name="sound" label="声音">
        <Switch
          name="sound"
          checked={ values.sound === '1' }
          checkedChildren="开"
          unCheckedChildren="关"
          onChange={ (val) => setFieldValue('sound', val ? '1' : '0') }
        />
      </FormItem>
      <FormItem name="bonus" label="是否带激励的 push">
        <Switch
          name="bonus"
          checked={ values.bonus === '1' }
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={ (val) => setFieldValue('bonus', val ? '1' : '0') }
        />
      </FormItem>
    </>
  )
}

export default PushBasicCopy