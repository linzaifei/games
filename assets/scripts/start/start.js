
import AppManager from '../custom/AppManager'
import wxCloudManager from '../wxCloudManager'
import { startData } from './config.js'
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
        content: cc.Node,
    },


    start() {
        AppManager.login()
        wxCloudManager.initCloud()

        this.init()
    },

    init() {

        startData.map(item => {
            this.onCreateItem(item)
        })
    },

    onCreateItem(item) {
        const itemPrefab = cc.instantiate(this.itemPrefab);
        itemPrefab.getComponent('item').setTitle(item.title)

        itemPrefab.on(cc.Node.EventType.TOUCH_START, () => {
            console.log('===哈哈哈', item);
            if (item.scene) {
                cc.director.loadScene(item.scene)
            }

        })
        this.content.addChild(itemPrefab)
    },

});
