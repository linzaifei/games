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
        contentLabel: cc.Label,
        tipBg: cc.Graphics,
    },
    start() {
        this.onDraw();
    },
    onDraw() {
        const w = this.node.width;
        const h = this.node.height;
        console.log('=wh111=', w, h)
        this.tipBg.roundRect(0, 0, w, h, 20)
        this.tipBg.fill()
    },
    setTitle(title) {
        if (title) {
            this.titleLabel.string = title;
        }
    }


});
