
const UserPermissions = (name:string)=>{
  //用户
  const userName = ['郭雨豪', '刘建明','崔小丰','宗琦','张玉波','陈人意']
  if(userName.indexOf(name)>-1){
    return true
  }else{
    return false
  }
}
export default UserPermissions