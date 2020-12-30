

import { levelConfig } from './roleConfig'
import globalData from '../custom/global'
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
        content: cc.Node,
        backBtn: cc.Node
    },

    onLoad() {
        this.type = globalData.type
        this.init()
    },

    start() {
        this.backBtn.on('touchstart', () => {
            cc.director.loadScene("start")
        })
    },
    onDestroy() {
        console.log('销毁hrdList')
        this.backBtn.off('touchstart');
        this.blocks.map(item => {
            item.off(cc.Node.EventType.TOUCH_START)
        })
    },



    init() {
        this.blocks = [];
        if (this.type == 0) {
            Object.values(levelConfig).map((item, index) => {
                this.onCreateItem(item, index)
            })
        } else if (this.type == 1) {
            const arr = [{
                title: '3X3',
                level: 1,
            }, {
                title: '4X4',
                level: 2,
            }, {
                title: '5X5',
                level: 3,
            }, {
                title: '6X6',
                level: 4,
            }];
            arr.map((item, index) => {
                this.onCreateItem(item, index)
            })
        }
    },

    onCreateItem(item, index) {
        const itemPrefab = cc.instantiate(this.itemPrefab);
        itemPrefab.getComponent('item').setTitle(item.title)
        this.blocks.push(itemPrefab);
        itemPrefab.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.type == 0) {
                globalData.level = index + 1;
            } else {
                globalData.nubLevel = index + 1;
            }
            cc.director.loadScene(this.type == 0 ? 'hrd' : 'nubHrd')
        })
        this.content.addChild(itemPrefab)
    },
    // update (dt) {},
});
