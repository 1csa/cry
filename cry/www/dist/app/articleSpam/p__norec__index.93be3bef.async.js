(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[12],{"2leo":function(e,t,a){"use strict";a.r(t);a("stmH");var n=a("5O1y"),l=(a("qXJo"),a("rAmn")),r=(a("42uY"),a("lGXO")),c=(a("FLAH"),a("excc")),o=(a("zI7Q"),a("SCaQ")),i=(a("Iaxd"),a("i6l0")),s=(a("oeo2"),a("BmDy")),d=(a("vgpD"),a("UL5a")),m=(a("gFku"),a("7WSx")),u=(a("M6c6"),a("jMRu")),h=a("JCfe"),g=a.n(h),v=(a("IJu9"),a("DuHN")),E=(a("ljfu"),a("x2dm")),p=a("ERkP"),f=a.n(p),b=(a("LCbC"),a("NwOV")),w=(a("Yzaq"),a("d+ro")),C=(a("oj2R"),a("/zI6")),y=a("ggb3"),D=a.n(y),A=a("5W1r"),S=a("wknW"),x=a("wZVN"),L=a("5ozA");a("Cmdq");class k extends f.a.PureComponent{constructor(e){super(e),this.onChangeArticleType=(e=>{this.setState({label:e.target.value})}),this.handleDeleteComment=(e=>{var t=this.state.comments;t=t.filter(t=>t.id!==e),this.setState({comments:t})}),this.onPassArticle=(()=>{var e=this;C["a"].confirm({title:"\u63d0\u793a",content:"\u60a8\u786e\u5b9a\u8981\u901a\u8fc7\u8be5\u6587\u7ae0\u5417\uff1f",onOk(){return e.handleArticle("checkDoc")}})}),this.onHideArticle=(()=>{var e=this;C["a"].confirm({title:"\u63d0\u793a",content:"\u60a8\u786e\u5b9a\u8981\u4e0d\u5c55\u793a\u8be5\u6587\u7ae0\u5417\uff1f(\u6536\u85cf \u548c \u5206\u4eab \u4e2d\u4fdd\u7559)",onOk(){return e.handleArticle("hide")}})}),this.onNoserveArticle=(()=>{var e=this;C["a"].confirm({title:"\u63d0\u793a",content:"\u60a8\u786e\u5b9a\u8981\u4e0d\u670d\u52a1\u8be5\u6587\u7ae0\u5417\uff1f(\u6536\u85cf \u5206\u4eab \u548c \u6e90\u8ba2\u9605 \u4e2d\u4fdd\u7559)",onOk(){return e.handleArticle("notserve")}})}),this.onNorecArticle=(()=>{var e=this;C["a"].confirm({title:"\u63d0\u793a",content:"\u60a8\u786e\u5b9a\u8981\u4e0d\u63a8\u8350\u8be5\u6587\u7ae0\u5417\uff1f(\u6536\u85cf \u5206\u4eab \u6e90\u8ba2\u9605 \u53ca \u81ea\u8350\u9891\u9053\uff0f\u641c\u7d22 \u4e2d\u4fdd\u7559)",onOk(){return e.handleArticle("notrecommend")}})}),this.onDeleteArticle=(()=>{var e=this;C["a"].confirm({title:"\u63d0\u793a",content:"\u60a8\u786e\u5b9a\u8981\u5220\u9664\u8be5\u6587\u7ae0\u5417\uff1f",onOk(){return e.deleteArticle()}})}),this.state={comments:this.props.doc.comments||[],label:""}}handleArticle(e){var t=this.props.doc,a=this.state.label;D.a.get("/api/proxy/".concat(S["a"].API_HOST,"/service/comment/review"),{params:{action:e,docid:t.docid,newsLabel:a,auditor:Object(x["a"])("username")||""}}).then(a=>{"success"===a.data.status?(this.props.handleRemoveDoc(t.docid),Object(A["saveLog"])({log_source:{tag:"articleSpam"},action_method:e,target_data:{docid:t.docid}})):v["a"].error("".concat(e,"\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5"))}).catch(t=>{v["a"].error("".concat(e,"\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5"))})}deleteArticle(){var e=this.props.doc,t=this.state.label;D.a.get("/api/proxy/".concat(S["a"].API_HOST,"/service/comment/review"),{params:{action:"removeDoc",docid:e.docid,newsLabel:t,auditor:Object(x["a"])("username")||""}}).then(t=>{"success"===t.data.status?(this.props.handleRemoveDoc(e.docid),Object(A["saveLog"])({log_source:{tag:"articleSpam"},action_method:"removeDoc",target_data:{docid:e.docid}})):v["a"].error("\u5220\u9664\u6587\u7ae0\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5")})}render(){var e=this.props,t=e.doc,a=e.index,n=this.state,l=n.comments,r=n.label;return f.a.createElement("div",{className:"audit-doc-wrapper"},f.a.createElement("div",{className:"doc-title"},f.a.createElement("span",null,a+1,".\xa0\xa0"),f.a.createElement(o["a"],{type:"primary",href:"https://www.baidu.com/s?wd=".concat(t.title),target:"_blank"},"\u767e\u5ea6\u4e00\u4e0b"),f.a.createElement("a",{href:"https://www.yidianzixun.com/article/".concat(t.docid),target:"_blank"},t.title)),f.a.createElement("div",{className:"doc-info"},t.wemedia&&f.a.createElement(w["a"],{color:"#2db7f5"},"\u81ea\u5a92\u4f53"),t.stky&&f.a.createElement(w["a"],{color:"red"},"\u7f6e\u9876"),t.sel&&f.a.createElement(w["a"],{color:"orange"},"\u52a0\u7cbe"),f.a.createElement("span",null,f.a.createElement("strong",null,"\u5927\u7c7b: "),t.cat&&t.cat.join(",")),f.a.createElement("span",null,f.a.createElement("strong",null,"\u6587\u7ae0\u6e90: "),t.source),f.a.createElement("span",null,f.a.createElement("strong",null,"\u6e90\u8bc4\u7ea7: "),t.source_tier),f.a.createElement("span",null,f.a.createElement("strong",null,"\u53d1\u5e03\u65e5\u671f: "),t.date),f.a.createElement("span",null,f.a.createElement("strong",null,"docid: "),t.docid)),f.a.createElement("div",{className:"audit-info"},f.a.createElement("span",null,f.a.createElement("strong",null,"\u5ba1\u6838\u4eba: "),t.auditor||"\u672a\u77e5"),f.a.createElement("span",null,f.a.createElement("strong",null,"\u5ba1\u6838\u65f6\u95f4: "),t.label_date||t.audit_finished_time),f.a.createElement("span",null,f.a.createElement("strong",null,"\u5ba1\u6838\u72b6\u6001: "),t.flag),f.a.createElement("span",null,f.a.createElement("strong",null,"\u5ba1\u6838\u8d1f\u53cd\u9988\u7c7b\u578b: "),t.newsLabel||"\u65e0")),f.a.createElement("div",{className:"doc-comments"},l.map((e,a)=>f.a.createElement(L["a"],{key:e.id,index:a,docid:t.docid,comment:e,hasDelete:!0,handleDeleteComment:this.handleDeleteComment}))),f.a.createElement("div",{className:"doc-oper"},f.a.createElement("h4",null,"\u4f60\u89c9\u5f97\u7684\u6587\u7ae0\u7c7b\u578b?"),f.a.createElement(b["a"].Group,{onChange:this.onChangeArticleType,value:r},f.a.createElement("div",{style:{marginBottom:"5px"}},f.a.createElement(b["a"],{value:"\u5783\u573e\u89e3\u8bf4"},"\u5783\u573e\u89e3\u8bf4"),f.a.createElement(b["a"],{value:"\u6c34\u6587"},"\u6c34\u6587"),f.a.createElement(b["a"],{value:"\u5783\u573e\u6587"},"\u5783\u573e\u6587"),f.a.createElement(b["a"],{value:"\u65e7\u95fb\u3001\u8fc7\u65f6"},"\u65e7\u95fb\u3001\u8fc7\u65f6"),f.a.createElement(b["a"],{value:"\u8f6f\u6587\u5e7f\u544a"},"\u8f6f\u6587\u5e7f\u544a")),f.a.createElement("div",{style:{marginBottom:"5px"}},f.a.createElement(b["a"],{value:"\u865a\u5047"},"\u865a\u5047"),f.a.createElement(b["a"],{value:"\u63d2\u5e7f\u544a"},"\u63d2\u5e7f\u544a"),f.a.createElement(b["a"],{value:"\u6807\u9898\u515a"},"\u6807\u9898\u515a"),f.a.createElement(b["a"],{value:"\u6587\u4e0d\u5bf9\u9898"},"\u6587\u4e0d\u5bf9\u9898"),f.a.createElement(b["a"],{value:"\u9519\u522b\u5b57"},"\u9519\u522b\u5b57")),f.a.createElement("div",null,f.a.createElement(b["a"],{value:"\u8272\u60c5"},"\u8272\u60c5"),f.a.createElement(b["a"],{value:"\u8272\u60c5\u6f2b\u753b"},"\u8272\u60c5\u6f2b\u753b"),f.a.createElement(b["a"],{value:"\u51c6\u8272\u60c5"},"\u51c6\u8272\u60c5"))),f.a.createElement("div",{className:"oper-btns"},"pass"!==t.flag&&f.a.createElement(o["a"],{type:"primary",onClick:this.onPassArticle},"\u901a\u8fc7"),"hide"!==t.flag&&f.a.createElement(o["a"],{disabled:!r,style:{backgroundColor:"#ee82ee",color:"#fff"},onClick:this.onHideArticle},"\u4e0d\u5c55\u793a"),"notserve"!==t.flag&&f.a.createElement(o["a"],{disabled:!r,style:{backgroundColor:"#ff8c00",color:"#fff"},onClick:this.onNoserveArticle},"\u4e0d\u670d\u52a1"),"notrecommend"!==t.flag&&f.a.createElement(o["a"],{disabled:!r,style:{backgroundColor:"#d2691e",color:"#fff"},onClick:this.onNorecArticle},"\u4e0d\u63a8\u8350"),"remove"!==t.flag&&f.a.createElement(o["a"],{onClick:this.onDeleteArticle,disabled:!r},"\u5220\u9664"))))}}var _=a("NWZ9"),I=a("rpna");a.d(t,"default",function(){return P});var O=E["a"].Option,N=20;class P extends f.a.PureComponent{constructor(e){super(e),this.onChangePage=(e=>{this.setState({loading:!0}),"load"===this.state.getDataMode?this.getDocList(e):this.getAuditDocListBySearch(e),window.scrollTo(0,0)}),this.handleRemoveDoc=(e=>{var t=this.state.docList;t=t.filter(t=>t.docid!==e),this.setState({docList:t})}),this.onCatChange=(e=>{this.setState({cat:e})}),this.onNegChange=(e=>{this.setState({negCommentClass:e})}),this.onTierChange=(e=>{this.setState({tier:e})}),this.onLabelChange=(e=>{this.setState({newsLabel:e})}),this.onFlagChange=(e=>{this.setState({flag:e})}),this.onAuditorChange=(e=>{this.setState({auditor:e.target.value})}),this.onAuditDateChange=((e,t)=>{this.setState({startDate:t[0],endDate:t[1]})}),this.onSearchAudited=(()=>{this.setState({loading:!0}),this.getAuditDocListBySearch(1)}),this.onSearchByDocid=(e=>{this.setState({loading:!0}),D.a.get("/api/proxy/".concat(S["a"].API_HOST,"/service/comment/review"),{params:{action:"getPendingDocByDocid",docid:e}}).then(e=>{"success"===e.data.status&&e.data.result.length>0&&e.data.result[0].docid?this.getDocDetail(e.data.result).then(e=>{this.setState({docList:e,pageIndex:1,count:1,loading:!1})}):this.setState({docList:[],pageIndex:1,count:0,getDataMode:"search",loading:!1})})}),this.exportData=(()=>{var e=this.state,t=e.count,a=e.cat,n=e.negCommentClass,l=e.tier,r=e.flag,c=e.auditor,o=e.startDate,i=e.endDate,s=e.newsLabel;if(t>0&&t<1e4){var d={action:"getPendingDocByDivision",cat:a,negCommentClass:n,isAudited:!0,flag:r};c&&(d.auditor=c),o&&i&&(d.startDate=o,d.endDate=i),"all"!==l&&(d.tier=l),"all"!==s&&(d.newsLabel=s);var m=Object.assign(d,{start:0,end:t}),u=[{label:"docid",value:"docid"},{label:"\u5927\u7c7b",value:"cat"},{label:"title",value:"title"},{label:"doc_url",value:"docid",filter:{argument:"row, key",content:"if (!row[key]) return; let doc_url = 'https://www.yidianzixun.com/article/' + row[key]; return doc_url;"}},{label:"\u53d1\u5e03\u65f6\u95f4",value:"date"},{label:"\u7f16\u8f91\u5ba1\u6838\u6587\u7ae0\u7c7b\u578b",value:"newsLabel"},{label:"\u7528\u6237\u8bc4\u8bba",value:"comments",filter:{argument:"row, key",content:"if (!row[key]) return; let commentLabels = []; row[key].forEach(item => {commentLabels.push(item.label);}); return commentLabels.join(',');"}}],h={method:"GET",url:"http://10.120.46.4:8041/service/comment/review",params:JSON.stringify(m),dir:"result-docs",struct:u,filename:"\u8bc4\u8bba\u53ec\u56de\u5df2\u5ba1\u6838\u6587\u7ae0",fileType:"xlsx"};ydFile.start(h,function(e){})}else v["a"].warning("\u5bfc\u51fa\u7684\u6570\u636e\u8981\u5927\u4e8e0\u6761\uff0c\u5c0f\u4e8e1\u4e07\u6761")}),this.state={getDataMode:"load",cat:"all",negCommentClass:"all",tier:"all",flag:"all",newsLabel:"all",auditor:"",startDate:"",endDate:"",docList:[],count:0,pageIndex:1,loading:!0}}componentDidMount(){this.getDocList(1),window.ydFile.set("sk","wKy3i0rEtHuGwRo2w4yJtZyVq4"),window.ydFile.set("approved_by",Object(x["a"])("username"))}getDocDetail(e){var t=e.map(e=>e.docid);return D.a.get("/api/proxy/http://tool-collection.ha.in.yidian.com:7080/docenter/yidian/ids/".concat(t,"/fields/source,cat_class,source_tier,_id"),{params:{}}).then(t=>{return new Promise((a,n)=>{if("success"===t.data.status){var l={};t.data.result.forEach(e=>{e._id&&(l[e._id]=e)}),e=e.map(e=>{var t=l[e.docid];return t?g()({},e,t):e}),a(e)}else n()})})}getDocList(e){D.a.get("/api/proxy/".concat(S["a"].API_HOST,"/service/comment/review"),{params:{action:"getDocAudited",start:(e-1)*N,end:e*N}}).then(t=>{"success"===t.data.status&&t.data.result.docs.length>0?this.getDocDetail(t.data.result.docs).then(a=>{this.setState({docList:a,pageIndex:e,count:t.data.result.count,loading:!1})}):this.setState({docList:[],pageIndex:1,count:0,getDataMode:"search",loading:!1})})}getAuditDocListBySearch(e){var t=this.state,a=t.cat,n=t.negCommentClass,l=t.tier,r=t.flag,c=t.auditor,o=t.startDate,i=t.endDate,s=t.newsLabel,d={action:"getPendingDocByDivision",cat:a,negCommentClass:n,isAudited:!0,flag:r,start:(e-1)*N,end:e*N};c&&(d.auditor=c),o&&i&&(d.startDate=o,d.endDate=i),"all"!==l&&(d.tier=l),"all"!==s&&(d.newsLabel=s),D.a.get("/api/proxy/".concat(S["a"].API_HOST,"/service/comment/review"),{params:d}).then(t=>{"success"===t.data.status&&t.data.result.docs.length>0?this.getDocDetail(t.data.result.docs).then(a=>{this.setState({docList:a,pageIndex:e,count:t.data.result.count,getDataMode:"search",loading:!1})}):this.setState({docList:[],pageIndex:1,count:0,getDataMode:"search",loading:!1})})}render(){var e=this.state,t=e.cat,a=e.negCommentClass,h=e.tier,g=e.flag,v=e.newsLabel,p=e.docList,b=e.count,w=e.pageIndex;return f.a.createElement(f.a.Fragment,null,f.a.createElement("div",{className:"main-content-with-page-header"},f.a.createElement(u["a"],{bordered:!1,style:{minHeight:500}},f.a.createElement(m["a"],{offsetTop:0},f.a.createElement("div",{style:{background:"#fff",padding:"15px 0",borderBottom:"1px solid #ddd"}},f.a.createElement(d["a"],{layout:"inline"},f.a.createElement(d["a"].Item,{label:"\u6587\u7ae0\u5927\u7c7b"},f.a.createElement(E["a"],{onChange:this.onCatChange,style:{width:150},value:t},f.a.createElement(O,{value:"all"},"\u5168\u90e8"),_["a"].map(e=>f.a.createElement(O,{value:e},e)))),f.a.createElement(d["a"].Item,{label:"\u7528\u6237\u8d1f\u53cd\u9988\u7c7b\u578b"},f.a.createElement(E["a"],{onChange:this.onNegChange,style:{width:150},value:a},f.a.createElement(O,{value:"all"},"\u5168\u90e8"),I["a"].map(e=>f.a.createElement(O,{value:e},e)))),f.a.createElement(d["a"].Item,{label:"\u5904\u7406\u7ed3\u679c"},f.a.createElement(E["a"],{style:{width:150},onChange:this.onFlagChange,value:g},f.a.createElement(O,{value:"all"},"\u5168\u90e8"),f.a.createElement(O,{value:"pass"},"\u901a\u8fc7"),f.a.createElement(O,{value:"hide"},"\u4e0d\u5c55\u793a"),f.a.createElement(O,{value:"notserve"},"\u4e0d\u670d\u52a1"),f.a.createElement(O,{value:"notrecommend"},"\u4e0d\u63a8\u8350"),f.a.createElement(O,{value:"remove"},"\u5220\u9664"))),f.a.createElement(d["a"].Item,{label:"\u5ba1\u6838\u8d1f\u53cd\u9988\u7c7b\u578b"},f.a.createElement(E["a"],{style:{width:150},onChange:this.onLabelChange,value:v},f.a.createElement(O,{value:"all"},"\u5168\u90e8"),f.a.createElement(O,{value:"\u6587\u4e0d\u5bf9\u9898"},"\u6587\u4e0d\u5bf9\u9898"),f.a.createElement(O,{value:"\u6807\u9898\u515a"},"\u6807\u9898\u515a"),f.a.createElement(O,{value:"\u6d6e\u5938\u865a\u5047"},"\u6d6e\u5938\u865a\u5047"),f.a.createElement(O,{value:"\u65e7\u95fb\u3001\u8fc7\u65f6"},"\u65e7\u95fb\u3001\u8fc7\u65f6"),f.a.createElement(O,{value:"\u8f6f\u6587\u5e7f\u544a"},"\u8f6f\u6587\u5e7f\u544a"),f.a.createElement(O,{value:"\u8272\u60c5"},"\u8272\u60c5"),f.a.createElement(O,{value:"\u4f4e\u4fd7"},"\u4f4e\u4fd7"),f.a.createElement(O,{value:"\u4fe1\u606f\u6709\u8bef"},"\u4fe1\u606f\u6709\u8bef"),f.a.createElement(O,{value:"\u6587\u7ae0\u4e0d\u5168"},"\u6587\u7ae0\u4e0d\u5168"),f.a.createElement(O,{value:"\u683c\u5f0f\u6df7\u4e71"},"\u683c\u5f0f\u6df7\u4e71"),f.a.createElement(O,{value:"\u5185\u5bb9\u6df7\u4e71"},"\u5185\u5bb9\u6df7\u4e71"),f.a.createElement(O,{value:"\u653f\u6cbb\u654f\u611f"},"\u653f\u6cbb\u654f\u611f"),f.a.createElement(O,{value:"\u5783\u573e\u6587"},"\u5783\u573e\u6587"),f.a.createElement(O,{value:"\u767d\u6c34\u6587"},"\u767d\u6c34\u6587"),f.a.createElement(O,{value:"\u5176\u4ed6"},"\u5176\u4ed6"))),f.a.createElement(d["a"].Item,{label:"\u6e90\u8bc4\u7ea7"},f.a.createElement(E["a"],{onChange:this.onTierChange,style:{width:150},value:h},f.a.createElement(O,{value:"all"},"\u5168\u90e8"),f.a.createElement(O,{value:"1"},"1"),f.a.createElement(O,{value:"2"},"2"),f.a.createElement(O,{value:"3"},"3"),f.a.createElement(O,{value:"4"},"4"),f.a.createElement(O,{value:"5"},"5"),f.a.createElement(O,{value:"6"},"6"))),f.a.createElement(d["a"].Item,{label:"\u5ba1\u6838\u5458\u8d26\u53f7"},f.a.createElement(s["a"],{placeholder:"\u8bf7\u8f93\u5165\u516c\u53f8\u90ae\u7bb1",onChange:this.onAuditorChange,style:{width:240},allowClear:!0})),f.a.createElement(d["a"].Item,{label:"\u5ba1\u6838\u65f6\u95f4"},f.a.createElement(i["a"].RangePicker,{format:"YYYY-MM-DD",onChange:this.onAuditDateChange})),f.a.createElement(d["a"].Item,null,f.a.createElement(o["a"],{type:"primary",onClick:this.onSearchAudited},"\u641c\u7d22"),f.a.createElement(c["a"],{content:"\u5bfc\u51fa\u7684\u6570\u636e\u8981\u5728\u4e00\u4e07\u6761\u4ee5\u5185,\u5426\u5219\u53ef\u80fd\u5bfc\u51fa\u5931\u8d25\uff0c\u6b64\u63a5\u53e3\u8f83\u6162\uff0c\u8bf7\u8010\u5fc3\u7b49\u5f85"},f.a.createElement(o["a"],{type:"danger",style:{marginLeft:"15px"},onClick:this.exportData},"\u5bfc\u51fa\u6570\u636e")))),f.a.createElement("div",{style:{marginTop:"15px"}},f.a.createElement(s["a"].Search,{style:{width:300},placeholder:"\u6309docid\u641c\u7d22\u53cd\u9988\u6587\u7ae0",onSearch:this.onSearchByDocid,enterButton:!0})),f.a.createElement(r["a"],{style:{background:"#fff",padding:"15px 0",borderBottom:"1px solid #ddd"},current:w,defaultCurrent:1,pageSize:N,total:b,showTotal:e=>"\u5171".concat(e,"\u6761"),onChange:this.onChangePage}))),f.a.createElement(l["a"],{spinning:this.state.loading},f.a.createElement("div",{className:"doc-list"},p&&p.map((e,t)=>f.a.createElement(k,{key:e.docid,index:t,doc:e,handleRemoveDoc:this.handleRemoveDoc})))),f.a.createElement(n["a"],null))))}}},Cmdq:function(e,t,a){e.exports={"audit-doc-wrapper":"audit-doc-wrapper","doc-info":"doc-info","audit-info":"audit-info","doc-comments":"doc-comments","doc-oper":"doc-oper","oper-btns":"oper-btns"}}}]);