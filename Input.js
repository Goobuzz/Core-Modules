define([
	'goo/math/Vector2',
	'js/Game'
], function(
	Vector2,
	Game
){
	"use strict";
	var Input = {};
	document.documentElement.addEventListener("mousedown", mouseDown, false);
	document.documentElement.addEventListener("mouseup", mouseUp, false);
	document.documentElement.addEventListener("mousemove", mouseMove, false);
	document.documentElement.addEventListener("keyup", keyUp, false);
	document.documentElement.addEventListener("keydown", keyDown, false);
	
	// thanks t-bone!
	document.documentElement.addEventListener("mousewheel", mouseWheel, false);
	document.documentElement.addEventListener("DOMMouseScroll", mouseWheel, false); // Firefox
	
	Input.mouseWheelDelta = 0;

	function mouseWheel(e){
		e = e || window.event;
		Input.mouseWheelDelta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		Game.raiseEvent("MouseWheel", Input.mouseWheelDelta);
	};
	
	var gamepads = [];
	var oldStates = [];
	var oldGamepads = [];
	var prevTimestamp = [];

	function gamepadConnected(e){
  		console.log("Gamepad Connected");
  		console.log(e);
  		gamepads.push(e.gamepad);
  		updateGamepadStates();
  		//Game.register("Update", this, pollGamepadState, -1);
  	}
  	function gamepadRemoved(e){
  		console.log("Gamepad Removed");
  		console.log(e);
  		for(var i = 0, ilen = gamepads.length; i < ilen; i++){
  			if(gamepads[i].index == e.gamepad.index){

  				gamepads.splice(i, 1);
  				break;
  			}
  		}
  		updateGamepadStates();
  		// check for gamepads.length and stop polling...
  	}
  	function gamepadButtonDown(e){
  		console.log("Button Down");
  		// e.button
  		console.log(e);
  	}
  	function gamepadButtonUp(e){
  		console.log("Button Up");
  		// e.button
  		console.log(e);
  	}
  	function gamepadAnalogMove(e){
  		console.log("Analog");
  		// e.axis, e.value
  		console.log(e);
  	}

	var gamepadSupportAvailable = !!navigator.webkitGetGamepads || 
		!!navigator.webkitGamepads ||
		(navigator.userAgent.indexOf('Firefox/') != -1);

	if (!gamepadSupportAvailable) {
    	console.warn("No gamepad support.");
  	} else {
  		window.addEventListener('MozGamepadButtonDown', gamepadButtonDown);
  		window.addEventListener('MozGamepadButtonUp', gamepadButtonUp);
  		 window.addEventListener('MozGamepadConnected', gamepadConnected);
		 window.addEventListener('MozGamepadDisconnected', gamepadRemoved);
		 window.addEventListener('MozGamepadAxisMove', gamepadAnalogMove);
		//window.addEventListener('gamepadconnected', gamepadConnected);
		//window.addEventListener('gamepaddisconnected', gamepadRemoved);

		if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
    		// start polling

    		Game.register("Update", this, pollGamepadState, -1);
    	}
  	}
  	
	function pollGamepadChange(){
		var gamepad = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
		navigator.webkitGamepads;
		if(gamepad){
			var changed = false;
			gamepads = [];
			for(var i = 0, ilen = gamepad.length; i < ilen; i++){
				if(typeof gamepad[i] != oldGamepads[i]){
					changed = true;
					oldGamepads[i] = typeof gamepad[i];
				}
				if(gamepad[i]){
					gamepads.push(gamepad[i]);
				}
			}
			if(changed){
				updateGamepadStates();
			}
		}
	};

	function updateGamepadStates(){
		oldStates = [];
  		for(var i = 0, ilen = gamepads.length; i < ilen; i++){
  			var buttons = [];
  			var axes = [];
  			for(var b = 0, blen = gamepads[i].buttons.length; b < blen; b++){
  				buttons[b] = gamepads[i].buttons[b];
  			}
  			for(var a = 0, alen = gamepads[i].axes.length; a < alen; a++){
  				axes[a] = gamepads[i].axes[a];
  			}
  			oldStates.push({buttons:buttons, axes:axes});
  		}
	}

	function pollGamepadState(){
		pollGamepadChange();
		for(var i = 0, ilen = gamepads.length; i < ilen; i++){
			var gamepad = gamepads[i];
			if(gamepad.timestamp && gamepad.timestamp == prevTimestamp[i]){continue;}
			prevTimestamp[i] = gamepad.timestamp;
			//console.log("State Changed");
			for(var b = 0, blen = gamepad.buttons.length; b < blen; b++){
				if(null == gamepadButtonAssign[i][b]){continue;}
				if(oldStates[i].buttons[b] != gamepad.buttons[b]){
					oldStates[i].buttons[b] = gamepad.buttons[b];
					if(gamepad.buttons[b] == 0){
						if(false == Input.Action[gamepadButtonAssign[i][b]]){continue;}
						Input.Action[gamepadButtonAssign[i][b]] = false;
						Game.raiseEvent(gamepadButtonAssign[i][b], false);
					}
					if(gamepad.buttons[b] == 1){
						if(true == Input.Action[gamepadButtonAssign[i][b]]){continue;}
						Input.Action[gamepadButtonAssign[i][b]] = true;
						Game.raiseEvent(gamepadButtonAssign[i][b], true);
					}
				}
			}
			for(var a = 0, alen = gamepad.axes.length; a < alen; a++){
				//console.log("gamepad:"+i+" axis:"+a+":"+gamepad.axes[a]);
				if(null == gamepadAxesAssign[i][a]){continue;}
				if(oldStates[i].axes[a] != gamepad.axes[a]){
					oldStates[i].axes[a] = gamepad.axes[a];
					Input.Action[gamepadAxesAssign[i][a]] = gamepad.axes[a];
					Game.raiseEvent(gamepadAxesAssign[i][a], gamepad.axes[a]);
				}
			}
		};
	}

	var gamepadButtonAssign = [{},{},{},{}];
	var gamepadAxesAssign = [{},{},{},{}];

	Input.assignGamepadAxisToAction = function(gamepad, axis, action){
		if(null == gamepadAxesAssign[gamepad][axis]){
			Input.Action[action] = false;
		}
		else{
			console.warn("Gamepad:"+gamepad+" Axis:"+axis+" already assigned to Action:"+gamepadAxesAssign[gamepad][axis]);
		}
		gamepadAxesAssign[gamepad][axis] = action;
	};

	Input.assignGamepadButtonToAction = function(gamepad, button, action){
		if(null == gamepadButtonAssign[gamepad][button]){
			Input.Action[action] = false;
		}
		else{
			console.warn("Gamepad:"+gamepad+" Button:"+button+" already assigned to Action:"+gamepadButtonAssign[gamepad][button]);
		}
		gamepadButtonAssign[gamepad][button] = action;
	};

	// onmousewheel
	Input.mousePosition = new Vector2();
	Input.mouseOld = new Vector2();
	Input.mouseDelta = new Vector2();
	Input.movement = new Vector2();
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
		
		var newX = e.pageX ? e.pageX : e.clientX + (document.documentElement.scrollLeft) ||
			(document.body.scrollLeft - document.documentElement.clientLeft);
			
		var newY = e.pageY ? e.pageY : e.clientY + (document.documentElement.scrollTop) ||
			(document.body.scrollTop - document.documentElement.scrollTop);

		newX -= Game.renderer.domElement.offsetLeft;
		newY -= Game.renderer.domElement.offsetTop;
		Input.movement.x = e.movementX;
		Input.movement.y = e.movementY;
		Input.mouseDelta.x = newX - Input.mousePosition.x;
		Input.mouseDelta.y = newY - Input.mousePosition.y;
		Input.mouseOld.x = Input.mousePosition.x;
		Input.mouseOld.y = Input.mousePosition.y;
		Input.mousePosition.x = newX;
		Input.mousePosition.y = newY;
	};

	return Input;
});
