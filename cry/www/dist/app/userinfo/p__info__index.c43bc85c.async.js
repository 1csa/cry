(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{Hl9H:function(e,a,t){e.exports={"fetchtable-item":"fetchtable-item","info-item":"info-item","img-item":"img-item"}},TUTT:function(e,a,t){"use strict";t.r(a);t("zI7Q");var l=t("SCaQ"),n=(t("oeo2"),t("BmDy")),r=(t("vgpD"),t("UL5a")),i=(t("M6c6"),t("jMRu")),m=t("Z32k"),c=t.n(m),s=(t("IJu9"),t("DuHN")),u=t("JGaj"),o=t.n(u),d=t("maMK"),E=t.n(d),p=t("ERkP"),b=t.n(p),v=(t("Hl9H"),(e,a)=>{return e===a}),f=Object(p["memo"])(e=>{var a=e.userForm,t=a.userid,n=a.nickname,r=a.username,i=a.usertype,m=a.appid,c=a.createTime,s=a.distributionChannel,u=a.version,o=a.fontsize,d=a.freshuser,E=a.readonly,p=a.profile;return b.a.createElement("div",{className:"fetchtable-item"},b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u6635\u79f0\uff1a"),b.a.createElement("div",null,n)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u7528\u6237\u540d\uff1a"),b.a.createElement("div",null,r)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u7528\u6237\u7c7b\u578b\uff1a"),b.a.createElement("div",null,i)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u4f7f\u7528\u7684APP\uff1a"),b.a.createElement("div",null,m)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u6ce8\u518c\u65f6\u95f4\uff1a"),b.a.createElement("div",null,c)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u7528\u6237\u6e20\u9053\uff1a"),b.a.createElement("div",null,s)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u9996\u6b21\u767b\u5f55\u7248\u672c\uff1a"),b.a.createElement("div",null,u)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u8bbe\u7f6e\u7684\u5b57\u4f53\uff1a"),b.a.createElement("div",null,o)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u65b0\u7528\u6237\uff1a"),b.a.createElement("div",null,d?"\u662f":"\u5426")),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u53ea\u8bfb\u7528\u6237\uff1a"),b.a.createElement("div",null,E?"\u662f":"\u5426")),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u53d1\u8868\u7684\u8bc4\u8bba\uff1a"),b.a.createElement(l["a"],{type:"link",size:"small",href:"http://pandora.yidian-inc.com/tools/crow#!/search/userid/".concat(t,"/publish_review_pass"),target:"_blank",style:{padding:"0"}},"\u53bb\u770b\u770b>>")),b.a.createElement("div",{className:"img-item"},b.a.createElement("img",{src:p,width:"122",height:"122"})))},v),h=f,y=(e,a)=>{return e===a},g=Object(p["memo"])(e=>{var a=e.oppoForm,t=a.nickname,l=a.username,n=a.createTime,r=a.version,i=a.imei,m=a.utk;return b.a.createElement("div",{className:"fetchtable-item"},b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u6635\u79f0\uff1a"),b.a.createElement("div",null,t)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"oppo_id\uff1a"),b.a.createElement("div",null,l)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u6ce8\u518c\u65f6\u95f4\uff1a"),b.a.createElement("div",null,n)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"\u9996\u6b21\u767b\u5f55\u7248\u672c\uff1a"),b.a.createElement("div",null,r)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"imei\uff1a"),b.a.createElement("div",null,i)),b.a.createElement("div",{className:"info-item"},b.a.createElement("label",null,"utk\uff1a"),b.a.createElement("div",null,m)))},y),O=g,N=(t("YdMF"),t("dVZ9")),k=(e,a)=>{return e===a},I=Object(p["memo"])(e=>{var a=[{title:"type",dataIndex:"type"},{title:"name",dataIndex:"name"},{title:"fromId",dataIndex:"fromId"},{title:"createTime",dataIndex:"createTime"},{title:"updateTime",dataIndex:"updateTime"}];return b.a.createElement(N["a"],{columns:a,dataSource:e.subChannelForm})},k),T=I,j=t("ggb3"),w=t.n(j),P=t("ubDG"),S=()=>{var e=Object(p["useState"])(""),a=E()(e,2),t=a[0],m=a[1],u=Object(p["useState"])({}),d=E()(u,2),v=d[0],f=d[1],y=Object(p["useState"])(!1),g=E()(y,2),N=g[0],k=g[1],I=Object(p["useState"])({}),j=E()(I,2),S=j[0],x=j[1],_=Object(p["useState"])(!1),H=E()(_,2),C=H[0],F=H[1],A=Object(p["useState"])([]),D=E()(A,2),J=D[0],M=D[1],R=Object(p["useState"])(!1),Z=E()(R,2),z=Z[0],G=Z[1],W=Object(p["useRef"])("");Object(p["useLayoutEffect"])(()=>{W.current=t},[t]);var q=e=>{return w.a.get("/api/proxy/".concat(P["a"].API_HOST,"/Website/mysql/user?userid=").concat(e,"&fields=*"))},L=e=>{return w.a.get("/api/proxy/".concat(P["a"].API_OPPO_HOST,"/Website/session/get-info-from-userid?userid=").concat(e,"&appid=oppobrowser"))},Q=e=>{return w.a.get("/api/proxy/".concat(P["a"].API_HOST,"/Website/mysql/channel?userid=").concat(e,"&fields=*"))},U=Object(p["useCallback"])(o()(c.a.mark(function e(){var a;return c.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:a=W.current,w.a.all([q(a),L(a),Q(a)]).then(w.a.spread(function(e,a,t){"success"===e.data.status&&e.data.result?(f(e.data.result),k(!0)):(f({}),k(!1)),"success"===a.data.status&&a.data.user?(x(a.data.user),F(!0)):(x({}),F(!1)),"success"===t.data.status&&t.data.result&&t.data.result.length>0?(M(t.data.result),G(!0)):(M([]),G(!1)),"success"!==e.data.status&&"success"!==a.data.status&&0===t.data.result.length&&s["a"].error("\u67e5\u65e0\u6b64\u7528\u6237\uff0c\u8bf7\u67e5\u770b\u7528\u6237ID\u662f\u5426\u586b\u5199\u6b63\u786e")}));case 2:case"end":return e.stop()}},e)})),[p["useRef"]]);return b.a.createElement(b.a.Fragment,null,b.a.createElement("div",{className:"basicinfo"},b.a.createElement(i["a"],{title:"\u7528\u6237\u8be6\u7ec6\u4fe1\u606f\u67e5\u8be2",bordered:!1},b.a.createElement(r["a"],{className:"form",layout:"inline"},b.a.createElement(r["a"].Item,{label:"uid"},b.a.createElement(n["a"],{placeholder:"\u8bf7\u8f93\u5165\u7528\u6237userid",value:t,onChange:e=>m(e.target.value),onPressEnter:U,allowClear:!0})),b.a.createElement(l["a"],{type:"primary",onClick:U},"\u67e5\u8be2"))),N&&b.a.createElement(i["a"],{title:"\u7528\u6237\u57fa\u7840\u4fe1\u606f",bordered:!1,style:{marginTop:"10px"}},b.a.createElement(h,{userForm:v})),C&&b.a.createElement(i["a"],{title:"OPPO\u7528\u6237\u4fe1\u606f",bordered:!1,style:{marginTop:"10px"}},b.a.createElement(O,{oppoForm:S})),z&&b.a.createElement(i["a"],{title:"\u7528\u6237\u8ba2\u9605\u9891\u9053\u5217\u8868",bordered:!1,style:{marginTop:"10px"}},b.a.createElement(T,{subChannelForm:J}))))};a["default"]=Object(p["memo"])(S)},ubDG:function(e,a,t){"use strict";var l={appId:"userinfo",appName:"userInfo\u7528\u6237\u67e5\u8be2\u5de5\u5177",logo:"http://si1.go2yd.com/get-image/0ZAJxXeZ6iu",menus:[{key:"/",icon:"home",name:"\u7528\u6237\u57fa\u7840\u4fe1\u606f"},{key:"/info",icon:"user",name:"\u7528\u6237\u8be6\u7ec6\u4fe1\u606f"},{key:"/portrait",icon:"meh",name:"\u7528\u6237\u753b\u50cf"},{key:"/blacklist",icon:"lock",name:"\u9ed1\u540d\u5355\u8bbe\u7f6e"}],layout:{hasSidebar:!0,theme:"dark"},API_HOST:"http://a4.go2yd.com",API_OPPO_HOST:"http://api-oppobrowser-o4.ha.in.yidian.com:8001"};a["a"]=l}}]);