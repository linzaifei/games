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
        alertBg: cc.Graphics,
        confromBtn: cc.Button,
        cancelBtn: cc.Button,
        radius: 20,
    },
    start() {
        this.onDraw();
        this.confromBtn.node.on('click', () => {
            this.node.emit('click', 1);
        }, this)
        this.cancelBtn.node.on('click', () => {
            this.node.emit('click', 0);
        }, this)
    },
    onDraw() {
        const w = this.node.width;
        const h = this.node.height;
        this.alertBg.roundRect(0, 0, w, h, this.radius)
        this.alertBg.fill()
    },
    setTitle(title) {
        if (title) {
            this.titleLabel.string = title;
        }
    },
    setContent(content) {
        if (content) {
            this.contentLabel.string = content;
        }
    }


});
