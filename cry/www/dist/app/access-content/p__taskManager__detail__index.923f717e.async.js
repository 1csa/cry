(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{wgFT:function(e,t,a){"use strict";a.r(t);a("YdMF");var n=a("dVZ9"),r=(a("qXJo"),a("rAmn")),c=(a("zI7Q"),a("SCaQ")),l=(a("oeo2"),a("BmDy")),i=(a("Jrc2"),a("J1A8")),s=(a("zAnB"),a("cUST")),u=a("Z32k"),o=a.n(u),d=(a("IJu9"),a("DuHN")),m=a("JCfe"),p=a.n(m),_=a("JGaj"),y=a.n(_),v=a("maMK"),k=a.n(v),f=a("ERkP"),w=a.n(f),E=a("EUZL"),h=a.n(E),x=a("uDfI"),I=a("wgY5"),g=a.n(I),b=a("n/bh"),j=a("U60H"),D=a("fcGt"),S=e=>{var t=e.location,a=e.user,u=e.dispatch,m=t.query.id,_=t.query.status,v={count:b["m"],page:1,parent_task_id:m,task_id:""},E=Object(f["useState"])(),x=k()(E,2),I=x[0],S=x[1],C=Object(f["useState"])(0),O=k()(C,2),J=O[0],T=O[1],M=Object(f["useState"])(!1),Y=k()(M,2),A=Y[0],H=Y[1],L=Object(f["useState"])(""),U=k()(L,2),z=U[0],F=U[1],q=Object(f["useState"])(null),Z=k()(q,2),B=Z[0],G=Z[1];Object(f["useEffect"])(()=>{N()},[m]);var K=e=>{v["page"]=e,N()},N=function(){var e=y()(o.a.mark(function e(){var t,a,n,r,c,l;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return H(!0),e.next=3,u({type:"TaskList/searchChildTask",payload:p()({},v)});case 3:t=e.sent,a=t.code,n=t.reason,r=t.tasks,c=t.total,B=r&&r[0],G(p()({},B)),l=r&&r.map(e=>{var t=Object.assign({},e.template);return t.all_count=e.all_count,t.count_yesterday=e.count_yesterday,t.count_7days=e.count_7days,t.storage_count=e.storage_count,t.id=e.id,t.status=e.status,t.use_status=e.use_status,t.error=e.error,t.error_timestamp=e.error_timestamp,t}),0===a?(T(c),S(l)):d["a"].info("\u5b50\u4efb\u52a1\u83b7\u53d6\u5931\u8d25,\u7a0d\u540e\u91cd\u8bd5; ".concat(n)),H(!1);case 13:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),Q=function(){var e=y()(o.a.mark(function e(t,n){var r,c,l,i,s,m,p;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(r=a.currentUser,c=void 0===r?{}:r,l=c.email||c.name||null,l){e.next=5;break}return console.error("operator: {operator}\u4e3a\u7a7a, \u7981\u6b62\u64cd\u4f5c"),e.abrupt("return");case 5:return i={task_id:t,use_status:n,operator:l,reason:""},e.next=8,u({type:"TaskList/setTaskStatus",payload:i});case 8:s=e.sent,m=s.code,p=s.reason,0===m?(d["a"].success("\u64cd\u4f5c\u6210\u529f!"),N()):d["a"].info("\u64cd\u4f5c\u5931\u8d25,\u8bf7\u7a0d\u540e\u91cd\u8bd5! ".concat(p));case 12:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}(),P=function(){var e=y()(o.a.mark(function e(){return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:v["task_id"]=z,N();case 2:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),R=[{title:"\u5b50\u4efb\u52a1ID",dataIndex:"id",key:"id",render:(e,t)=>{return w.a.createElement(j["Link"],{to:"/taskManager/detail/docs?id=".concat(e,"&status=").concat(t["use_status"])},e)}},{title:"\u8d26\u53f7/\u8bdd\u9898/\u5173\u952e\u8bcd/doc",render:(e,t)=>{return t["crawler_name"]||t["crawler_url"]}},{title:"\u9a6c\u7532\u53f7",dataIndex:"media_name",key:"media_name",render:(e,t)=>{return w.a.createElement("div",null,w.a.createElement("div",null,e),w.a.createElement("div",null,t["media_id"]?"UID: ".concat(t["media_id"]):""))}},{title:"\u8bdd\u9898",dataIndex:"talk_name",key:"talk_name",render:(e,t)=>{return w.a.createElement("div",null,w.a.createElement("div",null,e),w.a.createElement("div",null,t["talk_id"]?"\u8bdd\u9898ID: ".concat(t["talk_id"]):""))}},{title:"\u57ce\u5e02",dataIndex:"cityname",key:"cityname",render:(e,t)=>{return w.a.createElement("div",null,w.a.createElement("div",null,e),w.a.createElement("div",null,t["city_id"]?"\u57ce\u5e02ID: ".concat(t["city_id"]):""))}},{title:"\u81ea\u5b9a\u4e49",dataIndex:"self",key:"self"},{title:"\u4e2a\u6027\u5316\u8fc7\u6ee4\u6761\u4ef6",dataIndex:"filter",key:"filter"},{title:"\u6570\u91cf",dataIndex:"all_count",key:"all_count"},{title:"\u6628\u65e5\u6293\u53d6\u91cf",dataIndex:"count_yesterday",key:"count_yesterday"},{title:"7\u65e5\u6293\u53d6\u91cf",dataIndex:"count_7days",key:"count_7days"},{title:"\u5165\u5e93\u91cf",dataIndex:"storage_count",key:"storage_count"},{title:"\u72b6\u6001",dataIndex:"use_status",key:"use_status",render:(e,t)=>w.a.createElement("span",null,b["w"][e])},{title:"\u539f\u56e0",dataIndex:"error",key:"error",width:60},{title:"\u51fa\u73b0\u65f6\u95f4",dataIndex:"error_timestamp",key:"error_timestamp",width:100,render:e=>e?g()(1e3*e).format("YYYY-MM-DD HH:MM:SS"):""},{title:"\u64cd\u4f5c",dataIndex:"Action",key:"Action",width:120,render:(e,t)=>{var a=t["use_status"],n=w.a.createElement("a",{onClick:()=>Q(t["id"],b["v"][1])},b["w"][1]),r=w.a.createElement("a",{onClick:()=>Q(t["id"],b["v"][2])},b["w"][2]);return-1===b["v"].indexOf(a)?w.a.createElement(w.a.Fragment,null,n,w.a.createElement(s["a"],{type:"vertical"}),r):a===b["v"][1]?r:n}}],V={defaultCurrent:b["l"],pageSize:b["m"],onChange:K,total:J};function W(e){return e/60/60/24}function X(e,t,a){if(!a)return e&&e[t];if("crawl_time"===t&&e&&e[t]){var n=e[t],r=n.duanneirong,c=n.news,l=n.video;return"\u56fe\u6587".concat(W(c),"\u5929 \u89c6\u9891").concat(W(l),"\u5929 \u77ed\u5185\u5bb9").concat(W(r),"\u5929")}return e&&e[t]&&a[e[t]]}var $=function(){var e=y()(o.a.mark(function e(t){var a,n,r,c,l;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,u({type:"TaskList/searchChildTask",payload:{parent_task_id:m,count:1e4}});case 3:a=e.sent,n=a.code,a.reason,r=a.tasks,a.total,0===n?(c=r&&r.map(e=>e["template"]),l=h.a.utils.json_to_sheet(c),Object(D["b"])(Object(D["c"])(l,void 0),"\u4e3b\u4efb\u52a1ID-".concat(m,".xlsx"))):console.info("\u6570\u636e\u83b7\u53d6\u5931\u8d25");case 9:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}();return w.a.createElement(w.a.Fragment,null,w.a.createElement("div",{className:"main-content"},w.a.createElement(i["a"],{title:"\u4e3b\u4efb\u52a1id: ".concat(m,", \u72b6\u6001: ").concat(b["r"][_]||"\u672a\u77e5\u72b6\u6001"," ")}),w.a.createElement("div",{style:{display:"flex",justifyContent:"space-between",width:"100%",lineHeight:"50px",flexWrap:"wrap"}},w.a.createElement("div",null,w.a.createElement("strong",null,"\u8be6\u60c5: ")),w.a.createElement("div",null,"\u5e73\u53f0: ",X(B,"platform")," "),w.a.createElement("div",null,"\u5185\u5bb9\u7c7b\u578b: ",X(B,"content_type",b["d"])," "),w.a.createElement("div",null,"\u6293\u53d6\u65b9\u5f0f: ",X(B,"crawl_type",b["g"])," "),w.a.createElement("div",null,"\u662f\u5426\u6293\u53d6\u8bc4\u8bba: ",X(B,"is_crawl_comment",b["k"])," "),w.a.createElement("div",null,"\u6293\u53d6\u91cf\u7ea7: ",X(B,"crawl_mode",b["f"])," "),w.a.createElement("div",null,"\u6293\u53d6\u65f6\u95f4: ",X(B,"crawl_time",b["d"])," "),w.a.createElement("div",null,"\u5bfc\u5165\u8d26\u53f7: ",X(B,"import_account",b["j"])," "),w.a.createElement("a",{onClick:$},"\u6587\u4ef6\u4e0b\u8f7d")),w.a.createElement("div",null,"\u641c\u7d22\u6761\u4ef6:\xa0\u5b50\u4efb\u52a1ID: ",w.a.createElement(l["a"],{placeholder:"\u8bf7\u8f93\u5165\u5b50\u4efb\u52a1ID",onChange:e=>F(e.target.value),value:z,style:{width:"200px"}})," \xa0",w.a.createElement(c["a"],{onClick:P,type:"primary"},"\u67e5\u8be2")),w.a.createElement(s["a"],null,w.a.createElement("span",{style:{fontSize:10}},"\u5217\u8868\u533a\u57df")),w.a.createElement(r["a"],{spinning:A},w.a.createElement(n["a"],{columns:R,pagination:V,dataSource:I,rowKey:"id"}))))};t["default"]=Object(x["c"])(e=>{var t=e.user;return{user:t}})(S)}}]);