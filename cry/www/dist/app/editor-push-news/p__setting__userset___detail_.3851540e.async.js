(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{YFQm:function(e,a,t){"use strict";t.r(a);t("+L6B");var n=t("2/Rp"),r=(t("jCWc"),t("kPKH")),l=(t("14J3"),t("BMrR")),c=(t("Pwec"),t("CtXQ")),i=(t("5Dmo"),t("3S7+")),s=(t("/zsF"),t("PArb")),m=(t("IzEo"),t("bx4M")),o=t("d6i3"),d=t.n(o),p=t("qIgq"),u=t.n(p),E=t("p0pE"),y=t.n(E),v=(t("miYZ"),t("tsqr")),k=t("1l/V"),b=t.n(k),_=t("q1tI"),h=t.n(_),g=t("KYPV"),C=t("vbjC"),V=t("aN9G"),T=t("/6qR"),f=t("aMlF"),D=t("TS7C"),F=t("ExYV"),w=t("CN3I"),q=t("dmQA"),O=(t("+BJd"),t("mr32")),S=(t("2qtc"),t("kLXV")),x=(t("TpwP"),f["a"].TextArea),j=C["a"].Item,P=V["a"].Option,B={active_days_bucket:"\u6d3b\u8dc3\u5929\u6570\u7b49\u7ea7",active_doc_days_bucket:"\u6587\u7ae0\u6d3b\u8dc3\u5929\u6570\u7b49\u7ea7",active_video_days_bucket:"\u89c6\u9891\u6d3b\u8dc3\u5929\u6570\u7b49\u7ea7",click_doc_bucket:"\u70b9\u51fb\u6587\u7ae0\u7b49\u7ea7",click_video_bucket:"\u70b9\u51fb\u89c6\u9891\u7b49\u7ea7",duration_bucket:"\u603b\u505c\u7559\u65f6\u957f\u7b49\u7ea7",duration_doc_bucket:"\u6587\u7ae0\u505c\u7559\u65f6\u957f\u7b49\u7ea7",duration_video_bucket:"\u89c6\u9891\u505c\u7559\u65f6\u957f\u7b49\u7ea7"},A=e=>{var a=e.setFieldValue,t=e.userBehaviorDimensionMapList,c=Object(_["useState"])(!1),i=u()(c,2),s=i[0],m=i[1],o=Object(_["useState"])({}),d=u()(o,2),p=d[0],E=d[1],v=Object(_["useState"])([]),k=u()(v,2),b=k[0],T=k[1];Object(_["useEffect"])(()=>{A()},[p]);var f=()=>{return{behavior:"",frequency:[]}},D=()=>{a("userBehavior",p),m(!1)},F=()=>{m(!1)},w=(e,a)=>{var t=e.behavior,n=e.frequency;t&&n.length&&(n.forEach(e=>{p["".concat(t,"&&&&").concat(e)]=!0}),E(y()({},p)),a(f()))},q=e=>{var a=e.split(" "),t=u()(a,2),n=t[0],r=t[1];delete p["".concat(n,"&&&&").concat(r)],E(y()({},p))},A=()=>{b=Object.keys(p).map(e=>{var a=e.split("&&&&"),t=u()(a,2),n=t[0],r=t[1];return n=B[n],"".concat(n," ").concat(r)}),T([...b])};return h.a.createElement(h.a.Fragment,null,h.a.createElement(x,{name:"userBehavior",readOnly:!0,value:b,placeholder:"\u8bf7\u9009\u62e9\u7528\u6237\u884c\u4e3a\u6307\u6807",onClick:()=>m(!0)}),h.a.createElement(S["a"],{visible:s,width:1e3,onOk:D,onCancel:F,closable:!1},h.a.createElement(g["c"],{initialValues:f(),onSubmit:e=>{},render:e=>{var a=e.values,c=e.setFieldValue,i=e.resetForm;return h.a.createElement(C["a"],null,h.a.createElement(l["a"],{gutter:5},h.a.createElement(r["a"],{span:8},h.a.createElement(j,{name:"behavior"},h.a.createElement(V["a"],{name:"behavior",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u6307\u6807",onChange:()=>c("frequency",[])},Object.entries(B).map(e=>{return h.a.createElement(P,{key:e[0],value:e[0]},e[1])})))),h.a.createElement(r["a"],{span:13},h.a.createElement(j,{name:"frequency"},h.a.createElement(V["a"],{name:"frequency",mode:"multiple",placeholder:"\u8bf7\u9009\u62e9\u9891\u5ea6"},(t[a.behavior]||[]).map(e=>{return h.a.createElement(P,{key:e.key,value:e.key},e.value)})))),h.a.createElement(r["a"],{span:3},h.a.createElement(n["a"],{type:"primary",icon:"plus",onClick:()=>w(a,i),style:{position:"relative",top:"4px"}},"\u6dfb\u52a0"))))}}),h.a.createElement("h4",null,"\u7ed3\u679c\u96c6"),h.a.createElement("div",null,b.map(e=>{return h.a.createElement(O["a"],{key:e,closable:!0,onClose:()=>q(e)},e)}))))},I=A,M=f["a"].TextArea,N=C["a"].Item,G=V["a"].Option,L=T["a"].Group,J={hotTaste:"\u70ed\u70b9",dirtyTaste:"\u4f4e\u4fd7"},Q={high:"\u91cd\u5ea6",light:"\u8f7b\u5ea6",normal:"\u666e\u901a",insensitive:"\u4e0d\u654f\u611f"},R=e=>{var a=e.setFieldValue,t=e.senseTasteDimensionMapList,c=Object(_["useState"])(!1),i=u()(c,2),s=i[0],m=i[1],o=Object(_["useState"])({}),d=u()(o,2),p=d[0],E=d[1],v=Object(_["useState"])([]),k=u()(v,2),b=k[0],f=k[1];Object(_["useEffect"])(()=>{P()},[p]);var F=()=>{return{taste:"",stepType:"preset",frequency:[],start:void 0,end:void 0}},w=()=>{a("sensTaste",p),m(!1)},q=()=>{m(!1)},x=(e,a)=>{var t=e.taste,n=e.stepType,r=e.frequency,l=e.start,c=e.end;(r.length||void 0!==l||void 0!==c)&&("custom"===n&&void 0!==l&&void 0!==c&&(p["".concat(t,"&&&&").concat(l,"-").concat(c)]=!0),r.length&&r.forEach(e=>{p["".concat(t,"&&&&").concat(e)]=!0}),E(y()({},p)),a(F()))},j=e=>{var a=e.split(" "),t=u()(a,2),n=t[0],r=t[1];delete p["".concat(n,"&&&&").concat(r)],E(y()({},p))},P=()=>{b=Object.keys(p).map(e=>{var a=e.split("&&&&"),t=u()(a,2),n=t[0],r=t[1];return n=J[n],r=Q[r]?Q[r]:r,"".concat(n," ").concat(r)}),f([...b])};return h.a.createElement(h.a.Fragment,null,h.a.createElement(M,{name:"sensTaste",readOnly:!0,value:b,placeholder:"\u8bf7\u9009\u62e9\u654f\u611f\u5ea6",onClick:()=>m(!0)}),h.a.createElement(S["a"],{visible:s,width:1e3,onOk:w,onCancel:q,closable:!1},h.a.createElement(g["c"],{initialValues:F(),onSubmit:e=>{},render:e=>{var a=e.values,c=e.setFieldValue,i=e.resetForm;return h.a.createElement(C["a"],null,h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:5},h.a.createElement(N,{name:"taste"},h.a.createElement(V["a"],{name:"taste",showSearch:!0,placeholder:"\u8bf7\u9009\u62e9\u6307\u6807",onChange:()=>c("frequency",[])},Object.entries(J).map(e=>{return h.a.createElement(G,{key:e[0],value:e[0]},e[1])})))),h.a.createElement(r["a"],{span:4},h.a.createElement(N,{name:"stepType"},h.a.createElement(L,{name:"stepType"},h.a.createElement(T["a"],{name:"stepType",value:"preset"},"\u9884\u8bbe"),h.a.createElement(T["a"],{name:"stepType",value:"custom"},"\u81ea\u5b9a\u4e49")))),h.a.createElement(r["a"],{span:12},"custom"===a.stepType?h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:11},h.a.createElement(N,{name:"start"},h.a.createElement(D["a"],{name:"start",style:{width:"100%"},placeholder:"\u6700\u5c0f\u503c -100",min:-100,max:100,precision:0}))),h.a.createElement(r["a"],{span:2,style:{textAlign:"center"}},"-"),h.a.createElement(r["a"],{span:11},h.a.createElement(N,{name:"end"},h.a.createElement(D["a"],{name:"end",style:{width:"100%"},placeholder:"\u6700\u5927\u503c 100",min:-100,max:100,precision:0})))):h.a.createElement(N,{name:"frequency"},h.a.createElement(V["a"],{name:"frequency",mode:"multiple",showSearch:!0},(t[a.taste]||[]).map(e=>{return h.a.createElement(G,{key:e.key,value:e.key},e.value)})))),h.a.createElement(r["a"],{span:3},h.a.createElement(n["a"],{type:"primary",icon:"plus",onClick:()=>x(a,i),style:{position:"relative",top:"4px"}},"\u6dfb\u52a0"))))}}),h.a.createElement("h4",null,"\u7ed3\u679c\u96c6"),h.a.createElement("div",null,b.map((e,a)=>{return h.a.createElement(O["a"],{key:e,closable:!0,onClose:()=>j(e)},e)}))))},Y=R,K=f["a"].TextArea,z=C["a"].Item,X=V["a"].Option,H=T["a"].Group,W={newsTaste:"\u56fe\u6587",videoTaste:"\u89c6\u9891",slidesTaste:"\u56fe\u96c6"},Z={high:"\u91cd\u5ea6",light:"\u8f7b\u5ea6",normal:"\u666e\u901a",insensitive:"\u4e0d\u654f\u611f"},U=e=>{var a=e.setFieldValue,t=e.ctypeTasteDimensionMapList,c=Object(_["useState"])(!1),i=u()(c,2),s=i[0],m=i[1],o=Object(_["useState"])({}),d=u()(o,2),p=d[0],E=d[1],v=Object(_["useState"])([]),k=u()(v,2),b=k[0],f=k[1];Object(_["useEffect"])(()=>{P()},[p]);var F=()=>{return{preference:"",stepType:"preset",frequency:[],start:void 0,end:void 0}},w=()=>{a("ctypeTaste",p),m(!1)},q=()=>{m(!1)},x=(e,a)=>{var t=e.preference,n=e.stepType,r=e.frequency,l=e.start,c=e.end;(r.length||void 0!==l||void 0!==c)&&("custom"===n&&void 0!==l&&void 0!==c&&(p["".concat(t,"&&&&").concat(l,"-").concat(c)]=!0),r.length&&r.forEach(e=>{p["".concat(t,"&&&&").concat(e)]=!0}),E(y()({},p)),a(F()))},j=e=>{var a=e.split(" "),t=u()(a,2),n=t[0],r=t[1];delete p["".concat(n,"&&&&").concat(r)],E(y()({},p))},P=()=>{b=Object.keys(p).map(e=>{var a=e.split("&&&&"),t=u()(a,2),n=t[0],r=t[1];return n=W[n],r=Z[r]?Z[r]:r,"".concat(n," ").concat(r)}),f([...b])};return h.a.createElement(h.a.Fragment,null,h.a.createElement(K,{name:"sensTaste",readOnly:!0,value:b,placeholder:"\u8bf7\u9009\u62e9\u5185\u5bb9\u5f62\u6001\u504f\u597d",onClick:()=>m(!0)}),h.a.createElement(S["a"],{visible:s,width:1e3,onOk:w,onCancel:q,closable:!1},h.a.createElement(g["c"],{initialValues:F(),onSubmit:e=>{},render:e=>{var a=e.values,c=e.setFieldValue,i=e.resetForm;return h.a.createElement(C["a"],null,h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:5},h.a.createElement(z,{name:"preference"},h.a.createElement(V["a"],{name:"preference",showSearch:!0,placeholder:"\u8bf7\u9009\u62e9\u6307\u6807",onChange:()=>c("frequency",[])},Object.entries(W).map(e=>{return h.a.createElement(X,{key:e[0],value:e[0]},e[1])})))),h.a.createElement(r["a"],{span:4},h.a.createElement(z,{name:"stepType"},h.a.createElement(H,{name:"stepType"},h.a.createElement(T["a"],{name:"stepType",value:"preset"},"\u9884\u8bbe"),h.a.createElement(T["a"],{name:"stepType",value:"custom"},"\u81ea\u5b9a\u4e49")))),h.a.createElement(r["a"],{span:12},"custom"===a.stepType?h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:11},h.a.createElement(z,{name:"start"},h.a.createElement(D["a"],{name:"start",style:{width:"100%"},placeholder:"\u6700\u5c0f\u503c -100",min:-100,max:100,precision:0}))),h.a.createElement(r["a"],{span:2,style:{textAlign:"center"}},"-"),h.a.createElement(r["a"],{span:11},h.a.createElement(z,{name:"end"},h.a.createElement(D["a"],{name:"end",style:{width:"100%"},placeholder:"\u6700\u5927\u503c 100",min:-100,max:100,precision:0})))):h.a.createElement(z,{name:"frequency"},h.a.createElement(V["a"],{name:"frequency",mode:"multiple",showSearch:!0},(t[a.preference]||[]).map(e=>{return h.a.createElement(X,{key:e.key,value:e.key},e.value)})))),h.a.createElement(r["a"],{span:3},h.a.createElement(n["a"],{type:"primary",icon:"plus",onClick:()=>x(a,i),style:{position:"relative",top:"4px"}},"\u6dfb\u52a0"))))}}),h.a.createElement("h4",null,"\u7ed3\u679c\u96c6"),h.a.createElement("div",null,b.map((e,a)=>{return h.a.createElement(O["a"],{key:e,closable:!0,onClose:()=>j(e)},e)}))))},$=U,ee=t("Ok+i"),ae=t("/MKj"),te=t("3a4m"),ne=t.n(te),re=t("fNOv"),le=t("A7Dc"),ce=C["a"].Item,ie=V["a"].Option,se=T["a"].Group,me=[{key:"EQ",value:"="},{key:"GT",value:">"},{key:"GE",value:">="},{key:"LT",value:"<"},{key:"LE",value:"<="}],oe={labelCol:{sm:{span:4}},wrapperCol:{sm:{span:20}}},de={wrapperCol:{sm:{span:20,offset:4}}},pe={verticalAlign:"middle",marginLeft:2,marginTop:-2,color:"#1d92ff"},ue=e=>{var a=e.dispatch,t=e.dimension,o=t.dimensionMapList;Object(_["useEffect"])(()=>{Object.keys(o).length||a({type:"dimension/getDimensionListAll"})},[]);var p=()=>{var e=o.active_days_bucket,a=o.active_doc_days_bucket,t=o.active_video_days_bucket,n=o.click_doc_bucket,r=o.click_video_bucket,l=o.duration_bucket,c=o.duration_doc_bucket,i=o.duration_video_bucket;return{active_days_bucket:e,active_doc_days_bucket:a,active_video_days_bucket:t,click_doc_bucket:n,click_video_bucket:r,duration_bucket:l,duration_doc_bucket:c,duration_video_bucket:i}},E=()=>{var e=o.hotTaste,a=o.dirtyTaste;return{hotTaste:e,dirtyTaste:a}},k=()=>{var e=o.newsTaste,a=o.videoTaste,t=o.slidesTaste;return{newsTaste:e,videoTaste:a,slidesTaste:t}},O=()=>{return{name:"",aliasName:"",appid:[],appidGroup:[],gender:void 0,gender_score:.65,age:[],age_score:.5,persona:[],appCareer:[],lbs_user_group:[],lbsBlock:" ",regionType:"city",lbsTier:[],lbsProfile:[],distributionChannel:[],deviceName:[],osVersion:[],osVersion_iosCanClick:!1,osVersion_iostype:void 0,osVersion_iosvalue:void 0,osVersion_androidCanClick:!1,osVersion_androidtype:void 0,osVersion_androidvalue:void 0,dynamicVersion:[],dynamicVersion_iosCanClick:!1,dynamicVersion_iostype:void 0,dynamicVersion_iosvalue:void 0,dynamicVersion_androidCanClick:!1,dynamicVersion_androidtype:void 0,dynamicVersion_androidvalue:void 0,createDays:void 0,activationTime:void 0,clickDaysInPassed30Days:void 0,clickDaysInPassed30Days_start:void 0,clickDaysInPassed30Days_end:void 0,activeDays:void 0,activeDays_start:void 0,activeDays_end:void 0,userBehavior:void 0,sensTaste:void 0,ctypeTaste:void 0,sctCanClick:!1,sct:[],sctScore:70,vsctCanClick:!1,vsct:[],vsctScore:70}},S=function(){var e=b()(d.a.mark(function e(a){var t,n,r,l,c,i,s,m,o,p,E,k,b,_,h,g,C,V,T,f,D,F,w,q,O,S,B,A,I,M,N,G,L,J,Q,R,Y,K,z,X,H,W,Z,U,$,ee,ae,te;return d.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(t=a.aliasName,n=a.name,r=a.appid,l=a.appidGroup,c=a.gender,i=a.gender_score,s=a.age,m=a.age_score,o=a.persona,p=a.appCareer,E=a.lbs_user_group,k=a.lbsBlock,b=a.lbsTier,_=a.lbsProfile,h=a.distributionChannel,g=a.deviceName,C=a.osVersion_iosCanClick,V=a.osVersion_iostype,T=a.osVersion_iosvalue,f=a.osVersion_androidCanClick,D=a.osVersion_androidtype,F=a.osVersion_androidvalue,w=a.dynamicVersion_iosCanClick,q=a.dynamicVersion_iostype,O=a.dynamicVersion_iosvalue,S=a.dynamicVersion_androidCanClick,B=a.dynamicVersion_androidtype,A=a.dynamicVersion_androidvalue,I=a.createDays,M=a.activationTime,N=a.clickDaysInPassed30Days_end,G=a.clickDaysInPassed30Days_start,L=a.activeDays_start,J=a.activeDays_end,Q=a.userBehavior,R=a.sensTaste,Y=a.ctypeTaste,K=a.sctCanClick,z=a.sct,X=a.sctScore,H=a.vsctCanClick,W=a.vsct,Z=a.vsctScore,r.length||l.length){e.next=4;break}return v["a"].error("appid appidGroup \u4e24\u8005\u5fc5\u586b\u5176\u4e00"),e.abrupt("return");case 4:return U=y()({appid:r,appidGroup:l,gender:c?[c]:void 0,age:s,persona:o,appCareer:p,lbs_user_group:E,lbsBlock:" "!==k?[k]:void 0,lbsTier:b,lbsProfile:_,distributionChannel:h,deviceName:g,osVersion:x(C,V,T,f,D,F),dynamicVersion:x(w,q,O,S,B,A),createDays:I?[I]:void 0,activationTime:M?[M]:void 0,clickDaysInPassed30Days:j(G,N,"\u65e0\u7a77\u5927"),activeDays:j(L,J,30),sct:K?z:null,vsct:H?W:null},P(Q),P(R),P(Y)),$=[],Object.entries(U).forEach(e=>{var a=u()(e,2),t=a[0],n=a[1];n&&n.length&&$.push({key:t,interests:n})}),$=$.map(e=>{var a=e.key;e.interests;return"gender"===a&&(e.properties={threshold:"MEAN/GT/".concat(i)}),"age"===a&&(e.properties={threshold:"MEAN/GT/".concat(m)}),"sct"===a&&(e.properties={threshold:"MEAN/GT/".concat(X)}),"vsct"===a&&(e.properties={threshold:"MEAN/GT/".concat(Z)}),e}),ee={name:n+"_newsys",aliasName:t,dimensions:$},e.next=11,le["a"](ee);case 11:ae=e.sent,te=ae.header,0===te.code?(v["a"].success("\u4fdd\u5b58\u6210\u529f!"),ne.a.push("/setting/userset")):v["a"].error("\u4fdd\u5b58\u5931\u8d25!");case 14:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),x=(e,a,t,n,r,l)=>{var c=[];return e&&a&&t&&c.push("IOS/".concat(a,"/").concat(t)),n&&r&&l&&c.push("Android/".concat(r,"/").concat(l)),c.length?c:void 0},j=(e,a,t)=>{if(e||a)return["".concat(e||0,"-").concat(a||t)]},P=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=Object.keys(e),t={};return a.forEach(e=>{var a=e.split("&&&&"),n=u()(a,2),r=n[0],l=n[1];t[r]?t[r].push(l):t[r]=[l]}),t},B=(e,a)=>{"city"===a.target.value?e("lbsProfile",[]):e("lbsTier",[])};return h.a.createElement(h.a.Fragment,null,h.a.createElement(w["a"],{currentMenu:"\u5708\u5b9a\u4eba\u7fa4\u7ba1\u7406",currentSubMenu:"\u65b0\u589e"}),h.a.createElement(m["a"],{style:{margin:"0 20px"}},h.a.createElement("div",{style:{width:"800px",margin:"0 auto"}},h.a.createElement(g["c"],{initialValues:O(),onSubmit:e=>S(e)},e=>{var a=e.values,t=e.setFieldValue,m=e.handleReset;return h.a.createElement(C["a"],Object.assign({},oe),h.a.createElement(ce,{name:"name",label:"\u7fa4\u7ec4\u540d(\u82f1\u6587)",validate:re["b"]},h.a.createElement(f["a"],{name:"name",addonAfter:"_newsys",placeholder:"\u8bf7\u8f93\u5165\u82f1\u6587\u7fa4\u7ec4\u540d(\u5b57\u6bcd\u5f00\u5934\uff0c\u4ec5\u9650\u5b57\u6bcd\u6570\u5b57\u548c\u4e0b\u5212\u7ebf\uff0c\u5982\uff1achannel_group2)"})),h.a.createElement(ce,{name:"aliasName",label:"\u7fa4\u7ec4\u540d(\u4e2d\u6587)",validate:re["a"]},h.a.createElement(f["a"],{name:"aliasName",placeholder:"\u8bf7\u8f93\u5165\u4e2d\u6587\u7fa4\u7ec4\u540d"})),h.a.createElement(s["a"],null,"\u7528\u6237\u7ef4\u5ea6\u9009\u62e9(appid \u6216 appid group\u5fc5\u9009\u5176\u4e00)"),h.a.createElement(ce,{name:"appid",label:h.a.createElement(h.a.Fragment,null,"appid",h.a.createElement(i["a"],{title:"\u4ec5\u5c55\u793a\u90e8\u5206\u5e38\u7528\u5019\u9009\uff0c\u5982\u9700\u6dfb\u52a0\u65b0\u9009\u9879\uff0c\u8bf7\u5728Tuffy\u7528\u6237\u7fa4\u53cd\u9988"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"appid",mode:"multiple",placeholder:"\u8bf7\u9009\u62e9 appid"},o.appid&&o.appid.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"appidGroup",label:h.a.createElement(h.a.Fragment,null,"appid group",h.a.createElement(i["a"],{title:"\u8bf7\u9009\u62e9appid group\uff0c\u6709\u95ee\u9898\u8bf7\u5728Tuffy\u7528\u6237\u7fa4\u53cd\u9988"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"appidGroup",mode:"multiple",placeholder:"\u8bf7\u9009\u62e9 appid group"},o.appidGroup&&o.appidGroup.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"gender",label:h.a.createElement(h.a.Fragment,null,"\u6027\u522b",h.a.createElement(i["a"],{title:"\u8bf7\u9009\u62e9\u6027\u522b\uff0c\u65e0\u9009\u9879\u65f6\u5c06\u4e0d\u8fdb\u884c\u8be5\u7ef4\u5ea6\u7684\u7b5b\u9009"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(h.a.Fragment,null,h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:19},h.a.createElement(V["a"],{name:"gender",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u6027\u522b\uff0c\u65e0\u9009\u9879\u65f6\u9ed8\u8ba4\u4e3a\u5168\u90e8"},o.gender&&o.gender.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(r["a"],{span:5},h.a.createElement(ce,{name:"gender_score",validate:re["c"],style:{marginBottom:0}},h.a.createElement(D["a"],{name:"gender_score",style:{width:"100%"},placeholder:"\u6700\u4f4e\u7f6e\u4fe1\u5ea6",min:-100,max:100,precision:2,step:.01})))))),h.a.createElement(ce,{name:"age",label:h.a.createElement(h.a.Fragment,null,"\u5e74\u9f84",h.a.createElement(i["a"],{title:"\u8bf7\u9009\u62e9\u5e74\u9f84\uff0c\u65e0\u9009\u9879\u65f6\u5c06\u4e0d\u8fdb\u884c\u8be5\u7ef4\u5ea6\u7684\u7b5b\u9009"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(h.a.Fragment,null,h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:19},h.a.createElement(V["a"],{name:"age",mode:"multiple",placeholder:"\u8bf7\u9009\u62e9\u5e74\u9f84\uff0c\u65e0\u9009\u9879\u65f6\u9ed8\u8ba4\u4e3a\u5168\u90e8"},o.age&&o.age.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(r["a"],{span:5},h.a.createElement(ce,{name:"age_score",validate:re["c"],style:{marginBottom:0}},h.a.createElement(D["a"],{name:"age_score",style:{width:"100%"},placeholder:"\u6700\u4f4e\u7f6e\u4fe1\u5ea6",min:-100,max:100,precision:2,step:.01})))))),h.a.createElement(ce,{name:"persona",label:h.a.createElement(h.a.Fragment,null,"\u4eba\u7fa4(\u70b9\u51fb\u884c\u4e3a)",h.a.createElement(i["a"],{title:"\u652f\u6301\u81ea\u5b9a\u4e49\u8f93\u5165\uff0c\u4f46\u662f\u9700\u8981\u786e\u5b9a\u8f93\u5165\u7684\u683c\u5f0f\u4e0e\u753b\u50cf\u5185\u4fdd\u5b58\u7684\u4e00\u81f4\uff0c\u533a\u5206\u5927\u5c0f\u5199;\u5bf9\u5e94\u753b\u50cf\u5b57\u6bb5\u4e3a top_persona"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"persona",mode:"tags",placeholder:"\u8bf7\u9009\u62e9\u4eba\u7fa4\uff0c\u65e0\u9009\u9879\u65f6\u9ed8\u8ba4\u4e3a\u5168\u90e8\uff08\u81ea\u5b9a\u4e49\u8f93\u5165\u9700\u8c28\u614e\uff09"},o.persona&&o.persona.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"appCareer",label:h.a.createElement(h.a.Fragment,null,"\u4eba\u7fa4(\u5e94\u7528\u5b89\u88c5)",h.a.createElement(i["a"],{title:"\u5bf9\u5e94\u753b\u50cf\u5b57\u6bb5\u4e3a app_career"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"appCareer",mode:"multiple",placeholder:"\u8bf7\u9009\u62e9\u4eba\u7fa4"},o.appCareer&&o.appCareer.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"lbs_user_group",label:h.a.createElement(h.a.Fragment,null,"\u4eba\u7fa4(\u5730\u7406\u4f4d\u7f6e)",h.a.createElement(i["a"],{title:"\u5bf9\u5e94\u753b\u50cf\u5b57\u6bb5\u4e3a lbs_user_group"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"lbs_user_group",mode:"multiple",placeholder:"\u8bf7\u9009\u62e9\u4eba\u7fa4"},o.lbs_user_group&&o.lbs_user_group.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"lbs",label:h.a.createElement(h.a.Fragment,null,"\u6240\u5728\u5730",h.a.createElement(i["a"],{title:"\u53ef\u4ee5\u9009\u62e9\u654f\u611f\u533a\u57df\uff0c\u884c\u653f\u533a\u5212\u6307\u7684\u662f\u7701\u5e02\u53bf\u533a\u7684\u7b5b\u9009"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(l["a"],{gutter:12},h.a.createElement(r["a"],{span:5},h.a.createElement(ce,{name:"lbsBlock"},h.a.createElement(V["a"],{name:"lbsBlock",allowClear:!0,placeholder:""},h.a.createElement(ie,{value:" "},"\u5168\u90e8\u533a\u57df"),h.a.createElement(ie,{value:"true"},"\u654f\u611f\u533a\u57df"),h.a.createElement(ie,{value:"false"},"\u975e\u654f\u611f\u533a\u57df")))),h.a.createElement(r["a"],{span:12},h.a.createElement(ce,{name:"regionType"},h.a.createElement(se,{name:"regionType",onChange:e=>B(t,e)},h.a.createElement(T["a"],{name:"regionType",value:"city"},"\u57ce\u5e02\u5206\u7ea7"),h.a.createElement(T["a"],{name:"regionType",value:"county"},"\u884c\u653f\u533a\u5212")))),h.a.createElement(r["a"],{span:24},"city"===a.regionType?h.a.createElement(ce,{name:"lbsTier",style:{marginBottom:0}},h.a.createElement(V["a"],{name:"lbsTier",mode:"multiple",placeholder:"\u8bf7\u9009\u62e9"},o.lbsTier&&o.lbsTier.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))):h.a.createElement(ce,{name:"lbsProfile",style:{marginBottom:0}},h.a.createElement(q["a"],{lbsProfile:a.lbsProfile||[],setFieldValue:t,lbsProfileDimensionMapList:o.lbsProfile}))))),h.a.createElement(ce,{name:"distributionChannel",label:h.a.createElement(h.a.Fragment,null,"\u6e20\u9053",h.a.createElement(i["a"],{title:"\u641c\u7d22\u5e76\u9009\u62e9\u6e20\u9053\u53f7\uff0c\u53ea\u5c55\u793a\u90e8\u5206\u5019\u9009\uff0c\u81ea\u5b9a\u4e49\u8f93\u5165\u9700\u786e\u5b9a\u5165\u753b\u50cf\u5185\u4fdd\u5b58\u7684\u4e00\u81f4\uff0c\u533a\u5206\u5927\u5c0f\u5199"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"distributionChannel",mode:"tags",placeholder:"\u8bf7\u641c\u7d22\u5e76\u9009\u62e9\u6e20\u9053\uff0c\u65e0\u9009\u9879\u65f6\u9ed8\u8ba4\u4e3a\u5168\u90e8\uff08\u81ea\u5b9a\u4e49\u8f93\u5165\u9700\u8c28\u614e\uff09"},o.distributionChannel&&o.distributionChannel.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"deviceName",label:h.a.createElement(h.a.Fragment,null,"\u673a\u578b",h.a.createElement(i["a"],{title:"\u641c\u7d22\u5e76\u9009\u62e9\u673a\u578b\uff0c\u53ea\u5c55\u793a\u90e8\u5206\u5019\u9009\uff0c\u81ea\u5b9a\u4e49\u8f93\u5165\u9700\u786e\u5b9a\u5165\u753b\u50cf\u5185\u4fdd\u5b58\u7684\u4e00\u81f4\uff0c\u533a\u5206\u5927\u5c0f\u5199"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"deviceName",mode:"tags",placeholder:"\u8bf7\u641c\u7d22\u5e76\u9009\u62e9\u673a\u578b\uff0c\u65e0\u9009\u9879\u65f6\u9ed8\u8ba4\u4e3a\u5168\u90e8\uff08\u81ea\u5b9a\u4e49\u8f93\u5165\u9700\u8c28\u614e\uff09"},o.deviceName&&o.deviceName.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"osVersion",style:{marginBottom:"0px"},label:h.a.createElement(h.a.Fragment,null,"\u7248\u672c\u53f7",h.a.createElement(i["a"],{title:"\u5148\u52fe\u9009\u9700\u8981\u5708\u9009\u7684\u7cfb\u7edf\uff0c\u518d\u9009\u62e9\u5224\u65ad\u5173\u7cfb\u5e76\u8f93\u5165\u7248\u672c\u53f7\u6570\u5b57"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:4},h.a.createElement(ce,{name:"osVersion_iosCanClick"},h.a.createElement(F["a"],{name:"osVersion_iosCanClick"},"IOS"))),h.a.createElement(r["a"],{span:4},h.a.createElement(ce,{name:"osVersion_iostype"},h.a.createElement(V["a"],{name:"osVersion_iostype",placeholder:"\u5224\u65ad\u5173\u7cfb",disabled:!a.osVersion_iosCanClick},me.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)})))),h.a.createElement(r["a"],{span:16},h.a.createElement(ce,{name:"osVersion_iosvalue",validate:re["d"]},h.a.createElement(f["a"],{name:"osVersion_iosvalue",placeholder:"\u8bf7\u8f93\u5165\u7248\u672c\u53f7\u6570\u5b57\uff0c\u4f8b\u5982\uff1a5.1.4.2",disabled:!a.osVersion_iosCanClick})))),h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:4},h.a.createElement(ce,{name:"osVersion_androidCanClick"},h.a.createElement(F["a"],{name:"osVersion_androidCanClick"},"Android"))),h.a.createElement(r["a"],{span:4},h.a.createElement(ce,{name:"osVersion_androidtype"},h.a.createElement(V["a"],{name:"osVersion_androidtype",placeholder:"\u5224\u65ad\u5173\u7cfb",disabled:!a.osVersion_androidCanClick},me.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)})))),h.a.createElement(r["a"],{span:16},h.a.createElement(ce,{name:"osVersion_androidvalue",validate:re["d"]},h.a.createElement(f["a"],{name:"osVersion_androidvalue",placeholder:"\u8bf7\u8f93\u5165\u7248\u672c\u53f7\u6570\u5b57\uff0c\u4f8b\u5982\uff1a5.1.4.2",disabled:!a.osVersion_androidCanClick}))))),h.a.createElement(ce,{name:"dynamicVersion",style:{marginBottom:"0px"},label:h.a.createElement(h.a.Fragment,null,"\u52a8\u6001\u7248\u672c\u53f7",h.a.createElement(i["a"],{title:"\u5148\u52fe\u9009\u9700\u8981\u5708\u9009\u7684\u7cfb\u7edf\uff0c\u518d\u9009\u62e9\u5224\u65ad\u5173\u7cfb\u5e76\u8f93\u5165\u7248\u672c\u53f7\u6570\u5b57"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:4},h.a.createElement(ce,{name:"dynamicVersion_iosCanClick"},h.a.createElement(F["a"],{name:"dynamicVersion_iosCanClick"},"IOS"))),h.a.createElement(r["a"],{span:4},h.a.createElement(ce,{name:"dynamicVersion_iostype"},h.a.createElement(V["a"],{name:"dynamicVersion_iostype",placeholder:"\u5224\u65ad\u5173\u7cfb",disabled:!a.dynamicVersion_iosCanClick},me.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)})))),h.a.createElement(r["a"],{span:16},h.a.createElement(ce,{name:"dynamicVersion_iosvalue",validate:re["d"]},h.a.createElement(f["a"],{name:"dynamicVersion_iosvalue",placeholder:"\u8bf7\u8f93\u5165\u7248\u672c\u53f7\u6570\u5b57\uff0c\u4f8b\u5982\uff1a5.1.4.2",disabled:!a.dynamicVersion_iosCanClick})))),h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:4},h.a.createElement(ce,{name:"dynamicVersion_androidCanClick"},h.a.createElement(F["a"],{name:"dynamicVersion_androidCanClick"},"Android"))),h.a.createElement(r["a"],{span:4},h.a.createElement(ce,{name:"dynamicVersion_androidtype"},h.a.createElement(V["a"],{name:"dynamicVersion_androidtype",placeholder:"\u5224\u65ad\u5173\u7cfb",disabled:!a.dynamicVersion_androidCanClick},me.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)})))),h.a.createElement(r["a"],{span:16},h.a.createElement(ce,{name:"dynamicVersion_androidvalue",validate:re["d"]},h.a.createElement(f["a"],{name:"dynamicVersion_androidvalue",placeholder:"\u8bf7\u8f93\u5165\u7248\u672c\u53f7\u6570\u5b57\uff0c\u4f8b\u5982\uff1a5.1.4.2",disabled:!a.dynamicVersion_androidCanClick}))))),h.a.createElement(ce,{name:"createDays",label:h.a.createElement(h.a.Fragment,null,"\u7528\u6237\u521b\u5efa\u5468\u671f",h.a.createElement(i["a"],{title:"\u652f\u63011\u81f330\u5929\u7684\u9009\u62e9\uff0c\u4e0d\u652f\u6301\u81ea\u5b9a\u4e49\u8f93\u5165"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"createDays",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u7528\u6237\u521b\u5efa\u5468\u671f\uff0c\u65e0\u9009\u9879\u65f6\u9ed8\u8ba4\u4e3a\u5168\u90e8\u7528\u6237\uff0c\u5468\u671f\u65f6\u957f\u4e0d\u9650\u5236"},o.createDays&&o.createDays.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"activationTime",label:h.a.createElement(h.a.Fragment,null,"\u7528\u6237\u6fc0\u6d3b\u5468\u671f",h.a.createElement(i["a"],{title:"\u652f\u63011\u81f330\u5929\u7684\u9009\u62e9\uff0c\u4e0d\u652f\u6301\u81ea\u5b9a\u4e49\u8f93\u5165"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(V["a"],{name:"activationTime",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9\u7528\u6237\u6fc0\u6d3b\u5468\u671f\uff0c\u65e0\u9009\u9879\u65f6\u9ed8\u8ba4\u4e3a\u5168\u90e8\u7528\u6237\uff0c\u5468\u671f\u65f6\u957f\u4e0d\u9650\u5236"},o.activationTime&&o.activationTime.map(e=>{return h.a.createElement(ie,{key:e.key},e.value)}))),h.a.createElement(ce,{name:"clickDaysInPassed30Days",label:h.a.createElement(h.a.Fragment,null,"30\u5929\u70b9\u51fb\u6570",h.a.createElement(i["a"],{title:h.a.createElement("div",null,"30\u5929\u70b9\u51fb\u6570\u9891\u5ea6\u5212\u5206\uff1a",h.a.createElement("div",null,"\u4f4e\u9891\u7528\u6237[0,20]"),h.a.createElement("div",null,"\u4e2d\u4f4e\u9891\u7528\u6237[21,50]"),h.a.createElement("div",null,"\u4e2d\u9891\u7528\u6237[51,100]"),h.a.createElement("div",null,"\u4e2d\u9ad8\u9891\u7528\u6237[101,200]"),h.a.createElement("div",null,"\u9ad8\u9891\u7528\u6237[201,300]"),h.a.createElement("div",null,"\u5168\u52e4\u7528\u6237[300,\u221e)"))},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:11},h.a.createElement(D["a"],{name:"clickDaysInPassed30Days_start",placeholder:"\u70b9\u51fb\u6570\u6700\u5c0f\u503c\uff0c\u4e0d\u586b\u9ed8\u8ba4\u4e3a0",min:0,precision:0,style:{width:"100%"}})),h.a.createElement(r["a"],{span:2,style:{textAlign:"center"}},"\u2014"),h.a.createElement(r["a"],{span:11},h.a.createElement(D["a"],{name:"clickDaysInPassed30Days_end",style:{width:"100%"},placeholder:"\u70b9\u51fb\u6570\u6700\u5927\u503c\uff0c\u4e0d\u586b\u9ed8\u8ba4\u4e3a\u221e",min:0,precision:0})))),h.a.createElement(ce,{name:"activeDays",label:h.a.createElement(h.a.Fragment,null,"\u6708\u6d3b\u8dc3\u5929\u6570",h.a.createElement(i["a"],{title:"\u5de6\u4fa7\u4e3a\u6700\u5c0f\u503c\uff0c\u53f3\u4fa7\u4e3a\u6700\u5927\u503c\uff0c\u6700\u5c0f\u4e3a0\u6700\u5927\u4e3a30"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:11},h.a.createElement(D["a"],{name:"activeDays_start",placeholder:"\u6d3b\u8dc3\u5929\u6570\u6700\u5c0f\u503c\uff0c\u4e0d\u586b\u9ed8\u8ba4\u4e3a0",min:0,precision:0,style:{width:"100%"}})),h.a.createElement(r["a"],{span:2,style:{textAlign:"center"}},"\u2014"),h.a.createElement(r["a"],{span:11},h.a.createElement(D["a"],{name:"activeDays_end",style:{width:"100%"},placeholder:"\u6d3b\u8dc3\u5929\u6570\u6700\u5927\u503c\uff0c\u4e0d\u586b\u9ed8\u8ba4\u4e3a30",min:0,max:30,precision:0})))),h.a.createElement(ce,{name:"userBehavior",label:h.a.createElement(h.a.Fragment,null,"\u7528\u6237\u884c\u4e3a\u6307\u6807",h.a.createElement(i["a"],{title:"\u7528\u6237\u5404\u79cd\u884c\u4e3a\u7684\u9891\u5ea6\u9009\u62e9\uff0c\u5982\u201c\u6d3b\u8dc3\u5929\u6570\u4e3a\u4e2d\u4f4e\u9891\u7684\u7528\u6237\u201d"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(I,{setFieldValue:t,userBehaviorDimensionMapList:p()})),h.a.createElement(ce,{name:"sensTaste",label:h.a.createElement(h.a.Fragment,null,"\u654f\u611f\u5ea6",h.a.createElement(i["a"],{title:"\u652f\u6301\u9009\u62e9\u9884\u8bbe\u503c\u6216\u8f93\u5165\u81ea\u5b9a\u4e49\u503c\uff0c\u5176\u4e2d\u9884\u8bbe\u503c\u5305\u62ec\u91cd\u5ea6\uff0870-100\uff09\u3001\u8f7b\u5ea6\uff0830-70\uff09\u3001\u666e\u901a\uff080-30\uff09\u3001\u4e0d\u654f\u611f\uff08-100-0\uff09"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(Y,{setFieldValue:t,senseTasteDimensionMapList:E()})),h.a.createElement(ce,{name:"ctypeTaste",label:h.a.createElement(h.a.Fragment,null,"\u5185\u5bb9\u5f62\u6001\u504f\u597d",h.a.createElement(i["a"],{title:"\u7b5b\u9009\u7528\u6237\u5bf9\u56fe\u6587\u6216\u89c6\u9891\u7b49\u7684\u559c\u597d\u7a0b\u5ea6"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement($,{setFieldValue:t,ctypeTasteDimensionMapList:k()})),h.a.createElement(ce,{name:"interest",label:h.a.createElement(h.a.Fragment,null,"\u5174\u8da3\u6807\u7b7e",h.a.createElement(i["a"],{title:"\u7b5b\u9009\u7528\u6237\u5bf9\u56fe\u6587\u6216\u89c6\u9891\u4e0b\uff0c\u67d0\u7c7b\u6807\u7b7e\u7684\u559c\u597d\u7a0b\u5ea6"},h.a.createElement(c["a"],{type:"question-circle",style:pe})))},h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:3},h.a.createElement(ce,{name:"sctCanClick"},h.a.createElement(F["a"],{name:"sctCanClick"},"\u56fe\u6587"))),h.a.createElement(r["a"],{span:16},h.a.createElement(ee["a"],{name:"sct",setFieldValue:t,interestTagDimensionMapList:o.sct,disabled:!a.sctCanClick})),h.a.createElement(r["a"],{span:5},h.a.createElement(ce,{name:"sctScore"},h.a.createElement(D["a"],{name:"sctScore",disabled:!a.sctCanClick,style:{width:"100%"},placeholder:"\u6700\u4f4e\u7f6e\u4fe1\u5ea6",min:-100,max:100,precision:0,step:1})))),h.a.createElement(l["a"],{gutter:10},h.a.createElement(r["a"],{span:3},h.a.createElement(ce,{name:"vsctCanClick"},h.a.createElement(F["a"],{name:"vsctCanClick"},"\u89c6\u9891"))),h.a.createElement(r["a"],{span:16},h.a.createElement(ee["a"],{name:"vsct",setFieldValue:t,interestTagDimensionMapList:o.vsct,disabled:!a.vsctCanClick})),h.a.createElement(r["a"],{span:5},h.a.createElement(ce,{name:"vsctScore"},h.a.createElement(D["a"],{name:"vsctScore",disabled:!a.vsctCanClick,style:{width:"100%"},placeholder:"\u6700\u4f4e\u7f6e\u4fe1\u5ea6",min:-100,max:100,precision:0,step:1}))))),h.a.createElement(ce,Object.assign({},de,{name:"operate"}),h.a.createElement(n["a"],{type:"primary",icon:"save",htmlType:"submit"},"\u4fdd\u5b58"),h.a.createElement(n["a"],{type:"primary",icon:"rollback",style:{marginLeft:"20px"},onClick:m},"\u91cd\u7f6e")))}))))};a["default"]=Object(ae["c"])(e=>{return{dimension:e.dimension}})(ue)}}]);