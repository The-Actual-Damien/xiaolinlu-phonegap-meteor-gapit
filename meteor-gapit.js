window.GapIt = (function () {
  var GapIt = function (Zepto) {
    var api = this,
        /* Private protected storage */
        _ = {};

    /* State */
    _.loaded = false;
    _.resetUrl = null;
    _.options = {};
    /* Default options */
    _.defaultOptions = {
      meteorUrl: null,
      replaceUrl: true
    };
    /* Helpers */
    _.ajax = function (url, successCallback, failureCallback) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onreadystatechange = function () {
        /* If request has completed and http status code is not okay */
        if (request.readyState === 4 && request.status !== 200) {
          if (typeof failureCallback === 'function') { failureCallback(url, request); }
        /* Else if request has completed and http status code is okay */
        } else if (request.readyState === 4 && request.status === 200) {
          if (typeof successCallback === 'function') { successCallback(url, request.responseText, request); }
        /* Else if in any other (transitional) state, just return */
        } else {
          return;
        };
      };
      request.send(null);
    };
    _.parseHTML = function(str) {
      var tmp = document.implementation.createHTMLDocument();
      tmp.documentElement.innerHTML = str;
      return tmp;
    };
    _.replaceDocument = function (data) {
      var dom = _.parseHTML(data),
          newHeadElements = Zepto(dom).find('head').find('script, link, meta').attr('data-gapit', 'injected'),
          newBody = Zepto(dom).find('body');

      Zepto(document).find('head [data-gapit="injected"]').remove();
      Zepto(document).find('head').append(newHeadElements);
      Zepto(document).find('body').html(newBody);
    };
    /* Control Flow */
    _.init = function () {
      _.loaded = true;
      _.resetUrl = window.location.toString();
      api.hijack(_.options.meteorUrl);
    };
    _.requestOkay = function (requestUrl, newDocument, request) {
      if (_.options.replaceUrl === true && 'history' in window && typeof window.history['replaceState'] === 'function') {
        window.history.replaceState({}, '', requestUrl);
      }
      _.replaceDocument(newDocument);
    };
    _.requestFailed = function (requestUrl, failedRequest) {
      window.document.title = 'Error!';
      alert('Error! Please check your internet connection and try again.');
      if (navigator && 'app' in navigator && typeof navigator.app['exitApp'] === 'function') { navigator.app.exitApp(); }
    };
    /* Exported API */
    api.activated = function () {
      return _.loaded;
    };
    api.activate = function (input) {
      var options = _.options = Zepto.extend({}, _.defaultOptions, input || {});
      if (!options.meteorUrl) {
        console.log('GapIt Error: GapIt activated without a meteorUrl!')
        return false;
      }
      document.addEventListener('load', function () { if (!_.loaded) { _.init(); } }, true);
    };
    api.hijack = function (requestUrl) {
      _.ajax(requestUrl, _.requestOkay, _.requestFailed);
    };
    api.reset = function () {
      window.location = _.resetUrl;
    };
    api.zepto = Zepto;
    /* Init */
    return api;
  }

  /* Custom (core-only) build of Zepto for DOM manipulation.
  /* Zepto v1.1.3-10-gf4129d5 - zepto - zeptojs.com/license */
  var Zepto=function(){function L(t){return null==t?String(t):E[C.call(t)]||"object"}function Z(t){return"function"==L(t)}function j(t){return null!=t&&t==t.window}function M(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function q(t){return"object"==L(t)}function z(t){return q(t)&&!j(t)&&Object.getPrototypeOf(t)==Object.prototype}function k(t){return"number"==typeof t.length}function B(t){return o.call(t,function(t){return null!=t})}function R(t){return t.length>0?n.fn.concat.apply([],t):t}function V(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function _(t){return t in a?a[t]:a[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function F(t,e){return"number"!=typeof e||f[V(t)]?e:e+"px"}function H(t){var e,n;return l[t]||(e=u.createElement(t),u.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),l[t]=n),l[t]}function I(t){return"children"in t?s.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function U(n,i,r){for(e in i)r&&(z(i[e])||P(i[e]))?(z(i[e])&&!z(n[e])&&(n[e]={}),P(i[e])&&!P(n[e])&&(n[e]=[]),U(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function D(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return Z(e)?e.call(t,n,i):e}function W(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function X(e,n){var i=e.className,r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?n.parseJSON(t):t:e):t}catch(i){return t}}function G(t,e){e(t);for(var n in t.childNodes)G(t.childNodes[n],e)}var t,e,n,i,T,S,r=[],s=r.slice,o=r.filter,u=window.document,l={},a={},f={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},c=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,g=/([A-Z])/g,m=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=u.createElement("table"),w=u.createElement("tr"),b={tr:u.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:w,th:w,"*":u.createElement("div")},N=/complete|loaded|interactive/,x=/^[\w-]*$/,E={},C=E.toString,O={},A=u.createElement("div"),$={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},P=Array.isArray||function(t){return t instanceof Array};return O.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,s=!r;return s&&(r=A).appendChild(t),i=~O.qsa(r,e).indexOf(t),s&&A.removeChild(t),i},T=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},S=function(t){return o.call(t,function(e,n){return t.indexOf(e)==n})},O.fragment=function(e,i,r){var o,l,a;return h.test(e)&&(o=n(u.createElement(RegExp.$1))),o||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=c.test(e)&&RegExp.$1),i in b||(i="*"),a=b[i],a.innerHTML=""+e,o=n.each(s.call(a.childNodes),function(){a.removeChild(this)})),z(r)&&(l=n(o),n.each(r,function(t,e){m.indexOf(t)>-1?l[t](e):l.attr(t,e)})),o},O.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},O.isZ=function(t){return t instanceof O.Z},O.init=function(e,i){var r;if(!e)return O.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&c.test(e))r=O.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=O.qsa(u,e)}else{if(Z(e))return n(u).ready(e);if(O.isZ(e))return e;if(P(e))r=B(e);else if(q(e))r=[e],e=null;else if(c.test(e))r=O.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=O.qsa(u,e)}}return O.Z(r,e)},n=function(t,e){return O.init(t,e)},n.extend=function(t){var e,n=s.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){U(t,n,e)}),t},O.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],o=i||r?e.slice(1):e,u=x.test(o);return M(t)&&u&&i?(n=t.getElementById(o))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:s.call(u&&!i?r?t.getElementsByClassName(o):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=function(t,e){return t!==e&&t.contains(e)},n.type=L,n.isFunction=Z,n.isWindow=j,n.isArray=P,n.isPlainObject=z,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=T,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,s,i=[];if(k(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(s in t)n=e(t[s],s),null!=n&&i.push(n);return R(i)},n.each=function(t,e){var n,i;if(k(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return o.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){E["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(s.apply(this,arguments))},ready:function(t){return N.test(u.readyState)&&u.body?t(n):u.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?s.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return Z(t)?this.not(this.not(t)):n(o.call(this,function(e){return O.matches(e,t)}))},add:function(t,e){return n(S(this.concat(n(t,e))))},is:function(t){return this.length>0&&O.matches(this[0],t)},not:function(e){var i=[];if(Z(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):k(e)&&Z(e.item)?s.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return q(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!q(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!q(t)?t:n(t)},find:function(t){var e,i=this;return e=t?"object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(O.qsa(this[0],t)):this.map(function(){return O.qsa(this,t)}):[]},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:O.matches(i,t));)i=i!==e&&!M(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!M(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return D(e,t)},parent:function(t){return D(S(this.pluck("parentNode")),t)},children:function(t){return D(this.map(function(){return I(this)}),t)},contents:function(){return this.map(function(){return s.call(this.childNodes)})},siblings:function(t){return D(this.map(function(t,e){return o.call(I(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=H(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=Z(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(s){n(this).wrapAll(e?t.call(this,s):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=Z(t);return this.each(function(i){var r=n(this),s=r.contents(),o=e?t.call(this,i):t;s.length?s.wrapAll(o):r.append(o)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0===arguments.length?this.length>0?this[0].innerHTML:null:this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))})},text:function(e){return 0===arguments.length?this.length>0?this[0].textContent:null:this.each(function(){this.textContent=e===t?"":""+e})},attr:function(n,i){var r;return"string"==typeof n&&i===t?0==this.length||1!==this[0].nodeType?t:"value"==n&&"INPUT"==this[0].nodeName?this.val():!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:this.each(function(t){if(1===this.nodeType)if(q(n))for(e in n)W(this,e,n[e]);else W(this,n,J(this,i,t,this.getAttribute(n)))})},removeAttr:function(t){return this.each(function(){1===this.nodeType&&W(this,t)})},prop:function(e,n){return e=$[e]||e,n===t?this[0]&&this[0][e]:this.each(function(t){this[e]=J(this,n,t,this[e])})},data:function(e,n){var i=this.attr("data-"+e.replace(g,"-$1").toLowerCase(),n);return null!==i?Y(i):t},val:function(t){return 0===arguments.length?this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value):this.each(function(e){this.value=J(this,t,e,this.value)})},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),s=i.offsetParent().offset(),o={top:r.top-s.top,left:r.left-s.left};"static"==i.css("position")&&(o.position="relative"),i.css(o)});if(0==this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r=this[0],s=getComputedStyle(r,"");if(!r)return;if("string"==typeof t)return r.style[T(t)]||s.getPropertyValue(t);if(P(t)){var o={};return n.each(P(t)?t:[t],function(t,e){o[e]=r.style[T(e)]||s.getPropertyValue(e)}),o}}var u="";if("string"==L(t))i||0===i?u=V(t)+":"+F(t,i):this.each(function(){this.style.removeProperty(V(t))});else for(e in t)t[e]||0===t[e]?u+=V(e)+":"+F(e,t[e])+";":this.each(function(){this.style.removeProperty(V(e))});return this.each(function(){this.style.cssText+=";"+u})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(X(t))},_(t)):!1},addClass:function(t){return t?this.each(function(e){i=[];var r=X(this),s=J(this,t,e,r);s.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&X(this,r+(r?" ":"")+i.join(" "))}):this},removeClass:function(e){return this.each(function(n){return e===t?X(this,""):(i=X(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(_(t)," ")}),void X(this,i.trim()))})},toggleClass:function(e,i){return e?this.each(function(r){var s=n(this),o=J(this,e,r,X(this));o.split(/\s+/g).forEach(function(e){(i===t?!s.hasClass(e):i)?s.addClass(e):s.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||u.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var s,o=this[0];return r===t?j(o)?o["inner"+i]:M(o)?o.documentElement["scroll"+i]:(s=this.offset())&&s[e]:this.each(function(t){o=n(this),o.css(e,J(this,r,t,o[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,s,r=n.map(arguments,function(e){return t=L(e),"object"==t||"array"==t||null==e?e:O.fragment(e)}),o=this.length>1;return r.length<1?this:this.each(function(t,u){s=i?u:u.parentNode,u=0==e?u.nextSibling:1==e?u.firstChild:2==e?u:null,r.forEach(function(t){if(o)t=t.cloneNode(!0);else if(!s)return n(t).remove();G(s.insertBefore(t,u),function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),O.Z.prototype=n.fn,O.uniq=S,O.deserializeValue=Y,n.zepto=O,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto);

  return new GapIt(Zepto);
})();
