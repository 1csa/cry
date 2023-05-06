import axios from 'axios'
import appConfig from '@/config/app/app.config'

const checkUserSetName = (value?: string): Promise<string> => {
  let val = axios.post(`/api/proxy/${appConfig.API_HOST}/userset/checkUserSetName`, { name: value + '_newsys' })
    .then(res => res.data)
    .then(res => {
      const { header, data } = res
      if (header.code === 0 && data.correct === false) {
        return data.message as string
      }
      return ''
    })
  return val
}

const checkUserSetAliasName = (value?: string): Promise<string> => {
  let val = axios.post(`/api/proxy/${appConfig.API_HOST}/userset/checkUserSetName`, { aliasName: value })
    .then(res => res.data)
    .then(res => {
      const { header, data } = res
      if (header.code === 0 && data.correct === false) {
        return data.message as string
      }
      return ''
    })
  return val
}

const validateName = (value?: string): Promise<string> | string => {
  let error
  if (!value) {
    error = '群组名(英文)不能为空'
  } else if (!/^[a-zA-Z]([_a-zA-Z0-9]*)$/g.test(value)) {
    error = '格式错误（字母开头，仅限字母数字和下划线）'
  } else {
    error = checkUserSetName(value)
  }
  return error || ''
}

const validateAliasName = (value?: string): Promise<string> | string => {
  let error
  if (!value) {
    error = '群组名(中文)不能为空'
  } else {
    error = checkUserSetAliasName(value)
  }
  return error
}

const validateVersion = (value: string | undefined): string | void => {
  let error = ''
  if (value === undefined) return
  if (!/^[\d+][\.\d+]*$/g.test(value)) {
    error = '版本号格式错误'
  }
  return error
}

const validateScore = (value: number | string | null): string => {
  let error = ''
  if (value === '' || value === null) {
    error = '最低置信度不能为空'
  }
  return error
}

export { validateName, validateAliasName, validateVersion, validateScore }
