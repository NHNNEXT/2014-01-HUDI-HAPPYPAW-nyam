/*
Setting
autoSend(자동으로 보내기) : true
async(비동기) : true
Method : GET
type : auto

var a = $.ajax("http://daybrush.com/yk/board/daylightJS/test/json.php");
json.php는 content-type이  application/json => json형태의 데이터로 보여준다.

*/

//test private 
//interface  init, send, statechange
var _ajaxFunc = {
	"ajax" : {
		//초기화
		init : function(ajax) {
			var target = new XMLHttpRequest();
			target.open(ajax.option.method, ajax.url, ajax.option.async);
			ajax.target = target;
		},
		//보내기
		send : function(ajax) {
			var request = ajax.target;
			if(typeof ajax.param === "string" &&  ajax.param != "") {
				var length = ajax.param.split("&").length;
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				request.setRequestHeader("Content-length", ajax.param.length);
			}
			request.send(ajax.param);
		},
		//해당 정보를 가져온다.
		_get : function(ajax, request) {
			var contentType = request.getResponseHeader("content-type");
			switch(ajax.option.type) {
			case "auto":
				//JSON형태로 변환.
				if(contentType === "application/json")
					return daylight.parseJSON(request.responseText);
				
				//나머지는 그냥 텍스트로
				if(!request.responseXML)
					return request.responseText;
		
			case "xml":
				//XML이면 responseXML 노드 형태로 되어있다.
				if(request.responseXML)
					return request.responseXML;
				break;
			case "text":
				return request.responseText;
				break;
			case "json":
				return daylight.parseJSON(request.responseText);
			}	
			
			return request.responseText;
		},
		statechange : function(ajax) {
			var request = ajax.target;
			var self = this;
			//state변경
			request.onreadystatechange = function () {
				if (request.readyState == 4) {
					//200이 정상
					if(request.status == 200) {
						//done함수 있을 경우.
						if(ajax.func.done) {
							var value = self._get(ajax, request);
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
			//state변경
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

	//옵션 초기화
	this.option = {
		autoSend : this.autoSend,
		method : this.method,
		type : this.type,
		async : this.async
	};
	this.url = url;
	//콜백함수 초기화.
	this.func = {
		done : null,
		always : null,
		fail : null,
		timeout : null,
		beforeSend : null
	}

	//옵션이 있는지 없는지 검사.
	if(option) {
		for(var k in option) {
			//func에 해당하는 옵션이 들어오면 func에 넣는다.
			this.func[k] === undefined? this.option[k] = option[k]: this.func[k] = option[k];
		}
	}
	option = this.option;
	
	var type = option.type === "jsonp"? "script" : "ajax";//|| option.type==="script" 
	var ajaxFunc = this.ajaxFunc = _ajaxFunc[type];//해당하는 ajax 인터페이스를 가져온다.
	
	//타입에 맞게 parameter랑 url을 바꿔준다.
	this.setParameter(option.data);	
	
	ajaxFunc.init(this);//초기화.
	
	
	ajaxFunc.statechange(this);//콜백함수 설정.

	//ajax함수를 부르는 순간 보낼 것인가 안 보낼 것인가 결정.
	if(option.autoSend)
		this.send();
	
}
daylight.ajax.prototype.extend = daylight.extend;
daylight.ajax.prototype.autoSend = true;
daylight.ajax.prototype.method = "GET";
daylight.ajax.prototype.type = "auto";
daylight.ajax.prototype.async = true;


//callback함수 모음.
daylight.ajax.prototype.extend({
	beforeSend : function(func) {
		this.func.beforeSend = func;
		return true;
	},
	//결과가 정상적으로 완료되면 부르는 함수
	done : function(func) {
		this.func.done = func;
		return this;
	},
	//요청시간이 오바되면 부르는 함수
	timeout : function(func) {
		this.func.timeout = func;
		return this;
	},
	//요청실패하면 부르는 함수
	fail : function(func) {
		this.func.fail = func;
		return this;
	},
	//실패하든 말든 부르는 함수
	always : function(func) {
		this.func.always = func;
		return this;
	}
});
//콜백함수 호출하는 함수
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

//parameter관련 함수들
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
			;//생각해 보겠음...
			
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
//jsonp 처리 관련.
daylight.ajax.prototype.extend({
	setJSONP : function() {
		this.callbackName = "daylight" + parseInt(Math.random() * 1000000000);
		var prefix = (this.url.indexOf("?") != -1) ? "&"  : "?" ;
		var callback = "callback=" + this.callbackName;

		this.url += prefix + callback;
	}
});


