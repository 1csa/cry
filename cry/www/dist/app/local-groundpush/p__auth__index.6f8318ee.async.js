(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{Auu0:function(e,a,t){e.exports={teamAuth:"teamAuth","teamAuth-header":"teamAuth-header","teamAuth-operation":"teamAuth-operation","teamAuth-operation-screen":"teamAuth-operation-screen","teamAuth-operation-screen-item":"teamAuth-operation-screen-item","teamAuth-operation-screen-select":"teamAuth-operation-screen-select","teamAuth-table":"teamAuth-table","form-item":"form-item","form-item-label":"form-item-label","form-item-content":"form-item-content","form-operation":"form-operation",successModal:"successModal","successModal-tip":"successModal-tip","successModal-tip-icon":"successModal-tip-icon","successModal-info":"successModal-info",stopModal:"stopModal","stopModal-reason":"stopModal-reason"}},tTCW:function(e,a,t){"use strict";t.r(a);t("ljfu");var l=t("x2dm"),r=(t("oj2R"),t("/zI6")),s=(t("YdMF"),t("dVZ9")),n=(t("zI7Q"),t("SCaQ")),m=t("JCfe"),o=t.n(m),c=(t("IJu9"),t("DuHN")),i=(t("i8iW"),t("NjSG")),d=t("maMK"),u=t.n(d),p=t("ERkP"),h=t.n(p),E=t("uDfI"),b=t("N+uz"),f=t("fcGt"),v=t("7cJT"),N={teamName:"\u56e2\u961f\u540d\u79f0",id:"\u56e2\u961f\u7f16\u53f7",leaderName:"\u8d1f\u8d23\u4eba",leaderPhone:"\u8d1f\u8d23\u4eba\u7535\u8bdd",leaderWx:"\u8d1f\u8d23\u4eba\u5fae\u4fe1",responser:"\u8d1f\u8d23\u4eba(\u59d3\u540d|\u7535\u8bdd|WX)",citys:"\u5730\u63a8\u57ce\u5e02",cooperationStartTime:"\u5408\u4f5c\u5f00\u59cb\u65f6\u95f4",cooperationEndTime:"\u5408\u4f5c\u7ed3\u675f\u65f6\u95f4",status:"\u5f53\u524d\u72b6\u6001",stopReason:"\u505c\u6b62\u670d\u52a1\u539f\u56e0"},g=e=>{var a=[{title:"\u56e2\u961f\u540d\u79f0",dataIndex:"teamName",width:"8%"},{title:"\u56e2\u961f\u7f16\u53f7",dataIndex:"id",width:"8%"},{title:"\u8d1f\u8d23\u4eba(\u59d3\u540d|\u7535\u8bdd|WX)",dataIndex:"responser",width:"18%",render:(a,t)=>h.a.createElement("div",null,h.a.createElement("span",{style:{marginRight:3}},"".concat(t.leaderName," | ").concat(t.leaderPhone," | ").concat(t.leaderWx||"--")),h.a.createElement(n["a"],{type:"link",size:"small",style:{padding:0},onClick:()=>e(t)},"\u4fee\u6539\u4fe1\u606f"))},{title:"\u5730\u63a8\u57ce\u5e02",dataIndex:"city",width:"8%",render:(e,a)=>h.a.createElement("span",null,a.citys&&0!==a.citys.length?a.citys.map(e=>e.cityName).join(","):"--")},{title:"\u5408\u4f5c\u5f00\u59cb",dataIndex:"cooperationStartTime",width:"17%",sorter:!0},{title:"\u5408\u4f5c\u7ed3\u675f",dataIndex:"cooperationEndTime",width:"17%",render:e=>h.a.createElement("span",null,e||"--")},{title:"\u72b6\u6001",dataIndex:"status",width:"7%",align:"center",render:(e,a)=>0===a.status?"\u505c\u6b62\u670d\u52a1":"\u670d\u52a1\u4e2d"},{title:"\u539f\u56e0",dataIndex:"stopReason",render:(e,a)=>a.stopReason&&1!==a.status?a.stopReason:"--"}];return a},C=(t("oeo2"),t("BmDy")),y=(t("vgpD"),t("UL5a")),j=e=>{var a=e.value,t=e.onCancel,l=e.onCommit,r=e.form,s=r.getFieldDecorator,m=r.getFieldValue,o=r.getFieldError,c=r.setFieldsValue,i=Object(b["c"])("/pushTeam/updateLeaderInfo"),d=i.updateLoading,u=i.updateData;Object(p["useEffect"])(()=>{var e=a.leaderName,t=a.leaderPhone,l=a.leaderWx;c({name:e,phone:t,weixin:l})},[a]);var E=Object(p["useCallback"])(()=>{var e=m("name"),t=m("phone"),r=m("weixin"),s=o("name"),n=o("phone");s||n||u({id:a.id,leaderName:e,leaderPhone:t,leaderWx:r},()=>l(e,t,r))},[a]);return h.a.createElement(h.a.Fragment,null,h.a.createElement(y["a"],{className:"form",labelAlign:"right",labelCol:{span:4},wrapperCol:{span:16}},h.a.createElement(y["a"].Item,{className:"form-item",label:"\u8d1f\u8d23\u4eba",colon:!0},s("name",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u8d1f\u8d23\u4eba\u59d3\u540d"}]})(h.a.createElement(C["a"],null))),h.a.createElement(y["a"].Item,{className:"form-item",label:"\u8054\u7cfb\u7535\u8bdd"},s("phone",{rules:[{required:!0,message:'"\u8bf7\u8f93\u5165\u8d1f\u8d23\u4eba\u8054\u7cfb\u7535\u8bdd'},{pattern:/^1[3,5,7,8]\d{9}$/,message:"\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7\u7801"}]})(h.a.createElement(C["a"],null))),h.a.createElement(y["a"].Item,{className:"form-item",label:"\u5fae\u4fe1\u53f7"},s("weixin",{})(h.a.createElement(C["a"],null)))),h.a.createElement("div",{className:"form-operation"},h.a.createElement(n["a"],{size:"small",type:"primary",loading:d,onClick:E},"\u4fdd\u5b58"),h.a.createElement(n["a"],{size:"small",onClick:t},"\u53d6\u6d88")))},O=y["a"].create({name:"charger"})(j),I=O,A=(t("TPNu"),t("VogX")),k=(t("Iaxd"),t("i6l0")),w=t("wgY5"),x=t.n(w),T=e=>{var a=e.cities,t=void 0===a?[]:a,l=e.form,s=e.onCommit,m=e.onCancel,o=e.currentUser,c=void 0===o?"admin":o,i=l.getFieldDecorator,d=l.getFieldValue,E=l.validateFields,f=Object(b["a"])("/pushTeam/createTeam"),N=f.data,g=f.fetchData,j=Object(p["useState"])(!1),O=u()(j,2),I=O[0],w=O[1],T=Object(p["useCallback"])(()=>{var e=d("leaderWx");E(["teamName","leaderPhone","cityIds","leaderName","startTime"],(a,t)=>{if(!a){var l=t.teamName,r=t.leaderName,s=t.leaderPhone,n=t.cityIds,m=t.startTime;g({teamName:l,leaderName:r,leaderPhone:s,leaderWx:e,cityIds:[n],cooperationStartTime:x()(m).format("YYYY-MM-DD HH:mm:ss"),updateUser:c},M)}})},[N]),M=Object(p["useCallback"])(()=>{m(),w(!0)},[]),S=Object(p["useCallback"])(()=>{var e=d("teamName");w(!1),s(e,N)},[N]);return h.a.createElement(h.a.Fragment,null,h.a.createElement(y["a"],{className:"form",labelAlign:"right",labelCol:{span:4},wrapperCol:{span:16}},h.a.createElement(y["a"].Item,{className:"form-item",label:"\u56e2\u961f\u540d\u79f0"},i("teamName",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u56e2\u961f\u540d\u79f0"},{max:8,message:"\u56e2\u961f\u540d\u79f0\u4e0d\u80fd\u8d85\u8fc78\u4e2a\u5b57"}]})(h.a.createElement(C["a"],null))),h.a.createElement(y["a"].Item,{className:"form-item",label:"\u8d1f\u8d23\u4eba"},i("leaderName",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u8d1f\u8d23\u4eba\u540d\u79f0"}]})(h.a.createElement(C["a"],null))),h.a.createElement(y["a"].Item,{className:"form-item",label:"\u8054\u7cfb\u7535\u8bdd"},i("leaderPhone",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u624b\u673a\u53f7\u7801"},{pattern:/^1[3,5,6,7,8]\d{9}$/,message:"\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u624b\u673a\u53f7\u7801"}]})(h.a.createElement(C["a"],null))),h.a.createElement(y["a"].Item,{className:"form-item",label:"\u5fae\u4fe1\u53f7"},i("leaderWx",{})(h.a.createElement(C["a"],null))),h.a.createElement(y["a"].Item,{className:"form-item",label:"\u5730\u63a8\u57ce\u5e02"},i("cityIds",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u5730\u63a8\u57ce\u5e02"}]})(h.a.createElement(v["e"],{placeholder:"\u8bf7\u9009\u62e9\u5730\u63a8\u57ce\u5e02",options:t,filter:!0}))),h.a.createElement(y["a"].Item,{className:"form-item",label:"\u5408\u4f5c\u8d77\u59cb"},i("startTime",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u5408\u4f5c\u8d77\u59cb\u65f6\u95f4"}]})(h.a.createElement(k["a"],null)))),h.a.createElement("div",{className:"form-operation"},h.a.createElement(n["a"],{size:"small",type:"primary",onClick:T},"\u63d0\u4ea4")),h.a.createElement(r["a"],{closable:!1,footer:null,title:null,width:280,visible:I},h.a.createElement("div",{className:"successModal"},h.a.createElement("div",{className:"successModal-tip"},h.a.createElement(A["a"],{type:"check-circle",theme:"filled",className:"successModal-tip-icon"}),h.a.createElement("span",null,"\u751f\u6210\u6210\u529f\uff01")),h.a.createElement("div",{className:"successModal-info"},h.a.createElement("p",null,"\u56e2\u961f\u540d\u79f0: ",d("teamName")),h.a.createElement("p",null,"\u56e2\u961f\u7f16\u53f7: ",N)),h.a.createElement(n["a"],{type:"primary",size:"small",onClick:S},"\u786e\u5b9a"))))},M=y["a"].create()(T),S=Object(p["memo"])(M),z=(t("Auu0"),[{name:"\u5168\u90e8",value:void 0},{name:"\u5408\u4f5c\u4e2d",value:1},{name:"\u5408\u4f5c\u505c\u6b62",value:0}]),W=["\u7528\u6237\u7559\u5b58\u8d28\u91cf\u4e0d\u8fbe\u6807","\u63a8\u5e7f\u91cf\u6548\u679c\u4e0d\u8fbe\u6807","\u7591\u4f3c\u51fa\u73b0\u4f5c\u5f0a\u73b0\u8c61","\u63a8\u5e7f\u5468\u671f\u7ed3\u675f\uff0c\u6b63\u5e38\u7ec8\u6b62","\u7a81\u53d1\u60c5\u51b5\uff0c\u7ec8\u6b62\u63a8\u5e7f\u5408\u4f5c"],D=e=>{var a=e.dispatch,t=e.others,m=e.user,d=t.allTeams,E=t.allCities,C=m.currentUser,y=Object(b["a"])("/pushTeam/list"),j=y.loading,O=y.data,A=y.fetchData,k=Object(b["a"])("/pushTeam/list"),w=k.data,x=k.fetchData,T=Object(b["c"])("/pushTeam/updateStatusInfo"),M=T.updateData,D=Object(p["useState"])([]),P=u()(D,2),R=P[0],F=P[1],q=Object(p["useState"])({limit:10,offset:0}),J=u()(q,2),Y=J[0],U=J[1],V=Object(p["useState"])({}),L=u()(V,2),H=L[0],Q=L[1],X=Object(p["useState"])(!1),B=u()(X,2),G=B[0],K=B[1],$=Object(p["useState"])(!1),Z=u()($,2),_=Z[0],ee=Z[1],ae=Object(p["useState"])(),te=u()(ae,2),le=te[0],re=te[1],se=Object(p["useState"])(!1),ne=u()(se,2),me=ne[0],oe=ne[1],ce=Object(p["useState"])(!1),ie=u()(ce,2),de=ie[0],ue=ie[1],pe=Object(p["useRef"])({}),he={title:"\u64cd\u4f5c",dataIndex:"operation",width:"7%",render:(e,a)=>h.a.createElement(i["a"],{title:"\u786e\u8ba4".concat(0===a.status?"\u6062\u590d":"\u7ec8\u6b62","\u5408\u4f5c\uff1f"),cancelText:"\u53d6\u6d88",okText:"\u786e\u5b9a",placement:"leftBottom",onConfirm:()=>ge(a)},h.a.createElement("a",{href:"#"},0===a.status?"\u6062\u590d":"\u7ec8\u6b62"))};Object(p["useEffect"])(()=>{d&&0!==d.length||a({type:"others/fetchAllTeams"}),E&&0!==E.length||a({type:"others/fetchAllCities"}),A(Y)},[]),Object(p["useEffect"])(()=>{O&&F(O.list)},[O]),Object(p["useEffect"])(()=>{de&&x(Y)},[de]),Object(p["useEffect"])(()=>{if(de)try{Object(f["b"])(w&&w.list,"\u56e2\u961f\u5217\u8868",Ee)}catch(e){c["a"].error("\u51fa\u9519\u4e86\u3002\u3002"),console.log(e,"error happened in downloading....")}finally{ue(!1)}},[w]);var Ee=e=>{var a=e.id,t=e.teamName,l=e.leaderName,r=e.leaderPhone,s=e.leaderWx,n=e.cooperationStartTime,m=e.cooperationEndTime,o=e.status,c=e.stopReason,i=e.citys,d={id:a,teamName:t,leaderName:l,leaderPhone:r,leaderWx:s,citys:i&&0!==i.length?i.map(e=>e.cityName).join(","):"--",cooperationStartTime:n,cooperationEndTime:m,status:1===o?"\u670d\u52a1\u4e2d":"\u505c\u6b62\u670d\u52a1",stopReason:1===o?void 0:c},p=Object.entries(d).map(e=>{var a=u()(e,2),t=a[0],l=a[1];return[N[t],l]});return Object.fromEntries(p)},be=Object(p["useCallback"])(e=>{Q(e),K(!0)},[]),fe=Object(p["useCallback"])((e,a,t)=>{var l=R.map(l=>l.id!==H.id?l:o()({},l,{leaderName:e,leaderPhone:a,leaderWx:t}));F(l),K(!1)},[H]),ve=Object(p["useCallback"])(()=>{A(o()({},Y))},[Y]),Ne=Object(p["useCallback"])((e,t)=>{A({offset:0,limit:10}),a({type:"others/updateTeams",payload:{title:e,value:t}})},[]),ge=Object(p["useCallback"])(e=>{0===e.status?M({id:e.id,status:1},()=>A(Y)):(oe(!0),Q(e))},[Y]),Ce=Object(p["useCallback"])(()=>{M({id:H.id,status:0,stopReason:le},()=>{re(void 0),oe(!1),A(Y)})},[H,Y,le]),ye=Object(p["useCallback"])((e,a,t)=>{var l=e.current,r=void 0===l?1:l,s=e.pageSize,n=void 0===s?10:s,m=t.order,c=o()({},pe.current,{limit:n,offset:n*(r-1),desc:"ascend"===m?"asc":void 0});U(c),A(c)},[pe]);return h.a.createElement("div",{className:"teamAuth"},h.a.createElement("div",{className:"teamAuth-header"},h.a.createElement("h3",null,"\u56e2\u961f\u67e5\u8be2"),h.a.createElement(n["a"],{icon:"plus",type:"primary",size:"small",onClick:()=>ee(!0)},"\u6dfb\u52a0\u56e2\u961f")),h.a.createElement("div",{className:"teamAuth-operation"},h.a.createElement("div",{className:"teamAuth-operation-screen"},h.a.createElement(v["e"],{className:"teamAuth-operation-screen-item teamAuth-operation-screen-select",placeholder:"\u8bf7\u9009\u62e9\u56e2\u961f",mode:"multiple",allowClear:!0,filter:!0,options:d||[],value:Y.teamIds,onChange:e=>U(o()({},Y,{teamIds:e.length>0?e:void 0}))}),h.a.createElement(v["e"],{className:"teamAuth-operation-screen-item teamAuth-operation-screen-select",placeholder:"\u8bf7\u9009\u62e9\u57ce\u5e02",mode:"multiple",allowClear:!0,filter:!0,options:E||[],value:Y.cityIds,onChange:e=>U(o()({},Y,{cityIds:e.length>0?e:void 0}))}),h.a.createElement(v["c"],{className:"teamAuth-operation-screen-item",size:"small",value:Y.status,radioOptions:z,onChange:e=>U(o()({},Y,{status:e.target.value}))}),h.a.createElement(n["a"],{className:"teamAuth-operation-screen-item",size:"small",type:"primary",onClick:ve},"\u67e5\u8be2")),h.a.createElement(n["a"],{type:"primary",size:"small",onClick:()=>ue(!0)},"\u4e0b\u8f7dcsv")),h.a.createElement(s["a"],{className:"teamAuth-table",rowKey:"id",bordered:!0,columns:[...g(be),he],dataSource:R,loading:j.fetchLoading,onChange:ye,pagination:{size:"small",total:O&&O.total,showQuickJumper:!0,showSizeChanger:!0,showTotal:e=>"\u603b\u8ba1".concat(e,"\u6761\u7ed3\u679c")}}),h.a.createElement(r["a"],{title:"\u4fee\u6539\u8d1f\u8d23\u4eba\u4fe1\u606f",visible:G,onCancel:()=>K(!1),footer:null},h.a.createElement(I,{value:H,onCommit:fe,onCancel:()=>K(!1)})),h.a.createElement(r["a"],{title:"\u6dfb\u52a0\u56e2\u961f",visible:_,footer:null,onCancel:()=>ee(!1)},h.a.createElement(S,{cities:E,currentUser:C&&C.name,onCommit:Ne,onCancel:()=>ee(!1)})),h.a.createElement(r["a"],{visible:me,title:"\u7ec8\u6b62\u56e2\u961f\u670d\u52a1",footer:null,onCancel:()=>{re(void 0),oe(!1)}},h.a.createElement("div",{className:"stopModal"},h.a.createElement("div",{className:"stopModal-reason"},h.a.createElement("label",{className:"stopModal-label"},"\u7406\u7531"),h.a.createElement(l["a"],{style:{minWidth:280},size:"small",value:le,onChange:e=>re(e)},W.map(e=>h.a.createElement(l["a"].Option,{key:e,value:e},e)))),h.a.createElement(n["a"],{type:"primary",size:"small",onClick:Ce},"\u63d0\u4ea4"))))},P=Object(p["memo"])(D);a["default"]=Object(E["c"])(e=>({others:e.others,user:e.user}))(P)}}]);