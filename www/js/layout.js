$(document).on("loadLayout", function() {
	console.log("loadLayout");
	$(".takeQR").click(function() {
		console.log("qrcode click");
		cordova.plugins.barcodeScanner.scan(
		function (result) {
			if(result.cancelled)
				return;
			$.ajax(pageInfo.domain+"addHistory", {data:{qrcode:result.text}, method:"POST"}).done(function(value) {
				location.replace(location.href);
				alert("등록되었습니다.");
	
			}).fail(function(request) {
				alert("fail " + request.status);
			});
		  
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		});
	});
	$(".profile .name").html(user.name);
	$(".profile .id").html(user.id);

	$(".menu").click(function() {
		var h = window.innerHeight || 0;
		$(".wrapper").css("min-height", h + "px") ;
		$(".wrapper").toggleClass("open-menu");
	});
	$(".contents").click(function() {
		$(".wrapper").removeClass("open-menu");
	});
	$(".logout").click(logout);
});
