(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[12],{"9apV":function(t,r,e){"use strict";e.r(r);var n=e("Z32k"),a=e.n(n),u=e("JGaj"),c=e.n(u),s=e("sy1d"),p=e("n/bh");function i(t){return o.apply(this,arguments)}function o(){return o=c()(a.a.mark(function t(r){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].get("/api/proxy/".concat(p["G"].task),{params:r}));case 1:case"end":return t.stop()}},t)})),o.apply(this,arguments)}function l(t){return w.apply(this,arguments)}function w(){return w=c()(a.a.mark(function t(r){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].post("/api/proxy/".concat(p["G"].startTask),{data:r}));case 1:case"end":return t.stop()}},t)})),w.apply(this,arguments)}function f(t){return h.apply(this,arguments)}function h(){return h=c()(a.a.mark(function t(r){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].post("/api/proxy/".concat(p["G"].stopTask),{data:r}));case 1:case"end":return t.stop()}},t)})),h.apply(this,arguments)}function d(){return y.apply(this,arguments)}function y(){return y=c()(a.a.mark(function t(){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].get("/api/proxy/".concat(p["G"].siteList)));case 1:case"end":return t.stop()}},t)})),y.apply(this,arguments)}function x(t){return k.apply(this,arguments)}function k(){return k=c()(a.a.mark(function t(r){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].post("/api/proxy/".concat(p["G"].contentTypeList),{data:r}));case 1:case"end":return t.stop()}},t)})),k.apply(this,arguments)}function v(t){return b.apply(this,arguments)}function b(){return b=c()(a.a.mark(function t(r){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].post("/api/proxy/".concat(p["G"].task),{data:r}));case 1:case"end":return t.stop()}},t)})),b.apply(this,arguments)}function m(t){return g.apply(this,arguments)}function g(){return g=c()(a.a.mark(function t(r){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].get("/api/proxy/".concat(p["G"].task,"/").concat(r.id)));case 1:case"end":return t.stop()}},t)})),g.apply(this,arguments)}function G(t){return T.apply(this,arguments)}function T(){return T=c()(a.a.mark(function t(r){var e;return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=r.jobId,delete r.jobId,t.abrupt("return",s["a"].post("/api/proxy/".concat(p["G"].task,"/").concat(e),{data:r}));case 3:case"end":return t.stop()}},t)})),T.apply(this,arguments)}function L(){return j.apply(this,arguments)}function j(){return j=c()(a.a.mark(function t(){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].get("/api/proxy/".concat(p["G"].categoryList)));case 1:case"end":return t.stop()}},t)})),j.apply(this,arguments)}function J(){return A.apply(this,arguments)}function A(){return A=c()(a.a.mark(function t(){return a.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.abrupt("return",s["a"].get("/api/proxy/".concat(p["G"].exportApp)));case 1:case"end":return t.stop()}},t)})),A.apply(this,arguments)}var C={namespace:"putTaskList",state:{sourceList:[]},effects:{getTaskList(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(i,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},startTask(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(l,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},stopTask(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(f,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},getSiteList(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(d,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},getContentTypeList(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(x,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},createTask(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(v,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},getTaskDetail(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(m,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},getCategoryList(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(L,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},editTask(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(G,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()},getExportAppList(t,r){return a.a.mark(function e(){var n,u,c;return a.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,u=r.call,e.next=4,u(J,n);case 4:return c=e.sent,e.abrupt("return",c);case 6:case"end":return e.stop()}},e)})()}},reducers:{}};r["default"]=C}}]);