//pageInfo.domain = "http://localhost:8080/nyam/"
$(document).on("loginComplete", function() {
	//$.ajax함수 좋네. 옵션도 그럴싸하게 받고.
	$.ajax(pageInfo.domain + "m/requestBoard", {method:"POST", type:"json"}).done(function(list, req){


		//이제 디버깅코드는 날리고~
		console.log("LOAD REQUEST BOARD");
		console.log(list, req);
		JSON.parse(req.responseText);
		daylight.each(list, function(e, index) {this.num =index + 1;});
		$(".table").template(list, $(".box1"));

    }).fail(function(request){
    	//alert말고 디테일한 에러처리 함 해봐~ 
	    alert("ajax fail " + request.status);
	    
    });

});