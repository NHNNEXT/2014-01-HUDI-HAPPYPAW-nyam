function logout() {
	$.ajax("http://10.73.45.131:8080/nyam/app/m_logout", {method:"POST"}).done(function(value){
		alert("로그아웃되었습니다.");//이 앞에 alert("auto")가 뜨는데???연규 체크 
		window.location.replace("login.html");
	}).fail(function(request){
		alert("logout fail" + request.status);
	});
};
function loginCheck(id, password) {
	$.ajax("http://10.73.45.131:8080/nyam/app/m_login_check", {data:{id:id, password:password}, method:"POST"}).done(function(value) {
		if(value ==="false"){
			alert("ajax ok, login_fail   " + value);
			//window.location.replace("login.html");
			return;
		}
		alert("ajax ok. login success   "+value);
		window.location.replace("index.html");
	}).fail(function(request) {
		alert("loginfail   " + request.status); 
	});
}