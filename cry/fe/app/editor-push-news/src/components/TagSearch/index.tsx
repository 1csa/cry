import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Select, Tag, Statistic, Spin, message, Transfer } from 'antd'
import axios from 'axios'
import debounce from 'lodash/debounce'
import { TagProps } from '@/config/pushForm/push'
import appConfig from '@/config/app/app.config'

const Option = Select.Option
const { CheckableTag } = Tag

interface IProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  defaultTags: Array<TagProps>
  defaultSelectedTags: string[]
  name: string
  tagType: string
  isShowPushUserCount?: boolean
}

interface SearchOptionProps {
  fromId: string
  name: string
  type: string
  userCount: number
}

const TagSearch: React.FC<IProps> = ({ setFieldValue, defaultTags, defaultSelectedTags, name, tagType, isShowPushUserCount = true }) => {
  // type
  const [type, setType] = useState<string>('search')
  // loading
  const [loading, setLoading] = useState<boolean>(false)
  // search keyword
  const [searchWord, setSearchWord] = useState<string>('')
  // search options
  const [searchOptions, setSearchOptions] = useState<Array<SearchOptionProps>>([])
  // search map
  const [searchOptionsMap, setSearchOptionsMap] = useState<{[key: string]: string}>({})
  // pushuser count
  const [pushUserCount, setPushUserCount] = useState<number>(0)
  // tags
  let [tags, setTags] = useState<Array<TagProps>>([])
  // selected tags
  let [selectedTags, setSelectedTags] = useState<Array<string>>(defaultSelectedTags!)

  // init tags
  useEffect(() => {
    defaultTags = defaultTags.map(item => {
      item.checked = false
      return item
    })

    let tempSelectedTags = defaultSelectedTags!.map(item => {
      return {
        fromId: item,
        name: item,
        checked: true
      }
    })

    defaultTags = [...defaultTags, ...tempSelectedTags]
    setTags(defaultTags)
  }, [defaultTags])

  // if tagType is closable setFieldValue tags
  useEffect(() => {
    if (tagType === 'closable') {
      setFieldValue(name, tags)
    }
  }, [tags])

  // selected change update pushUserCount
  useEffect(() => {
    // console.log(name, selectedTags)
    setFieldValue(name, selectedTags)
    getUserCount(selectedTags)
  }, [selectedTags])

  const getUserCount = (selectedTag : Array<string>): void => {
    axios.get(`/api/proxy/${appConfig.NEW_PUSH_API_HOST}/channel/channel-user-count?channels=${selectedTag.join(',')}&exclude_channels=`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.data)
      .then(res => {
        const { status, result } = res
        if (status === 'success') {
          setPushUserCount(result.together)
        }
      })
  }

  // search
  const handleSearch = (value: string): void => {
    value = value.trim()
    setSearchWord(value)
    setLoading(true)

    if (value !== '') {
      axios.get(`/api/editor_push/searchChannel?keyword=${encodeURIComponent(value)}`)
        .then(res => res.data)
        .then(res => {
          const { status, data } = res
          if (status === 'success' && Array.isArray(data)) {
            if (!data.length) {
              message.info(`搜索 ${value} 返回结果为空!`)
            } else {
              // 将 data 中的 fromId name 映射
              data.forEach(item => searchOptionsMap[item.fromId] = item.name)

              setSearchOptions(data)
              setSearchOptionsMap({...searchOptionsMap})
              setLoading(false)
            }
          } else {
            message.error(res)
          }
        })
    }
  }

  // select channel
  const handleSelect = (value: string): void => {
    if (searchWord !== '请输入搜索内容') {
      setSearchWord('')
    }

    let tempTagFromIdArr = tags.map(item => item.fromId)
    if (!tempTagFromIdArr.includes(value)) {
      tags.push({
        fromId: value,
        name: searchOptionsMap[value],
        checked: false
      })
    }

    // getUserCount(tags)
    setTags([...tags])
  }

  // clear search options
  const clearSearchOptions = (): void => {
    setSearchOptions([])
  }

  // input enter
  // 考虑去重 一个是 考虑 输入 fromid 的重复 一个是 考虑 tag 对象数组 和 输入的重复
  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault()
    // 对 输入的内容 去重
    let values = e.target.value.trim().replace(/，/g, ',').split(',').map((item: string) => item.trim()).filter((item: string) => item !== '')
    values = [...new Set(values)]

    // 拿到 当前 tag 对象数组中的所有 name
    let tempTagFromIdArr = tags.map(item => item.fromId)

    // 判断 输入的内容 是否在 tempTagNameArr 中
    values.forEach((item: string) => {
      if (!tempTagFromIdArr.includes(item)) {
        tags.push({
          fromId: item,
          name: item,
          checked: false
        })
      }
    })

    // getUserCount(tags)
    setTags([...tags])
  }

  // change selected
  // 要改两个地方 一个是 tag 数组 还有一个是 selected 数组
  const handleChangeTagSelected = (fromId: string, checked: boolean): void => {
    console.log(fromId, checked)
    let newTags = tags.map(item => {
      if (item.fromId === fromId) {
        item.checked = checked
      }
      return item
    })

    // console.log(newTags)
    setTags(newTags)

    // add selectedTags
    if (checked) {
      selectedTags = [...selectedTags, fromId]
    } else { // remove selectedTags
      let index = selectedTags.indexOf(fromId)
      selectedTags.splice(index, 1)
    }
    setSelectedTags([...selectedTags])
  }

  return (
    <>
      <Row gutter={8}>
        <Col span={4}>
          <Select
            value={ type }
            onChange={ (value: string) => setType(value) }
          >
            <Option key="search">搜索</Option>
            <Option key="input">输入</Option>
          </Select>
        </Col>
        <Col span={14}>
          {
            type === 'search' ?
            <Select<string>
              mode="multiple"
              defaultActiveFirstOption={ false }
              showArrow={ false }
              filterOption={ false }
              notFoundContent={ loading ? <Spin /> : '' }
              onSearch={ debounce(handleSearch, 300) }
              onSelect={ handleSelect }
              onBlur={ clearSearchOptions }
              placeholder="请输入搜索内容"
            >
              {
                searchOptions.map(option => {
                  return (
                    <Option key={ option.fromId } value={ option.fromId }>
                      { option.name } - { option.fromId } - { option.userCount + '人' } { option.type === 'media' ? '- 自媒体': '' }
                    </Option>
                  )
                })
              }
            </Select>
            :
            <Input
              placeholder="请输入合法的 fromid，用英文逗号分割"
              onPressEnter={ handlePressEnter }
            />
          }
        </Col>
        {
          isShowPushUserCount &&
          <Col span={6}>
            <Statistic title="包含人数" value={ pushUserCount } valueStyle={{ fontSize: '18px' }} />
          </Col>
        }
      </Row>
      <Row>
        {
          tagType === 'checkable' ? (
            <>
              <p style={{ color: 'red', margin: '0', lineHeight: '14px' }}>注：需要选中才会统计包含人数</p>
              {
                tags.map(item => {
                  return (
                    <CheckableTag
                      key={ item.fromId }
                      checked={ item.checked }
                      style={{ border: '1px solid #d9d9d9' }}
                      onChange={ () => handleChangeTagSelected(item.fromId, !item.checked) }
                    >
                      {
                        item.name.indexOf('m_') > -1 ?
                        <>
                          { item.name } | 自媒体
                        </> :
                        <>
                          { item.name }
                        </>
                      }
                    </CheckableTag>
                  )
                })
              }
            </>
           ) : (
            tags.map(item => {
              return (
                <Tag
                  key={ item.fromId }
                  style={{ border: '1px solid #d9d9d9' }}
                  closable
                >
                  {
                    item.name.indexOf('m_') > -1 ?
                    <>
                      { item.name } | 自媒体
                    </> :
                    <>
                      { item.name }
                    </>
                  }
                </Tag>
              )
            })
          )
        }


        {/* <p style={{ color: 'red', margin: '0', lineHeight: '14px' }}>注：需要选中才会统计包含人数</p>
        {
          tags.map(item => {
            return (
              <CheckableTag
                key={ item.fromId }
                checked={ item.checked }
                style={{ border: '1px solid #d9d9d9' }}
                onChange={ () => handleChangeTagSelected(item.fromId, !item.checked) }
              >
                {
                  item.name.indexOf('m_') > -1 ?
                  <>
                    { item.name } | 自媒体
                  </> :
                  <>
                    { item.name }
                  </>
                }
              </CheckableTag>
            )
          })
        }
        {
          tags.map(item => {
            return (
              <Tag
                key={ item.fromId }
                style={{ border: '1px solid #d9d9d9' }}
                closable
              >
                {
                  item.name.indexOf('m_') > -1 ?
                  <>
                    { item.name } | 自媒体
                  </> :
                  <>
                    { item.name }
                  </>
                }
              </Tag>
            )
          })
        } */}
      </Row>
    </>
  )
}

export default TagSearch
