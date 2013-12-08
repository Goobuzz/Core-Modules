define([
	'js/Game',
	'js/Input'
], function(
	Game,
	Input
){
	function Cursor(settings){
		this.domElement = document.getElementById("cursor");
		this.domElement.px = settings.x;
		this.domElement.py = settings.y;
		this.domElement.src = settings.url;
		this.domElement.style.top = (Input.mousePosition.y-this.domElement.py)+"px";
		this.domElement.style.left = (Input.mousePosition.x-this.domElement.px)+"px";

		function update(){
			this.style.top = (Input.mousePosition.y-this.py)+"px";
			this.style.left = (Input.mousePosition.x-this.px)+"px";
		}
		this.domElement.style.top = (Input.mousePosition.y-this.domElement.py)+"px";
		this.domElement.style.left = (Input.mousePosition.x-this.domElement.px)+"px";
		Game.register("Update", this.domElement, update);
	}
	return Cursor;
});
