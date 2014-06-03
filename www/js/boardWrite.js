//pageInfo.domain = "http://localhost:8080/nyam/"
$(document).on("loadLayout", function() {

	
	console.log("LOAD REQUEST BOARD WRITE");
	
	//혹시 toggleClass도 만들었나?
	$(".navigation-item.back").removeClass("hidden");
	$(".navigation-item.menu").addClass("hidden");
	$(".navigation-item.back").click(function() {
		history.go(-1);
	});
	
	$(".submit").click(function(e) {
		e.preventDefault();
		var data = {title:$('[name="title"]').val(), content:$('[name="content"]').val()};
		$.ajax(pageInfo.domain + "m/requestBoard/write", {data:data, method:"POST", type:"json"}).done(function(value) {
			if(!value.hasOwnProperty("code")) {
				alert("실패");
				return;
			}
			var code = parseFloat(value.code); //parseInt가 아니고 Float인 이유는?
			
			switch(code) {
			case 200:
				alert("성공");
				window.location.replace("boardList.html");
				break;
			}
		
		
		}).fail(function(request) {
			alert("fail " + request.status);
		});
	});

});