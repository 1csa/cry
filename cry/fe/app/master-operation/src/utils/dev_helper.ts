export const checkHost = () => {
  if (location.hostname.indexOf('yidian-inc.com') === -1 && APP_ENV === 'development') {
    location.href =
      location.protocol + '//' + 'dev.yidian-inc.com:' + location.port + location.pathname;
  }
};

export const getUserName = (user: any) => {
  const { currentUser } = user;
  return (currentUser && (currentUser.name || currentUser.email)) || '';
};

export function saveLog(data: any, action_method: string): void {
  window['Logger'] &&
    window['Logger']['saveLog']({
      log_source: { tag: 'master-operation' },
      target_data: { detail: JSON.stringify(data) },
      action_method,
    });
}
