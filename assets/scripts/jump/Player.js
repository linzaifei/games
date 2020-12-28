// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 200,
        jumpDuration: 0.3,
        maxMoveSpeed: 0,
        accel: 0,//加速度
    },


    start() {

    },
    onLoad() {
        const jump = this.jumpAction()
        cc.tween(this.node).then(jump).start()
    },
    jumpAction() {
        const up = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' })
        const down = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });

        // cc.tween(this.node).then(up).then(down);

        const tween = cc.tween().sequence(up, down);

        return cc.tween().repeatForever(tween)
    }




    // update (dt) {},
});
