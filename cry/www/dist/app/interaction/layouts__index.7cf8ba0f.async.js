(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{"+ego":function(e,a,t){"use strict";t.r(a);var n=t("ERkP"),l=t.n(n),r=(t("qXJo"),t("rAmn")),o=t("uDfI"),c=(t("oBUM"),()=>{var e="//pandora.yidian-inc.com/tools/admin/login",a=location.href;location.href="".concat(e,"?callback=").concat(a)}),i=e=>{var a=e.children,t=e.user,o=e.dispatch,i=t.currentUser,s=i&&i.isAuthing,m=i&&i.email,u=!m&&!s;return Object(n["useEffect"])(()=>{o({type:"user/fetchCurrent"}),o({type:"auth/fetchAuth"})},[]),console.log(m,s,u),l.a.createElement(l.a.Fragment,null,m?a:u?c():l.a.createElement("div",{className:"page-loading"},l.a.createElement(r["a"],{size:"large",spinning:s})))},s=Object(o["c"])(e=>{var a=e.user,t=e.auth;return{user:a,auth:t}})(i),m=(t("OuEz"),t("nEO1")),u=(t("DoiJ"),t("9xBf")),d=(t("b69p"),t("5oqr")),p=(t("oosw"),t("/Oqt")),h=(t("TPNu"),t("VogX")),g=(t("DjZ7"),t("S0yW")),E=t("daAW"),y=t("O94r"),b=t.n(y),k={appId:"interaction",appName:"\u4e92\u52a8\u8fd0\u8425\u5e73\u53f0",logo:"http://si1.go2yd.com/get-image/0ZAJxXeZ6iu",menus:[{key:"/",name:"\u4eba\u5de5\u5e72\u9884",icon:"control",subMenu:[{key:"/fans",name:"\u8d26\u53f7\u7c89\u4e1d\u6570",icon:"user",subMenu:[{key:"/query_fans",name:"\u67e5\u8be2\u7c89\u4e1d\u6570",icon:"bulb"},{key:"/follow_media",name:"\u4e00\u952e\u6da8\u7c89",icon:"to-top"},{key:"/auto_fans",name:"\u81ea\u52a8\u6da8\u7c89",icon:"switcher"},{key:"/timing_fans",name:"\u5b9a\u65f6\u5b9a\u91cf\u6da8\u7c89",icon:"switcher"}]},{key:"/like_news",name:"\u6587\u7ae0\u70b9\u8d5e\u6570",icon:"file-text"},{key:"/like_comment",name:"\u8bc4\u8bba\u70b9\u8d5e\u6570",icon:"message"},{key:"/play_times",name:"\u89c6\u9891\u5185\u5bb9\u64ad\u653e\u6570",icon:"play-circle"},{key:"/tui_switch",name:"\u63a8\u4e00\u63a8\u5f00\u5173",icon:"rocket"}]}],layout:{hasSidebar:!0,theme:"dark"}},f=k,w=(t("F72t"),m["a"].Header),v=g["a"].Item,N=g["a"].SubMenu,S=e=>e.map(e=>{return e.subMenu&&e.subMenu.length>0?l.a.createElement(N,{key:e.key,title:l.a.createElement("span",null,l.a.createElement(h["a"],{type:e.icon}),l.a.createElement("span",null,e.name))},S(e.subMenu)):l.a.createElement(v,{key:e.key},l.a.createElement(E["Link"],{to:e.key},l.a.createElement(h["a"],{type:e.icon}),l.a.createElement("span",null,e.name)))});class x extends l.a.Component{render(){var e=this.props,a=this.props.currentUser,t=void 0===a?{}:a,n=l.a.createElement(g["a"],{className:"action-menu-dropdown"},l.a.createElement(v,null,l.a.createElement(h["a"],{type:"mail"}),t.email),l.a.createElement(g["a"].Divider,null),l.a.createElement(v,null,l.a.createElement(h["a"],{type:"rollback"}),l.a.createElement("a",{href:"//pandora.yidian-inc.com"},"\u8fd4\u56de Pandora \u5de5\u5177\u5e73\u53f0"))),r=b()({"global-header":!0,"global-header-dark":"dark"===this.props.theme,"global-header-light":"light"===this.props.theme});return l.a.createElement(w,{className:r},l.a.createElement("div",{className:"global-header-inner"},l.a.createElement("div",{className:"logo"},l.a.createElement(E["Link"],{to:"/"},f.logo?l.a.createElement("img",{src:f.logo.toString(),alt:""}):null,l.a.createElement("h1",null,f.appName))),l.a.createElement(g["a"],{className:"main-menu",theme:this.props.theme,mode:"horizontal",defaultSelectedKeys:e.defaultSelectedKeys},S(f.menus)),l.a.createElement("div",{className:"action-menus"},l.a.createElement(p["a"],{className:"action-menu",overlay:n},l.a.createElement("span",null,l.a.createElement(d["a"],{size:"small",src:t.avatar||"//s.go2yd.com/a/thead_meiguoduizhang.png"}),l.a.createElement("span",null,t.name))),f.helpDoc?l.a.createElement(u["a"],{placement:"bottom",title:"\u4f7f\u7528\u6587\u6863"},l.a.createElement("a",{className:"action-menu",href:f.helpDoc,target:"__blank"},l.a.createElement(h["a"],{type:"question-circle"}))):null)))}}var _=Object(o["c"])(e=>({currentUser:e.user.currentUser}))(x),M=(t("wNoj"),m["a"].Footer),D=()=>{return l.a.createElement(M,{className:"global-footer"},(new Date).getFullYear()," @ \u4e00\u70b9\u8d44\u8baf")},O=D;function z(e){var a=new RegExp("/app/".concat(e,"(/(w*))?")),t=location.pathname.replace(a,"$1");t.endsWith("/")&&(t=t.substring(0,t.length-1));var n=t.split("/");return n=n.length>=2?n.filter(e=>""!==e).map(e=>"/".concat(e)):["/"],{original:t,splited:n}}t("W660");var j=z(f.appId).splited,I=m["a"].Content;class U extends n["Component"]{constructor(){super(...arguments),this.state={collapsed:!1},this.toggleSider=(()=>{this.setState({collapsed:!this.state.collapsed})})}render(){return l.a.createElement(m["a"],{className:"basic-layout"},l.a.createElement(_,{defaultSelectedKeys:j,theme:this.props.theme,collapsed:this.state.collapsed,toggleSider:this.toggleSider}),l.a.createElement(I,{className:"basic-layout-content"},this.props.children),l.a.createElement(O,null))}}var q=U,C=(t("h3zL"),m["a"].Header),K=g["a"].Item,L=e=>{var a=e.user.currentUser,t=void 0===a?{}:a,n=l.a.createElement(g["a"],{className:"action-menu-dropdown"},l.a.createElement(K,null,l.a.createElement(h["a"],{type:"mail"}),t.email),l.a.createElement(g["a"].Divider,null),l.a.createElement(K,null,l.a.createElement(h["a"],{type:"rollback"}),l.a.createElement("a",{href:"/"},"\u8fd4\u56de Pandora \u5de5\u5177\u5e73\u53f0")));return l.a.createElement(C,{className:"global-header"},l.a.createElement(h["a"],{className:"sider-trigger",type:e.collapsed?"menu-unfold":"menu-fold",onClick:e.toggleSider}),l.a.createElement("div",{className:"action-menus"},l.a.createElement(p["a"],{className:"action-menu",overlay:n},l.a.createElement("span",null,l.a.createElement(d["a"],{size:"small",src:t.avatar||"//s.go2yd.com/a/thead_meiguoduizhang.png"}),l.a.createElement("span",null,t.name))),f.helpDoc?l.a.createElement(u["a"],{placement:"bottom",title:"\u4f7f\u7528\u6587\u6863"},l.a.createElement("a",{className:"action-menu",href:f.helpDoc,target:"__blank"},l.a.createElement(h["a"],{type:"question-circle"}))):null))},A=Object(o["c"])(e=>{var a=e.user;return{user:a}})(L),F=(t("l7QO"),m["a"].Sider),J=g["a"].Item,W=g["a"].SubMenu,P=e=>e.map(e=>{return e.subMenu&&e.subMenu.length>0?l.a.createElement(W,{key:e.key,title:l.a.createElement("span",null,l.a.createElement(h["a"],{type:e.icon}),l.a.createElement("span",null,e.name))},P(e.subMenu)):l.a.createElement(J,{key:e.key},l.a.createElement(E["Link"],{to:e.key},l.a.createElement(h["a"],{type:e.icon}),l.a.createElement("span",null,e.name)))}),R=e=>{return l.a.createElement(F,{theme:e.theme,width:"260",trigger:null,collapsible:!0,collapsed:e.collapsed},l.a.createElement("div",{className:"logo"},l.a.createElement(E["Link"],{to:"/"},f.logo?l.a.createElement("img",{src:f.logo.toString(),alt:""}):null,l.a.createElement("h1",null,f.appName))),l.a.createElement(g["a"],{theme:e.theme,mode:"inline",defaultSelectedKeys:e.defaultSelectedKeys},P(f.menus)))},B=R,X=(t("5RGE"),z(f.appId).splited);class Z extends n["Component"]{constructor(){super(...arguments),this.state={collapsed:!1},this.toggleSider=(()=>{this.setState({collapsed:!this.state.collapsed})})}render(){return l.a.createElement(m["a"],{className:"sidebar-layout"},l.a.createElement(B,{defaultSelectedKeys:X,theme:this.props.theme,collapsed:this.state.collapsed}),l.a.createElement(m["a"],null,l.a.createElement(A,{collapsed:this.state.collapsed,toggleSider:this.toggleSider}),this.props.children,l.a.createElement(O,null)))}}var G=Z,H=f.layout,Q=e=>l.a.createElement(s,null,H.hasSidebar?l.a.createElement(G,{theme:H.theme},e.children):l.a.createElement(q,{theme:H.theme},e.children));a["default"]=Q},"5RGE":function(e,a,t){e.exports={"sidebar-layout":"sidebar-layout","main-content":"main-content","main-content-with-page-header":"main-content-with-page-header","sider-trigger":"sider-trigger"}},F72t:function(e,a,t){e.exports={"basic-layout":"basic-layout","global-header":"global-header","global-header-inner":"global-header-inner",logo:"logo","main-menu":"main-menu","ant-menu-item":"ant-menu-item","action-menus":"action-menus","action-menu":"action-menu","ant-avatar":"ant-avatar","global-header-dark":"global-header-dark","ant-menu-item-selected":"ant-menu-item-selected","global-header-light":"global-header-light","action-menu-dropdown":"action-menu-dropdown","ant-dropdown-menu-item":"ant-dropdown-menu-item"}},W660:function(e,a,t){e.exports={"basic-layout-content":"basic-layout-content","page-header":"page-header","main-content":"main-content","main-content-with-page-header":"main-content-with-page-header","sider-trigger":"sider-trigger"}},h3zL:function(e,a,t){e.exports={"sidebar-layout":"sidebar-layout","global-header":"global-header","action-menus":"action-menus","action-menu":"action-menu","ant-avatar":"ant-avatar","action-menu-dropdown":"action-menu-dropdown","ant-dropdown-menu-item":"ant-dropdown-menu-item"}},l7QO:function(e,a,t){e.exports={"ant-layout-sider":"ant-layout-sider",logo:"logo","ant-layout-sider-light":"ant-layout-sider-light"}},oBUM:function(e,a,t){e.exports={"page-loading":"page-loading"}},wNoj:function(e,a,t){e.exports={"global-footer":"global-footer"}}}]);