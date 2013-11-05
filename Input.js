define([
	'goo/math/Vector2',
	'goo/entities/systems/System',
	'lib/Game'
], function(
	Vector2,
	System,
	Game
){
	"use strict";
	var view = null;
	function Input(goo){
		this.world = goo;
		view = goo;
		goo.renderer.domElement.addEventListener("mousedown", mouseDown, false);
		document.addEventListener("mouseup", mouseUp, false);
		document.addEventListener("mousemove", mouseMove, false);
		System.call(this, "Input", []);
	};

	Input.prototype = Object.create(System.prototype);
	Input.mousePosition = new Vector2();
	Input.mouseOld = new Vector2();
	Input.mouseDelta = new Vector2();
	Input.mouseButton = {};

	function mouseDown(e){
		updateMousePos(e);
		var btn = 0;
		if(null == e.which){
			btn = e.button;
		}
		else{
			switch(e.which){
				case 1:
					btn = 1;
					break;
				case 2:
					btn = 4;
					break;
				case 3:
					btn = 2;
					break;
			};
		}
		Input.mouseButton[btn] = true;
		Game.raiseEvent("MouseButton"+btn, true);
	};

	function mouseUp(e){
		updateMousePos(e);
		var btn = 0;
		if(null == e.which){
			btn = e.button;
		}
		else{
			switch(e.which){
				case 1:
					btn = 1;
					break;
				case 2:
					btn = 4;
					break;
				case 3:
					btn = 2;
					break;
			};
		}
		Input.mouseButton[btn] = false;
		Game.raiseEvent("MouseButton"+btn, false);
	};

	function mouseMove(e){
		updateMousePos(e);
		Game.raiseEvent("MouseMove");
	};

	function updateMousePos(e){
		e = e || window.event;
		if (e && e.preventDefault) {e.preventDefault();}
		if (e && e.stopPropagation) {e.stopPropagation();}
		
		Input.mousePosition.x = e.pageX ? e.pageX : e.clientX + (document.documentElement.scrollLeft) ||
			(document.body.scrollLeft - document.documentElement.clientLeft);
			
		Input.mousePosition.y = e.pageY ? e.pageY : e.clientY + (document.documentElement.scrollTop) ||
			(document.body.scrollTop - document.documentElement.scrollTop);

		Input.mousePosition.x -= view.renderer.domElement.offsetLeft;
		Input.mousePosition.y -= view.renderer.domElement.offsetTop;
		Input.mouseDelta.x = Input.mouseOld.x - Input.mousePosition.x;
		Input.mouseDelta.y = Input.mouseOld.y - Input.mousePosition.y;
		Input.mouseOld.x = Input.mousePosition.x;
		Input.mouseOld.y = Input.mousePosition.y;
	};

	
	return Input;
});
