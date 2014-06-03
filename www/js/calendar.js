$(document).on("loginComplete", function() {	
	var todate = new Date();
	var date = new Date(todate.getFullYear(), todate.getMonth(), 1);
	var lastDate = new Date(todate.getFullYear(), todate.getMonth() + 1, 0);
	
	var startWeek = date.getDay();
	var today = todate.getDate();
	var lastDay = lastDate.getDate();
	var day = 1;
	
	var getStamps = function(){
	
		//아쉽게도 하드코딩..URL밖으로 빼서 관리하기
		$.ajax("http://10.73.45.131:8080/nyam/m_nyamHistory", {method:"POST" , type: "json"}).done(function(value) {
			if(value.hasOwnProperty("code")) {
				switch(value.code) {
				case "500":
				}
			}
			//나름 좋은 시도 ^^. javascript array특성을 잘 아는 듯. isArray라는 함수가 있는지도 좀 보고, isArray함수 하나 만들어도 좋고.
			if(!value.hasOwnProperty("length") || value.constructor !== Array){
				alert("실패: Not Array"); //사용자에게 좋지 않은 ux.. alert. 개발자에게는 console.warn 이나 error함수를 사용해서 디버깅을 용이하게 해주는 것도 좋음.
				return;//배열이 아니다.
			}
			var tds = $(".calendar td .stamps");
			for(var i=0; i< value.length; i++){  //length는 미리 구해서 변수에 담아두고 사용하기. 
				var regdate = value[i].regdate;
				var day = parseInt(regdate.substring(8,10));
				$(tds.get(startWeek + day - 1)).append('<div class="stamp"></div>');
				//console.log(day);
			}
		}).fail(function(request) {
			alert("-실패-" + request.status);
		});
	}
	
	//each보니까 생각났는데 나중에 underscore.js 라이브러리를 분석해보는 게 함수형자바스크립트 언어를 구현하는데 꽤 도움이 많이 될 것임.
	$(".calendar td").each(function(td, index) {
		if(index < startWeek)
			return;
		if(day > lastDay)
			return;
		var td = $(td);
		td.find("span").text(day);
		if(day == today) //습관적으로 === 사용하기.
			td.addClass("today");
		day++;
	});
	var resize = function() {
		var width = $(document.querySelector(".calendar td")).width();
		$(".calendar td").css("height", width+"px");
	};
	
	$(window).resize(resize);
	resize();
	getStamps();
});
