const validatePushtype = (value: string | undefined): string => {
  let err = ''
  if (!value) {
    err = 'pushtype 不能为空'
  }
  return err
}

const validatePushtypeName = (value: string | undefined): string => {
  let err = ''
  if (!value) {
    err = 'pushtype name 不能为空'
  }
  return err
}

export { validatePushtype, validatePushtypeName }