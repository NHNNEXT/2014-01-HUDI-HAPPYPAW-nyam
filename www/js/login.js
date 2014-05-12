function logout() {
	$.ajax("http://10.73.45.131:8080/nyam/app/m_logout", {method:"POST"}).done(function(value){
		alert("로그아웃되었습니다.");
		window.location.replace("login.html");
	}).fail(function(request){
		alert("logout fail" + request.status);
	});
};


function loginCheck(id, password) {
	$.ajax("http://10.73.45.131:8080/nyam/app/m_login_check", {data:{id:id, password:password}, method:"POST", type:"json"}).done(function(value, req) {
		if(value.hasOwnProperty("code")){
			var code = parseInt(value.code);
			switch(code) {
			case 200://성공
				window.location.replace("index.html");
				return;
			case 300://없는 아이디, 패스워드 일치 X
				alert(value.message);
				return;
			}
			console.log(value);
			console.log(req.responseText);
			alert("ajax ok, login_fail   " + value);
			return;
		}
		console.log(value);
		alert("login fail");
		
	}).fail(function(request) {
		alert("login fail   " + request.status); 
	});
}