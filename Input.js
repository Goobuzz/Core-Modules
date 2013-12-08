define([
	'goo/math/Vector2',
	'js/Game'
], function(
	Vector2,
	Game
){
	"use strict";
	var Input = {};
	Input.mousePosition = new Vector2();
	Input.mouseOld = new Vector2();
	Input.mouseDelta = new Vector2();
	Input.movement = new Vector2();

	document.documentElement.addEventListener("mousedown", mouseDown, true);
	//document.documentElement.addEventListener("mouseup", mouseUp, false);
	document.documentElement.addEventListener("mouseup", mouseUp, true);
	document.documentElement.addEventListener("mousemove", mouseMove, true);
	document.documentElement.addEventListener("keyup", keyUp, false);
	document.documentElement.addEventListener("keydown", keyDown, false);
	// onmousewheel
	Input.Action = {};
	var keyAssign = {};
	var mouseButtonAssign = {};

	Input.assignKeyToAction = function(key, action){
		if(null == keyAssign[key]){
			Input.Action[action] = false;
		}
		else{
			console.warn("Key:"+key+" already assigned to Action:"+keyAssign[key]);
		}
		keyAssign[key] = action;
	};
	Input.assignMouseButtonToAction = function(button, action){
		if(null == mouseButtonAssign[button]){
			Input.Action[action] = false;
		}
		else{
			console.warn("MouseButton:"+button+" already assigned to Action:"+mouseButtonAssign[button]);
		}
		mouseButtonAssign[button] = action;
	};

	function keyDown(e){
		e = e || window.event;
		var key = (typeof e.which === "undefined") ? e.keyCode : e.which;
		if(null == keyAssign[key]){return;}
		if(true == Input.Action[keyAssign[key]]){return;}
		Input.Action[keyAssign[key]] = true;
		Game.raiseEvent(keyAssign[key], true);
	};
	function keyUp(e){
		e = e || window.event;
		var key = (typeof e.which === "undefined") ? e.keyCode : e.which;
		if(null == keyAssign[key]){return;}
		if(false == Input.Action[keyAssign[key]]){return;}
		Input.Action[keyAssign[key]] = false;
		Game.raiseEvent(keyAssign[key], false);
	};

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
		if(null == mouseButtonAssign[btn]){return;}
		if(true == Input.Action[mouseButtonAssign[btn]]){return;}
		Input.Action[mouseButtonAssign[btn]] = true;
		Game.raiseEvent(mouseButtonAssign[btn], true);
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
		if(null == mouseButtonAssign[btn]){return;}
		if(false == Input.Action[mouseButtonAssign[btn]]){return;}
		Input.Action[mouseButtonAssign[btn]] = false;
		Game.raiseEvent(mouseButtonAssign[btn], false);
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

		Input.mousePosition.x -= Game.renderer.domElement.offsetLeft;
		Input.mousePosition.y -= Game.renderer.domElement.offsetTop;
		Input.movement.x = e.movementX;
		Input.movement.y = e.movementY;
		Input.mouseDelta.x = Input.mouseOld.x - Input.mousePosition.x;
		Input.mouseDelta.y = Input.mouseOld.y - Input.mousePosition.y;
		Input.mouseOld.x = Input.mousePosition.x;
		Input.mouseOld.y = Input.mousePosition.y;
	};

	return Input;
});
