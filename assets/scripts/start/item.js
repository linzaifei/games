// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: cc.Label,
    },
    start() {

        // this.node.on(cc.Node.EventType.TOUCH_START, () => {
        //     console.log('====点击一下')
        //     this.node.emit('foo');
        // })
    },

    // onDestroy() {
    //     this.node.off(cc.Node.EventType.TOUCH_START)
    // },

    setTitle(title) {
        if (title) {
            this.titleLabel.string = title;
        }
    }
});
