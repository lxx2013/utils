var iphone = {};
(function(){
	var alpha,beta,gamma;
	window.addEventListener("deviceorientation", function (e) {
		[iphone.alpha,iphone.beta,iphone.gamma] = [e.alpha,e.beta,e.gamma];
		var arrow = document.getElementById("arrow_str");
		arrow.style.transform = "rotateZ("+Math.round(e.alpha)+"deg) "
			+"rotateX("+Math.round(e.beta)+"deg) "
			+"rotateY("+Math.round(e.gamma)+"deg)";
		document.getElementById("arrow_str").innerHTML = `alpha:${Math.round(e.alpha)}<br>beta:${Math.round(e.beta)}<br>gamma:${Math.round(e.gamma)}`;

	});
})();

