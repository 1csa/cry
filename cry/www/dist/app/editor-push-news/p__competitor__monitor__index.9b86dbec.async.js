(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{"71hr":function(t,e,r){t.exports={competitor:"competitor","competitor-header":"competitor-header","competitor-content":"competitor-content","ant-divider-horizontal":"ant-divider-horizontal","ant-card-body":"ant-card-body","ant-spin":"ant-spin","monitor-list":"monitor-list","competitor-screen-op":"competitor-screen-op","competitor-screen":"competitor-screen","ant-form-item":"ant-form-item","ant-calendar-picker":"ant-calendar-picker","notification-descripton":"notification-descripton","notification-message":"notification-message",label:"label",content:"content","notification-total":"notification-total"}},lJwQ:function(t,e,r){"use strict";r.r(e);r("7Kak");var n=r("9yH6"),a=(r("2qtc"),r("kLXV")),c=(r("fOrg"),r("+KLJ")),o=(r("T2oS"),r("W9HT")),i=(r("/zsF"),r("PArb")),u=(r("IzEo"),r("bx4M")),s=(r("Pwec"),r("CtXQ")),p=r("Y/ft"),l=r.n(p),d=r("p0pE"),f=r.n(d),m=(r("/xke"),r("TeRw")),h=r("d6i3"),v=r.n(h),b=r("1l/V"),w=r.n(b),y=(r("miYZ"),r("tsqr")),g=r("qIgq"),x=r.n(g),_=r("q1tI"),k=r.n(_),E=r("sxGJ"),O=r.n(E),S=r("wd/R"),j=r.n(S),R=r("CxXe"),I=r("/MKj"),C=r("c7k8"),A=r("hfLc"),N=r("0lfv"),T="YYYY-MM-DD HH:mm:ss",H={date:[j()().subtract(1,"days"),j()()],app_name:"",hotspot:"",kws:"",device_id:"",order:"desc",pub_status:"-1"},U=(j()().subtract(1,"days").format(T),j()().format(T),{id:-1,mid:"",push_title:"",push_abstract:"",push_channel:null,content_link:null,hotspot:null,app_name:"",date:"",brand:null,device_id:null,bundle_version:null,ct:null,sct:null,pub_status:0,pub_memo:"",doc_id:""}),M=r("sy1d"),P=r("ubDG");function J(t){return L.apply(this,arguments)}function L(){return L=w()(v.a.mark(function t(e){var r,n,a,c,o,i,u,s,p,l,d,f;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=e.start_date,n=e.end_date,a=e.app_name,c=e.hotspot,o=void 0===c?"":c,i=e.device_id,u=void 0===i?"":i,s=e.kws,p=void 0===s?"":s,l=e.order,d=e.pub_status,f=void 0===d?"":d,Array.isArray(a)?a=a.join(","):a||(a=""),t.abrupt("return",M["a"].get("/api/proxy/".concat(P["a"].PUSH_MANNAGER,"/content/list?start_date=").concat(encodeURIComponent(r),"&end_date=").concat(encodeURIComponent(n),"&app_name=").concat(encodeURIComponent(a),"&hotspot=").concat(encodeURIComponent(o),"&device_id=").concat(encodeURIComponent(u),"&kws=").concat(encodeURIComponent(p),"&order=").concat(l,"&pub_status=").concat(f)));case 3:case"end":return t.stop()}},t)})),L.apply(this,arguments)}function Y(t,e,r){return z.apply(this,arguments)}function z(){return z=w()(v.a.mark(function t(e,r,n){return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",M["a"].get("/api/proxy/".concat(P["a"].NEW_PUSH_API_HOST,"/case/set-crawl-hotspot?id=").concat(e,"&mid=").concat(r,"&hotspot=").concat(n)));case 1:case"end":return t.stop()}},t)})),z.apply(this,arguments)}function G(){return q.apply(this,arguments)}function q(){return q=w()(v.a.mark(function t(){var e,r=arguments;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=r.length>0&&void 0!==r[0]?r[0]:0,t.next=3,M["a"].get("/api/proxy/".concat(P["a"].PUSH_MANNAGER,"/content/list?last_id=").concat(e,"&order=desc"));case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}},t)})),q.apply(this,arguments)}function D(){return F.apply(this,arguments)}function F(){return F=w()(v.a.mark(function t(){var e,r=arguments;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=r.length>0&&void 0!==r[0]?r[0]:[],t.next=3,M["a"].post("/api/proxy/".concat(P["a"].PUSH_MANNAGER,"/content/check"),{data:e});case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}},t)})),F.apply(this,arguments)}var K=r("gzwA"),X=r("6zhC"),Q=r("pOK/"),V=r("cpmi");r("71hr");function W(t,e){var r;if("undefined"===typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=Z(t))||e&&t&&"number"===typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,o=!0,i=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return o=t.done,t},e:function(t){i=!0,c=t},f:function(){try{o||null==r.return||r.return()}finally{if(i)throw c}}}}function Z(t,e){if(t){if("string"===typeof t)return $(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?$(t,e):void 0}}function $(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var B=()=>{var t=Object(_["useState"])(""),e=x()(t,2),r=e[0],p=e[1],d=Object(_["useState"])(!1),h=x()(d,2),b=h[0],g=h[1],E=Object(_["useState"])(U),S=x()(E,2),M=S[0],P=S[1],L=Object(_["useState"])(H),z=x()(L,2),q=z[0],F=z[1],Z=Object(_["useState"])(-1),$=x()(Z,2),B=$[0],tt=$[1],et=Object(_["useState"])(!1),rt=x()(et,2),nt=rt[0],at=rt[1],ct=Object(R["k"])(),ot=Object(I["d"])(),it=Object(_["useRef"])(null),ut=Object(_["useRef"])([]),st=Object(_["useRef"])(-1),pt=Object(_["useRef"])([]),lt=Object(_["useRef"])(),dt=Object(_["useRef"])();Object(_["useEffect"])(()=>{q&&Ot(q)},[]),Object(_["useEffect"])(()=>{return lt.current=setInterval(()=>{Rt().then(t=>yt(t),t=>y["a"].error(t.toString()))},6e4),()=>{lt.current||clearInterval(lt.current)}},[]),Object(_["useEffect"])(()=>{return dt.current=setInterval(()=>{It().then(t=>gt(t),t=>y["a"].error(t.toString()))},6e4),()=>{dt.current||clearInterval(dt.current)}},[]),Object(_["useEffect"])(()=>{p((null===M||void 0===M?void 0:M.hotspot)?M.hotspot:"")},[null===M||void 0===M?void 0:M.hotspot]);var ft=function(){var t=w()(v.a.mark(function t(e){return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:Object(K["a"])({page:"push_competitor_monitor",action_id:"search"}),F(e),St(e);case 3:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}(),mt=t=>{var e=document.createElement("button"),r=new O.a(e,{text:()=>t});r.on("success",function(){y["a"].success("\u590d\u5236\u6210\u529f")}),r.on("error",function(){y["a"].error("\u590d\u5236\u5931\u8d25")}),e.click(),r.destroy()},ht=t=>{if(!t)return y["a"].error("\u8be5\u6761push\u5c1a\u672a\u5165\u5e93\uff0c\u8bf7\u6838\u5b9e\u540e\u70b9\u51fb");ct.push("/push/editor"),ot({type:"editorpush/fetchDocInfo",payload:{docid:t}})},vt=()=>{tt(-1)},bt=t=>{P(t),g(!0)},wt=function(){var t=w()(v.a.mark(function t(){var e,n,a,c,o;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=M.id,n=M.mid,a=void 0===n?"":n,t.next=3,Y(e,a,r);case 3:c=t.sent,o=c.status,"success"===o?(y["a"].success("\u8bbe\u7f6e\u70ed\u70b9\u6210\u529f!"),g(!1),ut.current=ut.current.map(t=>{return t.id===e&&(t.hotspot=r),t})):y["a"].error("\u8bbe\u7f6e\u70ed\u70b9\u5931\u8d25!");case 6:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}(),yt=function(){var t=w()(v.a.mark(function t(e){var r,n,a,c,o;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.length,0!==n){t.next=3;break}return t.abrupt("return");case 3:m["a"].open({key:"total_noti",duration:5,message:k.a.createElement(V["NotiTotal"],{total:n}),style:{width:520,marginLeft:-132},onClick:_t}),a=W(e.slice(-5)),t.prev=5,o=v.a.mark(function t(){var e,r,n,a,o,i;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=c.value,r=e.push_title,n=e.push_abstract,a=e.app_name,o=e.date,i=e.id,t.next=4,m["a"].open({duration:5,message:k.a.createElement(V["NotiMessage"],{title:r}),description:k.a.createElement(V["NotiDescription"],{summary:n,app:a,date:o}),style:{width:520,marginLeft:-132},onClick:()=>xt(i)});case 4:case"end":return t.stop()}},t)}),a.s();case 8:if((c=a.n()).done){t.next=12;break}return t.delegateYield(o(),"t0",10);case 10:t.next=8;break;case 12:t.next=17;break;case 14:t.prev=14,t.t1=t["catch"](5),a.e(t.t1);case 17:return t.prev=17,a.f(),t.finish(17);case 20:st.current=null===(r=e.slice(-1)[0])||void 0===r?void 0:r.id;case 21:case"end":return t.stop()}},t,null,[[5,14,17,20]])}));return function(e){return t.apply(this,arguments)}}(),gt=t=>{if(0!==ut.current.length){var e=t.filter(t=>1===t.pub_status).map(t=>t.id);ut.current=ut.current.map(t=>e.includes(t.id)?f()({},t,{pub_status:1}):t)}},xt=function(){var t=w()(v.a.mark(function t(e){var r,n,a,c,o;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!Object(N["d"])(e)){t.next=2;break}return t.abrupt("return",y["a"].error("\u5f53\u524d\u722c\u53d6\u5185\u5bb9\u6ca1\u6709id"));case 2:return at(!0),r=kt(),t.prev=4,t.next=7,jt(r);case 7:if(a=t.sent,c=a.findIndex(t=>t.id===e),o=a.filter(t=>0===t.pub_status).map(t=>t.id),pt.current=o,st.current=null===(n=a[0])||void 0===n?void 0:n.id,ut.current=a,F(r),!(c>=0)){t.next=18;break}tt(100*c),t.next=20;break;case 18:throw tt(100),new Error("\u65b0\u5217\u8868\u4e2d\u672a\u83b7\u53d6\u5230\u5bf9\u5e94\u7684\u722c\u53d6\u9879");case 20:t.next=25;break;case 22:t.prev=22,t.t0=t["catch"](4),y["a"].error(t.t0.toString()||"\u83b7\u53d6\u65b0\u7684\u76d1\u63a7\u5217\u8868\u5931\u8d25");case 25:return t.prev=25,setTimeout(()=>at(!1),500),t.finish(25);case 28:case"end":return t.stop()}},t,null,[[4,22,25,28]])}));return function(e){return t.apply(this,arguments)}}(),_t=()=>{var t=kt();F(t),Ot(t)},kt=()=>{var t=j()().subtract(1,"days"),e=j()();return f()({},q,{date:[t,e]})},Et=t=>{var e=t.date,r=t.pub_status,n=l()(t,["date","pub_status"]),a=JSON.parse(JSON.stringify(n));return a.start_date=j()(e[0]).format(T),a.end_date=j()(e[1]).format(T),!1===Object(N["k"])(r)&&+r>=0&&(a.pub_status=r),a},Ot=t=>{at(!0),jt(t).then(t=>{var e,r=t.filter(t=>0===t.pub_status).map(t=>t.id);pt.current=r,ut.current=t,st.current=null===(e=t[0])||void 0===e?void 0:e.id},t=>y["a"].error(t.toString())).finally(()=>setTimeout(()=>at(!1),500))},St=t=>{at(!0),jt(t).then(t=>ut.current=t,t=>y["a"].error(t.toString())).finally(()=>setTimeout(()=>at(!1),500))},jt=function(){var t=w()(v.a.mark(function t(e){var r,n,a,c,o,i;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r=Et(e),t.next=3,J(r);case 3:if(n=t.sent,a=n.code,c=n.data,o=n.msg,i=void 0===o?"\u83b7\u53d6\u76d1\u63a7\u5217\u8868\u5931\u8d25":o,200!==a){t.next=12;break}return t.abrupt("return",c);case 12:throw new Error(i);case 13:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}(),Rt=function(){var t=w()(v.a.mark(function t(){var e,r,n,a,c;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!(st.current<0)){t.next=2;break}return t.abrupt("return",[]);case 2:return t.next=4,G(st.current);case 4:if(e=t.sent,r=e.code,n=e.data,a=e.msg,c=void 0===a?"\u83b7\u53d6\u65b0\u7684\u722c\u53d6\u6570\u636e\u5931\u8d25":a,200!==r){t.next=13;break}return t.abrupt("return",n);case 13:throw new Error(c);case 14:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}(),It=function(){var t=w()(v.a.mark(function t(){var e,r,n,a,c;return v.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!Object(N["d"])(pt.current)){t.next=2;break}return t.abrupt("return",[]);case 2:return t.next=4,D(pt.current);case 4:if(e=t.sent,r=e.code,n=e.data,a=e.msg,c=void 0===a?"\u83b7\u53d6\u6587\u7ae0\u66f4\u65b0\u636e\u5931\u8d25":a,200!==r){t.next=13;break}return t.abrupt("return",n);case 13:throw new Error(c);case 14:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}();return k.a.createElement("div",{className:"competitor"},k.a.createElement("section",{className:"competitor-header"},k.a.createElement(s["a"],{type:"bar-chart"}),k.a.createElement("span",null,"\u7ade\u54c1Push\u76d1\u63a7")),k.a.createElement(u["a"],{className:"competitor-content"},k.a.createElement(X["ScreenForm"],{screen:q,onConfirm:ft}),k.a.createElement(i["a"],null),k.a.createElement("div",{className:"monitor-list",ref:it},nt?k.a.createElement(o["a"],null):k.a.createElement(C["b"],{scrollElement:it.current?it.current:void 0,onScroll:vt},t=>{var e=t.height,r=t.width,n=t.scrollTop,a=t.onChildScroll;return k.a.createElement(k.a.Fragment,null,0===n?k.a.createElement(c["a"],{type:"info",message:k.a.createElement("span",null,"\u5171\u641c\u7d22\u5230 ",ut.current.length," \u6761\u7ed3\u679c")}):null,k.a.createElement(C["a"],{autoHeight:!0,width:r,height:e,scrollTop:B>=0?B:n,overscanRowCount:2,rowCount:ut.current.length,rowHeight:100,noRowsRenderer:()=>k.a.createElement("span",null,"\u6682\u65e0\u6570\u636e"),rowRenderer:t=>k.a.createElement(Q["ListItem"],Object.assign({},t,{monitorList:ut.current,onCopyText:mt,onFastPush:ht,onSetHotpop:bt})),scrollToAlignment:"start",onScroll:a}))})),k.a.createElement(a["a"],{title:"\u8bbe\u7f6e\u70ed\u70b9\u7c7b\u578b",visible:b,width:600,onOk:wt,onCancel:()=>g(!1)},k.a.createElement(n["a"].Group,{value:r,onChange:t=>p(t.target.value)},Object(N["n"])(A["i"])))))};e["default"]=B}}]);