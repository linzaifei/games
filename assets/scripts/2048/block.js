import colors from './colors';
cc.Class({
    extends: cc.Component,

    properties: {
        numberLabel: cc.Label,

    },
    start() {


    },

    setNumber(number) {
        if (number == 0) {
            this.numberLabel.node.active = false
        }
        this.numberLabel.string = number;
        if (number in colors) {
            this.node.color = colors[number];
            // if (number >= 8) {
            this.numberLabel.node.color = new cc.Color().fromHEX('#F9F6F2');
            // }
        }

    }
});
