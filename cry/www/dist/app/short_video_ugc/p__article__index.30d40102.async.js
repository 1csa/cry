(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{"Hq/4":function(e,t,a){"use strict";a.r(t);a("zAnB");var n=a("cUST"),r=(a("zI7Q"),a("SCaQ")),c=(a("qXJo"),a("rAmn")),i=a("Z32k"),o=a.n(i),l=(a("IJu9"),a("DuHN")),s=a("JGaj"),u=a.n(s),d=a("maMK"),p=a.n(d),m=a("ERkP"),f=a.n(m),v=a("uDfI"),y=a("F7zw"),k=a("l8kx"),h=(a("cuar"),a("t2+N")),E=e=>{var t=e.docState,a=e.dispatch,i=e.location,s=i.query.id,d=i.query.name,v=t.isDirty,E=Object(m["useState"])([]),w=p()(E,2),b=w[0],S=w[1],x=Object(m["useState"])([]),g=p()(x,2),j=g[0],O=g[1],z=Object(m["useState"])(!1),N=p()(z,2),_=N[0],D=N[1],J=Object(m["useState"])(!1),q=p()(J,2),C=q[0],T=q[1];Object(m["useEffect"])(()=>{F("sticky"),F("normal")},[s]),Object(m["useEffect"])(()=>{v&&(T(!0),setTimeout(()=>{F("sticky"),F("normal")},2e3))},[v]);var F=function(){var e=u()(o.a.mark(function e(t){var n,r,c,i;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return T(!0),e.next=3,a({type:"doc/getDocs",payload:{type:t,talk_id:s,num:100}});case 3:n=e.sent,r=n.status,c=n.result,i=n.reason,"failed"===r&&l["a"].error("\u6570\u636e\u52a0\u8f7d\u5931\u8d25!".concat(i)),"success"===r&&("sticky"===t&&O([...c]),"normal"===t&&S([...c])),T(!1);case 10:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),I=e=>{return void 0!==j.find(t=>t.docid===e.docid)},R=function(){var e=u()(o.a.mark(function e(t){return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!I(b[t])){e.next=2;break}return e.abrupt("return",l["a"].info("\u8bf7\u52ff\u91cd\u590d\u6dfb\u52a0!"));case 2:H(t);case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),A=(e,t)=>{e>=j.length&&(e=j.length),H(t,e)},H=function(){var e=u()(o.a.mark(function e(t,n){var r,c,i,u;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r={talk_id:s,docid:b[t]&&b[t].docid},(n||void 0!==n)&&(r["idx"]=n,r["docid"]=j[t].docid),e.next=4,a({type:"doc/docSticky",payload:r});case 4:if(c=e.sent,i=c.status,u=c.reason,"failed"!==i){e.next=10;break}return l["a"].error("\u64cd\u4f5c\u5931\u8d25, ".concat(u)),e.abrupt("return");case 10:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}(),Q=(e,t)=>{Object(h["d"])(e,t).then(e=>{!0===e?(l["a"].success("\u64cd\u4f5c\u6210\u529f!"),F("normal")):l["a"].error("\u64cd\u4f5c\u5931\u8d25, \u8bf7\u7a0d\u540e\u91cd\u8bd5!")}).catch(e=>{console.log("err",e)})},U=e=>{Q(e,"delete_doc")},B=e=>{Q(e,"recover_doc")},G=function(){var e=u()(o.a.mark(function e(t,n){var r,c;return o.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,a({type:"doc/docUnSticky",payload:{talk_id:n,docid:t}});case 2:r=e.sent,c=r.status,r.reason,"success"===c?l["a"].success("\u64cd\u4f5c\u6210\u529f!"):l["a"].error("\u64cd\u4f5c\u5931\u8d25, \u8bf7\u7a0d\u540e\u91cd\u8bd5!");case 6:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}();return f.a.createElement(f.a.Fragment,null,f.a.createElement("div",{className:"main-content",style:{margin:8}},f.a.createElement(c["a"],{spinning:C,tip:"loading"},f.a.createElement("div",{className:"article-main-content"},f.a.createElement("div",null,f.a.createElement(r["a"],{type:"primary",icon:"plus",size:"small",onClick:()=>D(!0)},"\u6dfb\u52a0\u6587\u7ae0"),f.a.createElement(n["a"],null,f.a.createElement("span",{style:{fontSize:10}},"\u5f85\u7f6e\u9876\u6587\u7ae0\u5217\u8868")),b.map((e,t)=>{var a=[f.a.createElement(y["default"],{key:t,article:e,onTop:()=>R(t),onDelete:()=>U(e.docid),onRecorver:()=>B(e.docid),index:t})];return t<b.length-1&&a.push(f.a.createElement(n["a"],{dashed:!0,key:"divider".concat(t)})),a})),f.a.createElement("div",null,f.a.createElement(n["a"],null,f.a.createElement("span",{style:{fontSize:10}},"\u7f6e\u9876\u6587\u7ae0\u5217\u8868")),j.map((e,t)=>{var a=[f.a.createElement(y["default"],{index:t,key:t,article:e,onSort:e=>A(e,t),onRecorver:()=>B(e.docid),onCancelTop:()=>G(e.docid,e.talk_id)})];return t<j.length-1&&a.push(f.a.createElement(n["a"],{dashed:!0,key:"divider".concat(t)})),a})),f.a.createElement("div",{className:"content doc-preview"},f.a.createElement(n["a"],null,f.a.createElement("span",{style:{fontSize:12,color:"red"}},"\u70b9\u51fb\u6587\u7ae0\u6807\u9898\u53ef\u5728\u6b64\u680f\u9884\u89c8")),f.a.createElement("p",{className:"ifr-docid"}),f.a.createElement("iframe",{title:"doc preview iframe",id:"ifr-article",name:"ifr-article",allowFullScreen:!0})),f.a.createElement(k["default"],{visible:_,onCancel:D,id:s,name:d})))))};t["default"]=Object(v["c"])(e=>{var t=e.doc;return{docState:t}})(E)},cuar:function(e,t,a){e.exports={"article-main-content":"article-main-content","ifr-article":"ifr-article","ifr-docid":"ifr-docid"}}}]);