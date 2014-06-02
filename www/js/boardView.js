//pageInfo.domain = "http://localhost:8080/nyam/"
$(document).on("loginComplete", function() {
	var hash = location.hash;
	hash = hash.replace("#", "");
	$.ajax(pageInfo.domain + "m/requestBoard/view", {method:"POST", type:"json", data:{no:hash}}).done(function(list, req){

		console.log("LOAD REQUEST BOARD VIEW");
		console.log(list, req);
		JSON.parse(req.responseText);
		daylight.each(list, function(e, index) {this.num =index + 1;});
		$(".table").template(list, $(".table"));
		
		
		$(".navigation-item.back").removeClass("hidden");
		$(".navigation-item.menu").addClass("hidden");
		
		$(".navigation-item.back").click(function() {
			history.go(-1);
		})

    }).fail(function(request){
	    alert("ajax fail " + request.status);
	    
    });

});