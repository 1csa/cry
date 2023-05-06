function getCookie (cookieName: string) {
  let strCookie = document.cookie;
  let arrCookie = strCookie.split("; ");

  for(let i = 0; i < arrCookie.length; i++){
    let arr = arrCookie[i].split("=");
      if(cookieName == arr[0]){
          return arr[1];
      }
  }

  return "";
}

function getUserId() {
  return getCookie('YD_PANDORA_UID')
}

export default getUserId