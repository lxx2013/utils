var iphone = {}
window.addEventListener("deviceorientation", function (e) {
		[iphone.alpha,iphone.beta,iphone.gamma] = [e.alpha,e.beta,e.gamma];
		var arrow = document.getElementById("arrow");
		arrow.style.transform = "rotateZ("+Math.round(e.alpha)+"deg) " 
								+"rotateX("+Math.round(e.beta)+"deg) "
								+"rotateY("+Math.round(e.gamma)+"deg)";		
});
