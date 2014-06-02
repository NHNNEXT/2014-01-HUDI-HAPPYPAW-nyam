//pageInfo.domain = "http://localhost:8080/nyam/"
$(document).on("loginComplete", function() {
	$.ajax(pageInfo.domain + "m/requestBoard", {method:"POST", type:"json"}).done(function(list, req){

		console.log("LOAD REQUEST BOARD");
		console.log(list, req);
		JSON.parse(req.responseText);
		daylight.each(list, function(e, index) {this.num =index + 1;});
		$(".table").template(list, $(".box1"));

    }).fail(function(request){
	    alert("ajax fail " + request.status);
	    
    });

});