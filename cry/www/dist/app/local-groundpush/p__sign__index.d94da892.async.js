(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{EMsg:function(e,a,t){e.exports={sign_in:"sign_in",date:"date",label:"label",today:"today",before:"before",query:"query",query_select:"query_select",btn_content:"btn_content",team:"team",select:"select",radio:"radio",button:"button",down:"down"}},hHEA:function(e,a,t){"use strict";t.r(a);var n=t("ERkP"),l=t.n(n),r=(t("EMsg"),t("YdMF"),t("dVZ9")),s=(t("zI7Q"),t("SCaQ")),c=(t("LCbC"),t("NwOV")),i=t("Z32k"),d=t.n(i),m=(t("IJu9"),t("DuHN")),u=t("JGaj"),o=t.n(u),p=t("maMK"),b=t.n(p),I=(t("ljfu"),t("x2dm")),g=t("wgY5"),f=t.n(g),h=t("7cJT"),O=t("N+uz"),v=[{title:"\u65e5\u671f",dataIndex:"signInDate",key:"signInDate",render:e=>f()(e).format("YYYY-MM-DD")},{title:"\u56e2\u961f\u540d\u79f0",dataIndex:"teamName",key:"teamName"},{title:"\u56e2\u961f\u7f16\u53f7",dataIndex:"teamId",key:"teamId"},{title:"\u59d3\u540d",dataIndex:"pushManName",key:"pushManName"},{title:"\u7f16\u53f7ID",dataIndex:"id",key:"id"},{title:"uid",dataIndex:"pushManId",key:"pushManId"},{title:"\u7b7e\u5165\u65f6\u95f4",dataIndex:"signInTime",key:"signInTime",render:e=>e?f()(e).format("HH:mm:ss"):"--"},{title:"\u7b7e\u5165\u5730\u70b9(\u5730\u70b9|\u7ecf|\u7eac)",dataIndex:"signInDate",key:"signinAddr",render:(e,a)=>l.a.createElement("span",null,"".concat(a.address||"--"," | ").concat(a.latIn?parseFloat(a.latIn).toFixed(3):"--"," | ").concat(a.lngIn?parseFloat(a.lngIn).toFixed(3):"--"))},{title:"\u7b7e\u51fa\u65f6\u95f4",dataIndex:"signOutDate",key:"signOutDate",render:e=>e?f()(e).format("HH:mm:ss"):"--"},{title:"\u7b7e\u51fa\u5730\u70b9(\u7ecf|\u7eac)",dataIndex:"sigoutAddr",render:(e,a)=>l.a.createElement("span",null,"".concat(a.latOut?parseFloat(a.latOut).toFixed(3):"--"," | ").concat(a.lngOut?parseFloat(a.lngOut).toFixed(3):"--"))}],E={signInTime:"\u65e5\u671f",teamName:"\u56e2\u961f\u540d\u79f0",teamId:"\u56e2\u961f\u7f16\u53f7",pushManId:"uid",pushManName:"\u59d3\u540d",id:"\u7f16\u53f7ID",signInDate:"\u7b7e\u5230\u65f6\u95f4",signOutDate:"\u7b7e\u51fa\u65f6\u95f4",address:"\u7b7e\u51fa\u5730\u70b9"},y=t("fcGt"),D=I["a"].Option,N=e=>{var a,t=f()(Date.now()),i=Object(n["useState"])(t),u=b()(i,2),p=u[0],g=u[1],N=Object(n["useState"])(t),j=b()(N,2),k=j[0],x=j[1],M=Object(n["useState"])("1"),w=b()(M,2),Y=w[0],C=w[1],S=Object(n["useState"])([]),T=b()(S,2),z=T[0],F=T[1],_=Object(O["a"])("/other/teams"),q=_.data,H=_.fetchData,J=Object(O["a"])("/other/pushMans"),A=J.data,G=J.fetchData,Q=Object(O["a"])("/sign/list"),B=Q.data,K=Q.fetchData,V=10;Object(n["useEffect"])(()=>{var e=p&&Object(y["f"])(p),a=k&&Object(y["f"])(k);K({offset:0,limit:V,startTime:e,endTime:a})},[]),Object(n["useEffect"])(()=>{"1"===Y?H():"2"===Y&&G(),F([])},[Y]);var Z=e=>{var a=e.current,t=void 0===a?1:a,n=e.pageSize,l=void 0===n?10:n;L(l,l*(t-1))};function L(e,a){K(Object(y["e"])(P(e,a)))}function P(e,a){var t={limit:e,offset:a,startTime:p&&p.format("YYYY-MM-DD"),endTime:k&&k.format("YYYY-MM-DD")};return"1"===Y?t["teamIds"]=z:"2"===Y&&(t["pushManIds"]=z),t}var R=Object(n["useCallback"])(o()(d.a.mark(function e(){var a,t,n,l,r,s;return d.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return a=B?B.total:0,t=P(a,0),e.next=4,Object(O["b"])("/sign/list",Object(y["e"])(t));case 4:if(n=e.sent,l=n&&n.list,l&&0!==l.length&&0!==a){e.next=11;break}return m["a"].info("\u5f53\u524d\u6ca1\u6709\u6570\u636e\u53ef\u5bfc\u51fa"),e.abrupt("return");case 11:r=l.map(e=>{var a=e.signInTime,t=e.teamName,n=e.teamId,l=e.pushManId,r=e.pushManName,s=e.signInDate,c=e.id,i=(e.lngIn,e.latIn,e.lngOut,e.signOutDate),d=(e.cityId,e.cityName,e.address);return{signInTime:a,id:c,teamName:t,teamId:n,pushManId:l,pushManName:r,signInDate:s,signOutDate:i,address:d}}),s=r.map(e=>{var a=Object.entries(e).map(e=>{var a=b()(e,2),t=a[0],n=a[1];return[E[t],n]});return Object.fromEntries(a)}),Object(y["b"])(s,"\u7528\u6237\u8be6\u60c5\u6570\u636e");case 14:case"end":return e.stop()}},e)})),[B]);"1"===Y?a=q&&q.map((e,a)=>{var t=e.id,n=e.value;return l.a.createElement(D,{key:t},n)}):"2"===Y&&(a=A&&A.map((e,a)=>{var t=e.id,n=e.name,r=e.phone;return l.a.createElement(D,{key:t},"".concat(n,"-").concat(t,"-").concat(r))}));var U=Object(n["useCallback"])((e,a)=>{g(e),x(a)},[]);function W(e,a){return!!a.props.children&&(a.props.children+"").indexOf(e)>=0}return l.a.createElement("div",null,l.a.createElement("h3",null,"\u7b7e\u5230\u7edf\u8ba1"),l.a.createElement("div",{className:"date"},l.a.createElement("label",{className:"label"},"\u65e5\u671f"),l.a.createElement(h["d"],{fastSet:!0,defaultDate:0,value:[p,k],onSelectChange:U,includingToday:!0})),l.a.createElement("div",{className:"query"},l.a.createElement("label",{className:"label"},"\u7b5b\u9009"),l.a.createElement(c["a"].Group,{size:"small",value:Y,onChange:()=>C("1"===Y?"2":"1")},l.a.createElement(c["a"].Button,{value:"1"},"\u56e2\u961f"),l.a.createElement(c["a"].Button,{value:"2"},"\u5730\u63a8\u5458")),l.a.createElement(I["a"],{size:"small",mode:"multiple",value:z,className:"query_select",placeholder:"\u8bf7\u9009\u62e9",filterOption:W,onChange:e=>F(e)},a),l.a.createElement(s["a"],{className:"button",size:"small",type:"primary",onClick:()=>L(V,0)},"\u67e5\u770b")),l.a.createElement("div",{className:"team"},l.a.createElement("div",{className:"btn_content"},l.a.createElement(s["a"],{className:"down",size:"small",type:"primary",onClick:()=>R()},"\u4e0b\u8f7dcsv"))),l.a.createElement("div",null,l.a.createElement(r["a"],{columns:v,dataSource:B&&B.list,onChange:Z,scroll:{x:"max-content"},bordered:!0,pagination:{size:"small",total:B&&B.total,pageSize:B&&B.pageSize,showQuickJumper:!0,showSizeChanger:!0,showTotal:e=>"\u603b\u8ba1".concat(e,"\u6761\u7ed3\u679c")},rowKey:"id"})))},j=Object(n["memo"])(N);a["default"]=(()=>{return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",null,l.a.createElement(j,null)))})}}]);