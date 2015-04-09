var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by billbao on 2015-3-6.
 */
var duet;
(function (duet) {
    /**
     * 操控面板
     */
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            _super.call(this);
            this.stageW = egret.MainContext.instance.stage.stageWidth;
            this.stageH = egret.MainContext.instance.stage.stageHeight;
            //大圆圈半径
            this.CIRCLE_RADIUS = this.stageW / 4;
            //小圆圈半径
            this.BALL_RADIUS = 5;
            //旋转定时器的更新时间
            this.ROTATE_UPDATE_TIME = 25;
            //旋转速度（每秒）
            this.ROTATE_SPEED = 180;
            //是否转动
            this._isRotatable = false;
            //是否顺时针转动
            this._isClockwise = true;
            //转动更新定时器
            //        private _rotationTimer: egret.Timer;
            this._blueTail = null;
            this._redTail = null;
            this._hitEffect = null;
            //是否需要响应触摸事件
            this._isTouchable = true;
            //是否处于复位阶段
            this._onReset = false;
            //小球是否绑定了刚体
            this._isBindedBodyToBalls = false;
            this._rotatedDegree = 0;
            this._initPosBlue = new egret.Point();
            this._initPosRed = new egret.Point();
            //            this._rotationTimer = new egret.Timer(this.ROTATE_UPDATE_TIME, 0);
            //            this._rotationTimer.addEventListener(egret.TimerEvent.TIMER, this.rotationTimerFunc, this);
        }
        //创建控制面板
        Player.prototype.createPanel = function (x, y) {
            //绘制大圆圈
            this._bigCircle = new egret.Bitmap();
            //this._bigCircle.x = this.stageW / 2;
            //this._bigCircle.y = this.stageH - this.stageW / 4 - 100;
            this._bigCircle.anchorX = 0.5;
            this._bigCircle.anchorY = 0.5;
            this._bigCircle.x = x;
            this._bigCircle.y = y;
            this._bigCircle.texture = RES.getRes("circle");
            this._bigCircle.width = this.stageW / 2;
            this._bigCircle.height = this.stageW / 2;
            this.addChild(this._bigCircle);
            //设置两个小球的初始化位置
            this._initPosBlue.x = this._bigCircle.x - this.CIRCLE_RADIUS;
            this._initPosBlue.y = this._bigCircle.y;
            this._initPosRed.x = this._bigCircle.x + this.CIRCLE_RADIUS;
            this._initPosRed.y = this._bigCircle.y;
            //绘制两个小球
            //左球
            this._blueTail = this.createTailEffect();
            this._blueTail.emitterX = this._initPosBlue.x;
            this._blueTail.emitterY = this._initPosBlue.y;
            this.addChild(this._blueTail);
            this._blueTail.start();
            this._blueBall = new egret.Bitmap();
            this._blueBall.anchorX = 0.5;
            this._blueBall.anchorY = 0.5;
            this._blueBall.x = this._initPosBlue.x;
            this._blueBall.y = this._initPosBlue.y;
            this._blueBall.texture = RES.getRes("p1");
            this._blueBall.width = 50;
            this._blueBall.height = 50;
            this.addChild(this._blueBall);
            //右球
            this._redTail = this.createTailEffect();
            this._redTail.emitterX = this._initPosRed.x;
            this._redTail.emitterY = this._initPosRed.y;
            this.addChild(this._redTail);
            this._redTail.start();
            this._redBall = new egret.Bitmap();
            this._redBall.anchorX = 0.5;
            this._redBall.anchorY = 0.5;
            this._redBall.x = this._initPosRed.x;
            this._redBall.y = this._initPosRed.y;
            this._redBall.texture = RES.getRes("p2");
            this._redBall.width = 50;
            this._redBall.height = 50;
            this.addChild(this._redBall);
            //撞击粒子效果
            this._hitEffect = this.createHitEffect();
            this.addChild(this._hitEffect);
            //            this._rotationTimer.start();
            this.addEventListener(egret.Event.ENTER_FRAME, this.frameUpdate, this);
            this.lastTime = egret.getTimer();
            this.gapTime = 0;
            //添加全局事件侦听
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.stage_mouseDownHandler, this);
        };
        //帧更新函数
        Player.prototype.frameUpdate = function () {
            var curTime = egret.getTimer();
            this.gapTime = curTime - this.lastTime;
            this.lastTime = curTime;
            //            console.log("gapTime:" + this.gapTime);
            this.rotationUpdateFunc();
        };
        //给小球绑定刚体
        Player.prototype.BindBodyToBalls = function (world, factor) {
            if (!this._blueBallBody) {
                this._blueBallBody = this.createBallBody(this._blueBall.x, this._blueBall.y, Math.round((this.BALL_RADIUS / factor) * 100) / 100, factor);
            }
            else {
                this._blueBallBody.velocity = [0, 0];
            }
            world.addBody(this._blueBallBody);
            this._blueBallBody.displays = [this._blueBall];
            if (!this._redBallBody) {
                this._redBallBody = this.createBallBody(this._redBall.x, this._redBall.y, Math.round((this.BALL_RADIUS / factor) * 100) / 100, factor);
            }
            else {
                this._redBallBody.velocity = [0, 0];
            }
            world.addBody(this._redBallBody);
            this._redBallBody.displays = [this._redBall];
            this._isBindedBodyToBalls = true;
        };
        //给小球解绑刚体
        Player.prototype.DisbindBodyOfBalls = function (world) {
            world.removeBody(this._blueBallBody);
            this._blueBallBody = null;
            world.removeBody(this._redBallBody);
            this._redBallBody = null;
            this._isBindedBodyToBalls = false;
        };
        //创建圆形刚体
        Player.prototype.createBallBody = function (posX, posY, radius, factor) {
            console.log("小球刚体的半径：" + radius);
            var positionX = Math.round((posX / factor) * 100) / 100;
            var positionY = Math.round(((egret.MainContext.instance.stage.stageHeight - posY) / factor) * 100) / 100;
            var circleShape = new p2.Circle(radius);
            var ballBody = new p2.Body({ mass: 1, position: [positionX, positionY], fixedRotation: true, type: p2.Body.DYNAMIC, velocity: [0, 0] });
            ballBody.addShape(circleShape);
            return ballBody;
        };
        //顺时针转动小球
        Player.prototype.rotateBallsClockwise = function (angularVelocity) {
            var deltaDegree = angularVelocity * this.gapTime / 1000;
            this._rotatedDegree += deltaDegree;
            if (this._onReset) {
                //复位阶段
                if (this._rotatedDegree >= 0) {
                    this.resetBallsPosition();
                    this._onReset = false;
                    this.setTouchable(true);
                    return;
                }
            }
            else {
                if (this._rotatedDegree >= 360) {
                    this._rotatedDegree -= 360;
                }
            }
            this.updateBallsPosition();
        };
        //逆时针转动小球
        Player.prototype.rotateBallsCounterclockwise = function (angularVelocity) {
            var deltaDegree = angularVelocity * this.gapTime / 1000;
            this._rotatedDegree -= deltaDegree;
            if (this._onReset) {
                //复位阶段
                if (this._rotatedDegree <= 0) {
                    console.log("复位完成");
                    this.resetBallsPosition();
                    this._onReset = false;
                    this.setTouchable(true);
                    return;
                }
            }
            else {
                if (this._rotatedDegree <= -360) {
                    this._rotatedDegree += 360;
                }
            }
            this.updateBallsPosition();
        };
        //更新小球的位置
        Player.prototype.updateBallsPosition = function () {
            //角度转换为弧度
            //var radian = this._rotatedDegree * Math.PI / 180;
            //根据角度计算偏移位置
            //var deltaX: number = this.CIRCLE_RADIUS - Math.round(this.CIRCLE_RADIUS * Math.cos(radian));
            //var deltaY: number = Math.round(this.CIRCLE_RADIUS * Math.sin(radian));
            var deltaX = this.CIRCLE_RADIUS - Math.round(this.CIRCLE_RADIUS * egret.NumberUtils.cos(this._rotatedDegree));
            var deltaY = Math.round(this.CIRCLE_RADIUS * egret.NumberUtils.sin(this._rotatedDegree));
            //更新小球的位置
            if (this._isBindedBodyToBalls) {
                //如果绑定了刚体，则通过物理系统来改变小球的位置
                this.updateBodyPosition(this._blueBallBody, this._initPosBlue.x + deltaX, this._initPosBlue.y - deltaY, 50);
                this.updateBodyPosition(this._redBallBody, this._initPosRed.x - deltaX, this._initPosRed.y + deltaY, 50);
            }
            else {
                //如果没有绑定刚体，则直接计算改变小球的位置
                this._blueBall.x = this._initPosBlue.x + deltaX;
                this._blueBall.y = this._initPosBlue.y - deltaY;
                this._redBall.x = this._initPosRed.x - deltaX;
                this._redBall.y = this._initPosRed.y + deltaY;
            }
        };
        //更新刚体的位置
        Player.prototype.updateBodyPosition = function (body, posX, posY, factor) {
            body.position[0] = Math.round((posX / factor) * 100) / 100;
            body.position[1] = Math.round(((egret.MainContext.instance.stage.stageHeight - posY) / factor) * 100) / 100;
        };
        //更新拖尾粒子的位置
        Player.prototype.updateTailsPosition = function () {
            this._blueTail.emitterX = this._blueBall.x;
            this._blueTail.emitterY = this._blueBall.y;
            this._redTail.emitterX = this._redBall.x;
            this._redTail.emitterY = this._redBall.y;
        };
        //旋转更新
        Player.prototype.rotationUpdateFunc = function () {
            if (this._isRotatable || this._onReset) {
                if (this._isClockwise) {
                    this.rotateBallsClockwise(this.ROTATE_SPEED);
                }
                else {
                    this.rotateBallsCounterclockwise(this.ROTATE_SPEED);
                }
            }
            this.updateTailsPosition();
        };
        //设置旋转
        Player.prototype.setRotatable = function (isRotatable) {
            this._isRotatable = isRotatable;
        };
        Object.defineProperty(Player.prototype, "isClockwise", {
            get: function () {
                return this._isClockwise;
            },
            set: function (isClockwise) {
                this._isClockwise = isClockwise;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "circleRadius", {
            get: function () {
                return this.CIRCLE_RADIUS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "blueBallPosition", {
            get: function () {
                return new egret.Point(this._blueBall.x, this._blueBall.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "redBallPosition", {
            get: function () {
                return new egret.Point(this._redBall.x, this._redBall.y);
            },
            enumerable: true,
            configurable: true
        });
        //创建拖尾粒子系统
        Player.prototype.createTailEffect = function () {
            //获取纹理
            var texture = RES.getRes("tailParticle_png");
            //获取配置
            var config = RES.getRes("tailParticle_json");
            //创建粒子
            var tail = new particle.GravityParticleSystem(texture, config);
            return tail;
        };
        //创建撞击粒子效果
        Player.prototype.createHitEffect = function () {
            //获取纹理
            var texture = RES.getRes("tailParticle_png");
            //获取配置
            var config = RES.getRes("hitParticle_json");
            //创建粒子
            var hit = new particle.GravityParticleSystem(texture, config);
            return hit;
        };
        //播放撞击粒子效果
        Player.prototype.playHitEffect = function (posX, posY) {
            if (this._hitEffect) {
                this._hitEffect.emitterX = posX;
                this._hitEffect.emitterY = posY;
                this._hitEffect.start(100);
            }
        };
        //开始复位
        Player.prototype.startReset = function () {
            if (this._rotatedDegree == 0) {
                //没有转过，不需要复位
                this.setTouchable(true);
                return;
            }
            this._onReset = true;
            if (this._rotatedDegree > 0) {
                this.isClockwise = false;
            }
            else {
                this.isClockwise = true;
            }
        };
        //重置两个球的位置
        Player.prototype.resetBallsPosition = function () {
            this._rotatedDegree = 0;
            //更新小球的位置
            if (this._isBindedBodyToBalls) {
                //如果绑定了刚体，则通过物理系统来改变小球的位置
                this.updateBodyPosition(this._blueBallBody, this._initPosBlue.x, this._initPosBlue.y, 50);
                this.updateBodyPosition(this._redBallBody, this._initPosRed.x, this._initPosRed.y, 50);
            }
            else {
                //如果没有绑定刚体，则直接计算改变小球的位置
                this._blueBall.x = this._initPosBlue.x;
                this._blueBall.y = this._initPosBlue.y;
                this._redBall.x = this._initPosRed.x;
                this._redBall.y = this._initPosRed.y;
            }
            /*
            
                        if (this._blueBall != null) {
                            this._blueBall.x = this._initPosBlue.x;
                            this._blueBall.y = this._initPosBlue.y;
                        }
            
                        if (this._blueTail != null) {
                            this._blueTail.emitterX = this._initPosBlue.x;
                            this._blueTail.emitterY = this._initPosBlue.y;
                        }
            
                        if (this._redBall != null) {
                            this._redBall.x = this._initPosRed.x;
                            this._redBall.y = this._initPosRed.y;
                        }
            
                        if (this._redTail) {
                            this._redTail.emitterX = this._initPosRed.x;
                            this._redTail.emitterY = this._initPosRed.y;
                        }*/
        };
        //设置是否可以响应触摸
        Player.prototype.setTouchable = function (bTouchable) {
            this._isTouchable = bTouchable;
        };
        //鼠标按下
        Player.prototype.stage_mouseDownHandler = function (event) {
            if (!this._isTouchable) {
                //不需要响应触摸事件，直接返回
                return;
            }
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.stage_mouseMoveHandler, this);
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stage_mouseUpHandler, this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.LEAVE_STAGE, this.stage_mouseUpHandler, this);
            this.downPoint = new egret.Point(event.stageX, event.stageY);
            //console.log("downPoint:x->" + event.stageX, ",y->" + event.stageY);
            this.setRotatable(true);
            if (this.downPoint.x > this.stageW / 2) {
                this.isClockwise = true;
            }
            else {
                this.isClockwise = false;
            }
        };
        //鼠标移动
        Player.prototype.stage_mouseMoveHandler = function (event) {
            if (!this.movePoint) {
                this.movePoint = new egret.Point();
            }
            this.movePoint.x = event.stageX;
            this.movePoint.y = event.stageY;
            if (this.movePoint.x > this.stageW / 2) {
                this.isClockwise = true;
            }
            else {
                this.isClockwise = false;
            }
        };
        //鼠标抬起
        Player.prototype.stage_mouseUpHandler = function (event) {
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.stage_mouseMoveHandler, this);
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_mouseUpHandler, this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.LEAVE_STAGE, this.stage_mouseUpHandler, this);
            this.setRotatable(false);
        };
        return Player;
    })(egret.DisplayObjectContainer);
    duet.Player = Player;
    Player.prototype.__class__ = "duet.Player";
})(duet || (duet = {}));
