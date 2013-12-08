define([
	"js/NodeList",
	'goo/entities/GooRunner',
	'goo/math/Ray',
	'goo/entities/systems/PickingSystem',
	'goo/picking/PrimitivePickLogic',
	'goo/math/Vector3'
], function(
	NodeList,
	GooRunner,
	Ray,
	PickingSystem,
	PrimitivePickLogic,
	Vector3
){
	"use strict";
	var Game = new GooRunner({
		antialias: true,
		manuallyStartGameLoop: false,
		tpfSmoothingCount:1
	});
	Game.doRender = false;

	var picking = new PickingSystem({pickLogic: new PrimitivePickLogic()});
    var v1 = new Vector3();
    var v2 = new Vector3();
	var cross = new Vector3();
    var mrc;
    var hit;
    var distance;
    var hitElement = 0;
    var hitIndex = 0;

    Game.world.setSystem(picking);
    Game.ray = new Ray();

    picking.onPick = function(result){
    	hit = null;
		if(null != result){
			if(result.length > 0){
				hitIndex = -1;
	    		hitElement = -1;
	    		mrc = null;
    			distance = typeof picking.pickRay.distance !== 'undefined' ? picking.pickRay.distance : Infinity;
    			for(var i = 0, ilen = result.length; i < ilen; i++){
    				mrc = result[i].entity.meshRendererComponent;
    				if(null == mrc){console.log("entity.meshRenderComponent does not exist!");}
    				else{
    					if(null != result[i].entity.hitMask){
    						if((result[i].entity.hitMask & picking.mask) != 0){
    							for(var j = 0, jlen = result[i].intersection.distances.length; j < jlen; j++){
    								if(result[i].intersection.distances[j] < distance){
    									if(picking.all){
    									}
    									else{
			        						distance = result[i].intersection.distances[j];
			        						hitIndex = i;
			        						hitElement = j;
		        						}
    								}
        						}
    						}
    					}
    				}
    			}
	    		if(hitIndex != -1){
	    			// create two CCW 'edge vectors' based on the points of the face hit
	    			v1.x = result[hitIndex].intersection.vertices[hitElement][0].x - result[hitIndex].intersection.vertices[hitElement][1].x;
					v1.y = result[hitIndex].intersection.vertices[hitElement][0].y - result[hitIndex].intersection.vertices[hitElement][1].y;
					v1.z = result[hitIndex].intersection.vertices[hitElement][0].z - result[hitIndex].intersection.vertices[hitElement][1].z;

					v2.x = result[hitIndex].intersection.vertices[hitElement][2].x - result[hitIndex].intersection.vertices[hitElement][0].x;
					v2.y = result[hitIndex].intersection.vertices[hitElement][2].y - result[hitIndex].intersection.vertices[hitElement][0].y;
					v2.z = result[hitIndex].intersection.vertices[hitElement][2].z - result[hitIndex].intersection.vertices[hitElement][0].z;
					
					// use the cross product of the face edges to get the 'normal'
					cross.x = (v1.y * v2.z) - (v1.z * v2.y);
					cross.y = (v1.z * v2.x) - (v1.x * v2.z);
					cross.z = (v1.x * v2.y) - (v1.y * v2.x);
					cross.normalize();

					// use the dot product to determine if the normal is facing the origin
					// of the ray or not *** doesn't work ***
					//	dp = (-cross.x * ray.direction.x) + (-cross.y * ray.direction.y) + (-cross.z * ray.direction.z);

	    			hit = {
						entity: result[hitIndex].entity,
						point: new Vector3().copy(result[hitIndex].intersection.points[hitElement]),
						normal: new Vector3().copy(cross),
						distance: result[hitIndex].intersection.distances[hitElement]
					}
	    		}
	    	}
	    }
		picking.hit = hit;
    };
	
    Game.castRay = function(ray, mask, all){
    	picking.pickRay = ray;
    	picking.mask = mask;
    	picking.all = all;
    	picking._process();
    	return picking.hit;
    };
    Object.freeze(Game.castRay);

	var listeners = {};

	Game.register = function(e, o, c, priority){
		if(null == listeners[e]){
			listeners[e] = new NodeList();
		}
		else{
			for(var n = listeners[e].first; n; n = n.next){
				if(n.object === o){
					console.log("Callback already exists for this object!");
					return;
				}
			}
		}
		var node = {
			next:null,
			previous:null,
			callback:c,
			object:o
		};
		if(null == priority){
			listeners[e].addFirst(node);
		}
		else{
			node.priority = priority;
			listeners[e].addSorted(node);
		}
		return Game;
	};
	Object.freeze(Game.register);

	Game.unregister = function(e, o){
		if(null == listeners[e]){
			return;
		}
		var n = listeners[e].first;
		for(var n = listeners[e].first; n; n = n.next){
			if(n.object === o){
				listeners[e].remove(n);
			}
		}
		return Game;
	};
	Object.freeze(Game.unregister);

	Game.raiseEvent = function(){
		var e = [].shift.apply(arguments);
		if(null == e){return;}
		if(null == listeners[e]){
			return;
		}
		var n = listeners[e].first;
		for(var n = listeners[e].first; n; n = n.next){
			n.callback.apply(n.object, arguments);
		}
		return Game;
	}
	Object.freeze(Game.raiseEvent);

	Game.renderer.domElement.id = 'goo';
	document.body.appendChild(Game.renderer.domElement);
	return Game;
});
