function logout() {
	$.ajax("http://10.73.45.131:8080/nyam/app/m_logout", {method:"POST"}).done(function(value){
		alert("로그아웃되었습니다.");
		window.location.replace("login.html");
	}).fail(function(request){
		alert("logout fail" + request.status);
	});
};
function loginCheck(id, password) {
	$.ajax("http://10.73.45.131:8080/nyam/app/m_login_check", {data:{id:id, password:password}, method:"POST", type:"json"}).done(function(value) {
		if(value.hasOwnProperty("code")){
			switch(code) {
			case 200://성공
				window.location.replace("index.html");
				return;
			case 300://없는 아이디입니다.
				alert("존재하지 않는 회원이거나 패스워드가 일치하지 않습니다..");
				return;
			}
			alert("ajax ok, login_fail   " + value);
			return;
		}
		alert("login fail");
		
	}).fail(function(request) {
		alert("login fail   " + request.status); 
	});
}