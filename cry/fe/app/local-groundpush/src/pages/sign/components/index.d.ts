export interface team_type {
    id:number,
    value:string,
 }
 export interface personnel_type {
    id:number,
    name:string,
    phone:string
 }
 export interface signIn_type {
    pageNum: number,
    pageSize: number,
    size: number,
    total: number,
    list: signIn_data[]
 }
 export interface signIn_data{
    id: number,
    signInTime: string
    teamId: number,
    teamName: string,
    pushManId: number,
    pushManName: string,
    signInDate: string,
    lngIn: string,
    latIn:string,
    lngOut:string
    latOut:string,
    signOutDate: string
    cityId:number
    cityName:string,
    address:string

 }
