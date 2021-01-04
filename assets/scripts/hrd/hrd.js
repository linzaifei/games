import { roleConfig, levelConfig } from './roleConfig'
import util from '../util/util'
import globalData from '../custom/global'
const MIN_DISTANCE = 60; //最大偏移量
const MOVE_DURATION = 0.3//动画时间
const HCOUNTS = 4 //水平等于4
const VCOUNTS = 5 //垂直等于5

cc.Class({
    extends: cc.Component,

    properties: {
        gameBox: cc.Node,
        gameBg: cc.Graphics,
        hrdBlockPerfab: cc.Prefab,
        level: 2, //等级
        step: 0,
        space: 0,
        levelLabel: cc.Label, //等级label
        stepLabel: cc.Label,//通过步骤
        titleLabel: cc.Label,//标题
        targetLabel: cc.Label,//目标部署
        alertViewPerfab: cc.Prefab,
    },
    start() {
        //计算ItemSize 
        const w = this.gameBox.width
        this.itemSize = (w - this.space * (HCOUNTS + 1)) / HCOUNTS;
        this.onDraw();
        this.reStart()
        this.addEventHandler()

        this.alertView = cc.instantiate(this.alertViewPerfab);
        this.node.addChild(this.alertView)



    },
    onLoad() {
        this.level = globalData.level;
        console.log('wolail ===', globalData.level)
    },
    onDestroy() {
        console.log('hrd销毁了')
        this.removeEventHandler()
    },

    init() {
        //初始化计算每一个item大小
        const config = levelConfig[String(this.level)];
        this.levelLabel.string = String(this.level);
        this.targetLabel.string = config.targetStep;
        this.titleLabel.string = config.title;
        this.stepLabel.string = this.step;
        // this.tipBox.active = false
    },
    onDraw() {
        const w = this.gameBox.width;
        const h = w * VCOUNTS / HCOUNTS;
        console.log('this.g', w, h);
        this.gameBox.width = w;
        this.gameBox.height = h;
        this.gameBg.roundRect(0, 0, w, h, 15);
        this.gameBg.fill()
    },
    /** 0上一关 1 下一关 2 返回 3恢复  */
    onClickItem(op, idx) {
        console.log('===', idx)
        switch (parseInt(idx)) {
            case 0:
                if (this.level > 1) {
                    this.level -= 1;
                    this.reStart()
                }
                break;
            case 1:
                const len = Object.keys(levelConfig).length
                if (this.level < len) {
                    this.level += 1;
                    this.reStart()
                }
                break;
            case 2:
                cc.director.loadScene('hrdList')
                break;
            case 3:
                this.reStart()
                break;
        }
    },

    //重新开始
    reStart() {
        this.init()
        this.step = 0;
        if (this.blocks && this.blocks.length > 0) {
            for (let index = 0; index < this.blocks.length; index++) {
                const element = this.blocks[index];
                if (element) {
                    console.log('销毁block')
                    element.destroy();
                }
            }
        } else {
            this.blocks = []
        }

        this.onDrawBlock()
    },
    //循环获取
    onGetRows(callback) {
        for (let i = 0; i < HCOUNTS; i++) {
            for (let j = 0; j < VCOUNTS; j++) {
                callback({ x: i, y: j })
            }
        }
    },


    //开始绘制block
    onDrawBlock() {
        this.emptyPosition = []
        this.items = {}
        this.positions = []
        this.blocks = []
        const levels = levelConfig[String(this.level)].layout
        const arr = levels.map(item => { return item });
        console.log('levels=', levels)
        const lev = util.getReverseArr(arr)
        console.log('==', lev)
        console.log('==', this.emptyPosition, this.items, this.positions)
        for (let x = 0; x < HCOUNTS; x++) {
            this.positions.push([])
            this.emptyPosition.push([])
            for (let y = 0; y < VCOUNTS; y++) {
                const p_x = this.space * (x + 1) + (this.itemSize * x);
                const p_y = this.space * (y + 1) + (this.itemSize * y);
                const roleId = lev[y][x];
                const roleInfo = roleConfig[roleId]
                this.positions[x][y] = cc.v2(p_x, p_y)

                this.emptyPosition[x][y] = !roleInfo ? cc.v2(p_x, p_y) : 0;
                console.log('=point=', p_x, p_y, roleInfo, this.emptyPosition[x][y])
                if (roleInfo) {
                    if (roleId != 12 && this.items[roleId]) {
                        continue;
                    }
                    this.items[roleId] = true
                    const info_h = roleInfo.h;
                    const info_v = roleInfo.v;
                    const width = this.itemSize * info_h + (info_h - 1) * this.space;
                    const height = this.itemSize * info_v + (info_v - 1) * this.space;
                    const block = cc.instantiate(this.hrdBlockPerfab);
                    block.width = width;
                    block.height = height;
                    this.gameBox.addChild(block)
                    block.setPosition(cc.v2(p_x, p_y));
                    this.blocks.push(block)
                    block.getComponent('hrdBlock').setTitle(roleInfo.name);
                }
            }
        }
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

    onTouchStart(event) {
        //设置坐标是世界坐标
        this.startPoint = event.getLocation();
        // 获取世界坐标在当前坐标系的位置
        const pos = this.gameBox.convertToNodeSpaceAR(this.startPoint);
        // console.log(pos)
        for (let index = 0; index < this.blocks.length; index++) {
            const block = this.blocks[index];
            // 获取在父亲节点坐标系下(AR为原点)的节点包围盒 ;block.getBoundingBox()
            //判断点击的block 
            if (block.getBoundingBox().contains(pos)) {
                console.log(block)
                this.currentBlock = block;
                break;
            }
        }
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
        if (!this.currentBlock) return;

        //1. 获取当前block 位置信息
        const pos = this.getCurrentPotint(this.currentBlock.position)
        console.log('===pos_v==', pos)

        //2. 获取当前这个block 宽高占比
        const h = Math.floor(this.currentBlock.width / this.itemSize);
        const v = Math.floor(this.currentBlock.height / this.itemSize);

        //3.判断条件是否满足
        let condition = false;
        const start_x = pos.x;
        const start_y = pos.y;

        let empty_x;
        let empty_y;
        let move_x;
        let move_y;

        let end_x; //最终需要移动的位置
        let end_y; //最终需要移动的位置
        switch (direction) {
            case 'left':
                condition = pos && start_x > 0;
                empty_x = start_x - 1;
                empty_y = start_y;
                move_x = start_x + h - 1;
                move_y = start_y;
                end_x = start_x - 1;
                end_y = start_y;

                break;
            case 'right':
                condition = pos && (start_x + h) < HCOUNTS;
                empty_x = start_x + h;
                empty_y = start_y;
                move_x = start_x;
                move_y = start_y;
                end_x = start_x + 1;
                end_y = start_y;
                break;
            case 'up':
                condition = pos && start_y < VCOUNTS - 1;
                empty_x = start_x;
                empty_y = start_y + v;
                move_x = start_x;
                move_y = start_y;
                end_x = start_x;
                end_y = start_y + 1;
                console.log('====', empty_x, empty_y, move_x, move_y)
                break;
            case 'down':
                condition = pos && start_y > 0;
                empty_x = start_x;
                empty_y = start_y - 1;

                move_x = start_x;
                move_y = empty_y + v;

                end_x = start_x;
                end_y = empty_y;
                break;
        }

        if (condition) {
            const endPos = this.emptyPosition[empty_x][empty_y];//3.判断下一个是不是空
            console.log('=endPos==', endPos)
            if (endPos) {

                if (h == 2 && (direction == 'up' || direction == 'down')) {
                    console.log('这是水平2个单位 上下移动')
                    const empty_x1 = start_x + 1;
                    const empty_y1 = (direction == 'up' ? (start_y + v) : (start_y - 1));
                    const move_x1 = start_x + 1;
                    const move_y1 = (direction == 'up' ? start_y : (start_y + v - 1));

                    const first = { empty_x, empty_y, move_x, move_y }
                    const last = { empty_x1, empty_y1, move_x1, move_y1 }
                    const end = { end_x, end_y, }
                    const size = { h, v }
                    this.onSame(first, last, end, size)
                    return;
                }
                if (v == 2 && (direction == 'left' || direction == 'right')) {
                    console.log('这是垂直2个单位 左右移动')
                    const empty_x1 = (direction == 'left' ? (start_x - 1) : (start_x + h));
                    const empty_y1 = start_y + 1;
                    const move_x1 = (direction == 'left' ? (start_x + h - 1) : start_x);
                    const move_y1 = start_y + 1;

                    const first = { empty_x, empty_y, move_x, move_y }
                    const last = { empty_x1, empty_y1, move_x1, move_y1 }
                    const end = { end_x, end_y, }
                    const size = { h, v }
                    this.onSame(first, last, end, size)
                    return;
                }

                this.onGetStepCount()
                this.onChange(empty_x, empty_y, move_x, move_y);

                this.onAnimation(this.currentBlock, this.positions[end_x][end_y])
                console.log('==emptyPosition==', this.emptyPosition)
                console.log('==', this.blocks)
            }
        }
        this.currentBlock = null
    },

    onAnimation(block, position) {
        cc.tween(block)
            .to(MOVE_DURATION, { position })
            .start()
    },



    //相同模块
    onSame(first, last, end, size) {
        const { empty_x, empty_y, move_x, move_y, } = first
        const { empty_x1, empty_y1, move_x1, move_y1, } = last
        const { end_x, end_y } = end
        const { h, v } = size
        const endPos1 = this.emptyPosition[empty_x1][empty_y1];
        console.log('=endPos1==', endPos1)
        if (endPos1) {
            this.onChange(empty_x, empty_y, move_x, move_y);
            this.onChange(empty_x1, empty_y1, move_x1, move_y1);
            this.onAnimation(this.currentBlock, this.positions[end_x][end_y])

            this.onGetStepCount()
            if (h == 2 && v == 2) {
                this.onGameOnver(empty_x, empty_y)
            }
        }
        console.log('==emptyPosition==', this.emptyPosition)
    },
    //用于交换数据
    onChange(empty_x, empty_y, move_x, move_y) {
        this.emptyPosition[move_x][move_y] = this.positions[move_x][move_y];
        this.emptyPosition[empty_x][empty_y] = 0;
    },

    /** 获取当前block的postion */
    getCurrentPotint(v) {
        let po = ''
        for (let x = 0; x < this.positions.length; x++) {
            const item = this.positions[x];
            for (let y = 0; y < item.length; y++) {
                const element = item[y];
                // console.log('x-y', x, y, element)
                if (element.x == v.x && element.y == v.y) {
                    po = {
                        x,
                        y,
                    }
                    break;
                }
            }
        }
        return po
    },

    /**计算运动步数 */
    onGetStepCount() {
        this.step += 1;
        this.stepLabel.string = this.step;
    },
    //游戏结束
    onGameOnver(empty_x, empty_y) {
        //1.获取曹操位置信息
        console.log('=position===', empty_y, empty_x)
        if (empty_x == 1 && empty_y == 0) {
            console.log('====恭喜你你成功了哈哈哈')

            this.alertView.active = true
            this.alertView.getComponent('alertView').setContent('恭喜你完成本关，移动步数：' + this.step)
            this.alertView.on('click', (idx) => {
                console.log('点击23', idx)
                this.alertView.active = false
                this.onClickItem('', idx)
            })
        }
    }

});
