(function(window) {

var document = window.document || document;
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
var navigator = window.navigator || navigator;
var userAgent = navigator.userAgent;


if(!document.querySelector) {
	alert("지원하지 않는 브라우저입니다.");
	return;
}

var daylight = function(query, parent) {
	return daylight.init(query, parent);
};

window.$ = window.daylight = daylight;

daylight.document = document;

daylight.version = "0.2.1";


daylight.CONSTANT = {SLOW:"slow", FAST:"fast"};
daylight.OPTION = {speed : daylight.CONSTANT.FAST};


var CONSTANT = daylight.CONSTANT,
	OPTION = daylight.OPTION;


var _textToElement = function(text) {
	var e = document.createElement("div");
	e.innerHTML = text;
	return e;
}
var _sumArray = function(arr) {
	var a = [];
	var l = arr.length;
	for(var i = 0; i < l; ++i) {
		var type = daylight.type(arr[i]);
		if(type === "array")
			a.concat(arr[i]);
	}
	return a;
}
var _style = function(element) {
	return window.getComputedStyle && window.getComputedStyle(element) || element.currentStyle || element.style;
}
var _curCss = function(element, name, pre_styles) {
	if(!element || !name)
		return;
	//pre_styles
	//element에 대해 미리 정의한 style들의 모음.
	var style = pre_styles && pre_styles[name] || _style(element)[name];
	//한 스타일 속성  style.length - 1 = 문자 끝자리가 %
	if(style[style.length - 1] === "%") {
		var percentage = parseFloat(style);
		var offset_parent = element.offsetParent;

		var element_styles = _style(offset_parent);
		var dimension = _curCssHook(offset_parent, name, element_styles);
		
		//%로 된 css 속성을 절대값 pixel로 바꿔준다. 크롬은 알아서 픽셀로 바꿔준다.
		return percentage * dimension / 100 + "px";
	}
	
	return style;
}
var _dimensionCssHook = function(element, component, pre_styles) {
	var border_left = _curCss(element, "border-"+component[0]+"-width", pre_styles);
	var border_right = _curCss(element, "border-"+component[1]+"-width", pre_styles);
	var padding_left = _curCss(element, "padding-"+component[0], pre_styles);
	var padding_right = _curCss(element, "padding-"+component[1], pre_styles);
	var inner = (component[0] === "left") ? $(element).innerWidth() : $(element).innerHeight();
	var dimension = inner - parseFloat(border_left) - parseFloat(border_right) - parseFloat(padding_left) - parseFloat(padding_right);	
	//console.log("Dimension");
	return dimension;
}

var _curCssHook = function(element, name, pre_styles) {
	//content width에 따라 바뀔 수 있는 속성
	var lrtype = ["left", "right", "width", "margin-left", "margin-right", "padding-left", "padding-right", "border-left-width", "border-right-width"];
	//content height에 따라 바뀔 수 있는 속성
	var tbtype = ["top", "bottom", "height", "margin-top", "margin-bottom", "padding-top", "padding-bottom", "border-top-width", "border-bottom-width"];	
	
	
	if(lrtype.indexOf(name) !== -1) {
		var requestComponent = ["left", "right"];
		return _dimensionCssHook(element, requestComponent, pre_styles);
	} else if(tbtype.indexOf(name) !== -1) {
		var requestComponent = ["top", "bottom"];
		return _dimensionCssHook(element, requestComponent, pre_styles);
	} else if(name === "font-size") {
		return _curCss(element.offsetParent, name);
	}
	
	//%를 쓸 수 있는 css 속성이 있는지 확인할 수가 없다 ;;; 조사해보자 ㅠㅠ
	return 0;
}
/*
	
	daylihgtObject의 매핑된 오브젝트 각각에 대해 element를 추가한다.
*/
var _addDomEach = function(daylightObject, element, callback) {
	if(daylightObject.length == 0)
		return;
		
	var t = daylight.type(element, true);
	var e;
	switch(t) {
	case "string":
	case "number":
		e = _textToElement(element).childNodes;
		break;
	case "daylight":
		e = element.o;
		break;
	case "nodelist":
	case "array":
		e = element;
	case "html":
		e = [element];
	}
	if(e === undefined)
		return;
	
	var length = e.length;
	//1개만 있을 경우 원본을 추가한다. 원본이 추가될 경우 원래 있던 곳은 자동으로 삭제 된다.
	if(daylightObject.length == 1) {
		var self = daylightObject.o[0];
		for(var i = 0; i < length; ++i) {
			if(self == e[i])
				continue;
			
			callback.call(self, self, e[i]);
		}
		
	} else {
		//복사한 element를 추가한다.
		daylightObject.each(function(self, index) {
			for(var i = 0; i < length; ++i) {
				if(self == e[i])//자기 자신에 자신을 추가 할 수 없다.
					continue;
				callback.call(self, self, daylight.clone(e[i]));
			}
		});
		//이제 다 추가하고 원래 있던 건 지운다.
		for(var i = 0; i < length; ++i) {
			var parent = e[i].parentNode;
			if(!parent)
				continue;
			
			parent.removeChild(e[i]);
		}
	}
}
//Array's IndexOf
var arr = [];

var indexOf = arr.indexOf;
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (element) {
		var length = arr.length;
		
		for(var i = 0; i < length; ++i) {
			if(arr[i] == object)
				return i;
		}		
		return -1;
    }
}


//FORM INPUT, SELECT VALUE값는 찾는 함수와 설정하는 함수
var _value = {
	//SELECT 태그에 해당하는 함수
	select : {
		get : function(element) {
			var result = [];
			var options = element && element.options;
			var opt;
			length=options.length
			for (var i=0; i < length; ++i) {
				opt = options[i];
				
				if (opt.selected)
					result[result.length] = (opt.value || opt.text);
			}
			return result.length > 1 ? result : result[0];
		},
		set : function(element, key) {
			var options = element && element.options;			
			if(!options)
				return;
			
			var result = [];
			var type = daylight.type(key);
			var length = options.length;
			if(!length)
				return;
			//isSelected => X
			switch(type) {
			case "number":
				for(var i = 0; i < length; ++i) {
					var opt = options[i];
					opt.selected = false;
				}
				options[key].selected = true;
				break;
			case "string":
				for(var i = 0; i < length; ++i) {
					var opt = options[i];
					var value = (opt.value || opt.text);
					opt.selected = value == key;
				}
				break;
			case "array":
				for(var i = 0; i < length; ++i) {
					var opt = options[i];
					var value = (opt.value || opt.text);
					opt.selected = (key.indexOf(value) >= 0);
				}
			}
		}
	},
	input : {
		get : function(element, is_value) {
			var type = element.type;
			if(!_value[type])
				return element.value;
			else
				return _value[type].get(element, is_value);
		},
		set : function(element, key) {
			var type = element.type;
			if(!_value[type])
				element.value = key;
			else
				_value[type].set(element, key);	
		}
	},
	textarea : {
		get : function(element) {
			return element.innerText;
		},
		set : function(element, key) {
			element.innerText = key;
		}
	},
	radio : {
		get : function(element, is_value) {
			if(is_value || element.checked) return element.value;
			return;	
		},
		set : function(element, key) {
			var type = daylight.type(key);
			if(type == "array")
				element.checked = !!(key.indexOf(element.value) >= 0); 
			else
				element.checked = (element.value === key);
		}		
	},
	checkbox : {
		get : function(element, is_value) {
			if(is_value || element.checked) return element.value;
			return;	
		},
		set : function(element, key) {
			var type = daylight.type(key);
			if(type == "array")
				element.checked = !!(key.indexOf(element.value) >= 0);
			else 
				element.checked = element.value === key;
		}
	}
	
};

daylight.Object = function(arr) {
	var size = arr.length;
	this.o = this.objects = arr;
	this.length = size;
	//옵션 설정하면 제이쿼리랑 비슷하게 사용 가능 하지만 느려짐.
	if(OPTION.speed === CONSTANT.SLOW) {
		this.length = size;
		for(var i = 0; i < size; ++i) {
			this[i] = arr[i];
		}
	}	
}


//daylight.Object의 프로토타입은 Array이다. JQuery가 느린 원인 중 하나. 하지만 매우 편하게 사용할 수 있다.
daylight.Object.prototype = [];

//프로토타입을 daylight.fn으로 묶는다.
daylight.fn = daylight.Object.prototype;

//daylight object라는 것을 인식
daylight.fn.daylight = "daylight";

//확장 함수
daylight.extend = daylight.fn.extend = function() {
	var a = arguments;
	var length = a.length;
	if(length == 0)
		return this;
	
	var i = 0;
	var target = this;
	
	if(typeof target === "boolean") {
		target = a[0] || {};
	}	
	
	var name;
	for(; i < length; ++i) {
		var options = a[i];
		if(typeof options !== "object")
			continue;

		for(name in options) {
			var src = target[name];
			var copy = options[name];

/*
	중복제거
			//ildan  continue;
			if(src)
				continue;
*/
			
			target[name] = copy;
		}
	}
	return target;
}

//daylight만의 타입  Array, String 등 구분가능.
//jQuery jQuery.type 참고.
daylight.type = function(obj, expand) {
	var type = typeof obj;
	if(!expand)
		return obj==null ? obj+"" : type == "object" ? obj.daylight || class2type[toString.call(obj)] || "object" : type;
	
	return obj==null ? obj+"" : type == "object" ? obj instanceof HTMLElement ? "html" : obj.daylight || class2type[toString.call(obj)] || "object" : type;	
}

daylight.css = function(element, name, value) {
	//set CSS value가 있으면 style을 정해준다.
	if(value !== undefined && typeof value != "boolean") {
		element.style[name] = value;
		return value;
	}
	//자동 parseFloat을 해준다.
	if(value === true) {
		var returnValue = parseFloat(_curCss(element, name));
		if(!returnValue)//returnValue가 NaN 일경우 returnValue == NaN이 false다 ㅠㅠㅠ NaN일 경우 비교문에서는 false로 나온다.. ㅠㅠㅠ
			return 0;//auto인 경우?
			
		return returnValue;
	}
	return _curCss(element, name);
}

//define 관련 함수들 모음
daylight.extend( {
	//해당 함수를 선언합니다.
	define : function(object, name, func) {
		var type = typeof object;
		if(type == "object" && object.__proto__)
			object.__proto__[name] = func;
		else if(daylight.indexOf(["function", "object"], type) != -1 && object.prototype)
			object.prototype[name] = func;
		else if(type == "object")
			object[name] = func;
	},
	//GetterSetter함수를 만듭니다.
	defineGetterSetter :function(object, name) {
		this.defineGetter(object, name);
		this.defineSetter(object, name);
	},
	defineGetter : function(object, name, func) {
		if(!func)
			func = function(name){return function() {return this[name];}}(name);
			
		name =  "get" + name.charAt(0).toUpperCase() + name.substr(1, name.length);	
		this.define(object, name, func);
	},
	defineSetter : function(object, name, func) {
		if(!func)
			func = function(name){return function(value) {return this[name] = value;}}(name);
			
		name =  "set" + name.charAt(0).toUpperCase() + name.substr(1, name.length);	
		this.define(object, name, func);
	}
	//전역변수를 만듭니다.
	,defineGlobal : function(name, o) {
		var typeName = this.type(name);
		if(typeName === "string")
			window[name] = o;
	}
});

//내용을 복사합니다.
daylight.clone = function(node, dataAndEvent, deepDataAndEvent) {
	var n = node.cloneNode();
	n.innerHTML = node.innerHTML;
	return n;
}
/*??제거 대상*/
daylight.create = function(classFunction) {
	return function() {
		var a = new function(arg) {
			return classFunction.apply(this, arg);
		}(arguments);
		a.__proto__ = classFunction.prototype;
		
		return a;
	};
}


daylight.extend({
/**
* @func : daylight.parseJSON(text)
* @description : jsonString을 Object로 바꿔준다.
* @param : jsonString
* @return : Object(JSON)
*/
	parseJSON : function(text) {
		try {
			//이미 object라면 바꿔줄 필요가 없다.
			if(typeof text === "object")
				return text;
			
			return JSON.parse(text);
		} catch (e) {
			//JSON형식이 아니라면 에러...
			return {};
		}
	}
});
daylight.extend({
	nodeName : function(element, compare) {
		var nodeName = element.nodeName;
		
		if(compare !== undefined)//비교 대상이 있으면 비교값을 리턴 true, false;
			return nodeName === compare;
			
		return nodeName;//비교 대상이 없으면 노드 이름만 반환.
	},
	/**
* @func : daylight.isNode(Node)
* @description : 해당 객체가 Node인지 확인
* @param : Node
* @return : Boolean(노드이면 true 아니면 false)
*/
	isNode : function(o) {
		if(o instanceof Node)
			return true;
	
		return false;
	},
/**
* @func : daylight.isElement(Node)
* @description : 해당 객체가 Element인지 확인
* @param : Element
* @return : Boolean(Element이면 true 아니면 false)
*/
	isElement : function(o) {
		if(!o)
			return false;
		
		//nodeType 이 1이면 HTMLElement이다.
		if(o.nodeType === 1)
			return true;
	
		return false;
	},
	isPlainObject : function(n) {
		if(!n)
			return false;
		//PlainObject의 생성자는 Object이다???
		if(n.constructor === Object)
			return true;
	}
});

/**
* @func : daylight.replace(SearchValue, NewValue, String)
* @description : replaceAll
* @param : from(바뀔 문자), to(바꿀 문자), str(문자열)
* @return : String
*/
daylight.replace = function(from, to, str) {
	return str.split(from).join(to);
}
//해당 index를 보여줍니다.
daylight.index = function(arr, object) {
	var type = daylight.type(arr);
	
	//indexOf라는 함수가 index와 같다.
	if(arr.indexOf)
		return arr.indexOf(object);
	
	if(type === "object") {
		//key value 쌍을 이루는 plainObject 일 것이다.
		for(var key in arr) {
			if(arr[key] === object)
				return key;
		}
		return "";
	} else {
		var length = arr.length;
		
		for(var i = 0; i < length; ++i) {
			if(arr[i] == object)
				return i;
		}
		//못찾으면 -1을 반환.
		return -1;
	}
}
daylight.extend({
	//각각의 요소에 대해 콜백함수를 실행시킨다.
	each : function(arr, callback) {
		var type = daylight.type(arr, true);
		//배열 또는 nodelist인 경우
		if(type === "array" || type === "nodelist") {
			var length = arr.length;
			for(var i = 0; i < length; ++i)
				callback.call(arr[i], arr[i], i, arr);//i == index, arr
		} else if(type == "object") {
			for(var i in arr) 
				callback.call(arr[i], arr[i], i, arr);
		} else if(type === "daylight") {
				arr.each(callback);
		}
		
		return arr;
	},
	//해당 object를 갖고 있는지 확인 selector도 가능 true / false
	has : function(element, object, isContainParent) {
		var is_element = daylight.isElement(object);
		var is_selector = (typeof object === "string");
		return is_element && daylight.contains(element, object, isContainParent) ||	
				is_selector && daylight.contains(element, element.querySelector(object));
	
	},
	//해당 object를 갖고 있는지 확인 element만 가능
	contains : function(parent, node, isContainParent) {
		return (isContainParent && parent === node || parent !== node )&& parent.contains(node);
	}
});
//addClass, removeClass, hasClass
daylight.extend({
	/**
	* @func : daylight.removeClass(Element, className)
	* @description : 클래스를 삭제를 합니다.
	* @func : daylight.removeClass(Element, className, Boolean(ignore Checking Element))
	* @description : 클래스를 삭제를 합니다. (3번째 인자가 true로 들어오면 첫번째 인자가 Element인지 검사를 하는 코드를 무시합니다.)
	* @param : element(삭제할 element), className : 삭제할 클래스 이름, ignoreCheck : element의 검사를 무시할 수 있다.(중복 체크)
	* @return : Boolean(삭제 체크)
	*/
	removeClass : function(element, className, ignoreCheck) {
		if(!ignoreCheck && !daylight.isElement(element))
			return false;
			
		var name = element.className;
		var arr = name.split(" ");
		var length = arr.length;
		var afterClassName = "";

		
		for(var i = 0; i < length; ++i) {
			var eClass = arr[i];
			if(eClass == className)
				continue;
			afterClassName += afterClassName ? " " + eClass : eClass
		}
		element.className = afterClassName;
		
		return true;
	},
	/**
	* @func : daylight.hasClass(Element, className)
	* @description : 클래스를 가지고 있는지 확인
	* @param : Element(찾을 element), className : 찾을 클래스 이름
	* @return : Boolean(가지고 있는지 체크)
	*/
	hasClass : function(element, className) {

		if(!daylight.isElement(element))
			return false;
			
		var name = element.className;
		var arr = name.split(" ");
		var length = arr.length;
		for(var i = 0; i < length; ++i) {
			if(arr[i] == className)
				return true;
		}
		return false;
	}, 
	/**
	* @func : daylight.addClass(Element, className)
	* @param : element(추가할 element), className(추가할 클래스 이름)
	* @return : Boolean(추가되었는지 체크)
	*/
	addClass : function(element, className) {
		if(daylight.hasClass(element, className))
			return false;
	
		if(element.className == "")
			element.className = className;
		else
			element.className += " " + className;
			
		return true;
	},
	toggleClass : function(element, className, className2) {		
		var is_add = daylight.addClass(element, className);
		if(!is_add) {
			//className이 이미 있다. -> className 제거
			daylight.removeClass(element, className, true);
			
			//className2가 없다. -> className2 추가.
			if(className2)
				daylight.addClass(element, className2);
				
			return false;
		} else if(className2) {
			//className이 추가되었다. className2이 있다.
			daylight.removeClass(element, className2, true);
		}
		return true;
	}
});

/**
* @func : daylight.init(query)
* @param : query(CSS Query)
* @return : new daylight.Object
*/
daylight.$ = daylight.init = function(query, option) {
	var objects;
	var t = daylight.type(query);
	switch(t) {
	case "daylight":
		return query;	
	case "string":
		objects = query ? document.querySelectorAll(query) : [];
		if(!objects) objects = [];
		break;
	case "array":
	case "nodelist":
		objects = query;
		break;
	default:
		objects = [query];
	}
	return new this.Object(objects, option);
}
/**
* @func : daylight.template(object, template)
* @param : object(Array, Object), template(String, Daylight)
* @return : html(String)
*/
daylight.template = function(obj, template) {
	var type = this.type(obj);
	var templateType = this.type(template);
	
	if(templateType == "daylight")
		template = template.ohtml();//html 형태로 변환
		
	if(type == "array") {//배열이면 리스트 형태로 만든다.
		var contents = [];
		var length = obj.length;
		for(var i = 0; i < length; ++i) {
			var content = obj[i];
			contents[contents.length] = this.template(content, template);//배열의 요소를 다시 template을 만든다.
		}
		return contents.join(" ");
	} else if(type == "object") {//배열의 요소를 분석해서 {key}를 바꿔준다.
		for(var k in obj) {
			var value = obj[k];
			if(this.type(value) == "array") {//만드는 중
				var regx = new RegExp('{' + k + '}((.|\n|\r)*?){/'+ k + '}', 'g');
				var list = template.match(regx);
				
				if(!list)
					continue;
				
				for(var i = 0; i < list.length; ++i) {
					var sub_template = list[i];
					sub_template = sub_template.replace("{" + k + "}", "");
					sub_template = sub_template.replace("{/" + k + "}", "");
					template = template.replace(list[i], daylight.template(value, sub_template) );//{key} => value
				}
				
			} else {
				if(value === undefined)
					value = "";
				template = daylight.replace("{" + k + "}", value, template);//{key} => value
			}
		}
		//console.log(template);
		return template;
	} else {
		//배열이나 Dictionary 형태가 아닌 다른 것들은 키를 1로 하고 value로 바꿔준다.
		return daylight.replace("{1}", obj, template);//{1} => value
	}
	return "";
}
/**
* @func : daylight.attr(name, value)
* @param : name(String), value(undefined, String)
* @return : attribute(String)
*/
daylight.fn.attr = function(name, value) {
	if(value === "" || value) {
		this.each(function(obj) {
			if(typeof obj == "object") {//속도 저하의 원인을 찾자!! 10ms 증가
				obj.setAttribute? obj.setAttribute(name, value) : obj[name] = value;
			}
		});
		return this;
	}
	
	var o = this.o[0];
	if(typeof o == "object")	
		return  o.getAttribute ? o.getAttribute(name) : o[name];
	else
		return;

}

daylight.fn.css = function(name, value) {
	if(!(value === undefined)) {
		if(typeof name === "object") {
			this.forEach(function(e) {
				for(var key in name) {
					e.style[key] = name[key];
				}
			});
		} else {
			this.forEach(function(e) {
				e.style[name] = value;
			});
		}
		return this;
	}
		
	return _curCss(this.o[0], name);
}
//Event
daylight.fn.extend({
	drag : function(dragFunc) {
		var dragObject = null;
		var is_drag = false;
		var dragDistance = {x : 0, y : 0};
		var prePosition = null;
		
		var mouseDown = function(e) {
			is_drag = true;
			prePosition = daylight.$E.cross(e);
			dragDistance = {stx :prePosition.pageX, sty : prePosition.pageY, x : 0, y : 0, dx:0, dy:0};
			dragObject = e.target || e.srcElement;
	/* 		console.log("DRAG START"); */
			dragFunc(dragObject, e, dragDistance);
		};
		var mouseMove = function(e) {
			if(!is_drag)
				return;	
			var position = daylight.$E.cross(e);
			dragDistance.dx = position.pageX - prePosition.pageX;
			dragDistance.dy = position.pageY - prePosition.pageY;
			dragDistance.x += dragDistance.dx;
			dragDistance.y += dragDistance.dy;
	
			prePosition = position;
			
			if(dragFunc) dragFunc(dragObject, e, dragDistance);
			e.preventDefault();
		};
		var mouseUp = function(e) {
			if(!is_drag)
				return;
			dragObject = null;
			is_drag = false;
		}
		
		this.addEvent("mousedown", mouseDown);
		this.addEvent("mousemove", mouseMove);
		this.addEvent("mouseup", mouseUp);
		this.addEvent("mouseleave", mouseUp);
		
		this.addEvent("touchstart", mouseDown);
		this.addEvent("touchmove", mouseMove);
		this.addEvent("touchend", mouseUp);
		
		return this;
	},
	on: function(key, func) {
		if(func) {
			this.forEach(function(e) {
				if(e.addEventListener){
					e.addEventListener(key, func);    
				} else if(e.attachEvent){ // IE < 9 :(
				    e.attachEvent("on" + key, func);
				}
			});
		} else {
			this.each(function(e) {
				this[key]();
			});
		}
		return this;
	},
	ready: function(func) {
		var listener =  function (e) {
			if (e && e.readyState  || this.readyState === "interactive" ) {
				func.call(this, e);
			}
		};
		this.each(function() {
			console.log(this.readyState);
			if(this.readyState === "interactive" || this.readyState === "complete")
				listener({readyState : "interactive"});
		});
		
		this.on("readystatechange", listener);

	}
});
daylight.fn.equal = function(object) {
	var type = daylight.type(object, true);
	if(type === "html" && this.length === 1 && object === this.o[0]) {
		return true;
	} else if(type === "daylight" &&  this.length === object.length) {
		for(var i = 0; i < object.length; ++i) {
			if(this.index(object.o[i]) === -1)
				return false;

		}
		return true;
	}
	return false;
}
daylight.fn.find = function(query) {
	var o = [];
	this.each(function() {
		if(!daylight.isElement(this))
			return;
		
		var a = this.querySelectorAll(query);
		var l = a.length;
		for(var i = 0; i < l; ++i) {
			o[o.length] = a[i];
		}
	});
	return daylight(o);
}
daylight.fn.extend({
	/*
		$().filter(function(object, index, arr) {
			return true이면 arr 추가 false이면 arr 추가 X
		
		return 값은 $(arr)
	*/
	filter : function(func) {
		var type = daylight.type(func);
		var objects = this.o;
		var length = this.length;
		var arr = [];
		switch(type) {
		case "function":
			for(var i = 0; i < length; ++i) {
				var o = objects[i];
				var a = func.call(o, o, i, objects);
				if(a)arr[arr.length] = o;
			}
			return daylight(arr);
		}
		
		return daylight(arr);
	},
	/*
		selector 또는 element를 갖고 있는 지 확인 isContaintParent가 true이면 그게 자신인지 까지 확인
		
	*/
	has: function(selector, isContainParent) {
		if(daylight.isElement(selector)) {
			return this.filter(function() {
				return daylight.contains(this, selector, isContainParent);
			});
		} else if(typeof selector === "string"){
			return this.filter(function() {
				return daylight.contains(this, this.querySelector(selector));
			});		
		}
		return daylight([]);
	},
	/*
		검색한 element에서 가져오고 싶은 값을 arr으로 반환
		
	*/
	map: function(func) {	
		var objects = this.o;
		var length = this.length;
		var arr = [];
		for(var i = 0; i < length; ++i)
			arr[i] = func.call(objects[i], i, objects);
		
		return daylight(arr);
	},
	/*
		각각의 element에 대해 일을 수행한다.
		인자 (object, index, array)
		
	*/
	each : function(callback) {
		var objects = this.o;
		var length = this.length;
		for(var i = 0; i < length; ++i) {
			var object = objects[i];
			callback.call(object, object, i, objects);
		}
		return this;
	}
});

daylight.fn.extend({
	getClass : function() {
		var obj = this.o[0];
		//var type = daylight.type(obj);
		if(obj instanceof HTMLElement) {
			return this.o[0].className.split(" ");
		}
		return [];
	},
	addClass : function(className) {
		this.each(function(e, index) {
			daylight.addClass(e, className);
		});
		return this;
	},
	hasClass : function(className, index) {
		if(!index)
			index = 0;
		if(!this.length)
			return false;
		
		return daylight.hasClass(this.o[index], className);
	},
	/*
		클래스가 있으면 제거 없으면 추가한다.
		
		className이 있으면 className 제거 , className2 추가
		className2가 있으면 className2제거, className 추가
		
	*/
	toggleClass : function(className, className2) {
		//var obj = this;
		if(this.length == 0)
			return;
		
		//if(this.size == 1)
		//	return daylight.toggleClass(this.o[0], className, className2);
			
		this.each(function(e, index) {
			daylight.toggleClass(e, className, className2);
		});
		return this;
	},
	removeClass : function(className) {
		//var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
		this.each(function(element) {
			daylight.removeClass(element, className);
		});
		
		return this;
	}
});

/*
	before
	<p>
	prepend
	aa
	
	append
	</p>
	after
*/
daylight.fn.extend({
	before : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element) {
			this.insertHTML("beforebegin", e); 
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target) && target.parentNode)
				target.parentNode.insertBefore(element, target);
		});
		return this;
	},
	prepend : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element) {
			this.insertHTML("afterbegin", e);
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target))
				target.insertBefore(element, target.firstChild);
		});
		return this;
	},
	append : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element) {
			this.insertHTML("beforeend", e);
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target))
				target.appendChild(element);
		});
		return this;
		
	},
	after : function(e) {
		var is_element = daylight.isElement(e);//type 검사
		if(!is_element) {
			this.insertHTML("afterend", e);
			return this;
		}
		_addDomEach(this, e, function(target, element) {
			if(daylight.isElement(target) && target.parentNode)
				target.parentNode.insertBefore(element,  target.nextSibling );
		});
		return this;
	},
	insertHTML : function(position, html) {//html 삽입하는 함수
		this.each(function(element) {
			if(!daylight.isElement(element))//만약 element가 아니면 insertAdjacentHTML을 사용할 수 없다.
				return false;
			
			element.insertAdjacentHTML(position, html);
		});
		return this;
	}
});
daylight.fn.extend({
	removeChild : function(element) {
		var size = this.length;
		for(var i = 0; i < size; ++i) {
			try {
				this.o[i].removeChild(element);
			} catch(e) {
			}
		}
		return this;
	},
	remove : function(selector) {
		var type = daylight.type(selector, true);
		if(type === "undefined") {
			this.each(function(element) {
				var parent = element.parentNode;
				if(!parent)
					return;
				try {
					parent.removeChild(element);
				} catch(e) {}
			});
		} else if(type === "html") {
			this.removeChild(selector);
		} else if(type === "string"){
			this.each(function(element) {
				var a = element.querySelectorAll(selector);
				var length = a.length;
				for(var i = 0; i < length; ++i) {
					try {
						element.removeChild(a[i]);
					} catch(e) {
						console.log(e);
					}
				}
			});
		}
		return this;
	}
});

daylight.fn.extend({
	isEmpty : function() {
		return this.length === 0;
	},
	isElement : function(index) {
		if(index) {
			if(daylight.isElement(this.o[i]))
				return true;
				
			return false;
		}
		if(this.o.constructor === NodeList)
			return true;
		
		return false;
	}
});

daylight.fn.extend({
	index : function(object) {
		var type = daylight.type(object);
		if(type === "daylight")
			object = object.o[0];
		
		var length = this.length;
		for(var i = 0; i <length; ++i) {
			if(this.o[i] === object)
				return i;
		}
		return -1;
	},
	size : function() {
		return this.length;
	},
	get : function(index) {
		if(index === undefined)
			return this.o;
		var length = this.length;	
		if(length == 0)
			return null;
			
		while(index < 0) {index = length + index;}
		while(index >= this.length) {index = index - length;}
		
		return this.o[index];
	},
	first : function() {
		if(this.size == 0)
			return;
		
		return daylight(this.get(0));
	},
	last : function() {
		if(this.size == 0)
			return;
			
		return daylight(this.get(-1));
	}
});
daylight.fn.scrollTop = function(value) {
	if(value) {
		this.each(function(e) {
			e.scrollTop = value;
		});
		return this;
	} else {
		return this.o[0].scrollTop;
	}
}

daylight.fn.template = function(o, t) {
	this.html(daylight.template(o, t));
	return this;
}

daylight.fn.extend({
	parent: function(object) {
		var arr = [];
		var type = daylight.type(object);
		var parentObjects = type === "string"? daylight(object).o : [];
	
		if(type === "number") {
			this.each(function(v) {
				if(!daylight.isElement(v))
					return;
				var i = object;
				while(--i >= 0 && (v = v.parentNode)) {}
				
				if(!v)
					return;
	
				arr[arr.length] = v;
			});
		} else {
			this.each(function(v) {
				if(!daylight.isElement(v))
					return;
	
				var a = v.parentNode;
				if(a)
					arr[arr.length] = a;
			});
		}
		return daylight(arr);
	},
	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !daylight.nodeName( offsetParent, "html" ) && offsetParent.style && offsetParent.style.position === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});
daylight.fn.siblings = function() {
	var arr = [];
};


daylight.fn.extend({
	html : function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.innerHTML = value;
			});
		}
		if(this.length === 0)
			return "";
		return this.o[0].innerHTML;
	},
	text : function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.innerText = value;
			});
			return this;
		}
		return this.o[0].innerText;
	},
	ohtml : function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				this.outerHTML = value;
			});
		}
		return this.o[0].outerHTML;
	},
	val : function(value) {
		if(!(value === undefined)) {
			this.each(function() {
				if(!daylight.isElement(this))
					return;
					
				var node = this.nodeName.toLowerCase();
				_value[node].set(this, value);
			});
			return this;
		}
		if(!daylight.isElement(this.o[0]))
			return;
		var node = this.o[0].nodeName.toLowerCase();
		return _value[node].get(this.o[0]);
	}
});
daylight.fn.extend({
	first : function() {
		return this.o[0];
	},
	last : function() {
		if(!this.length)
			return;

		return this.o[this.length - 1];
	},
	children : function() {
		var o = [];
		this.each(function(v) {
			if(!daylight.isElement(v))
				return;
				
			var a = this.children;
			var l = a.length;
			for(var i = 0; i < l; ++i)
				o[o.length] = a[i];
		});
		return daylight(o);
	},
	prev : function() {
		var arr = [];
		var length = this.length;
		for(var i = 0; i < length; ++i) {
			var e = this.o[i];
			if(daylight.type(e) != "object")
				continue;
			while((e = e.previousSibling) != null && e.nodeType != 1) {}
	
			if(!e)
				continue;
			
			arr.push(e);
		};
		return daylight(arr);
	},
	next : function() {
		var arr = [];
		var length = this.length;
		for(var i = 0; i < length; ++i) {
			var e = this.o[i];
			if(!daylight.isNode(e))
				continue;
			while((e = e.nextSibling) != null && e.nodeType != 1) {}
			if(!e)
				continue;
	
			arr[arr.length] = e;
		}
		return daylight(arr);
	}

});

//getComputedStyle == currentStyle
daylight.fn.extend({
	dimension : function() {
		var is_request = {};
		var border = {left : null, top: null, right:null, bottom:null};
		var padding = {left : null, top: null, right:null, bottom:null};
		var margin = {left : null, top: null, right:null, bottom:null};
		
	},
	style : function(name) {
		var o = this.o[0];
		if(!o)
			return o.style[name];
	}
});
//demension 관련 함수들  width, height, innerWidth, innerHeight, outerWidth, outerHeight
["Width", "Height"].forEach(function(name) {
	var lowerName = name.toLowerCase();
	var requestComponent = name === "Width" ? ["left", "right"] : ["top", "bottom"];
	daylight.fn[lowerName] = function() {
		var currentStyle = this.style();
		var o = this.o[0];
		if(o["client" + name] > 0) {
			var dimension = o["client" + name];
		var cssHooks = _style(o);
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[0], cssHooks));
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[1], cssHooks));
			
			return dimension;
		}
		var dimension = o["offset" + name];
		var cssHooks = _style(o);
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[0], cssHooks));
		dimension -= parseFloat(_curCss(o, "padding-" + requestComponent[1], cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[0] + "-width", cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[1] + "-width", cssHooks));

		return dimension;
	}
	daylight.fn["inner" + name] = function() {
		var currentStyle = this.style();
		var o = this.o[0];
		if(o["client" + name] > 0)
			return o["client" + name]

		var dimension = o["offset" + name];
		var cssHooks = _style(o);
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[0] + "-width", cssHooks));
		dimension -= parseFloat(_curCss(o, "border-" + requestComponent[1] + "-width", cssHooks));
		
		return dimension;
	}
	daylight.fn["outer" + name] = function(bInlcudeMargin) {
		var currentStyle = this.style();
		var o = this.o[0];
		var dimension = o["offset" + name];
		
		if(bInlcudeMargin) {
			var cssHooks = _style(o);
			dimension += parseFloat(_curCss(o, "margin-" + requestComponent[0], cssHooks)) + parseFloat(_curCss(o, "margin-" + requestComponent[1], cssHooks));
		}
		return dimension;
	}
});

//테스트용 함수 ㅠㅠㅠㅠ
daylight.fn.test = function() {
	var o = this.o[0];
	
	this.dimension();
}
daylight.fn.extend({
	position : function() {
		//margin padding을 무시한 위치

		var offsetParent, offset,
			elem = this.o[0],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( elem.style.position === "fixed" ) {
			offset = elem.getBoundingClientRect();
		} else {
			offsetParent = this.offsetParent();
			offset = this.offset();
			if ( !daylight.nodeName( offsetParent.o[0], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += daylight.css( offsetParent.o[0], "borderTopWidth", true );
			parentOffset.left += daylight.css( offsetParent.o[0], "borderLeftWidth", true );
			parentOffset.top -= daylight.css( offsetParent.o[0], "paddingTop", true );
			parentOffset.left -= daylight.css( offsetParent.o[0], "paddingLeft", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - daylight.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - daylight.css( elem, "marginLeft", true )
		};

	}
	//jQuery를 거의 그대로 퍼옴.
	,offset : function() {
		//contents의 위치
		var element = this.o[0];		
		var box = { top: 0, left: 0 };
		if(!element)
			return box;
		
		var win = window;
		var doc = document;
		var docElem = docElem = doc.documentElement;
		if(element.getBoundingClientRect)
			box = element.getBoundingClientRect();
		
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	}
});

//animation Effect
daylight.fn.extend({
	animation : function() {
		
	},
	show : function() {
		
	},
	hide : function() {
		
	}
});

daylight.parseHTML;
daylight.fn.scrollLeft;



daylight.extend({
	checkType : daylight.type,
	forEach : daylight.each,
	indexOf : daylight.index
});

daylight.fn.extend({
	forEach : daylight.fn.each,
	indexOf : daylight.fn.indexOf,
	empty : daylight.fn.isEmpty,
	addEvent : daylight.fn.on
});



daylight.each("Boolean Number String Text Function Array Date RegExp Object Error Window NodeList".split(" "), function(name, index, arr) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

/*
daylight.each("$Event".split(" "), function(name, index, arr) {
	daylight.defineGlobal(name, daylight[name]);
});
*/

daylight.each("scroll load click mousedown mousemove mouseup mouseleave focus keydown keypress keyup select selectstart dragstart resize".split(" "), function(name, index, arr) {
	daylight.fn[name] = function(func) {
		this.on(name, func);
	}
});


})(window);