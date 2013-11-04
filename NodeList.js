define([], function(){
	"use strict";
	function NodeList(){
		this.first = null;
		this.last = null;
	};
	NodeList.prototype.add = function( _node ){
		if( null == this.first ){
			this.first = _node;
			this.last = _node;
			_node.next = null;
			_node.previous = null;
		}
		else{
			this.last.next = _node;
			_node.previous = this.last;
			_node.next = null;
			this.last = _node;
		}
	}
	NodeList.prototype.addSorted = function( _node ){
		if( null == this.first ){
			this.first = _node;
			this.last = _node;
			_node.next = null;
			_node.previous = null;
		}
		else{
			var n = this.last;
			while(n != null){
				if(n.pIndex <= _node.pIndex){
					break;
				}
				n = n.previous;
			}

			if(n == this.last){
				//console.log("n == this.last");
				this.last.next = _node;
				_node.previous = this.last;
				_node.next = null;
				this.last = _node;
			}
			else if(null == n){
				//console.log("null == n");
				_node.next = this.first;
				_node.previous = null;
				this.first.previous = _node;
				this.first = _node;
			}
			else{
				//console.log();
				_node.next = n.next;
				_node.previous = n;
				n.next.previous = _node;
				n.next = _node;
			}
		}
	}

	NodeList.prototype.addFirst = function( _node ){
		if( null == this.first ){
			this.first = _node;
			this.last = _node;
			_node.next = null;
			_node.previous = null;
		}
		else{
			_node.next = this.first;
			this.first.previous = _node;
			this.first = _node;
		}
	}

	NodeList.prototype.remove = function( _node ){
		if( this.first == _node ){
			this.first = this.first.next;
		}
		if( this.last == _node){
			this.last = this.last.previous;
		}
		if( _node.previous != null ){
			_node.previous.next = _node.next;
		}
		if( _node.next != null ){
			_node.next.previous = _node.previous;
		}
	}
	NodeList.prototype.clear = function(){
		while( null != this.first ){
			var node = this.first;
			this.first = node.next;
			node.previous = null;
			node.next = null;
		}
		this.last = null;
	}
	return NodeList;
});
