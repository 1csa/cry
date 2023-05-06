const validateUserEmail = (value: string | undefined): string => {
  let error = ''
  if (!value) {
    error = '邮箱不能为空'
  } else if (!/\S+@\S+\.\S+/.test(value)) {
    error = '邮箱格式不正确'
  }
  return error
}
const validatePushAuth = (value: string | undefined): string => {
  let error = ''
  if (!value) {
    error = '推送权限不能为空'
  }
  return error
}
const validatePermission = (value: Array<string>): string => {
  let error = ''
  if (!value.length) {
    error = '推送类别不能为空'
  }
  return error
}

export { validateUserEmail, validatePushAuth, validatePermission }
