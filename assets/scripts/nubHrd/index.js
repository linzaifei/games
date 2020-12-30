// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import util from '../util/util'
import schedule from '../util/schedule'
import globalData from '../custom/global'
import { getArrWithLevel } from './nubConfig'
const MIN_DISTANCE = 60; //最大偏移量
const MOVE_DURATION = 0.3//动画时间
cc.Class({
    extends: cc.Component,

    properties: {
        gameBox: cc.Node,
        gameBg: cc.Graphics,
        hrdBlockPerfab: cc.Prefab,
        levelLabel: cc.Label, //等级label
        timeLabel: cc.Label,//通过步骤
        bestLabel: cc.Label,//标题
        space: 10,//间隔
        count: 4,// 个数
        level: 2,
    },
    start() {
        this.init()
        this.onDraw();
        this.onDrawBlock();
        this.addEventHandler()
        //开始定时器
        schedule.startTime(this, (time) => {
            this.timeLabel.string = time
        })
    },
    onDestroy() {
        console.log('销毁unbHrd');
        schedule.stopTime(this)
        this.removeEventHandler()
    },

    onLoad() {
        this.level = globalData.nubLevel;
        this.count = this.level == 1 ? 3 : this.level == 2 ? 4 : this.level == 3 ? 5 : this.level == 4 ? 6 : 3
        console.log('wolail ===', globalData.nubLevel, this.count)

    },
    init() {
        const w = this.gameBox.width
        this.itemSize = (w - this.space * (this.count + 1)) / this.count;
        this.dataArr = getArrWithLevel(this.level, this.count).dataArr
        console.log('=blockArr==', this.dataArr)


    },
    onDraw() {
        const w = this.gameBox.width;
        console.log('this.g', w);
        this.gameBox.width = w;
        this.gameBox.height = w;
        this.gameBg.roundRect(0, 0, w, w, 15);
        this.gameBg.fill()
    },


    addEventHandler() {
        this.gameBox.on('touchstart', (event) => {
            this.onTouchStart(event);
        })
        this.gameBox.on('touchend', (event) => {
            this.onTouchEnd(event);
        })
        this.gameBox.on('touchcancel', (event) => {
            this.onTouchEnd(event);
        })
    },
    //移除手势
    removeEventHandler() {
        this.gameBox.off(cc.Node.EventType.TOUCH_START)
        this.gameBox.off(cc.Node.EventType.TOUCH_END)
        this.gameBox.off(cc.Node.EventType.TOUCH_CANCEL)
    },
    //开始绘制block
    onDrawBlock() {
        this.emptyPosition = []
        this.positions = []
        this.blocks = [];

        for (let x = 0; x < this.count; x++) {
            this.positions.push([])
            this.emptyPosition.push([])
            this.blocks.push([])
            for (let y = 0; y < this.count; y++) {
                const p_x = this.space * (x + 1) + (this.itemSize * x);
                const p_y = this.space * (y + 1) + (this.itemSize * y);
                this.positions[x][y] = cc.v2(p_x, p_y)
                this.emptyPosition[x][y] = !this.dataArr[x][y] ? cc.v2(p_x, p_y) : 0;
                if (this.dataArr[x][y]) {
                    const block = cc.instantiate(this.hrdBlockPerfab);
                    block.width = this.itemSize;
                    block.height = this.itemSize;
                    this.gameBox.addChild(block)
                    block.setPosition(cc.v2(p_x, p_y));
                    this.blocks[x][y] = block;
                    block.getComponent('hrdBlock').setTitle(String(this.dataArr[x][y]));
                }

            }
        }
        console.log('==', this.blocks, this.positions, this.emptyPosition)
    },

    onTouchStart(event) {
        //设置坐标是世界坐标
        this.startPoint = event.getLocation();
    },

    onTouchEnd(event) {
        console.log('onTouchEnd')

        const endPoint = event.getLocation();
        const vec = endPoint.sub(this.startPoint);
        console.log('vec', vec, vec.mag())
        if (vec.mag() > MIN_DISTANCE) {
            console.log('----',)
            if (Math.abs(vec.x) > Math.abs(vec.y)) {
                if (vec.x > 0) {
                    console.log('向右')
                    this.moveDirection('right')
                } else {
                    console.log('向左')
                    this.moveDirection('left')
                }
            } else {
                if (vec.y > 0) {
                    console.log('向上')
                    this.moveDirection('up');
                } else {
                    console.log('向下')
                    this.moveDirection('down');
                }
            }
        }
    },

    moveDirection(direction) {
        // 获取世界坐标在当前坐标系的位置
        const pos = this.gameBox.convertToNodeSpaceAR(this.startPoint);
        const x = Math.floor(pos.x / this.itemSize)
        const y = Math.floor(pos.y / this.itemSize)
        console.log('x=y=', x, y)
        this.block = this.blocks[x][y];
        console.log('block=', this.block, this.block.position)
        if (!this.block) return;
        console.log('===pos_v==', pos)
        //3.判断条件是否满足
        let condition = false;
        const start_x = x;
        const start_y = y;
        let move_x;
        let move_y;
        switch (direction) {
            case 'left':
                condition = pos && start_x > 0;
                move_x = start_x - 1;
                move_y = start_y;
                break;
            case 'right':
                condition = pos && (start_x + 1) < this.count;

                move_x = start_x + 1;
                move_y = start_y;

                break;
            case 'up':
                condition = pos && start_y < this.count - 1;

                move_x = start_x;
                move_y = start_y + 1;

                break;
            case 'down':
                condition = pos && start_y > 0;
                move_x = start_x;
                move_y = start_y - 1;
                break;
        }

        console.log('xy-m_xm-y', start_x, start_y, move_x, move_y)
        if (condition) {
            const endPos = this.emptyPosition[move_x][move_y];//3.判断下一个是不是空
            console.log('=endPos==', endPos)

            if (endPos) {
                this.onChange(move_x, move_y, start_x, start_y);
                this.onAnimation(this.block, this.positions[move_x][move_y])
                console.log('==emptyPosition==', this.emptyPosition)
                this.onGameOnver();
            }
        }
        this.block = null
    },

    onAnimation(block, position) {
        if (position) {
            cc.tween(block)
                .to(MOVE_DURATION, { position })
                .start()
        }
    },

    //用于交换数据
    onChange(move_x, move_y, start_x, start_y) {
        this.emptyPosition[start_x][start_y] = this.positions[start_x][start_y];
        this.emptyPosition[move_x][move_y] = 0;
        const block = this.blocks[move_x][move_y];
        this.blocks[move_x][move_y] = this.blocks[start_x][start_y];
        this.blocks[start_x][start_y] = block;

        const data = this.dataArr[move_x][move_y];
        this.dataArr[move_x][move_y] = this.dataArr[start_x][start_y];
        this.dataArr[start_x][start_y] = data;


    },


    //计算时间
    onClickItem(event, idx) {
        switch (parseInt(idx)) {
            case 0:
                cc.director.loadScene('hrdList')
                break;
            case 1:

                break;
        }

    },

    //游戏结束
    onGameOnver() {
        //1.获取曹操位置信息
        console.log('=position===', this.dataArr)

        let count = 0;
        for (let y = this.count - 1; y >= 0; y--) {
            for (let x = 0; x < this.count; x++) {
                const element = this.dataArr[x][y];
                count++
                if (element) {
                    if (count != element) {
                        break;
                    }
                    console.log('===element x,y', element)
                }
            }
        }

        console.log('count', count)
    }

});
