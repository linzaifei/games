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
        hrdBg: cc.Graphics,
    },
    start() {
        this.onDraw();
    },
    onDraw() {
        const w = this.node.width;
        const h = this.node.height;
        console.log('=wh=', w, h)
        this.hrdBg.roundRect(0, 0, w, h, 10)
        this.hrdBg.fill()
    },
    setTitle(title) {
        if (title) {
            this.titleLabel.string = title;
        }
    }
});
