(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{"9iDs":function(e,t,a){"use strict";a.r(t);a("2qtc");var n=a("kLXV"),r=(a("bbsP"),a("/wGt")),l=(a("g9YV"),a("wCAj")),c=(a("/zsF"),a("PArb")),i=(a("Pwec"),a("CtXQ")),o=a("d6i3"),s=a.n(o),u=a("1l/V"),m=a.n(u),p=(a("+L6B"),a("2/Rp")),d=a("p0pE"),h=a.n(d),v=a("qIgq"),_=a.n(v),b=a("q1tI"),E=a.n(b),y=a("/MKj"),f=a("KYPV"),w=a("vbjC"),g=a("aMlF"),x=a("aN9G"),k=a("/6qR"),O=a("MStj"),j=a("P+IH"),S=a("hPS3"),I=a("hfLc"),C=a("0lfv"),z=[{value:"real_click_rate-asc",label:"\u771f\u5b9e\u70b9\u51fb\u7387-\u5347\u5e8f"},{value:"real_click_rate-desc",label:"\u771f\u5b9e\u70b9\u51fb\u7387-\u964d\u5e8f"},{value:"click_pv-asc",label:"\u70b9\u51fb\u6b21\u6570-\u5347\u5e8f"},{value:"click_pv-desc",label:"\u70b9\u51fb\u6b21\u6570-\u964d\u5e8f"},{value:"arrive_pv-asc",label:"\u5230\u8fbe\u6b21\u6570-\u5347\u5e8f"},{value:"arrive_pv-desc",label:"\u5230\u8fbe\u6b21\u6570-\u964d\u5e8f"},{value:"view_pv-asc",label:"\u63a8\u9001\u6b21\u6570-\u5347\u5e8f"},{value:"view_pv-desc",label:"\u63a8\u9001\u6b21\u6570-\u964d\u5e8f"}],N=(a("P8T2"),{}),A=E.a.memo(e=>{var t=e.cates,a=void 0===t?{}:t,n=e.onSubmit,r=Object(b["useState"])(),l=_()(r,2),c=l[0],i=l[1],o=e=>{var t=(e["orderBy"]||"").split("-");if(2===t.length){var a=t[0],r=t[1];e["sort"]=a,e["order"]=r}else e["sort"]="",e["order"]="";return e.operator&&(e.operator=e.operator.trim()),n(c?h()({},e,{d:c}):e)};return E.a.createElement("div",null,E.a.createElement(f["c"],{initialValues:N,onSubmit:o},E.a.createElement(w["a"],{className:"history-screen",labelCol:{span:5},wrapperCol:{span:19},labelAlign:"right",layout:"vertical"},E.a.createElement(w["a"].Item,{name:"doc_id",label:"docid"},E.a.createElement(g["a"],{name:"doc_id",placeholder:"\u8bf7\u8f93\u5165docid"})),E.a.createElement(w["a"].Item,{name:"biz_id",label:"\u4e1a\u52a1\u7ebf"},E.a.createElement(x["a"],{name:"biz_id",allowClear:!0},Object(C["o"])(I["f"]))),E.a.createElement(w["a"].Item,{name:"push_id",label:"\u63a8\u9001ID"},E.a.createElement(g["a"],{name:"push_id",placeholder:"\u8bf7\u8f93\u5165\u65b0\u6216\u8001PushId"})),E.a.createElement(w["a"].Item,{name:"keywords",label:"\u5173\u952e\u8bcd"},E.a.createElement(g["a"],{name:"keywords",placeholder:"\u652f\u6301\u6807\u9898/\u6458\u8981\u6a21\u7cca\u641c\u7d22"})),E.a.createElement(w["a"].Item,{name:"operator",label:"\u90ae\u7bb1\u524d\u7f00"},E.a.createElement(g["a"],{name:"operator",placeholder:"\u8bf7\u8f93\u5165\u64cd\u4f5c\u4eba\u90ae\u7bb1\u524d\u7f00"})),E.a.createElement(w["a"].Item,{name:"userids",label:"\u63a8\u9001\u7c7b\u522b"},E.a.createElement(x["a"],{name:"userids",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u63a8\u9001\u7c7b\u578b"},Object(C["o"])(I["s"]))),E.a.createElement(w["a"].Item,{name:"cate",label:"\u5206\u7c7b"},E.a.createElement(x["a"],{name:"cate",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u5206\u7c7b"},Object(C["o"])(a))),E.a.createElement(w["a"].Item,{name:"platform",label:"\u5e73\u53f0"},E.a.createElement(x["a"],{name:"platform",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u5e73\u53f0"},Object(C["o"])(I["r"]))),E.a.createElement(w["a"].Item,{name:"hot_level",label:"\u70ed\u70b9\u7b49\u7ea7"},E.a.createElement(x["a"],{name:"hot_level",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u70ed\u70b9\u7b49\u7ea7"},Object(C["o"])(I["o"]))),E.a.createElement(w["a"].Item,{name:"xiaomi_priority",label:"\u662f\u5426\u9ad8\u4f18"},E.a.createElement(k["a"].Group,{name:"xiaomi_priority"},Object(C["n"])(I["G"]))),E.a.createElement(w["a"].Item,{name:"orderBy",label:"\u6570\u636e\u6392\u5e8f"},E.a.createElement(x["a"],{name:"orderBy",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u6392\u5e8f\u65b9\u5f0f"},z.map(e=>{return E.a.createElement(x["a"].Option,{key:e.value}," ",e.label," ")}))),E.a.createElement(w["a"].Item,{name:"d",label:"\u521b\u5efa\u65f6\u95f4"},E.a.createElement(O["a"],{style:{width:"100%"},name:"d",format:"YYYY-MM-DD",onChange:(e,t)=>i(t)})),E.a.createElement(w["a"].Item,{className:"history-screen-operation",name:"submit",wrapperCol:{span:24}},E.a.createElement(j["a"],{size:"small",loading:!1},"\u63d0\u4ea4"),E.a.createElement(S["a"],{size:"small",onClick:()=>i("")},"\u91cd\u7f6e")))))}),D=(a("BoS7"),a("Sdc0")),F=(a("miYZ"),a("tsqr")),P=a("eZYV"),Y=a("Nsi5"),J=a("jQXT"),q=(a("Lput"),e=>{var t=e.initial,a=void 0===t?{}:t,n=e.onSubmit,r=Object(P["c"])("tools"),l=Object(b["useState"])(!1),c=_()(l,2),i=c[0],o=c[1],s=e=>{if(!r||!1===r.includes(Y["b"]))return F["a"].warning("\u53bb\u9664\u6807\u9898\u9650\u5236\u9700\u8981\u7533\u8bf7\u6743\u9650\u54e6\uff5e");o(e)};return E.a.createElement(f["c"],{initialValues:a,onSubmit:n},E.a.createElement(w["a"],{className:"content-editor",colon:!1},E.a.createElement("div",{className:"content-editor-item"},E.a.createElement("div",{className:"content-editor-title"},E.a.createElement("label",null,"\u63a8\u9001\u6807\u9898"),E.a.createElement("span",null,"\u53bb\u9664\u6807\u9898\u5b57\u6570\u9650\u5236\uff1a",E.a.createElement(D["a"],{size:"small",checked:i,onChange:s}))),E.a.createElement(w["a"].Item,{name:"head",validate:e=>Object(J["h"])(e,i)},E.a.createElement(g["a"],{name:"head",size:"small"}))),E.a.createElement("div",{className:"content-editor-item"},E.a.createElement("label",null,"\u63a8\u9001\u6458\u8981"),E.a.createElement(w["a"].Item,{name:"news",validate:J["f"]},E.a.createElement(g["a"].TextArea,{name:"news"}))),E.a.createElement(w["a"].Item,{name:"submit"},E.a.createElement(j["a"],{loading:!1},"\u63d0 \u4ea4"))))}),T=(a("+BJd"),a("mr32")),V=a("H2DF"),B=e=>{return[{title:"\u6587\u7ae0ID/\u6807\u9898/\u6458\u8981",dataIndex:"pushContent",width:180,render:(e,t)=>{var a=t.head,n=t.news,r=t.doc_id;return b["createElement"](b["Fragment"],null,b["createElement"]("h3",null,r),b["createElement"]("p",{className:"ant-table-cell",title:a},b["createElement"]("a",{href:"http://www.yidianzixun.com/article/".concat(r.trim()),target:"_blank"},a)),b["createElement"]("p",{className:"ant-table-cell",title:n},n))}},{title:"\u521b\u5efa\u65f6\u95f4",dataIndex:"create_time",width:102},{title:"\u63a8\u9001\u7c7b\u522b\u53ca\u70ed\u70b9\u7ea7\u522b",dataIndex:"typeAndCate",width:160,render:(e,t)=>{var a=t.type,n=t.hot_level;return b["createElement"](b["Fragment"],null,b["createElement"]("p",null,a),b["createElement"]("p",null,n?I["o"][n]:"--"," "))}},{title:"\u5206\u7c7b",dataIndex:"cate",width:80,render:t=>e[t]},{title:"\u5708\u9009\u6807\u7b7e",dataIndex:"channel",render:e=>b["createElement"](b["Fragment"],null,Array.isArray(e)&&e.map(e=>b["createElement"]("div",null,b["createElement"](T["a"],{color:"blue",key:e,style:{margin:"0 4px 4px 0"}},e))))},{title:"\u6392\u9664\u6807\u7b7e",dataIndex:"exclude_channel",render:e=>b["createElement"](b["Fragment"],null,Array.isArray(e)&&e.map(e=>b["createElement"]("div",null,b["createElement"](T["a"],{color:"red",key:e,style:{margin:"0 4px 4px 0"}},e))))},{title:"\u4ea4\u96c6\u6807\u7b7e",dataIndex:"inter_channel",render:e=>b["createElement"](b["Fragment"],null,Array.isArray(e)&&e.map(e=>b["createElement"]("div",null,b["createElement"](T["a"],{color:"blue",key:e,style:{margin:"0 4px 4px 0"}},e))))},{title:"\u64cd\u4f5c\u4eba",dataIndex:"operator",width:100},{title:"\u9ad8\u4f18",dataIndex:"xm_priority",width:52,render:(e,t)=>{var a=t.oppo_pay,n=void 0===a?"":a,r=t.xm_priority,l=void 0===r?"":r;return 1===n&&0===l?b["createElement"]("span",null,"oppo"):0===n&&1===l?b["createElement"]("span",null,"\u5c0f\u7c73"):1===n&&1===l?b["createElement"]("div",null,"oppo ",b["createElement"]("br",null)," \u5c0f\u7c73"):b["createElement"]("span",null,"\u5426")}},{title:"\u63a8\u9001\u6570\u636e",dataIndex:"push_stat",render:(e,t)=>{var a=t["useSortKey"]||"";if(e){var n=["click_uv","click_pv","real_click_rate","arrive_uv","arrive_pv","view_uv","view_pv","real_convert_rate"];return b["createElement"](b["Fragment"],null,n.length&&n.map(t=>b["createElement"]("div",null,b["createElement"](T["a"],{color:t===a?"red":"blue",key:t,style:{margin:"0 4px 4px 0"}},V["m"][t],":",["click_rate","convert_rate","real_click_rate","real_convert_rate"].includes(t)?parseInt(1e6*e[t]+"")/1e4+"%":parseInt(e[t])))))}return""}}]},L=a("lfbw"),M=a("sy1d");a("ubDG");function G(){return K.apply(this,arguments)}function K(){return K=m()(s.a.mark(function e(){return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,M["a"].get("/api/push/common/testApi");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)})),K.apply(this,arguments)}var X=a("maTO"),Z=a("c+yx");a("q9RC");function H(e,t){var a;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(a=Q(e))||t&&e&&"number"===typeof e.length){a&&(e=a);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var l,c=!0,i=!1;return{s:function(){a=e[Symbol.iterator]()},n:function(){var e=a.next();return c=e.done,e},e:function(e){i=!0,l=e},f:function(){try{c||null==a.return||a.return()}finally{if(i)throw l}}}}function Q(e,t){if(e){if("string"===typeof e)return R(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);return"Object"===a&&e.constructor&&(a=e.constructor.name),"Map"===a||"Set"===a?Array.from(e):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?R(e,t):void 0}}function R(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}var $={channel:[],exclude_channel:[],biz_id:"YDZX",platform:[],push_id:"",new_push_id:""},U=["all_break","auto","auto_break"],W=e=>{var t=e.auth,a=Object(y["d"])(),o=Object(b["useState"])(),u=_()(o,2),d=u[0],v=u[1],f=Object(b["useState"])(),w=_()(f,2),g=w[0],x=w[1],k=Object(b["useState"])(),O=_()(k,2),j=O[0],S=O[1],z=Object(b["useState"])(),D=_()(z,2),F=D[0],P=D[1],J=Object(b["useState"])(!1),T=_()(J,2),V=T[0],M=T[1],K=Object(b["useState"])(!1),Q=_()(K,2),R=Q[0],W=Q[1],ee=Object(b["useState"])(!1),te=_()(ee,2),ae=te[0],ne=te[1],re=Object(b["useState"])(N),le=_()(re,2),ce=le[0],ie=le[1],oe=Object(b["useState"])($),se=_()(oe,2),ue=se[0],me=se[1],pe=Object(b["useState"])(!1),de=_()(pe,2),he=de[0],ve=de[1],_e=Object(b["useState"])(),be=_()(_e,2),Ee=be[0],ye=be[1],fe=Object(b["useState"])(!1),we=_()(fe,2),ge=(we[0],we[1]),xe=e=>{var t=e.current,a=void 0===t?1:t,n=e.pageSize,r=void 0===n?10:n,l=h()({},ce,{page:a,pageCount:r});ie(l),Ne(l)},ke=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"YDZX",r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:[],l=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",c=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"";W(e),me({channel:t,exclude_channel:a,biz_id:n,platform:r,push_id:l,new_push_id:c})},Oe=(e,t)=>{a({type:"editorpush/updatePush",payload:{pushId:e,type:t}})},je=(e,t)=>{var a=t.push_id,n=t.new_push_id,r=t.head,l=t.news;ve(e),ye({push_id:a,new_push_id:n,head:r,news:l})},Se=e=>{var t=JSON.parse(JSON.stringify(e)),a=t.xiaomi_priority;if("11"===a){try{delete t.oppo_pay}catch(e){console.log(e)}t["xiaomi_priority"]="1"}else if("22"===a){try{delete t.xiaomi_priority}catch(e){console.log(e)}t["oppo_pay"]="1"}else"33"===a?(t["xiaomi_priority"]="1",t["oppo_pay"]="1"):"0"===a&&(t["xiaomi_priority"]="0",t["oppo_pay"]="0");ie(h()({},t,{page:1})),Ne(h()({},t,{page:1}))},Ie=e=>{a({type:"editorpush/updateContent",payload:e,callback:()=>je(!1,{})})},Ce={title:"\u64cd\u4f5c",dataIndex:"operation",align:"center",width:108,render:(e,t)=>{var a=t.type.match(/^\W+\(([a-z_]+)\)$/),n=a?a[1]:"";return E.a.createElement("div",{style:{display:"flex",flexDirection:"column"}},["all","auto"].includes(n)&&!0!==t.pause?E.a.createElement(p["a"],{type:"link",size:"small",onClick:()=>Oe(t.push_id||t.new_push_id,"pause")},"\u6682\u505c\u63a8\u9001"):null,["all","auto"].includes(n)&&!0===t.pause?E.a.createElement(E.a.Fragment,null,E.a.createElement(p["a"],{type:"link",size:"small",onClick:()=>Oe(t.push_id||t.new_push_id,"continue")},"\u6062\u590d\u63a8\u9001"),E.a.createElement(p["a"],{type:"link",size:"small",onClick:()=>je(!0,t)},"\u518d\u6b21\u7f16\u8f91")):null,E.a.createElement(p["a"],{type:"link",size:"small",onClick:()=>ke(!0,t.channel,t.exclude_channel,t.biz_id,t.platform,t.push_id,t.new_push_id)},"\u67e5\u770b\u8be6\u60c5"))}};Object(b["useEffect"])(()=>{ze()},[]),Object(b["useEffect"])(()=>{var e,a=(null===t||void 0===t?void 0:null===(e=t.currentAuth)||void 0===e?void 0:e.childAuths)||[];ge(a.indexOf(Y["c"])>=0)},[t]);var ze=function(){var e=m()(s.a.mark(function e(){var t,a,n,r,l,c,i;return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return ne(!0),e.next=3,Object(X["a"])();case 3:if(t=e.sent,"success"!==t.status){e.next=11;break}a={},n=H(t.result);try{for(n.s();!(r=n.n()).done;)l=r.value,c=l.name,i=l.id,a[i]=c}catch(e){n.e(e)}finally{n.f()}P(a),e.next=12;break;case 11:throw new Error(t.message);case 12:return e.next=14,Ae(ce);case 14:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),Ne=function(){var e=m()(s.a.mark(function e(t){return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return ne(!0),e.next=3,Ae(t);case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),Ae=function(){var e=m()(s.a.mark(function e(t){var a,n,r,l,c,i,o,u,m,p,d,h,_,b,E,y,f,w,g,k,O;return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(L["a"])(t);case 2:if(a=e.sent,n=[],"success"!==a.status){e.next=20;break}return r=a.result,l=r.statistics,c=void 0===l?[]:l,i=r.task_history,o=void 0===i?[]:i,u=r.count_all,m=void 0===u?0:u,v(c),x(o),S(m),ne(!1),o.forEach(e=>{e["type"].indexOf("auto")>-1?n.push(e["new_push_id"]):n.push(e["push_id"])}),p="",d=t["d"],h=t["sort"],d?(_=Object(Z["g"])(+new Date(d)),b=Object(Z["g"])(+new Date(d)+3456e5),p="".concat(_,"/").concat(b)):(E=Object(Z["g"])(+new Date),y=Object(Z["g"])(+new Date+3456e5),p="".concat(E,"/").concat(y)),f={intervals:p,columns:["view_pv","view_uv","arrive_pv","arrive_uv","click_pv","click_uv"],granularity:"all",filter:{push_id:n},group:["push_id"],limit:10240,dataSource:"push_pv_uv_app"},e.next=18,Object(X["k"])(f);case 18:w=e.sent,"success"===w.status&&w.result&&w.result.length?(g=w.result,k={},g.forEach(e=>{var t=e[1],a=e[2],n=e[3],r=e[4],l=e[5],c=e[6],i={view_pv:t,view_uv:a,arrive_pv:n,arrive_uv:r,click_pv:l,click_uv:c};i["real_click_rate"]=0===l||0===n?0:(l/n).toFixed(6),i["real_convert_rate"]=0===c||0===r?0:(c/r).toFixed(6),k[e[0]]=i}),O=JSON.parse(JSON.stringify(o)),O.forEach(e=>{k[e["new_push_id"]]&&(e["push_stat"]=k[e["new_push_id"]]),k[e["push_id"]]&&(e["push_stat"]=k[e["push_id"]]),e["useSortKey"]=h}),x(O)):console.log(a.message);case 20:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),De=function(){var e=m()(s.a.mark(function e(){var t;return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,G();case 2:t=e.sent,console.log(t);case 4:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}();return E.a.createElement("div",{className:"history"},E.a.createElement("section",{className:"history-statistic"},E.a.createElement("div",{className:"history-statistic-title"},E.a.createElement(i["a"],{type:"bar-chart"}),E.a.createElement("span",null,"\u63a8\u9001\u7c7b\u522b\u7edf\u8ba1")),E.a.createElement("div",{className:"history-statistic-content"},U.map((e,t)=>E.a.createElement(E.a.Fragment,{key:e},0!==t?E.a.createElement(c["a"],{type:"vertical"}):null,E.a.createElement("p",null,"".concat(I["s"]&&I["s"][e],"_").concat(e,"  ").concat(d&&d[e])))))),E.a.createElement("section",{className:"history-tasks"},E.a.createElement("div",{className:"history-tasks-header"},E.a.createElement("div",{className:"history-tasks-header-title"},E.a.createElement(i["a"],{type:"table"}),E.a.createElement("span",null,"\u63a8\u9001\u5386\u53f2\u7edf\u8ba1"),E.a.createElement(p["a"],{type:"primary",onClick:De,style:{marginLeft:"20px",opacity:0}},"\u6d4b\u8bd5-\u70b9\u6211")),E.a.createElement(p["a"],{type:"primary",size:"small",onClick:()=>M(!0)},"\u7b5b\u9009")),E.a.createElement("div",{className:"history-tasks-table"},E.a.createElement(l["a"],{rowKey:"push_id",bordered:!0,columns:[...B(F),Ce],dataSource:g,loading:ae,scroll:{y:document.body.clientHeight-300},pagination:{total:j,size:"small",current:ce.page,pageSize:ce.pageCount,showSizeChanger:!0,showQuickJumper:!0,showTotal:e=>"\u5171\u8ba1".concat(e,"\u6761")},onChange:xe}))),E.a.createElement(r["a"],{visible:V,title:"\u7b5b\u9009-\u63a8\u9001\u5386\u53f2",width:450,onClose:()=>M(!1)},E.a.createElement(A,{cates:F,onSubmit:Se})),E.a.createElement(n["a"],{title:"\u6807\u7b7e",footer:null,closable:!1,visible:R,onCancel:()=>ke(!1)},E.a.createElement("h5",null,"\u4e1a\u52a1\u7ebf"),E.a.createElement("p",null,ue.biz_id?I["f"][ue.biz_id]:"---"),E.a.createElement("h5",null,"\u5e73\u53f0"),E.a.createElement("p",null,!1===Object(C["d"])(ue.platform)?ue.platform.map(e=>I["r"][e]).join(","):"--"),E.a.createElement("h5",null,"\u63a8\u9001ID(\u8001|\u65b0)"),E.a.createElement("p",null,E.a.createElement("div",null,"\u8001\uff1a",ue.push_id||"---"),E.a.createElement("div",null,"\u65b0\uff1a",ue.new_push_id||"---"))),E.a.createElement(n["a"],{title:"\u518d\u6b21\u7f16\u8f91",visible:he,footer:null,onCancel:()=>je(!1,{})},E.a.createElement(q,{initial:Ee,onSubmit:Ie})))};t["default"]=Object(y["c"])(e=>{var t=e.auth;return{auth:t}})(W)},Lput:function(e,t,a){e.exports={"content-editor-title":"content-editor-title","content-editor":"content-editor","ant-form-item":"ant-form-item"}},P8T2:function(e,t,a){e.exports={"history-screen":"history-screen","ant-form-item":"ant-form-item","history-screen-operation":"history-screen-operation"}}}]);