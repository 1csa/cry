const validateGid = (value: string | undefined): string => {
  let error = ''
  if (!value) {
    error = 'gid 不能为空'
  }
  return error
}

const validateGidName = (value: string | undefined): string => {
  let error = ''
  if (!value) {
    error = 'gid name 不能为空'
  }
  return error
}

export { validateGid, validateGidName }