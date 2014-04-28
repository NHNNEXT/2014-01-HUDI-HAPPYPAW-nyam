pages.push(function() {
	
	var todate = new Date();
	var date = new Date(todate.getFullYear(), todate.getMonth(), 1);
	var lastDate = new Date(todate.getFullYear(), todate.getMonth() + 1, 0);
	
	var startWeek = date.getDay();
	var today = todate.getDate();
	var lastDay = lastDate.getDate();
	var day = 1;
	
	var getStamps = function(){
	
		$.ajax("http://10.73.45.131:8080/nyam/app/m_nyamHistory", {method:"POST" , type: "json"}).done(function(value) {
			//alert("성공" + value);
			if(!value.length && value.constructor !== Array){
				alert("실패");
				return;//배열이 아니다.
			}
			var tds = $(".calendar td .stamps");
			for(var i=0; i< value.length; i++){
				var regdate = value[i].regdate;
				var day = parseInt(regdate.substring(8,10));
				$(tds.get(startWeek + day - 1)).append('<div class="stamp"></div>');
				console.log(day);
			}
		}).fail(function(request) {
			alert("실패" + request.status);
		});
	}
	
	$(document).ready(function() {
		$(".calendar td").each(function(td, index) {
			if(index < startWeek)
				return;
			if(day > lastDay)
				return;
			var td = $(td);
			td.find("span").text(day);
			if(day == today)
				td.addClass("today");
			day++;
		});
		var resize = function() {
			$(".calendar td").css("height", $(document.querySelector(".calendar td")).width());
		};
		
		$(window).resize(resize);
		resize();
		getStamps();
	});
});