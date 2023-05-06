const validateRstype = (value: string): string => {
  let error = ''
  if (!value) {
    error = 'rstype 不能为空'
  }
  return error
}

const validateDocid = (value: string, name: string): string => {
  let error = ''
  if (!value) {
    error = `${name} 不能为空`
  }
  return error
}

const validateTvType = (value: string, name: string): string => {
  let error = ''
  if (!value) {
    error = `${name} 不能为空`
  }
  return error
}

const validateTvValue = (value: string, name: string): string => {
  let error = ''
  if (!value) {
    error = `${name} 不能为空`
  }
  return error
}

const validateTvTime = (value: string, name: string): string => {
  let error = ''
  if (!value) {
    error = `${name} 不能为空`
  }
  return error
}

const validateBottomTabTab = (value: string): string => {
  let error = ''
  if (!value) {
    error = 'tab 不能为空'
  }
  return error 
}

const validateBottomTabFromid = (value: string): string => {
  let error = ''
  if (!value) {
    error = 'tab 不能为空'
  }
  return error 
}

const validateAudioAlbumid = (value: string): string => {
  let error = ''
  if (!value) {
    error = '专辑 id 不能为空'
  }
  return error
}

const validateRankListType = (value: string): string => {
  let error = ''
  if (!value) {
    error = '排行榜类型不能为空'
  }
  return error
}

const validateRankListRankType = (value: string): string => {
  let error = ''
  if (!value) {
    error = '排行榜 rank_type 不能为空'
  }
  return error
}

const validateRankListId = (value: string): string => {
  let error = ''
  if (!value) {
    error = '排行榜 id 不能为空'
  }
  return error
}

const validateChannelCardFromid = (value: string): string => {
  let error = ''
  if (!value) {
    error = 'from_id 不能为空'
  }
  return error
}

const validateTalkId = (value: string): string => {
  let error = ''
  if (!value) {
    error = '话题 id 不能为空'
  }
  return error
}

const validateLocalTopicTalkId = (value: string): string => {
  let error = ''
  if (!value) {
    error = '话题 id (身边版)不能为空'
  }
  return error
}

const validateTvStationTvType = (value: string): string => {
  let error = ''
  if (!value) {
    error = '分类不能为空'
  }
  return error
}

const validateTvStationActionType = (value: string): string => {
  let error = ''
  if (!value) {
    error = '打开方式不能为空'
  }
  return error
}

const validateTvStationOpenValue = (value: string): string => {
  let error = ''
  if (!value) {
    error = '单条参数不能为空'
  }
  return error
}

const validateTvJumpChannelOpenType = (value: string): string => {
  let error = ''
  if (!value) {
    error = '打开方式不能为空'
  }
  return error
}

const validateTvJumpChannelCategoryId = (value: string): string => {
  let error = ''
  if (!value) {
    error = '分类 id 不能为空'
  }
  return error
}

const validateTvJumpChannelOpenValue = (value: string): string => {
  let error = ''
  if (!value) {
    error = '定位单条不能为空'
  }
  return error
}

const getStrLen = (value: string): number => {
  const numOrLetterPattern = /[0-9A-Za-z\s]/g

  if (value === '' || !numOrLetterPattern.test(value)) {
    return value.length
  }
  
  const res = value.match(numOrLetterPattern)
  const numOrLetterCount = res ? res.length : 0
  return value.length - Math.floor(numOrLetterCount / 2)
}

const validateTitle = (value: string): string => {
  let error = ''
  if (!value) {
    error = '标题不能为空'
  } else if (getStrLen(value) > 18) {
    error = '标题不能超过 18 个字'
  }
  return error
}

const validateSummary = (value: string): string => {
  let error = ''
  if (!value) {
    error = '摘要不能为空'
  } else if (getStrLen(value) > 62) {
    error = '摘要不能超过 62 个字'
  }
  return error 
}

const validatePushType = (value: string): string => {
  let error = ''
  if (!value) {
    error = 'pushtype 不能为空'
  }
  return error
}

const validateCate = (value: string): string => {
  let error = ''
  if (!value) {
    error = '分类不能为空'
  }
  return error
}

const validateTags = (value: string[], retrieve_strategy: string = ''): string => {
  let error = ''
  if (retrieve_strategy !== 'only_veins' && !value.length) {
    error = 'tags 不能为空'
  }
  return error
}

const validateDelayPushTime = (value: string, delay_push: string): string => {
  let error = ''
  if (delay_push === '1' && !value) {
    error = '定时推送时间不能为空'
  }
  return error
}

export { validateRstype, validateDocid, validateTvType, validateTvValue, validateTvTime, 
  validateBottomTabTab, validateBottomTabFromid, validateAudioAlbumid, validateRankListType,
  validateRankListRankType, validateRankListId, validateChannelCardFromid, validateTalkId,
  validateLocalTopicTalkId, validateTvStationTvType, validateTvStationActionType, validateTvStationOpenValue,
  validateTvJumpChannelOpenType, validateTvJumpChannelCategoryId, validateTvJumpChannelOpenValue,
  validateTitle, validateSummary, validatePushType, validateCate, validateTags, validateDelayPushTime }