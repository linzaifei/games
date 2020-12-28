import AppManager from '../custom/AppManager';
import wxCloudManager from '../wxCloudManager'
import LocalStorage from '../custom/localStorage'

const ROWS = 4;
const NUMBERS = [2, 4];
const MIN_DISTANCE = 60; //最大偏移量
const MOVE_DURATION = 0.1; //移动时间
const MAX = 2048;
const ANIMATION_DURATION = 0.1
cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab: cc.Prefab, //小模块资源
        gap: 20,//间距
        bg: cc.Node, //背景Node
        titleBox: cc.Node,
        scoreBox: cc.Node,
        scoreBg: cc.Graphics,
        scoreLabel: cc.Label, //评分对象
        score: 0, //分数
        best: 0,//最高分
        bestBg: cc.Graphics,
        bestLabel: cc.Label,
        gameBox: cc.Node,
        gameBg: cc.Graphics,
        gameOverBox: cc.Node,
        gameOverBg: cc.Graphics,
        gameOverLabel: cc.Label,
        rankBox: cc.Node,
        rankBg: cc.Graphics,
        rankButton: cc.Button,
        goButton: cc.Button,
        returnButton: cc.Button,

    },


    start() {
        this.drawBgBlocks()
        this.init()
        this.drawTitle();
        this.drawGameOver();
        this.drawRank()
    },
    onDestroy() {
        console.log('销毁')
        this.removeEventHandler()

    },
    onLoad() {


        this.returnButton.node.on('click', this.returnGame, this);

        this.goButton.node.on('click', () => {
            console.log('返回')
            cc.director.loadScene("start")
        }, this)

        this.initUserInfoButton()
        this.passiveShare()
    },
    showRanks() {
        if (typeof wx === 'undefined') {
            return;
        }
        this.rankBox.active = true;
        this.showAnimation(this.rankBox)
        this.removeEventHandler();
        wx.getOpenDataContext().postMessage({
            score: this.score,
        });

    },
    returnGame() {
        if (typeof wx === 'undefined') {
            return;
        }
        this.addEventHandler();
        this.rankBox.active = false;
        wx.getOpenDataContext().postMessage({
            score: 'clear'
        });
    },
    //主动分享
    shareGame() {
        if (typeof wx === 'undefined') {
            return;
        }
        wx.shareAppMessage({
            title: '我玩了' + this.best + '分，你呢？',
            // imageUrl: cc.url.raw('resources/share.png'),
        });
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
                title: '我玩了' + this.best + '分，你呢？',
                // imageUrl: cc.url.raw('resources/share.png'),
            }
        });
    },
    updateBest(number) {
        this.best = LocalStorage.get2048Score();
        if (!this.best || number >= this.best) {
            LocalStorage.set2048Score(number)
            this.best = number;
            this.bestLabel.string = number;
        }
    },

    initUserInfoButton() {
        if (typeof wx === 'undefined') {
            return;
        }
        AppManager.login()
    },
    restart(event) {
        console.log('restart!');
        this.init();
    },
    drawTitle() {
        let width = this.scoreBox.width;
        let height = this.scoreBox.height;
        this.scoreBg.roundRect(-width / 2, -height / 2, width, height, 10);
        this.scoreBg.fill();
        this.bestBg.roundRect(-width / 2, -height / 2, width, height, 10);
        this.bestBg.fill();
    },
    drawGameOver() {
        const w = this.gameOverBox.width;
        const h = this.gameOverBox.height;
        this.gameOverBg.roundRect(-w / 2, -h / 2, w, h, 20);
        this.gameOverBg.fill()
    },
    drawRank() {
        const w = this.rankBox.width;
        const h = this.rankBox.height;
        this.rankBg.roundRect(-w / 2, -h / 2, w, h, 20);
        this.rankBg.fill()
    },
    showAnimation(object) {
        cc.tween(object)
            .to(0.06, { scale: 1.1 })
            .to(0.06, { scale: 1 })
            .start();
    },
    //开始
    init() {
        this.updateScore(0)
        this.addEventHandler()
        // blocks 存储prefab 快
        if (this.blocks) {
            this.onGetRows(data => {
                if (this.blocks[data.x][data.y] != null) {
                    this.blocks[data.x][data.y].destroy();
                }
            })
        }
        this.blocks = [];
        this.data = [];
        //设置默认值
        for (let i = 0; i < ROWS; i++) {
            this.blocks.push([null, null, null, null])
            this.data.push([0, 0, 0, 0])
        }
        console.log(this.blocks, this.data)
        //随机生成三个数
        for (let i = 0; i < ROWS - 1; i++) {
            this.onAddBlock();
        }
        this.gameOverBox.active = false
        this.success = false;
        this.best = LocalStorage.get2048Score()
        console.log('====best', this.best)
        this.updateBest(this.best);
    },

    //监听触摸事件
    addEventHandler() {
        this.gameBox.on('touchstart', (event) => {
            // console.log('===start', event.getLocation())
            this.startPoint = event.getLocation();
        })
        this.gameBox.on('touchend', (event) => {
            // console.log('===end', event.getLocation())
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

    //触摸事件解析
    onTouchEnd(event) {
        const endPoint = event.getLocation();
        const vec = endPoint.sub(this.startPoint);
        //如果 vec.mag() 偏移量超多60 才可以触发
        if (vec.mag() > MIN_DISTANCE) {
            if (Math.abs(vec.x) > Math.abs(vec.y)) {
                if (vec.x > 0) {
                    console.log('向右')
                    this.moveDirection('right')
                } else {
                    console.log('向左')
                    // this.onMoveLeft()
                    this.moveDirection('left')
                }
            } else {
                if (vec.y > 0) {
                    console.log('向上')
                    this.moveDirection('up')
                } else {
                    console.log('向下')
                    this.moveDirection('down')
                }
            }
        }
    },
    //算法计算
    moveDirection(direction) {
        console.log('move ' + direction);
        let hasMoved = false;
        const move = (x, y, callback) => {
            let DirX;
            let DirY;
            let condition;
            switch (direction) {
                case 'left':
                    DirX = x;
                    DirY = y - 1;
                    condition = (y == 0)
                    break;
                case 'right':
                    DirX = x;
                    DirY = y + 1;
                    condition = (y == ROWS - 1);
                    break;
                case 'up':
                    DirX = x + 1;
                    DirY = y;
                    condition = (x == ROWS - 1)
                    break;
                case 'down':
                    DirX = x - 1;
                    DirY = y;
                    condition = (x == 0)
                    break
            }
            if (condition || this.data[x][y] == 0) {
                callback && callback()
                return
            } else if (this.data[DirX][DirY] == 0) {
                const block = this.blocks[x][y];
                const postion = this.positions[DirX][DirY];
                this.blocks[DirX][DirY] = block;
                this.blocks[x][y] = null;
                this.data[DirX][DirY] = this.data[x][y];
                this.data[x][y] = 0;
                this.doMove(block, postion, () => {
                    move(DirX, DirY, callback);
                })
                hasMoved = true;
            } else if (this.data[DirX][DirY] == this.data[x][y]) {
                const block = this.blocks[x][y];
                const postion = this.positions[DirX][DirY];
                this.data[DirX][DirY] *= 2;
                // console.log('===我来了', this.data[x][DirY])
                this.data[x][y] = 0;
                this.blocks[x][y] = null;
                this.blocks[DirX][DirY].getComponent('block').setNumber(this.data[DirX][DirY])
                this.doMove(block, postion, () => {
                    block.destroy();
                    callback && callback()
                })
                hasMoved = true;
                this.score += this.data[DirX][DirY];
                if (this.data[DirX][DirY] == MAX) {
                    this.success = true;
                    this.gameOver();
                }
                this.showAnimation(this.blocks[DirX][DirY])

            } else {
                callback && callback();
                return;
            }
        }

        let toMove = [];
        switch (direction) {
            case 'left':
                for (let i = 0; i < ROWS; ++i) {
                    for (let j = 0; j < ROWS; ++j) {
                        if (this.data[i][j] != 0) {
                            toMove.push({ x: i, y: j });
                        }
                    }
                }
                break;
            case 'right':
                for (let i = 0; i < ROWS; ++i) {
                    for (let j = ROWS - 1; j >= 0; --j) {
                        if (this.data[i][j] != 0) {
                            toMove.push({ x: i, y: j });
                        }
                    }
                }
                break;
            case 'up':
                for (let i = ROWS - 1; i >= 0; --i) {
                    for (let j = 0; j < ROWS; ++j) {
                        if (this.data[i][j] != 0) {
                            toMove.push({ x: i, y: j });
                        }
                    }
                }
                break;
            case 'down':
                for (let i = 0; i < ROWS; ++i) {
                    for (let j = 0; j < ROWS; ++j) {
                        if (this.data[i][j] != 0) {
                            toMove.push({ x: i, y: j });
                        }
                    }
                }
                break;
        }

        let counter = 0;
        for (let i = 0; i < toMove.length; ++i) {
            move(toMove[i].x, toMove[i].y, () => {
                counter++;
                if (counter == toMove.length) {
                    this.afterMove(hasMoved);
                }
            });
        }
    },
    onMoveDirection(direction) {
        let hasMoved = false;
        const move = (x, y, callback) => {
            let DirX;
            let DirY;
            let condition;
            switch (direction) {
                case 'left':
                    DirX = x;
                    DirY = y - 1;
                    condition = (y == 0)
                    break;
                case 'right':
                    DirX = x;
                    DirY = y + 1;
                    condition = (y == ROWS - 1);
                    break;
                case 'up':
                    DirX = x + 1;
                    DirY = y;
                    condition = (x == ROWS - 1)
                    break;
                case 'down':
                    DirX = x - 1;
                    DirY = y;
                    condition = (x == 0)
                    break
            }
            if (condition || this.data[x][y] == 0) {
                callback && callback()
                return
            } else if (this.data[DirX][DirY] == 0) {
                const block = this.blocks[x][y];
                const postion = this.positions[DirX][DirY];
                this.blocks[DirX][DirY] = block;
                this.blocks[x][y] = null;
                this.data[DirX][DirY] = this.data[x][y];
                this.data[x][y] = 0;
                this.doMove(block, postion, () => {
                    move(DirX, DirY, callback);
                })
                hasMoved = true;
            } else if (this.data[DirX][DirY] == this.data[x][y]) {
                const block = this.blocks[x][y];
                const postion = this.positions[DirX][DirY];
                this.data[DirX][DirY] *= 2;
                // console.log('===我来了', this.data[x][DirY])
                this.data[x][y] = 0;
                this.blocks[x][y] = null;
                this.blocks[DirX][DirY].getComponent('block').setNumber(this.data[DirX][DirY])
                this.doMove(block, postion, () => {
                    block.destroy();
                    callback && callback()
                })
                hasMoved = true;
                this.score += this.data[DirX][DirY];
                if (this.data[DirX][DirY] == MAX) {
                    this.success = true;
                    this.gameOver();
                }
                this.showAnimation(this.blocks[DirX][DirY])

            } else {
                callback && callback();
                return;
            }
        }
        //统计所以数据为空的位置
        const toMove = [];
        this.onGetRows((data) => {
            if (this.data[data.x][data.y] != 0) {
                toMove.push(data)
            }
        })
        let counter = 0;
        toMove.map((it, idx) => {
            move(it.x, it.y, () => {
                counter++
                // console.log('idx', counter, toMove.length)
                if (counter == toMove.length) {
                    this.afterMove(hasMoved)
                }
            })
        })
    },
    //循环获取
    onGetRows(callback) {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                callback({ x: i, y: j })
            }
        }
    },
    //动画结束添加模块
    afterMove(hasMoved) {
        if (hasMoved) {
            this.onAddBlock();
            this.updateScore(this.score)
            this.updateBest(this.score);
        }
        if (this.checkFail()) {
            this.gameOver()
        }
    },
    gameOver() {

        console.log('Game Over!');
        this.removeEventHandler();
        this.gameOverBox.active = true;
        this.gameOverLabel.string = this.success ? '游戏成功' : '游戏结束'
    },
    //检测失败
    checkFail() {
        let check = true;
        this.onGetRows(p => {
            const x = p.x;
            const y = p.y;
            const n = this.data[x][y];
            if (n == 0) check = false
            if (y > 0 && this.data[x][y - 1] == n) check = false
            if (x > 0 && this.data[x - 1][y] == n) check = false
            if (y < ROWS - 1 && this.data[x][y + 1] == n) check = false
            if (x > ROWS - 1 && this.data[x + 1][y] == n) check = false
        })
        return check;
    },
    //移动动画
    doMove(block, position, callback) {
        cc.tween(block)
            .to(MOVE_DURATION, { position })
            .call(() => {
                callback && callback()
            }).start()
    },
    //随机添加模块
    onAddBlock() {
        const emptyLocations = this.getEmptyLocations()
        //随机生成数字
        const random = Math.floor(Math.random() * 2)
        const number = NUMBERS[random];
        //获取获取空位置
        const index = Math.floor(Math.random() * emptyLocations.length);
        const x = emptyLocations[index].x;
        const y = emptyLocations[index].y;
        const position = this.positions[x][y];
        const block = cc.instantiate(this.blockPrefab);
        block.width = this.blockSize;
        block.height = this.blockSize;
        block.setPosition(position)
        block.getComponent('block').setNumber(number)
        this.gameBox.addChild(block);
        this.blocks[x][y] = block;
        this.data[x][y] = number;
        cc.tween(block)
            .to(ANIMATION_DURATION, { scale: 0.9 })
            .to(ANIMATION_DURATION, { scale: 1 }, { easing: 'sineIn' })
            .start();

    },
    //找出所有空闲位置
    getEmptyLocations() {
        const emptyLocations = [];
        this.onGetRows(data => {
            if (this.blocks[data.x][data.y] == null) {
                emptyLocations.push(data)
            }
        })
        return emptyLocations;
    },

    //设置分数
    updateScore(number) {
        this.score = number;
        this.scoreLabel.string = number;
    },

    //绘制背景盘
    drawBgBlocks() {
        const size = Math.min(this.gameBox.width, this.gameBox.height);
        console.log('=size=', size)
        this.blockSize = (size - this.gap * (ROWS + 1)) / ROWS;
        this.gameBg.roundRect(0, 0, size, size, 20);
        this.gameBg.fill();

        this.positions = [];
        for (let y = 0; y < ROWS; y++) {
            this.positions.push([])
            for (let x = 0; x < ROWS; x++) {
                const p_x = (x + 0.5) * this.blockSize + (x + 1) * this.gap;
                const p_y = (y + 0.5) * this.blockSize + (y + 1) * this.gap;
                const block = cc.instantiate(this.blockPrefab);
                block.width = this.blockSize;
                block.height = this.blockSize;
                this.gameBox.addChild(block);
                block.setPosition(cc.v2(p_x, p_y));
                block.getComponent('block').setNumber(0);
                this.positions[y][x] = cc.v2(p_x, p_y);

            }
        }

    }
});
