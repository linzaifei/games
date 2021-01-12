
import AppManager from '../custom/AppManager'
import wxCloudManager from '../wxCloudManager'
import { startData } from './config.js'
import Global from '../custom/global'
cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: cc.Prefab,
        content: cc.Node,
    },


    start() {
        // AppManager.login()
        // wxCloudManager.initCloud()
        this.init()
        this.passiveShare()
    },

    //被动分享
    passiveShare() {
        console.log('passive share!');
        if (typeof wx === 'undefined') {
            return;
        }
        wx.showShareMenu();
        wx.onShareAppMessage(() => {
            return {
                title: '块分享给你的小伙伴吧！',
                // imageUrl: cc.url.raw('resources/share.png'),
            }
        });
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
                Global.type = item.type;
                cc.director.loadScene(item.scene)
            }

        })
        this.content.addChild(itemPrefab)
    },

});
