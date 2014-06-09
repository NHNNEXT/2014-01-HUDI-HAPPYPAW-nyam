var pageInfo = {
	domain : "http://125.209.200.26:80/nyam/"
}
var user = {id:"22", name:"11"};
var initLayout = function() {
	function _initLayout(layout) {
		var info = {id:user.id, name:user.name}
		var layout = daylight.template(info, layout);
		$("body").append(layout);
		$(".section").append($(".contents"));
		$(".contents").addClass("show");
		$(document).on("loadLayout");
	}
	console.debug("initLayout");
    $.ajax("./layout.html", {method:"GET"}).done(function(value, req){
		console.log("download layout");
		_initLayout(req.responseText);	
    }).fail(function(request){
		if(request.status === 0) {
			if(!request.responseText)
				return;
			_initLayout(request.responseText);
		}
    });

}

var checkLogin = function(){
    $.ajax(pageInfo.domain + "m_getLoginUser", {method:"POST", type:"json"}).done(function(value){
    	//alert("login after" +  value.id+"     " + location.href);
    	if(value.hasOwnProperty("code") || !value.hasOwnProperty("id") ){
    		if(location.href.indexOf("login") <= 0) {
    		    alert("로그인을 해주세요.");
    		    window.location.replace("login.html");
		    }


    	} else {
    		user = value;
    		
		   $(document).ready(function(){
		   		console.log("READY");
		   		initLayout();
		   		$(document).trigger("loginComplete");
		   });
    	}
    }).fail(function(request){
	    alert("ajax fail " + request.status);
	    
    });
}
checkLogin();

