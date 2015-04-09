var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by alexgan on 2015-3-6.
 */
var duet;
(function (duet) {
    /**
     * 主游戏容器
     */
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            _super.call(this);
            /**障碍物*/
            this.blocks = [];
            /**障碍物的运动速度*/
            this.blockSpeed = 4;
            /**创建障碍物的时间间隔*/
            this.blockTimer = new egret.Timer(1000, 1);
            //当前障碍物的间隔
            this.MIN_BLOCK_SPACING = 320;
            //显示分数面板延时定时
            this.showScoreTimer = new egret.Timer(500, 1);
            //游戏是否结束
            this.isGameOver = false;
            //物理世界坐标和egret坐标的比例因子
            this._factor = 50;
            this._lastTime = egret.getTimer();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        /**初始化*/
        GameContainer.prototype.onAddToStage = function (event) {
            console.log("onAddToStage");
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        };
        /**创建游戏场景*/
        GameContainer.prototype.createGameScene = function () {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            // 可滚动背景
            this.bg = new duet.BgMap();
            this.addChild(this.bg);
            // 玩家控制的小球
            this.player = new duet.Player();
            this.player.createPanel(this.stageW / 2, this.stageH - this.stageW / 4 - 100);
            this.addChild(this.player);
            this.player.setTouchable(false);
            //创建物理世界
            this.createPhysicsWorld();
            // 预创建
            this.preCreatedInstance();
            GlobalEvent.getInstance().addEventListener(GlobalEvent.GAME_START, this.gameStart, this);
        };
        /**预创建一些对象，减少游戏时的创建消耗*/
        GameContainer.prototype.preCreatedInstance = function () {
            duet.BlocksManager.preCreateBlocks();
        };
        /**游戏开始*/
        GameContainer.prototype.gameStart = function () {
            this.isGameOver = false;
            duet.BlocksManager.reset();
            //给控制球绑定刚体并加入物理世界
            this.player.BindBodyToBalls(this._world, this._factor);
            this.player.startReset();
            this.bg.start();
            this.touchEnabled = true;
            this.newBlock = null;
            this._curBlockSpacing = this.MIN_BLOCK_SPACING;
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameLogicUpdated, this);
            this.blockTimer.addEventListener(egret.TimerEvent.TIMER, this.createBlock, this);
            this.blockTimer.start();
            // 更新分数
            GameConfig.score = 0;
            GlobalEvent.getInstance().dispatchEventWith(GlobalEvent.UPDATE_SCORE);
        };
        /**创建障碍物*/
        GameContainer.prototype.createBlock = function () {
            var block = duet.BlocksManager.createABlock(this._world, this._factor);
            this.newBlock = block;
            this.addChildAt(block, this.numChildren - 1);
            this.blocks.push(block);
            //            console.log(this._world.bodies.length + " body in the world!");
        };
        /**游戏结束*/
        GameContainer.prototype.gameStop = function () {
            this.isGameOver = true;
            //清除物理世界
            //            this._world.clear();
            this.player.DisbindBodyOfBalls(this._world);
            this.player.setTouchable(false);
            this.player.setRotatable(false);
            this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameLogicUpdated, this);
            this.blockTimer.removeEventListener(egret.TimerEvent.TIMER, this.createBlock, this);
            this.blockTimer.stop();
            this.showScoreTimer.addEventListener(egret.TimerEvent.TIMER, this.showScorePanel, this);
            this.showScoreTimer.start();
        };
        //显示成绩
        GameContainer.prototype.showScorePanel = function () {
            // 清理障碍物
            var block;
            while (this.blocks.length > 0) {
                block = this.blocks.pop();
                this.removeChild(block);
                block.retsetMovePattern();
                this._world.removeBody(block.body);
                block.passed = false;
                duet.BlocksManager.reclaim(block, block._type);
            }
            this.showScoreTimer.removeEventListener(egret.TimerEvent.TIMER, this.showScorePanel, this);
            this.showScoreTimer.stop();
            // 显示成绩
            Director.gameScene().panelManager.openOverPanel();
        };
        //创建物理世界
        GameContainer.prototype.createPhysicsWorld = function () {
            //创建world
            this._world = new p2.World();
            //刚体不运动是自动进入睡眠状态
            this._world.sleepMode = p2.World.BODY_SLEEPING;
            //设置重力参数
            this._world.gravity = [0, 0];
            //监听碰撞消息
            this._world.on(this._world.beginContactEvent.type, this.collisionFunc, this);
            //运行物理世界
            egret.Ticker.getInstance().register(this.runPhysicsWorld, this);
        };
        //运行物理世界
        GameContainer.prototype.runPhysicsWorld = function (dt) {
            if (this.isGameOver) {
                return;
            }
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            //让世界向后运动
            this._world.step(dt / 1000);
            if (this.isGameOver) {
                return;
            }
            //更新绑定了刚体的显示物体的位置
            var stageHeight = egret.MainContext.instance.stage.stageHeight;
            var l = this._world.bodies.length;
            for (var i = 0; i < l; i++) {
                var boxBody = this._world.bodies[i];
                /*                if (boxBody.type == p2.Body.KINEMATIC) {
                                    boxBody.position[1] += -5 * dt / 1000;
                                }
                  */
                var box = boxBody.displays[0];
                if (box) {
                    box.x = boxBody.position[0] * this._factor;
                    box.y = stageHeight - boxBody.position[1] * this._factor;
                    box.rotation = 360 - boxBody.angle * 180 / Math.PI;
                }
            }
        };
        //游戏逻辑更新
        GameContainer.prototype.gameLogicUpdated = function () {
            var _this = this;
            // 障碍物运动，超出边界即清除
            //var delArr: any[] = [];
            this.blocks.forEach(function (block) {
                if (block.y > _this.stageH + block.height) {
                    //delArr.push(block);
                    _this.removeChild(block);
                    block.retsetMovePattern();
                    _this._world.removeBody(block.body);
                    block.passed = false;
                    duet.BlocksManager.reclaim(block, block._type);
                    _this.blocks.splice(_this.blocks.indexOf(block), 1);
                }
            });
            this.blocks.forEach(function (block) {
                // 是否通过障碍物
                if (!block.passed && (_this.player.blueBallPosition.y < block.y && _this.player.redBallPosition.y < block.y)) {
                    block.passed = true;
                    //                    RES.getRes("s_point").play();
                    // 更新分数
                    GameConfig.score++;
                    //                    console.log("当前分数：" + GameConfig.score);
                    GlobalEvent.getInstance().dispatchEventWith(GlobalEvent.UPDATE_SCORE);
                }
            });
            //检测是否需要创建新的障碍物
            if (this.newBlock && (this.newBlock.y - this.newBlock._initPosition[1] >= this._curBlockSpacing)) {
                //新的障碍物已经移动超过了障碍物的距离，此时应该新建一个障碍物
                this.createBlock();
                //确定下一次障碍物的距离
                if (duet.BlocksManager.nextBlockType == duet.Block.BLOCK_TYPE_SHORT || duet.BlocksManager.nextBlockType == duet.Block.BLOCK_TYPE_LONG || duet.BlocksManager.nextBlockType == duet.Block.BLOCK_TYPE_SQUARE) {
                    if (duet.BlocksManager.curBlockType == duet.Block.BLOCK_TYPE_SHORT || duet.BlocksManager.curBlockType == duet.Block.BLOCK_TYPE_LONG || duet.BlocksManager.curBlockType == duet.Block.BLOCK_TYPE_SQUARE) {
                        this._curBlockSpacing = this.MIN_BLOCK_SPACING;
                    }
                    else {
                        this._curBlockSpacing = this.MIN_BLOCK_SPACING + 50;
                    }
                }
                else {
                    this._curBlockSpacing = this.MIN_BLOCK_SPACING + 50;
                }
            }
        };
        //碰撞消息回调
        GameContainer.prototype.collisionFunc = function (event) {
            console.log("Collision happened!");
            //            console.log(event);
            var bodyA = event.bodyA;
            var bodyB = event.bodyB;
            var posX;
            var posY;
            //先判断一下哪个刚体是DYNAMIC类型的，就是球
            if (bodyA.type == p2.Body.DYNAMIC) {
                posX = bodyA.displays[0].x;
                posY = bodyA.displays[0].y;
            }
            else {
                posX = bodyB.displays[0].x;
                posY = bodyB.displays[0].y;
            }
            //在被撞小球上面播放撞击粒子效果
            this.player.playHitEffect(posX, posY);
            this.gameStop();
            RES.getRes("s_hit").play();
        };
        return GameContainer;
    })(egret.DisplayObjectContainer);
    duet.GameContainer = GameContainer;
    GameContainer.prototype.__class__ = "duet.GameContainer";
})(duet || (duet = {}));
