

import { levelConfig } from './roleConfig'
import globalData from './globalData'
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
        content: cc.Node,
        backBtn: cc.Node
    },

    start() {
        this.init()

        this.backBtn.on('touchstart', () => {
            cc.director.loadScene("start")
        })
    },
    onDestroy() {
        console.log('销毁hrdList')
        this.backBtn.off('touchstart');
    },

    init() {
        console.log('=====', Object.values(levelConfig))
        Object.values(levelConfig).map((item, index) => {
            this.onCreateItem(item, index)
        })
    },

    onCreateItem(item, index) {
        const itemPrefab = cc.instantiate(this.itemPrefab);
        itemPrefab.getComponent('item').setTitle(item.title)

        itemPrefab.on(cc.Node.EventType.TOUCH_START, () => {
            console.log('===哈哈哈', item);
            globalData.level = index + 1;
            cc.director.loadScene('hrd')
        })
        this.content.addChild(itemPrefab)
    },
    // update (dt) {},
});
