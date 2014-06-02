$(document).on("loginComplete", function() {
	var hash = location.hash;
	hash = hash.replace("#", "");
	var template = $(".contents.restaurant-view").html();
	$.ajax(pageInfo.domain + "m/restaurant/view", {method:"POST", type:"json", data:{no:hash}}).done(function(restaurant){
		console.log(restaurant);
		if(!restaurant.hasOwnProperty("no")) {
			history.back();
			alert("잘못된 주소입니다.");
			return;
		}
			
		console.log("LOAD RESTAUANT");
		
		$(".restaurant-view").template(restaurant, template);
		$(".navigation-item.back").removeClass("hidden");
		$(".navigation-item.menu").addClass("hidden");
		$(".navigation-item.back").click(function() {
			history.go(-1);
		})
    }).fail(function(request){
	    alert("ajax fail " + request.status);
	    
    });

});