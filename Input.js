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
	var _self = {};
	_self.init = function(goo){
		view = goo.renderer.domElement;
		goo.renderer.domElement.addEventListener("mousedown", mouseDown, false);
		document.addEventListener("mouseup", mouseUp, false);
		document.addEventListener("mousemove", mouseMove, false);
		System.call(this, "_self", []);
	};

	_self.mousePosition = new Vector2();
	_self.mouseOld = new Vector2();
	_self.mouseDelta = new Vector2();
	_self.mouseButton = {};

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
		_self.mouseButton[btn] = true;
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
		_self.mouseButton[btn] = false;
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
		
		_self.mousePosition.x = e.pageX ? e.pageX : e.clientX + (document.documentElement.scrollLeft) ||
			(document.body.scrollLeft - document.documentElement.clientLeft);
			
		_self.mousePosition.y = e.pageY ? e.pageY : e.clientY + (document.documentElement.scrollTop) ||
			(document.body.scrollTop - document.documentElement.scrollTop);

		_self.mousePosition.x -= view.offsetLeft;
		_self.mousePosition.y -= view.offsetTop;
		_self.mouseDelta.x = _self.mouseOld.x - _self.mousePosition.x;
		_self.mouseDelta.y = _self.mouseOld.y - _self.mousePosition.y;
		_self.mouseOld.x = _self.mousePosition.x;
		_self.mouseOld.y = _self.mousePosition.y;
	};

	
	return _self;
});
