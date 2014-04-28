pages.push(function() {
	$(document).ready(function() {
		$(".takeQR").click(function() {
			console.log("qrcode click");
			cordova.plugins.barcodeScanner.scan(
			function (result) {
				if(result.cancelled)
					return;
				$.ajax("http://10.73.45.131:8080/nyam/app/addHistory", {data:{qrcode:result.text}, method:"POST"}).done(function(value) {
				location.replace(location.href);
				alert("success");
		
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
	});
});
$(document).ready(function() {
	$(".menu").click(function() {
		$(".wrapper").toggleClass("open-menu");
	});
	$(".contents").click(function() {
		$(".wrapper").removeClass("open-menu");
	});
	$(".logout").click(logout);
});