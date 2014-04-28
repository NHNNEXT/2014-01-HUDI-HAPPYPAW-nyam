var pages = [];
var user;
var checkLogin = function(){
    $.ajax("http://10.73.45.131:8080/nyam/app/m_getLoginUser", {method:"POST"}).done(function(value){
    	if(!value || value === "{}"){
    		if(location.href.search("login") <= 0) {
    		    alert("로그인을 해주세요.");
		    	//window.location.replace("login.html");
		    }
    	} else{
    		
    		user = $.parseJSON(value);
    		for(var i = 0; i < pages.length; ++i)
    			pages[i]();
    	}
    }).fail(function(request){
	    alert("ajax fail " + request.status);
	    
    });
}
checkLogin();