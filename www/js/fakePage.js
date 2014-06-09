
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
	user.id = "fakeId";
	user.name = "fakeName";
	$(document).ready(function() {
		initLayout();
		$(document).on("loginComplete");
	});
}
checkLogin();