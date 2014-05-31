
		var menu = document.querySelector("#menu");
		var elView = document.querySelector(".view");
		var elSliding = document.querySelector(".hidden");
		

		 
		/*좌측 슬라이딩 메뉴 버튼. */
		menu.addEventListener("click", function(e){
/* 버블링캡쳐링 때문에 메뉴를 누르면 슬라이드 원상복귀되지 않는다.레프트값 확인해서 복원할 수 있게 해줘야 할 듯. 			
if(elView.style.left == */
			var test = document.defaultView.getComputedStyle(elView);
			console.log("===================" + test.left);
			
			if(test.left === "0px"){
				elView.style.left = 250 + "px";
				elSliding.style.left = 0 + "px";
				console.log("move left");
			} 
			
			else if(test.left === "250px"){

				elView.style.left = 0 + "px";
				elSliding.style.left = -250 + "px";
				console.log("move right");
			}
			console.log(elView.style.left +"  " +elSliding.style.left);
			
		}  );

		/*슬라이딩 된 상태에서 돌아갈 수 있도록 */
		elView.addEventListener("click", function(e){
			elView.style.left = 0 + "px";
			elSliding.style.left = -250 + "px";
		}, true);



		
		var box = document.getElementById("message");
	
/*
		document.body.addEventListener("touchstart", function(e){
			box.innerHTML = "touch Start";
		});
		
		document.body.addEventListener("touchmove", function(e){
			box.innerHTML = "touch move";
		});
		
		document.body.addEventListener("touchend", function(e){
			box.innerHTML = "touch end";
		});
*/

		/*제스쳐 메세지 박스에서 보기 */
		document.addEventListener("gesturestart", function (e){
			box.innerHTML="gesture start";
			console.log("str");
		});
	//이미지 회전 
		var img = document.getElementsByClassName("image");
		
		//첫번째 사진 돌아가고 확대 하도록. 
		document.addEventListener("gesturechange", function (e){
			box.innerHTML="gesture change";
			//img.style.webkitTransform="scale("+ e.scale+ + ")";

			img[0].style.webkitTransform ="scale(" + e.scale + ")rotate(" + e.rotation + "deg)";
		});
		
		document.addEventListener("gestureend", function(e){
			box.innerHTML="gesture end"
			console.log("gestureend");
		});
		

