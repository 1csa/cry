import appConfig from '@/config/app.config';

export function getIsDev() {
  let getDev: string | null | boolean = localStorage.getItem("isDev");
  if (getDev !== null && getDev === 'false') {
    getDev = false
  } else if (getDev !== null && getDev === 'true'){
    getDev = true
  }
  const isDev: boolean = getDev === null? appConfig.isDev : getDev;
  return isDev
}