const validateLabel = (value: string): string => {
  let error = ''
  if (!value.length) {
    error = '类别不能为空'
  }
  return error
}

const validateUserTag = (value: string): string => {
  let error = ''
  if (!value.length) {
    error = '用户包不能为空'
  }
  return error
}

export { validateLabel, validateUserTag }
