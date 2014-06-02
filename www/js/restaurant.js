$(document).on("loginComplete", function() {
	$.ajax(pageInfo.domain + "m/restaurant", {method:"POST", type:"json"}).done(function(list){

		console.log("LOAD RESTAUANT");
	
		daylight.each(list, function(e, index) {this.num = index + 1;});
		$(".restaurant-list tbody").template(list, $(".restaurant-list tbody"));

    }).fail(function(request){
	    alert("ajax fail " + request.status);
	    
    });

});