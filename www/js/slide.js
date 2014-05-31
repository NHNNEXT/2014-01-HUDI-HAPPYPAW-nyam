
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
