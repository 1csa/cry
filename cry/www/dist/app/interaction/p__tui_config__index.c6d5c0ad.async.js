(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{"3K4L":function(e,a,t){"use strict";t.r(a);t("Yx0K");var n=t("gJMY"),c=(t("53cK"),t("VKn7")),i=(t("mZxn"),t("S7b9")),r=(t("jz31"),t("8VRj")),o=(t("M6c6"),t("jMRu")),s=(t("zI7Q"),t("SCaQ")),l=t("Z32k"),g=t.n(l),u=(t("IJu9"),t("DuHN")),h=t("JGaj"),p=t.n(h),m=(t("xH0B"),t("NbVC")),d=t("ERkP"),f=t.n(d),v=t("uDfI"),y=t("ggb3"),E=t.n(y),_=t("5W1r"),C=(t("bThk"),m["a"].TabPane),w="http://operationtoolservice.go2yd.int.yidian-inc.com";class b extends d["Component"]{constructor(e){var a;super(e),a=this,this.handleUpdateTuiConfig=p()(g.a.mark(function e(){var t,n,c,i;return g.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=a.state,n=t.ugc_config,c=t.pgc_config,e.next=3,E.a.post("".concat(w,"/interact/tui-config?op=update"),{ugc_config:n,pgc_config:c});case 3:i=e.sent,0===i.data.code?(a.fetchTuiConfig(),u["a"].success("\u4fdd\u5b58\u6210\u529f")):u["a"].error("\u4fdd\u5b58\u5931\u8d25\uff1a".concat(i.data.reason)),Object(_["saveLog"])({log_source:{tag:"interaction"},action_method:"tui-config",target_data:{ugc_config:n,pgc_config:c,res:i.data}});case 6:case"end":return e.stop()}},e)})),this.handleChangeTab=(e=>{this.fetchTuiConfig()}),this.handleChangeFansRange=((e,a,t,n)=>{var c=this.state["".concat(e,"_config")];c[a].fans_count[t]=n,"ugc"===e?this.setState({ugc_config:c}):this.setState({pgc_config:c})}),this.handleChangeTuiRange=((e,a,t,n)=>{var c=this.state["".concat(e,"_config")];c[a].tui_count[t]=n,"ugc"===e?this.setState({ugc_config:c}):this.setState({pgc_config:c})}),this.handleAddLevel=(e=>{var a=this.state["".concat(e,"_config")];a.push({fans_count:[0,0],tui_count:[0,0],key:Math.random()}),"ugc"===e?this.setState({ugc_config:a}):this.setState({pgc_config:a})}),this.handleRemoveLevel=((e,a)=>{var t=this.state["".concat(e,"_config")];t.splice(a,1),"ugc"===e?this.setState({ugc_config:t}):this.setState({pgc_config:t})}),this.handleBack=(()=>{this.props.history.push("/tui_switch")}),this.state={ugc_config:[],pgc_config:[]}}fetchTuiConfig(){var e=this;return p()(g.a.mark(function a(){var t,n,c,i;return g.a.wrap(function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,E.a.post("".concat(w,"/interact/tui-config?op=get"),{});case 2:t=a.sent,0===t.data.code?(n=t.data.result,c=n.ugc_config.map(e=>{return e.key=Math.random(),e}),i=n.pgc_config.map(e=>{return e.key=Math.random(),e}),e.setState({ugc_config:c,pgc_config:i})):u["a"].error("\u83b7\u53d6\u5931\u8d25\uff1a".concat(t.data.reason));case 4:case"end":return a.stop()}},a)}))()}componentDidMount(){var e=this;return p()(g.a.mark(function a(){var t;return g.a.wrap(function(a){while(1)switch(a.prev=a.next){case 0:t=e.props.auth.currentAuth,console.log(t),(null===t||void 0===t?void 0:t.childAuths.includes("tui"))||e.props.history.push("/no_auth"),e.fetchTuiConfig();case 4:case"end":return a.stop()}},a)}))()}render(){var e=this.state,a=e.ugc_config,t=e.pgc_config,l=f.a.createElement(s["a"],{icon:"left",onClick:this.handleBack,style:{marginLeft:10}},"\u8fd4\u56de");return f.a.createElement("div",{className:"main-content-with-page-header"},f.a.createElement(o["a"],null,f.a.createElement(r["a"],null,f.a.createElement(r["a"].Item,null,"\u4eba\u5de5\u5e72\u9884"),f.a.createElement(r["a"].Item,null,"\u63a8\u4e00\u63a8\u914d\u7f6e"))),f.a.createElement(o["a"],null,f.a.createElement(m["a"],{defaultActiveKey:"ugc_config",onChange:this.handleChangeTab,tabBarExtraContent:l},f.a.createElement(C,{tab:"UGC",key:"ugc_config"},a.length>0?a.map((e,a)=>{return f.a.createElement(i["a"],{gutter:16,key:e.key,style:{marginTop:"15px",lineHeight:"32px"}},f.a.createElement(c["a"],{span:2},"\u6863\u4f4d",a+1,":"),f.a.createElement(c["a"],{span:8},f.a.createElement("span",{style:{marginRight:10}},"\u7c89\u4e1d\u6570:"),f.a.createElement(n["a"],{defaultValue:e.fans_count[0],onChange:e=>this.handleChangeFansRange("ugc",a,0,e)}),f.a.createElement("span",{style:{margin:"2px"}},"-"),f.a.createElement(n["a"],{defaultValue:e.fans_count[1],onChange:e=>this.handleChangeFansRange("ugc",a,1,e)}),f.a.createElement("span",{style:{marginLeft:"2px"}},"\u4e2a")),f.a.createElement(c["a"],{span:8},f.a.createElement("span",{style:{marginRight:10}},"\u5355\u7bc7\u63a8\u6570:"),f.a.createElement(n["a"],{defaultValue:e.tui_count[0],onChange:e=>this.handleChangeTuiRange("ugc",a,0,e)}),f.a.createElement("span",{style:{margin:"2px"}},"-"),f.a.createElement(n["a"],{defaultValue:e.tui_count[1],onChange:e=>this.handleChangeTuiRange("ugc",a,1,e)}),f.a.createElement("span",{style:{marginLeft:"2px"}},"\u63a8")),f.a.createElement(c["a"],{span:2},f.a.createElement(s["a"],{type:"danger",onClick:()=>this.handleRemoveLevel("ugc",a)},"\u5220\u9664")))}):null,f.a.createElement(i["a"],{style:{marginTop:20}},f.a.createElement(s["a"],{type:"primary",onClick:()=>this.handleAddLevel("ugc")},"\u65b0\u589e")),f.a.createElement(i["a"],{style:{marginTop:40}},f.a.createElement(s["a"],{type:"primary",onClick:this.handleUpdateTuiConfig},"\u4fdd\u5b58"))),f.a.createElement(C,{tab:"\u4e00\u70b9\u53f7",key:"pgc_config"},t.length>0?t.map((e,a)=>{return f.a.createElement(i["a"],{gutter:16,key:e.key,style:{marginTop:"15px",lineHeight:"32px"}},f.a.createElement(c["a"],{span:2},"\u6863\u4f4d",a+1,":"),f.a.createElement(c["a"],{span:8},f.a.createElement("span",{style:{marginRight:10}},"\u7c89\u4e1d\u6570:"),f.a.createElement(n["a"],{defaultValue:e.fans_count[0],onChange:e=>this.handleChangeFansRange("pgc",a,0,e)}),f.a.createElement("span",{style:{margin:"2px"}},"-"),f.a.createElement(n["a"],{defaultValue:e.fans_count[1],onChange:e=>this.handleChangeFansRange("pgc",a,1,e)}),f.a.createElement("span",{style:{marginLeft:"2px"}},"\u4e2a")),f.a.createElement(c["a"],{span:8},f.a.createElement("span",{style:{marginRight:10}},"\u5355\u7bc7\u63a8\u6570:"),f.a.createElement(n["a"],{defaultValue:e.tui_count[0],onChange:e=>this.handleChangeTuiRange("pgc",a,0,e)}),f.a.createElement("span",{style:{margin:"2px"}},"-"),f.a.createElement(n["a"],{defaultValue:e.tui_count[1],onChange:e=>this.handleChangeTuiRange("pgc",a,1,e)})),f.a.createElement(c["a"],{span:2},f.a.createElement(s["a"],{type:"danger",onClick:()=>this.handleRemoveLevel("pgc",a)},"\u5220\u9664")))}):null,f.a.createElement(i["a"],{style:{marginTop:20}},f.a.createElement(s["a"],{type:"primary",onClick:()=>this.handleAddLevel("pgc")},"\u65b0\u589e")),f.a.createElement(i["a"],{style:{marginTop:40}},f.a.createElement(s["a"],{type:"primary",onClick:this.handleUpdateTuiConfig},"\u4fdd\u5b58")))),","))}}a["default"]=Object(v["c"])(e=>{var a=e.user,t=e.auth;return{user:a,auth:t}})(b)},"5W1r":function(e,a,t){var n,c,i;(function(t,r){c=[],n=r,i="function"===typeof n?n.apply(a,c):n,void 0===i||(e.exports=i)})(0,function(){var e="http://web-rest.int.yidian-inc.com/api/v1/log-platform/log",a={pandora:{schema:"webuilog",service:"pandora"},oppobrowser:{schema:"webuilog",service:"oppobrowser"},feedback:{schema:"webuilog",service:"feedback"},www:{schema:"webuilog",service:"www"},doris:{schema:"webuilog",service:"doris"},mibrowser:{schema:"webuilog",service:"mibrowser"},huawei:{schema:"webuilog",service:"huawei"},vivo:{schema:"webuilog",service:"vivo"},atlas:{schema:"webuilog",service:"atlas"}};function t(a){var t="";for(var n in a)a[n]&&(t+="".concat(n,"=").concat(encodeURIComponent(a[n]),"&"));return t=t.substring(0,t.length-1),"".concat(e,"?").concat(t)}function n(e){return void 0===e}function c(e){var a=new RegExp(e+"=([^;]*);"),t=a.exec(document.cookie);return t&&t[1]||""}return{getCookie:c,saveLog:function(e,i){var r,o="",s={user:{username:decodeURI(c("nickname"))||decodeURI(c("username"))||"",userid:parseInt(c("YD_PANDORA_UID"))}};n(i)&&(i="pandora"),r=a[i],o=t(r),e=Object.assign({},s,e),fetch(o,{body:JSON.stringify(e),headers:{"content-type":"application/json"},method:"POST",mode:"cors"}).then(()=>{console.info("\u53d1\u9001\u6210\u529f")})}}})},bThk:function(e,a,t){e.exports={"page-header":"page-header","ant-breadcrumb":"ant-breadcrumb","page-header-title":"page-header-title","ant-layout-content":"ant-layout-content","layout-container":"layout-container"}}}]);