(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{MQy7:function(e,a,t){"use strict";t.r(a);t("YdMF");var l=t("dVZ9"),r=(t("zI7Q"),t("SCaQ")),i=(t("Yx0K"),t("gJMY")),n=(t("ljfu"),t("x2dm")),c=(t("vgpD"),t("UL5a")),d=(t("M6c6"),t("jMRu")),o=(t("IJu9"),t("DuHN")),s=t("JCfe"),m=t.n(s),u=t("maMK"),p=t.n(u),y=(t("oeo2"),t("BmDy")),h=t("ERkP"),E=t.n(h),I=t("ggb3"),g=t.n(I),b=t("n/bh"),w=t("b0+G"),k=t("uDfI"),f=(t("s6c/"),Object(w["a"])(),b["a"]),x=(y["a"].Search,e=>{var a=Object(h["useState"])([]),t=p()(a,2),s=t[0],u=t[1],I=Object(h["useState"])({}),b=p()(I,2),w=b[0],k=b[1],x=e.form,v=x.getFieldDecorator,D=x.validateFieldsAndScroll,V=x.resetFields,C=Object(h["useState"])(!1),N=p()(C,2),j=N[0],O=N[1],S=Object(h["useState"])(!1),F=p()(S,2),M=F[0],R=F[1],J=()=>{D((e,a)=>{k(a),a.docids?(O(!0),g.a.get("/api/proxy/http://www.qatool.yidian-inc.com:8089/jeecg-boot/test/qatoolDemo/queryRulesById",{params:m()({},a)}).then(e=>{0===e.data.code?(u(e.data.result?e.data.result:[]),o["a"].success(e.data.message)):o["a"].error("\u67e5\u8be2\u5185\u5bb9\u4e3a\u7a7a"),O(!1)})):o["a"].error("\u8bf7\u8f93\u5165\u8981\u67e5\u8be2\u7684doc_id")})},q=()=>{V(),u([])},B=()=>{R(!M)},Q=(e,a)=>{var t=new RegExp("(?:^|,)".concat(a,":([^#]*)")).exec(e);return t&&t[1]},Y=[{title:"\u6587\u7ae0ID",dataIndex:"docId",key:"docId",width:"14%"},{title:"\u662f\u5426\u8fc7\u6ee4",dataIndex:"isFiltered",key:"isFiltered",width:"10%"},{title:"\u89c4\u5219ID",dataIndex:"ruleId",width:"14%",key:"ruleId"},{title:"\u89c4\u5219\u540d\u79f0",dataIndex:"ruleName",width:"11%",key:"ruleName",render:(e,a)=>{return E.a.createElement("a",{style:{textDecoration:"none",color:"rgb(92, 91, 91)"},href:0==w.docids.substring(0,1)?"/app/filtertools/rule/news?ruleName=".concat(e):"/app/filtertools/rule/video?ruleName=".concat(e)},e)}},{title:"\u4e0d\u547d\u4e2d/\u547d\u4e2d\u89c4\u5219\u7684\u539f\u56e0",dataIndex:"reason",width:"30%",key:"reason"},{title:"\u8986\u76d6\u63cf\u8ff0",dataIndex:"groupDesc",width:"30%",key:"groupDesc",render:(e,a)=>{return E.a.createElement("a",{style:{textDecoration:"none",color:"rgb(92, 91, 91)"},href:"/app/filtertools/usercover?groupId=".concat(Q(e,"#groupId"))},e)}}];return E.a.createElement("div",{className:"main-check"},E.a.createElement(d["a"],{bordered:!1,style:{minHeight:380}},E.a.createElement(c["a"],{layout:"inline",style:{margin:"10px auto",maxWidth:900}},E.a.createElement(c["a"].Item,{label:"docIds",style:{margin:8}},v("docids",{initialValue:"",rules:[{required:!0,message:"\u4e0d\u80fd\u4e3a\u7a7a"}]})(E.a.createElement(y["a"],{placeholder:"\u8bf7\u8f93\u5165docId\u591a\u4e2a\u7528,\u5206\u9694",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"\u9891\u9053",style:{margin:8}},v("fromid",{initialValue:""})(E.a.createElement(y["a"],{placeholder:"\u8bf7\u8f93\u5165\u9891\u9053",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"CityCore",style:{margin:8}},v("cityCore",{initialValue:""})(E.a.createElement(n["a"],{style:{width:180},placeholder:"\u53ea\u5728\u9891\u9053\u4e3akv/knn\u65f6\u6709\u6548"},E.a.createElement(n["a"].Option,{value:"true"},"true"),E.a.createElement(n["a"].Option,{value:"false"},"false")))),E.a.createElement(c["a"].Item,{label:"appid",style:{margin:8}},v("appid",{initialValue:""})(E.a.createElement(y["a"],{placeholder:"\u8bf7\u8f93\u5165appid",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"\u7528\u6237id",style:{margin:8}},v("userid",{initialValue:""})(E.a.createElement(y["a"],{placeholder:"\u8bf7\u8f93\u5165\u7528\u6237id",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"\u6fc0\u6d3b\u5929\u6570",style:{margin:8}},v("activation_days",{initialValue:""})(E.a.createElement(i["a"],{placeholder:"\u5982\u679c\u6709userId\u5219\u4ece\u753b\u50cf\u91cc\u53d6",style:{width:180},step:1}))),E.a.createElement("div",{className:"hot-box",style:{display:M?"flex":"none"}},E.a.createElement(c["a"].Item,{label:"city",style:{margin:8}},v("city",{initialValue:""})(E.a.createElement(y["a"],{placeholder:"\u57ce\u5e02\u9017\u53f7\u5206\u9694\u5317\u4eac,\u90d1\u5dde",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"\u8bbe\u5907\u578b\u53f7",style:{margin:8}},v("model",{initialValue:""})(E.a.createElement(y["a"],{placeholder:"\u624b\u673a\u8bbe\u5907\u578b\u53f7",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"bucket",style:{margin:8}},v("bucket",{initialValue:""})(E.a.createElement(y["a"],{placeholder:"\u53ef\u4f20\u591a\u4e2a\u5982app-exp1\uff0capp-exp2",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"\u56fe\u6587\u89c4\u5219ID",style:{margin:8}},v("useNewsRuleIds",{initialValue:""})(E.a.createElement(y["a"],{placeholder:"\u8981\u67e5\u8be2\u7684\u56fe\u6587\u89c4\u5219Id \u7528,\u5206\u9694",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"\u89c6\u9891\u89c4\u5219ID",style:{margin:8}},v("useVideoRuleIds",{initialValue:""})(E.a.createElement(y["a"],{placeholder:"\u8981\u67e5\u8be2\u7684\u89c6\u9891\u89c4\u5219Id \u7528,\u5206\u9694",style:{width:180}}))),E.a.createElement(c["a"].Item,{label:"\u914d\u7f6e",style:{margin:8}},v("fcSystem",{initialValue:""})(E.a.createElement(n["a"],{style:{width:180},placeholder:"\u8bf7\u9009\u62e9\u4f7f\u7528\u54ea\u4e2a\u670d\u52a1\u7684\u914d\u7f6e"},f.CheckConfig.map(e=>E.a.createElement(n["a"].Option,{value:e.value},e.key)))))," ",E.a.createElement("br",null)),E.a.createElement("div",{className:"button-list"},E.a.createElement(r["a"],{type:"primary",onClick:()=>J()},"\u67e5\u8be2"),E.a.createElement(r["a"],{onClick:()=>q()},"\u91cd\u7f6e"),E.a.createElement(r["a"],{className:"pack",onClick:()=>B()},M?"\u6536\u8d77":"\u5c55\u5f00"))),E.a.createElement("h4",{style:{marginBottom:"20px"}},"\u8fc7\u6ee4\u51fa \uff1a ",E.a.createElement("span",{style:{color:"#1890ff"}},s.length)," \u6761\u6587\u7ae0"),E.a.createElement(l["a"],{columns:Y,loading:j,dataSource:s})))}),v=c["a"].create({name:"Check_other"})(x);a["default"]=Object(k["c"])(e=>{var a=e.rule;return{rule:a}})(v)},"s6c/":function(e,a,t){}}]);