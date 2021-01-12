
import { forIn, rotateArr } from '../util/util'
import { defaultColor, perviewColor, shapeType, shapeColors } from './tetris-type'

import localStorage from '../custom/localStorage'
const itemSize = 45;
const DROPSPEED = 600;
const MIN_DISTANCE = 50;

cc.Class({
    extends: cc.Component,
    properties: {
        gameBox: cc.Node,
        containerBlock: cc.Graphics,
        perviewBlock: cc.Graphics,
        scoreLabel: cc.Label,
        gameOverBox: cc.Node,
        gScoreLabel: cc.Label,
        bestScoreLabel: cc.Label,
        space: 1,//用来表示每一个小模块间距
        score: 0
    },
    onLoad() {

        const w = this.gameBox.width
        this.row = Math.floor((w - this.space) / (itemSize + this.space));
        this.col = this.row * 2;
        this.containerColors = [];//用来保存背景所有的颜色
        this.perviewColors = [];//用来保存预览所有的颜色
        this.randomShape = ''; //用来存储随机产生的形状
        this.shapeColor = '';//用来存储当前图形的颜色
        this.fps = 0;
        this.dropSpeed = DROPSPEED; //下落速度
        this.x = 3; //用来记录当前
        this.y = this.col;
        this.gameBox.height = this.col * (itemSize + this.space)

    },
    start() {
        this.init();
    },
    update(dt) {
        this.fps += dt * 1000;
        if (this.fps > this.dropSpeed) {
            this.fps = 0;
            this.onDropDown()
        }
    },
    onDestroy() {
        this.saveScore()
    },
    addEventHandler() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.onTouchStart(event);
        })
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            this.onTouchEnd(event);
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            this.onTouchEnd(event);
        })
    },
    //移除手势
    removeEventHandler() {
        this.node.off(cc.Node.EventType.TOUCH_START)
        this.node.off(cc.Node.EventType.TOUCH_END)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL)
    },
    onTouchStart(event) {
        this.startPoint = event.getLocation();
    },
    onTouchEnd(event) {
        console.log('start', this.startPoint)
        const endPoint = event.getLocation();
        const vec = endPoint.sub(this.startPoint);
        console.log('vec', vec, vec.mag())
        if (vec.mag() > MIN_DISTANCE) {
            console.log('----',)
            if (Math.abs(vec.x) > Math.abs(vec.y)) {
                if (vec.x > 0) {
                    console.log('向右')
                    this.onMoveDirection('right')
                } else {
                    console.log('向左')
                    this.onMoveDirection('left')
                }
            } else {
                if (vec.y > 0) {
                    console.log('向上')
                    this.onMoveDirection('up');
                } else {
                    console.log('向下')
                    this.dropSpeed = 0;
                    this.onMoveDirection('down');
                }
            }
        }

    },

    init() {
        //主界面试图颜色
        forIn(this.row, this.col, (x, y) => {
            this.containerColors[x][y] = defaultColor
            this.drawBgRect(x, y, this.containerColors[x][y]);
        }, (x) => {
            this.containerColors[x] = []
        })
        this.onDrawRandomShape()
        this.addEventHandler()
        this.gameOverBox.active = false;
        this.scoreLabel.string = 'score: ' + this.score;
        console.log('==', this.containerColors)
    },
    onClickItem(op, idx) {
        console.log('=====', idx)
        switch (parseInt(idx)) {
            case 0:
                cc.director.loadScene('start')
                break;
            case 1:
                this.score = 0
                this.removeEventHandler()
                this.init()
                break;

        }
    },
    //绘制随机图形
    onDrawRandomShape() {
        const keys = Object.keys(shapeType);
        const idx = Math.floor(Math.random() * keys.length)
        const shape = shapeType[keys[idx]]
        const idx1 = Math.floor(Math.random() * shape.length)
        this.randomShape = shape[idx1]
        this.shapeColor = shapeColors[keys[idx]]
        console.log('idx', idx, idx1, shape, this.randomShape, this.shapeColor);
        this.drawPreview()
    },
    //绘制预览
    drawPreview() {
        this.perviewBlock.clear();
        //预览界面试图颜色
        forIn(4, 4, (x, y) => {
            this.perviewColors[x][y] = perviewColor
            if (this.randomShape[x] && this.randomShape[x][y]) this.perviewColors[x][y] = this.shapeColor;
            this.drawPreviewRect(x, y, this.perviewColors[x][y]);
        }, (x) => {
            this.perviewColors[x] = []
        })
        console.log('perviewColors', this.perviewColors)
    },
    onDrawView(color) {
        const len = this.randomShape.length
        forIn(len, len, (x, y) => {
            if (this.randomShape[x][y]) this.drawBgRect(this.x + x, this.y + y, color);
        })
    },
    onMoveDirection(direction) {
        let x;
        let y;
        switch (direction) {
            case 'left':
                x = -1;
                y = 0;
                break
            case 'right':
                x = 1;
                y = 0
                break;
            case 'up':
                this.onRotate()
                return;
            case 'down':

                this.onDropDown()
                return;
                break
        }
        console.log('==========分割寻===')
        if (!this.collisionDetection(x, y, this.randomShape)) {
            //1.，清空之前形状 
            this.onDrawView(defaultColor)
            if (direction == 'left') {
                this.x--
            } else {
                this.x++;
            }
            console.log('==this.y==', this.y)
            //2.重新绘制形状
            this.onDrawView(this.shapeColor)
        }
    },

    onDropDown() {
        if (!this.collisionDetection(0, -1, this.randomShape)) {
            //1.，清空之前形状 
            this.onDrawView(defaultColor)
            this.y--;
            console.log('==this.y==', this.y)
            //2.重新绘制形状
            this.onDrawView(this.shapeColor)
        } else {
            this.onDropEnd()
        }
    },
    //碰撞检测
    collisionDetection(x, y, shape) {
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape.length; j++) {
                // console.log('shape=', shape[i][j])
                if (!shape[i][j]) continue;
                const nextX = this.x + x + i;
                const nextY = this.y + y + j;
                // console.log('----', nextX, nextY)
                //1.判断他的左右下是否否靠边
                if (nextX < 0 || nextX > this.row || nextY < 0) return true
                //
                if (nextY >= this.col) continue;
                //判断是不是下一个是不是有值
                // console.log('当前值===', this.containerColors[nextX][nextY])
                if (this.containerColors[nextX][nextY] != defaultColor) return true
            }
        }
        return false
    },

    onGetRotateIdx() {
        this.selectIdx++
        if (this.selectIdx > 4) {
            this.selectIdx = 0;
        }
    },
    //向上旋转变形
    onRotate() {
        const arr = rotateArr(this.randomShape);
        console.log('=arr=', arr)
        let x = 0;
        //判断这个即将要旋转的试图是不是引进靠近边上了
        if (this.collisionDetection(0, 0, arr)) {
            //如果靠近右边墙 需要想左移动一格 反之            
            x = this.x > this.row / 2 ? -1 : 1
        }

        //旋转
        if (!this.collisionDetection(x, 0, arr)) {
            this.onDrawView(defaultColor)
            this.x += x;
            this.randomShape = arr;
            this.onDrawView(this.shapeColor)
        }
    },
    updateBgRect() {
        this.containerBlock.clear();
        forIn(this.row, this.col, (x, y) => {
            this.drawBgRect(x, y, this.containerColors[x][y])
        })
    },

    //游戏结束
    gameover() {
        this.removeEventHandler()
        this.gameOverBox.active = true;
        this.gScoreLabel.string = 'score: ' + this.score;
        this.saveScore((besttetris) => {
            this.bestScoreLabel.string = 'best score: ' + besttetris;
        })

    },
    //保存积分
    saveScore(callback) {
        let besttetris = localStorage.getTrteisScore();
        console.log('===', besttetris)
        if (parseInt(besttetris) < this.score) {
            besttetris = this.score;
            localStorage.setTrteisScore(this.score)
        }
        callback && callback(besttetris)
    },
    //下落结束
    onDropEnd() {
        this.dropSpeed = DROPSPEED;
        //1.判断是不是已经到顶了 如果到顶了就暂停了
        const len = this.randomShape.length;
        if ((len + this.y) >= this.col) {
            console.log('到顶了拜拜', len + this.y, this.col)
            this.gameover()

            return;
        }
        //2.渲染当前视图并且保存到containerColors 里面
        forIn(len, len, (x, y) => {
            if (this.randomShape[x][y]) {
                this.containerColors[this.x + x][this.y + y] = this.shapeColor
            }
        })
        console.log('-------', this.containerColors, this.y)
        //3.计算有没有一行已经渲染的
        const canFullArr = []
        forIn(this.col, this.row, (y, x) => {
            console.log('====', this.containerColors[x][y] != defaultColor)
            canFullArr[y][x] = this.containerColors[x][y] != defaultColor
        }, (y) => {
            canFullArr[y] = [];
        })

        let idx = 0
        for (let i = 0; i < canFullArr.length; i++) {
            const canfull = canFullArr[i].every(item => item)
            console.log('canfull', canfull, i)
            //准备开始消除
            if (canfull) {
                for (let m = 0; m < this.row; m++) {
                    for (let n = i - idx; n < this.col; n++) {
                        if (n < this.col - 1) {
                            this.containerColors[m][n] = this.containerColors[m][n + 1]
                        }
                    }
                }
                idx = 1
                this.score += 10;
            }
        }
        this.updateBgRect();
        this.scoreLabel.string = 'score:' + this.score;
        //开始新的
        this.y = this.col;
        this.x = 3;
        this.onDrawRandomShape()
    },

    //绘制图形
    drawBgRect(x, y, color) {
        const d_x = (itemSize + this.space) * x;
        const d_y = (itemSize + this.space) * y;
        this.containerBlock.fillColor = new cc.Color().fromHEX(color)
        this.containerBlock.roundRect(d_x, d_y, itemSize, itemSize, 5);
        this.containerBlock.fill()
    },
    //绘制预览图形
    drawPreviewRect(x, y, color) {
        const d_x = (itemSize + this.space) * x;
        const d_y = (itemSize + this.space) * y;
        this.perviewBlock.fillColor = new cc.Color().fromHEX(color)
        this.perviewBlock.roundRect(d_x, d_y, itemSize, itemSize, 5);
        this.perviewBlock.fill()
    },

});
