var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by alexgan on 2015-3-6.
 * Modified by billbao on 2015-3-26
 */
var duet;
(function (duet) {
    /**
     * 障碍物，利用对象池
     */
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block(type) {
            _super.call(this);
            this.passed = false;
            this.patternTimer = new egret.Timer(2000); //模式运动定时器
            this._type = type;
            //设置纹理
            this.setTextureByType(this._type);
        }
        //根据类型设置障碍物的纹理
        Block.prototype.setTextureByType = function (type) {
            if (type == Block.BLOCK_TYPE_SHORT || type == Block.BLOCK_TYPE_SHORT_H_MOVE || type == Block.BLOCK_TYPE_SHORT_FAST) {
                //短条
                this.texture = RES.getRes("b1");
            }
            else if (type == Block.BLOCK_TYPE_LONG || type == Block.BLOCK_TYPE_LONG_H_MOVE || type == Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE || type == Block.BLOCK_TYPE_LONG_ROTATE_REVERSE || type == Block.BLOCK_TYPE_LONG_FAST) {
                //长条
                this.texture = RES.getRes("b2");
            }
            else if (type == Block.BLOCK_TYPE_SQUARE || type == Block.BLOCK_TYPE_SQUARE_FAST) {
                //正方形
                this.texture = RES.getRes("b3");
            }
            this.width = this.width * 1.33;
            this.height = this.height * 1.33;
        };
        //根据类型设置障碍物的运动模式
        Block.prototype.setMovePattern = function (options) {
            //            console.log("setMovePattern");
            if (this._body == null) {
                //刚体不存在
                return;
            }
            this._options = options;
            if (this._type == Block.BLOCK_TYPE_SHORT_H_MOVE || this._type == Block.BLOCK_TYPE_LONG_H_MOVE) {
                //水平来回移动
                this._body.velocity[0] = this._options.velocity[0];
                this.patternTimer.addEventListener(egret.TimerEvent.TIMER, this.horizontalMoveFunc, this);
                this.patternTimer.start();
            }
            else if (this._type == Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE || this._type == Block.BLOCK_TYPE_LONG_ROTATE_REVERSE) {
            }
            else if (this._type == Block.BLOCK_TYPE_SHORT_FAST || this._type == Block.BLOCK_TYPE_LONG_FAST || this._type == Block.BLOCK_TYPE_SQUARE_FAST) {
                //快速下落运动
                this._body.velocity[1] = this._options.velocity[1] + this._initVelocity[1];
            }
        };
        //重置障碍物运动模式
        Block.prototype.retsetMovePattern = function () {
            if (this._type == Block.BLOCK_TYPE_SHORT_H_MOVE || this._type == Block.BLOCK_TYPE_LONG_H_MOVE) {
                //水平来回移动
                this.patternTimer.removeEventListener(egret.TimerEvent.TIMER, this.horizontalMoveFunc, this);
                this.patternTimer.stop();
            }
        };
        //水平运动模式定时器回调
        Block.prototype.horizontalMoveFunc = function () {
            this._options.velocity[0] = -this._options.velocity[0];
            this._body.velocity[0] = this._options.velocity[0];
        };
        //绑定刚体
        Block.prototype.bindABody = function (world, factor) {
            //先换算刚体的物理坐标和物理大小
            var positionX = Math.round((this.x / factor) * 100) / 100;
            var positionY = Math.round(((egret.MainContext.instance.stage.stageHeight - this.y) / factor) * 100) / 100;
            if (this._body == null) {
                var width = Math.round(((this.width - 10) / factor) * 100) / 100;
                var height = Math.round(((this.height - 10) / factor) * 100) / 100;
                //添加方形刚体
                var boxShape = new p2.Rectangle(width, height);
                //刚体参数
                var options;
                this._initVelocity = [0, -4];
                if (this._type == Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE) {
                    //顺时针旋转的长条
                    options = {
                        mass: 1,
                        position: [positionX, positionY],
                        type: p2.Body.KINEMATIC,
                        velocity: this._initVelocity,
                        angularVelocity: -Math.PI * 2 / 3
                    };
                }
                else if (this._type == Block.BLOCK_TYPE_LONG_ROTATE_REVERSE) {
                    //逆时针旋转的长条
                    options = {
                        mass: 1,
                        position: [positionX, positionY],
                        type: p2.Body.KINEMATIC,
                        velocity: this._initVelocity,
                        angularVelocity: Math.PI * 2 / 3
                    };
                }
                else {
                    //其他
                    options = {
                        mass: 1,
                        position: [positionX, positionY],
                        fixedRotation: true,
                        type: p2.Body.KINEMATIC,
                        velocity: this._initVelocity
                    };
                }
                this._body = new p2.Body(options);
                this._body.addShape(boxShape);
                this._body.displays = [this];
            }
            else {
                this._body.position = [positionX, positionY];
                this._body.angle = 0;
            }
            world.addBody(this._body);
        };
        Object.defineProperty(Block.prototype, "body", {
            //获取block的刚体
            get: function () {
                return this._body;
            },
            enumerable: true,
            configurable: true
        });
        //障碍物的类型
        Block.BLOCK_TYPE_SHORT = 1; //短条
        Block.BLOCK_TYPE_LONG = 2; //长条
        Block.BLOCK_TYPE_SQUARE = 3; //正方形
        Block.BLOCK_TYPE_SHORT_H_MOVE = 4; //水平移动的短条
        Block.BLOCK_TYPE_LONG_H_MOVE = 5; //水平移动的长条
        Block.BLOCK_TYPE_SHORT_FAST = 6; //快速下落的短条
        Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE = 7; //顺时针旋转的长条
        Block.BLOCK_TYPE_LONG_ROTATE_REVERSE = 8; //逆时针旋转的长条
        Block.BLOCK_TYPE_SQUARE_FAST = 9; //快速下落的方块
        Block.BLOCK_TYPE_LONG_FAST = 10; //快速下落的长条
        return Block;
    })(egret.Bitmap);
    duet.Block = Block;
    Block.prototype.__class__ = "duet.Block";
})(duet || (duet = {}));
