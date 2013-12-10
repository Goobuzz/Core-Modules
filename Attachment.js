define([
    'js/Game',
    'goo/math/Vector3',
    'goo/math/Transform'
], function(
    Game,
    Vector3,
    Transform
){
    "use strict";
    var Attachment = function(){};
    Attachment.attach = function(attachee, target, bone, pos, rot, scl){
        
        if(null == target.meshDataComponent){console.error("target requires a MeshDataComponent(Perhaps pass in a child?).");return;}
        if(null == target.meshDataComponent.currentPose){console.error("target requires a skeleton");return;}
        var meshData = target.meshDataComponent,
        joints = meshData.currentPose._skeleton._joints,
        jointID = -1;
        var joint = null;
        
        for(var i = 0, ilen = joints.length; i < ilen; i++){
            if(joints[i]._name === bone){jointID = i;break;}
        }
        if(-1 == jointID){console.error("Could not find bone '"+bone+"' on target.");return;}

        var a = Game.world.createEntity(attachee.name+"_Attachment");
        a.oldScale = new Vector3().copy(attachee.transformComponent.transform.scale);
        attachee.transformComponent.setScale(1,1,1);

        if(scl){
            a.transformComponent.setScale(scl);
        }
        a.addToWorld();
        target.transformComponent.attachChild(a.transformComponent);
        target.transformComponent.setUpdated();

        a.transformComponent.attachChild(attachee.transformComponent);
        a.transformComponent.setUpdated();

        if(pos){
            attachee.transformComponent.setTranslation(
                pos.x*(1/target.transformComponent.transform.scale.x),
                pos.y*(1/target.transformComponent.transform.scale.y),
                pos.z*(1/target.transformComponent.transform.scale.z));
        }
        //console.log(attachee.transformComponent.transform.translation);
        if(rot){
            attachee.transformComponent.transform.rotation.fromAngles(rot.y, rot.z, rot.x);
        }
        attachee.transformComponent.setUpdated();

        a.parentMeshData = meshData;
        a.parentJointID = jointID;
        a.scale = 1.0;
        a.calcVec = new Vector3();
        
        attachee.attachment = a;

        function attachUpdate(){
            var m = this.parentMeshData.currentPose._globalTransforms[this.parentJointID].matrix;
            var t = this.transformComponent.transform;
            m.getTranslation(t.translation);           
            t.rotation.set(
                m.e00, m.e10, m.e20,
                m.e01, m.e11, m.e21,
                m.e02, m.e12, m.e22
            );

            this.transformComponent.updateTransform();
            this.transformComponent.updateWorldTransform();
        }
        Game.register("LateUpdate", a, attachUpdate);
    }
    Attachment.remove = function(attachee, target){
        attachee.transformComponent.transform.translation.copy(attachee.transformComponent.worldTransform.translation);
        attachee.transformComponent.transform.rotation.copy(attachee.transformComponent.worldTransform.rotation);
        target.transformComponent.detachChild(attachee.attachment.transformComponent);
        attachee.attachment.transformComponent.detachChild(attachee.transformComponent);
        attachee.attachment.removeFromWorld();
        attachee.transformComponent.setScale(attachee.attachment.oldScale.x,attachee.attachment.oldScale.y,attachee.attachment.oldScale.z);
        delete attachee.attachment;
        Game.unregister("LateUpdate", attachee);
    }
    return Attachment;
});
