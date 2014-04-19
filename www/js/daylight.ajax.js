/*
Setting
autoSend(�먮룞�쇰줈 蹂대궡湲�) : true
async(鍮꾨룞湲�) : true
Method : GET
type : auto

var a = $.ajax("http://daybrush.com/yk/board/daylightJS/test/json.php");
json.php�� content-type��  application/json => json�뺥깭�� �곗씠�곕줈 蹂댁뿬以��.

*/

//test private 
//interface  init, send, statechange
var _ajaxFunc = {
	"ajax" : {
		//珥덇린��
		init : function(ajax) {
			var target = new XMLHttpRequest();
			target.open(ajax.option.method, ajax.url, ajax.option.async);
			ajax.target = target;
		},
		//蹂대궡湲�
		send : function(ajax) {
			var request = ajax.target;
			if(typeof ajax.param === "string" &&  ajax.param != "") {
				var length = ajax.param.split("&").length;
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				request.setRequestHeader("Content-length", ajax.param.length);
			}
			request.send(ajax.param);
		},
		//�대떦 �뺣낫瑜� 媛�몄삩��.
		_get : function(ajax, request) {
			var contentType = request.getResponseHeader("content-type");
			switch(ajax.option.type) {
			case "auto":
				//JSON�뺥깭濡� 蹂��.
				if(contentType === "application/json")
					return ajax._parseJSON(request.responseText);
				
				//�섎㉧吏�� 洹몃깷 �띿뒪�몃줈
				if(!request.responseXML)
					return request.responseText;
		
			case "xml":
				//XML�대㈃ responseXML �몃뱶 �뺥깭濡� �섏뼱�덈떎.
				if(request.responseXML)
					return request.responseXML;
				break;
			case "text":
				return request.responseText;
				break;
			case "json":
				return ajax._parseJSON(request.responseText);
			}	
			
			return request.responseText;
		},
		statechange : function(ajax) {
			var request = ajax.target;
			var self = this;
			//state蹂寃�
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					//200�� �뺤긽
					if(request.status == 200) {
						//done�⑥닔 �덉쓣 寃쎌슦.
						if(ajax.func.done) {
							var value = self._get(ajax, request);
							alert(ajax.option.type);
							ajax._done(value, request);
						}
					} else {
						ajax._fail(request);
					}
					ajax._always(request);
				}
			};
			request.timeout = 5000;
			request.ontimeout = function() {
				ajax._timeout(request);
			}
		}
	},
	"script" : {
		init : function(ajax) {
			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.type = "text/javascript";
			ajax.target = script;
		},
		send : function(ajax) {
			setTimeout(function() {
				var script = ajax.target;
				if(ajax.option.type === "jsonp") {
					daylight.defineGlobal(ajax.callbackName, function(data) {
						ajax._done(data, script);
						ajax._always(script);
						
						window[ajax.callbackName] = undefined;
						script.parentNode.removeChild(script);
						delete window[ajax.callbackName];
					});
				}
				var e = daylight("head, body").o[0];
				if(e) e.appendChild(script);
				script.src = ajax.url;			
			}, 1);

		},
		get : function() {
		},
		statechange : function(ajax) {
			var script = ajax.target;
			var self = this;
			//state蹂寃�
			script.onreadystatechange = function () {
				//loading
				//interactive
				//loaded
				//complete
				if(this.status == "loaded") {
				} 
			};
			script.onerror = function() {
				ajax._fail(script);
				ajax._always(script);
			};
			script.onload = function() {
				if(ajax.option.type != "jsonp") {
					ajax._done(script.innerHTML, script);
					ajax._always(script);
				}
			};
		}
		
	}
};
daylight.ajax = function(url, option) {
	var cl = arguments.callee;
	if (!(this instanceof cl)) return new cl(url, option);

	//�듭뀡 珥덇린��
	this.option = {
		autoSend : this.autoSend,
		method : this.method,
		type : this.type,
		async : this.async
	};
	this.url = url;
	//肄쒕갚�⑥닔 珥덇린��.
	this.func = {
		done : null,
		always : null,
		fail : null,
		timeout : null,
		beforeSend : null
	}

	//�듭뀡�� �덈뒗吏 �녿뒗吏 寃��.
	if(option) {
		for(var k in option) {
			//func�� �대떦�섎뒗 �듭뀡�� �ㅼ뼱�ㅻ㈃ func�� �ｋ뒗��.
			this.func[k] === undefined? this.option[k] = option[k]: this.func[k] = option[k];
		}
	}
	option = this.option;
	
	var type = option.type === "jsonp"? "script" : "ajax";//|| option.type==="script" 
	var ajaxFunc = this.ajaxFunc = _ajaxFunc[type];//�대떦�섎뒗 ajax �명꽣�섏씠�ㅻ� 媛�몄삩��.
	
	//��낆뿉 留욊쾶 parameter�� url�� 諛붽퓭以��.
	this.setParameter(option.data);	
	
	ajaxFunc.init(this);//珥덇린��.
	
	
	ajaxFunc.statechange(this);//肄쒕갚�⑥닔 �ㅼ젙.

	//ajax�⑥닔瑜� 遺瑜대뒗 �쒓컙 蹂대궪 寃껋씤媛 �� 蹂대궪 寃껋씤媛 寃곗젙.
	if(option.autoSend)
		this.send();
	
}
daylight.ajax.prototype.extend = daylight.extend;
daylight.ajax.prototype.autoSend = true;
daylight.ajax.prototype.method = "GET";
daylight.ajax.prototype.type = "auto";
daylight.ajax.prototype.async = true;

daylight.ajax.prototype._parseJSON = function(text) {
	try {
		return JSON.parse(text);
	} catch (e) {
		return {};
	}
}


//callback�⑥닔 紐⑥쓬.
daylight.ajax.prototype.extend({
	beforeSend : function(func) {
		this.func.beforeSend = func;
		return true;
	},
	//寃곌낵媛 �뺤긽�곸쑝濡� �꾨즺�섎㈃ 遺瑜대뒗 �⑥닔
	done : function(func) {
		this.func.done = func;
		return this;
	},
	//�붿껌�쒓컙�� �ㅻ컮�섎㈃ 遺瑜대뒗 �⑥닔
	timeout : function(func) {
		this.func.timeout = func;
		return this;
	},
	//�붿껌�ㅽ뙣�섎㈃ 遺瑜대뒗 �⑥닔
	fail : function(func) {
		this.func.fail = func;
		return this;
	},
	//�ㅽ뙣�섎뱺 留먮뱺 遺瑜대뒗 �⑥닔
	always : function(func) {
		this.func.always = func;
		return this;
	}
});
//肄쒕갚�⑥닔 �몄텧�섎뒗 �⑥닔
daylight.ajax.prototype.extend({
	_done : function(value, target) {
	
		if(this.func.done)
			this.func.done.call(target, value, target);
	},
	_fail : function(target) {
		if(this.func.fail)
			this.func.fail.call(target, target);
	},
	_timeout : function(target) {
		if(this.func.timeout)
			this.func.timeout.call(target, target);
	},
	_always : function(target) {
		if(this.func.always)
			this.func.always.call(target, target);
	}
});

daylight.ajax.prototype.get = function() {
	return this._get(this.request);
}
daylight.ajax.prototype.send = function() {
	if(this.func.beforeSend)
		this.func.beforeSend(this.target);
		
	this.ajaxFunc.send(this);
	
	return this;
}

//parameter愿�� �⑥닔��
daylight.ajax.prototype.extend({
	setParameter : function(data) {

		if(!data)
			this.param = "";
		else if(typeof data === "string")
			this.param = data;
		else if(daylight.isPlainObject(data))
			this.param = this.objectToParam(data, this.option.method);
		else if(window.FormData && data.constructor == FormData)
			this.param = data;
		else
			;//�앷컖�� 蹂닿쿋��...
			
		if(this.option.type === "jsonp") {
			this.setJSONP();
			this.url += "&" + this.param;
			return;
		} else if(this.option.method === "GET") {
			var prefix = (this.url.indexOf("?") != -1) ? "&"  : "?" ;
			this.url += prefix + this.param;
		}
		
	},
	objectToParam : function(data, method) {
		var param = "";
		for (var key in data) {
		    if (param != "")
		        param += "&";
	
		    param += key + "=" + ((method=== "POST") ? encodeURI(data[key]) : data[key]);
		}
		return param;
	}
});
//jsonp 泥섎━ 愿��.
daylight.ajax.prototype.extend({
	setJSONP : function() {
		this.callbackName = "daylight" + parseInt(Math.random() * 1000000000);
		var prefix = (this.url.indexOf("?") != -1) ? "&"  : "?" ;
		var callback = "callback=" + this.callbackName;

		this.url += prefix + callback;
	}
});

