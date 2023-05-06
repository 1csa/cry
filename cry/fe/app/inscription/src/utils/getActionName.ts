/**
 * 产生通用跳转的跳转名称
*/

const genActionName = (action: string) => {
  const actionName = action.replace(/^\w/g, p => p.toUpperCase()).replace(/_\w/g, p => p.slice(1).toUpperCase());
  return `Action${actionName}`;
};

export default genActionName;
