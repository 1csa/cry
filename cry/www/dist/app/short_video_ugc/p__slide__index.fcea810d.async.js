(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{RD6x:function(e,t,a){"use strict";a.r(t);a("zAnB");var n=a("cUST"),l=(a("zI7Q"),a("SCaQ")),r=(a("qXJo"),a("rAmn")),i=(a("M6c6"),a("jMRu")),s=(a("IJu9"),a("DuHN")),c=a("maMK"),d=a.n(c),u=a("ERkP"),o=a.n(u),p=a("uDfI"),m=a("30KE");a("tDq5");function f(e){for(var t=0;t<e.length;++t){var a=e[t];if(!a.url||!a.id)return!0}return!1}var E=e=>{e.children;var t=e.dispatch,a=e.slideState;Object(u["useEffect"])(()=>{setTimeout(()=>{t({type:"slide/fetchSlides"})},1e3)},[]),Object(u["useEffect"])(()=>{v([...a.slides])},[a.slides]);var c=Object(u["useState"])(a.slides),p=d()(c,2),E=p[0],v=p[1],y=()=>{var e={id:"",url:""};E.push(e),v([...E])},h=(e,t)=>{E[t]=e},S=e=>{E.splice(e,1),v([...E])},b=()=>{f(E)?s["a"].error("\u8f6e\u64ad\u56fe\u914d\u7f6e\u6709\u7a7a\u9879!"):t({type:"slide/addSlides",payload:{data:E}})};return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"main-content"},o.a.createElement(i["a"],{bordered:!1},o.a.createElement(r["a"],{tip:"\u52a0\u8f7d\u4e2d...",spinning:a.loading},o.a.createElement(l["a"],{type:"primary",onClick:y},"\u6dfb\u52a0"),"\xa0",E.length>0?o.a.createElement(l["a"],{type:"primary",onClick:b},"\u4fdd\u5b58"):null,o.a.createElement(n["a"],null,o.a.createElement("span",{style:{fontSize:"10px"}},"\u6dfb\u52a0\u5b8c\u6210\u540e\u4fdd\u5b58")),E.map((e,t)=>o.a.createElement(m["default"],{className:"slide",key:t,defaultValue:e,index:t,onChange:e=>h(e,t),onDelete:()=>S(t)}))))))};t["default"]=Object(p["c"])(e=>{var t=e.slide;return{slideState:t}})(E)},tDq5:function(e,t,a){e.exports={slide:"slide"}}}]);