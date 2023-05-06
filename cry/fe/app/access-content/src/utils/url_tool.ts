export const getQueryVariable = (variable: string) => {
  
  let href = window.location.href;
  let query = href.substring(href.indexOf('?')+1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return '';
}
