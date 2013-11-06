define([
	"lib/NodeList"
], function(
	NodeList
){
	"use strict";
	var _self = {};
	_self._listeners = {};

	// @param String: name
	// @param Function: callback
	// @param Number: pIndex
	_self.register = function(e, c, pIndex){
		if(null == _self._listeners[e]){
			_self._listeners[e] = new NodeList();
		}
		else{
			var n = _self._listeners[e].first;
			while(n != null){
				if(n.callback === c){
					console.log("Callback already exists !");
					return;
				}
				n = n.next;
			}
		}
		var node = {
			next:null,
			previous:null,
			callback:c
		};
		if(null == pIndex){
			_self._listeners[e].addFirst(node);
		}
		else{
			node.pIndex = pIndex;
			_self._listeners[e].addSorted(node);
		}
		return _self;
	};
	// @param String: name
	// @param Function: callback
	_self.unregister = function(e, c){
		if(null == _self._listeners[e]){
			return;
		}
		var n = _self._listeners[e].first;
		while(n != null){
			if(n.callback === c){
				_self._listeners[e].remove(n);
			}
			n = n.next;
		}
		return _self;
	};
	// @param String: name
	// @param mixed
	_self.raiseEvent = function(){
		var e = [].shift.apply(arguments);
		if(null == e){return;}
		if(null == _self._listeners[e]){
			return;
		}
		var n = _self._listeners[e].first;
		while(n != null){
			n.callback.apply(null, arguments);
			n = n.next;
		}
		return _self;
	}
	return _self;
});
