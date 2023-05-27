!function e(t,n,o){function i(s,l){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!l&&c)return c(s,!0);if(r)return r(s,!0);var a=Error("Cannot find module '"+s+"'");throw a.code="MODULE_NOT_FOUND",a}var h=n[s]={exports:{}};t[s][0].call(h.exports,function(e){var n;return i(t[s][1][e]||e)},h,h.exports,e,t,n,o)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)i(o[s]);return i}({1:[function(e,t,n){(function(){var t,o,i,r,s,l;r=(l=e("./protocol")).Parser,o=l.PROTOCOL_6,i=l.PROTOCOL_7,s="2.2.1",n.Connector=t=function(){function e(e,t,n,o){var i,s,l,c,a;this.options=e,this.WebSocket=t,this.Timer=n,this.handlers=o,this._uri="ws://"+this.options.host+":"+this.options.port+"/livereload",this._nextDelay=this.options.mindelay,this._connectionDesired=!1,this.protocol=0,this.protocolParser=new r({connected:(i=this,function(e){return i.protocol=e,i._handshakeTimeout.stop(),i._nextDelay=i.options.mindelay,i._disconnectionReason="broken",i.handlers.connected(e)}),error:(s=this,function(e){return s.handlers.error(e),s._closeOnError()}),message:(l=this,function(e){return l.handlers.message(e)})}),this._handshakeTimeout=new n((c=this,function(){if(c._isSocketConnected())return c._disconnectionReason="handshake-timeout",c.socket.close()})),this._reconnectTimer=new n((a=this,function(){if(a._connectionDesired)return a.connect()})),this.connect()}return e.prototype._isSocketConnected=function(){return this.socket&&this.socket.readyState===this.WebSocket.OPEN},e.prototype.connect=function(){var e,t,n,o;if(this._connectionDesired=!0,!this._isSocketConnected())return this._reconnectTimer.stop(),this._disconnectionReason="cannot-connect",this.protocolParser.reset(),this.handlers.connecting(),this.socket=new this.WebSocket(this._uri),this.socket.onopen=(e=this,function(t){return e._onopen(t)}),this.socket.onclose=(t=this,function(e){return t._onclose(e)}),this.socket.onmessage=(n=this,function(e){return n._onmessage(e)}),this.socket.onerror=(o=this,function(e){return o._onerror(e)})},e.prototype.disconnect=function(){if(this._connectionDesired=!1,this._reconnectTimer.stop(),this._isSocketConnected())return this._disconnectionReason="manual",this.socket.close()},e.prototype._scheduleReconnection=function(){if(this._connectionDesired&&!this._reconnectTimer.running)return this._reconnectTimer.start(this._nextDelay),this._nextDelay=Math.min(this.options.maxdelay,2*this._nextDelay)},e.prototype.sendCommand=function(e){if(null!=this.protocol)return this._sendCommand(e)},e.prototype._sendCommand=function(e){return this.socket.send(JSON.stringify(e))},e.prototype._closeOnError=function(){return this._handshakeTimeout.stop(),this._disconnectionReason="error",this.socket.close()},e.prototype._onopen=function(e){var t;return this.handlers.socketConnected(),this._disconnectionReason="handshake-failed",(t={command:"hello",protocols:[o,i]}).ver=s,this.options.ext&&(t.ext=this.options.ext),this.options.extver&&(t.extver=this.options.extver),this.options.snipver&&(t.snipver=this.options.snipver),this._sendCommand(t),this._handshakeTimeout.start(this.options.handshake_timeout)},e.prototype._onclose=function(e){return this.protocol=0,this.handlers.disconnected(this._disconnectionReason,this._nextDelay),this._scheduleReconnection()},e.prototype._onerror=function(e){},e.prototype._onmessage=function(e){return this.protocolParser.process(e.data)},e}()}).call(this)},{"./protocol":6},],2:[function(e,t,n){(function(){var e;e={bind:function(e,t,n){if(e.addEventListener)return e.addEventListener(t,n,!1);if(e.attachEvent)return e[t]=1,e.attachEvent("onpropertychange",function(e){if(e.propertyName===t)return n()});throw Error("Attempt to attach custom event "+t+" to something which isn't a DOMElement")},fire:function(e,t){var n;if(e.addEventListener)return(n=document.createEvent("HTMLEvents")).initEvent(t,!0,!0),document.dispatchEvent(n);if(e.attachEvent){if(e[t])return e[t]++}else throw Error("Attempt to fire custom event "+t+" on something which isn't a DOMElement")}},n.bind=e.bind,n.fire=e.fire}).call(this)},{},],3:[function(e,t,n){(function(){var e;t.exports=e=function(){function e(e,t){this.window=e,this.host=t}return e.identifier="less",e.version="1.0",e.prototype.reload=function(e,t){if(this.window.less&&this.window.less.refresh){if(e.match(/\.less$/i))return this.reloadLess(e);if(t.originalPath.match(/\.less$/i))return this.reloadLess(t.originalPath)}return!1},e.prototype.reloadLess=function(e){var t,n,o,i;if(0===(n=function(){var e,n,o,i;for(e=0,o=document.getElementsByTagName("link"),i=[],n=o.length;e<n;e++)((t=o[e]).href&&t.rel.match(/^stylesheet\/less$/i)||t.rel.match(/stylesheet/i)&&t.type.match(/^text\/(x-)?less$/i))&&i.push(t);return i}()).length)return!1;for(o=0,i=n.length;o<i;o++)(t=n[o]).href=this.host.generateCacheBustUrl(t.href);return this.host.console.log("LiveReload is asking LESS to recompile all stylesheets"),this.window.less.refresh(!0),!0},e.prototype.analyze=function(){return{disable:!!(this.window.less&&this.window.less.refresh)}},e}()}).call(this)},{},],4:[function(e,t,n){(function(){var t,o,i,r,s;t=e("./connector").Connector,s=e("./timer").Timer,i=e("./options").Options,r=e("./reloader").Reloader,n.LiveReload=o=function(){function e(e){var n,o,l,c,a,h;if(this.window=e,this.listeners={},this.plugins=[],this.pluginIdentifiers={},this.console=this.window.location.href.match(/LR-verbose/)&&this.window.console&&this.window.console.log&&this.window.console.error?this.window.console:{log:function(){},error:function(){}},!(this.WebSocket=this.window.WebSocket||this.window.MozWebSocket)){this.console.error("LiveReload disabled because the browser does not seem to support web sockets");return}if(!(this.options=i.extract(this.window.document))){this.console.error("LiveReload disabled because it could not find its own <SCRIPT> tag");return}this.reloader=new r(this.window,this.console,s),this.connector=new t(this.options,this.WebSocket,s,{connecting:function(){},socketConnected:function(){},connected:(l=this,function(e){var t;return"function"==typeof(t=l.listeners).connect&&t.connect(),l.log("LiveReload is connected to "+l.options.host+":"+l.options.port+" (protocol v"+e+")."),l.analyze()}),error:function(e){if(e instanceof ProtocolError){if("undefined"!=typeof console&&null!==console)return console.log(""+e.message+".")}else if("undefined"!=typeof console&&null!==console)return console.log("LiveReload internal error: "+e.message)},disconnected:(a=this,function(e,t){var n;switch("function"==typeof(n=a.listeners).disconnect&&n.disconnect(),e){case"cannot-connect":return a.log("LiveReload cannot connect to "+a.options.host+":"+a.options.port+", will retry in "+t+" sec.");case"broken":return a.log("LiveReload disconnected from "+a.options.host+":"+a.options.port+", reconnecting in "+t+" sec.");case"handshake-timeout":return a.log("LiveReload cannot connect to "+a.options.host+":"+a.options.port+" (handshake timeout), will retry in "+t+" sec.");case"handshake-failed":return a.log("LiveReload cannot connect to "+a.options.host+":"+a.options.port+" (handshake failed), will retry in "+t+" sec.");case"manual":case"error":break;default:return a.log("LiveReload disconnected from "+a.options.host+":"+a.options.port+" ("+e+"), reconnecting in "+t+" sec.")}}),message:(h=this,function(e){switch(e.command){case"reload":return h.performReload(e);case"alert":return h.performAlert(e)}})})}return e.prototype.on=function(e,t){return this.listeners[e]=t},e.prototype.log=function(e){return this.console.log(""+e)},e.prototype.performReload=function(e){var t,n;return this.log("LiveReload received reload request: "+JSON.stringify(e,null,2)),this.reloader.reload(e.path,{liveCSS:null==(t=e.liveCSS)||t,liveImg:null==(n=e.liveImg)||n,originalPath:e.originalPath||"",overrideURL:e.overrideURL||"",serverURL:"http://"+this.options.host+":"+this.options.port})},e.prototype.performAlert=function(e){return alert(e.message)},e.prototype.shutDown=function(){var e;return this.connector.disconnect(),this.log("LiveReload disconnected."),"function"==typeof(e=this.listeners).shutdown?e.shutdown():void 0},e.prototype.hasPlugin=function(e){return!!this.pluginIdentifiers[e]},e.prototype.addPlugin=function(e){var t,n;!this.hasPlugin(e.identifier)&&(this.pluginIdentifiers[e.identifier]=!0,t=new e(this.window,{_livereload:this,_reloader:this.reloader,_connector:this.connector,console:this.console,Timer:s,generateCacheBustUrl:(n=this,function(e){return n.reloader.generateCacheBustUrl(e)})}),this.plugins.push(t),this.reloader.addPlugin(t))},e.prototype.analyze=function(){var e,t,n,o,i,r;if(this.connector.protocol>=7){for(o=0,n={},i=(r=this.plugins).length;o<i;o++)n[(e=r[o]).constructor.identifier]=t=("function"==typeof e.analyze?e.analyze():void 0)||{},t.version=e.constructor.version;this.connector.sendCommand({command:"info",plugins:n,url:this.window.location.href})}},e}()}).call(this)},{"./connector":1,"./options":5,"./reloader":7,"./timer":9},],5:[function(e,t,n){(function(){var e;n.Options=e=function(){function e(){this.host=null,this.port=35729,this.snipver=null,this.ext=null,this.extver=null,this.mindelay=1e3,this.maxdelay=6e4,this.handshake_timeout=5e3}return e.prototype.set=function(e,t){if(void 0!==t)return isNaN(+t)||(t=+t),this[e]=t},e}(),e.extract=function(t){var n,o,i,r,s,l,c,a,h,u,d,f,p;for(a=0,u=(f=t.getElementsByTagName("script")).length;a<u;a++)if((c=(n=f[a]).src)&&(i=c.match(/^[^:]+:\/\/(.*)\/z?livereload\.js(?:\?(.*))?$/))){if(s=new e,(r=i[1].match(/^([^\/:]+)(?::(\d+))?$/))&&(s.host=r[1],r[2]&&(s.port=parseInt(r[2],10))),i[2])for(h=0,d=(p=i[2].split("&")).length;h<d;h++)(o=(l=p[h]).split("=")).length>1&&s.set(o[0].replace(/-/g,"_"),o.slice(1).join("="));return s}return null}}).call(this)},{},],6:[function(e,t,n){(function(){var e,t,o,i,r=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return -1};n.PROTOCOL_6=e="http://livereload.com/protocols/official-6",n.PROTOCOL_7=t="http://livereload.com/protocols/official-7",n.ProtocolError=i=function e(t,n){this.message="LiveReload protocol error ("+t+') after receiving data: "'+n+'".'},n.Parser=o=function(){function n(e){this.handlers=e,this.reset()}return n.prototype.reset=function(){return this.protocol=null},n.prototype.process=function(n){var o,s,l,c,a;try{if(null==this.protocol){if(n.match(/^!!ver:([\d.]+)$/))this.protocol=6;else if(l=this._parseMessage(n,["hello"])){if(l.protocols.length){if(r.call(l.protocols,t)>=0)this.protocol=7;else if(r.call(l.protocols,e)>=0)this.protocol=6;else throw new i("no supported protocols found")}else throw new i("no protocols specified in handshake message")}return this.handlers.connected(this.protocol)}if(6!==this.protocol)return l=this._parseMessage(n,["reload","alert"]),this.handlers.message(l);if(!(l=JSON.parse(n)).length)throw new i("protocol 6 messages must be arrays");if(o=l[0],c=l[1],"refresh"!==o)throw new i("unknown protocol 6 command");return this.handlers.message({command:"reload",path:c.path,liveCSS:null==(a=c.apply_css_live)||a})}catch(h){if((s=h)instanceof i)return this.handlers.error(s);throw s}},n.prototype._parseMessage=function(e,t){var n,o,s;try{o=JSON.parse(e)}catch(l){throw n=l,new i("unparsable JSON",e)}if(!o.command)throw new i('missing "command" key',e);if(s=o.command,0>r.call(t,s))throw new i("invalid command '"+o.command+"', only valid commands are: "+t.join(", ")+")",e);return o},n}()}).call(this)},{},],7:[function(e,t,n){(function(){var e,t,o,i,r,s,l;l=function(e){var t,n,o;return(n=e.indexOf("#"))>=0?(t=e.slice(n),e=e.slice(0,n)):t="",(n=e.indexOf("?"))>=0?(o=e.slice(n),e=e.slice(0,n)):o="",{url:e,params:o,hash:t}},i=function(e){var t;return decodeURIComponent(t=0===(e=l(e).url).indexOf("file://")?e.replace(/^file:\/\/(localhost)?/,""):e.replace(/^([^:]+:)?\/\/([^:\/]+)(:\d*)?\//,"/"))},s=function(e,t,n){var i,r,s,l,c;for(l=0,i={score:0},c=t.length;l<c;l++)(s=o(e,n(r=t[l])))>i.score&&(i={object:r,score:s});return i.score>0?i:null},o=function(e,t){var n,o,i,r;if((e=e.replace(/^\/+/,"").toLowerCase())===(t=t.replace(/^\/+/,"").toLowerCase()))return 1e4;for(n=e.split("/").reverse(),o=t.split("/").reverse(),r=Math.min(n.length,o.length),i=0;i<r&&n[i]===o[i];)++i;return i},r=function(e,t){return o(e,t)>0},e=[{selector:"background",styleNames:["backgroundImage"]},{selector:"border",styleNames:["borderImage","webkitBorderImage","MozBorderImage",]},],n.Reloader=t=function(){function t(e,t,n){this.window=e,this.console=t,this.Timer=n,this.document=this.window.document,this.importCacheWaitPeriod=200,this.plugins=[]}return t.prototype.addPlugin=function(e){return this.plugins.push(e)},t.prototype.analyze=function(e){return results},t.prototype.reload=function(e,t){var n,o,i,r,s;for(this.options=t,null==(o=this.options).stylesheetReloadTimeout&&(o.stylesheetReloadTimeout=15e3),s=this.plugins,i=0,r=s.length;i<r;i++)if((n=s[i]).reload&&n.reload(e,t))return;if(!(t.liveCSS&&e.match(/\.css$/i)&&this.reloadStylesheet(e))){if(t.liveImg&&e.match(/\.(jpe?g|png|gif)$/i)){this.reloadImages(e);return}return this.reloadPage()}},t.prototype.reloadPage=function(){return this.window.document.location.reload()},t.prototype.reloadImages=function(t){var n,o,s,l,c,a,h,u,d,f,p,m,g,v,y,w,R,$;for(a=0,n=this.generateUniqueString(),f=(v=this.document.images).length;a<f;a++)r(t,i((o=v[a]).src))&&(o.src=this.generateCacheBustUrl(o.src,n));if(this.document.querySelectorAll)for(h=0,p=e.length;h<p;h++)for(s=(y=e[h]).selector,l=y.styleNames,w=this.document.querySelectorAll("[style*="+s+"]"),u=0,m=w.length;u<m;u++)o=w[u],this.reloadStyleImages(o.style,l,t,n);if(this.document.styleSheets){for(d=0,R=this.document.styleSheets,$=[],g=R.length;d<g;d++)c=R[d],$.push(this.reloadStylesheetImages(c,t,n));return $}},t.prototype.reloadStylesheetImages=function(t,n,o){var i,r,s,l,c,a,h,u;try{s=null!=t?t.cssRules:void 0}catch(d){i=d}if(s)for(c=0,h=s.length;c<h;c++)switch((r=s[c]).type){case CSSRule.IMPORT_RULE:this.reloadStylesheetImages(r.styleSheet,n,o);break;case CSSRule.STYLE_RULE:for(a=0,u=e.length;a<u;a++)l=e[a].styleNames,this.reloadStyleImages(r.style,l,n,o);break;case CSSRule.MEDIA_RULE:this.reloadStylesheetImages(r,n,o)}},t.prototype.reloadStyleImages=function(e,t,n,o){var s,l,c,a,h;for(a=0,h=t.length;a<h;a++)"string"==typeof(c=e[l=t[a]])&&(s=c.replace(/\burl\s*\(([^)]*)\)/,function(e){return function(t,s){return r(n,i(s))?"url("+e.generateCacheBustUrl(s,o)+")":t}}(this)))!==c&&(e[l]=s)},t.prototype.reloadStylesheet=function(e){var t,n,o,r,l,c,a,h,u,d,f,p,m,g,v,y;for(c=0,o=(function(){var e,t,o,i;for(e=0,o=this.document.getElementsByTagName("link"),i=[],t=o.length;e<t;e++)(n=o[e]).rel.match(/^stylesheet$/i)&&!n.__LiveReload_pendingRemoval&&i.push(n);return i}).call(this),t=[],d=(g=this.document.getElementsByTagName("style")).length;c<d;c++)(l=g[c]).sheet&&this.collectImportedStylesheets(l,l.sheet,t);for(a=0,f=o.length;a<f;a++)n=o[a],this.collectImportedStylesheets(n,n.sheet,t);if(this.window.StyleFix&&this.document.querySelectorAll)for(h=0,p=(v=this.document.querySelectorAll("style[data-href]")).length;h<p;h++)l=v[h],o.push(l);if(this.console.log("LiveReload found "+o.length+" LINKed stylesheets, "+t.length+" @imported stylesheets"),r=s(e,o.concat(t),(y=this,function(e){return i(y.linkHref(e))})))r.object.rule?(this.console.log("LiveReload is reloading imported stylesheet: "+r.object.href),this.reattachImportedRule(r.object)):(this.console.log("LiveReload is reloading stylesheet: "+this.linkHref(r.object)),this.reattachStylesheetLink(r.object));else for(this.console.log("LiveReload will reload all stylesheets because path '"+e+"' did not match any specific one"),u=0,m=o.length;u<m;u++)n=o[u],this.reattachStylesheetLink(n);return!0},t.prototype.collectImportedStylesheets=function(e,t,n){var o,i,r,s,l,c;try{s=null!=t?t.cssRules:void 0}catch(a){o=a}if(s&&s.length)for(i=l=0,c=s.length;l<c;i=++l)switch((r=s[i]).type){case CSSRule.CHARSET_RULE:continue;case CSSRule.IMPORT_RULE:n.push({link:e,rule:r,index:i,href:r.href}),this.collectImportedStylesheets(e,r.styleSheet,n)}},t.prototype.waitUntilCssLoads=function(e,t){var n,o,i,r,s,l;return n=!1,o=function(){if(!n)return n=!0,t()},e.onload=(s=this,function(){return s.console.log("LiveReload: the new stylesheet has finished loading"),s.knownToSupportCssOnLoad=!0,o()}),!this.knownToSupportCssOnLoad&&(i=(l=this,function(){return e.sheet?(l.console.log("LiveReload is polling until the new CSS finishes loading..."),o()):l.Timer.start(50,i)}))(),this.Timer.start(this.options.stylesheetReloadTimeout,o)},t.prototype.linkHref=function(e){return e.href||e.getAttribute("data-href")},t.prototype.reattachStylesheetLink=function(e){var t,n,o;if(!e.__LiveReload_pendingRemoval)return e.__LiveReload_pendingRemoval=!0,"STYLE"===e.tagName?((t=this.document.createElement("link")).rel="stylesheet",t.media=e.media,t.disabled=e.disabled):t=e.cloneNode(!1),t.href=this.generateCacheBustUrl(this.linkHref(e)),(n=e.parentNode).lastChild===e?n.appendChild(t):n.insertBefore(t,e.nextSibling),this.waitUntilCssLoads(t,(o=this,function(){var n;return n=/AppleWebKit/.test(navigator.userAgent)?5:200,o.Timer.start(n,function(){var n;if(e.parentNode)return e.parentNode.removeChild(e),t.onreadystatechange=null,null!=(n=o.window.StyleFix)?n.link(t):void 0})}))},t.prototype.reattachImportedRule=function(e){var t,n,o,i,r,s,l,c,a;return l=e.rule,n=e.index,o=e.link,s=l.parentStyleSheet,r='@import url("'+(t=this.generateCacheBustUrl(l.href))+'") '+(i=l.media.length?[].join.call(l.media,", "):"")+";",l.__LiveReload_newHref=t,(c=this.document.createElement("link")).rel="stylesheet",c.href=t,c.__LiveReload_pendingRemoval=!0,o.parentNode&&o.parentNode.insertBefore(c,o),this.Timer.start(this.importCacheWaitPeriod,(a=this,function(){if(c.parentNode&&c.parentNode.removeChild(c),l.__LiveReload_newHref===t)return s.insertRule(r,n),s.deleteRule(n+1),(l=s.cssRules[n]).__LiveReload_newHref=t,a.Timer.start(a.importCacheWaitPeriod,function(){if(l.__LiveReload_newHref===t)return s.insertRule(r,n),s.deleteRule(n+1)})}))},t.prototype.generateUniqueString=function(){return"livereload="+Date.now()},t.prototype.generateCacheBustUrl=function(e,t){var n,o,i,r,s;return null==t&&(t=this.generateUniqueString()),e=(s=l(e)).url,n=s.hash,o=s.params,this.options.overrideURL&&0>e.indexOf(this.options.serverURL)&&(i=e,e=this.options.serverURL+this.options.overrideURL+"?url="+encodeURIComponent(e),this.console.log("LiveReload is overriding source URL "+i+" with "+e)),(r=o.replace(/(\?|&)livereload=(\d+)/,function(e,n){return""+n+t}))===o&&(r=0===o.length?"?"+t:""+o+"&"+t),e+r+n},t}()}).call(this)},{},],8:[function(e,t,n){(function(){var t,n,o;for(o in t=e("./customevents"),n=window.LiveReload=new(e("./livereload")).LiveReload(window),window)o.match(/^LiveReloadPlugin/)&&n.addPlugin(window[o]);n.addPlugin(e("./less")),n.on("shutdown",function(){return delete window.LiveReload}),n.on("connect",function(){return t.fire(document,"LiveReloadConnect")}),n.on("disconnect",function(){return t.fire(document,"LiveReloadDisconnect")}),t.bind(document,"LiveReloadShutDown",function(){return n.shutDown()})}).call(this)},{"./customevents":2,"./less":3,"./livereload":4},],9:[function(e,t,n){(function(){var e;n.Timer=e=function(){function e(e){var t;this.func=e,this.running=!1,this.id=null,this._handler=(t=this,function(){return t.running=!1,t.id=null,t.func()})}return e.prototype.start=function(e){return this.running&&clearTimeout(this.id),this.id=setTimeout(this._handler,e),this.running=!0},e.prototype.stop=function(){if(this.running)return clearTimeout(this.id),this.running=!1,this.id=null},e}(),e.start=function(e,t){return setTimeout(t,e)}}).call(this)},{},]},{},[8]);
