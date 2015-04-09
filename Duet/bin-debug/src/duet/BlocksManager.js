/**
* Created by billbao on 2015-3-24.
*/
var duet;
(function (duet) {
    /**
     * 障碍物管理器
     */
    var BlocksManager = (function () {
        function BlocksManager() {
        }
        /**生产*/
        BlocksManager.produce = function (type) {
            if (this.cacheDict[type] == null)
                this.cacheDict[type] = [];
            var dict = this.cacheDict[type];
            var block;
            if (dict.length > 0) {
                block = dict.pop();
            }
            else {
                block = new duet.Block(type);
            }
            //           block.textureName = textureName;
            return block;
        };
        /**回收*/
        BlocksManager.reclaim = function (block, type) {
            if (this.cacheDict[type] == null)
                this.cacheDict[type] = [];
            var dict = this.cacheDict[type];
            if (dict.indexOf(block) == -1)
                dict.push(block);
        };
        /**预分配*/
        BlocksManager.reserve = function (type, count) {
            var objArr = []; // 临时存储
            for (var i = 0; i < count; i++) {
                var block = this.produce(type);
                objArr.push(block);
            }
            for (i = 0; i < count; i++) {
                block = objArr.pop();
                this.reclaim(block, type);
            }
        };
        //预创建block
        BlocksManager.preCreateBlocks = function () {
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_SHORT, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_LONG, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_SQUARE, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_SHORT_H_MOVE, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_LONG_H_MOVE, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_SHORT_FAST, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_LONG_ROTATE_REVERSE, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_SQUARE_FAST, 5);
            duet.BlocksManager.reserve(duet.Block.BLOCK_TYPE_LONG_FAST, 5);
        };
        BlocksManager.reset = function () {
            this.curTypeNum = 2;
            this.blockCounter = 1;
            this.curBlockType = 0;
            this.nextBlockType = 0;
        };
        //根据规则随机一种障碍物类型
        //typeNum: 种类数量
        BlocksManager.randomBlockType = function (typeNum) {
            var type = 1;
            if (typeNum <= 3) {
                type = Math.floor(Math.random() * typeNum) + 1;
            }
            else if (typeNum == 4) {
                var rand = Math.floor(Math.random() * 100);
                if (rand < 15) {
                    type = duet.Block.BLOCK_TYPE_SHORT_H_MOVE;
                }
                else {
                    type = Math.floor(Math.random() * typeNum) + 1;
                }
            }
            else if (typeNum == 5) {
                var rand = Math.floor(Math.random() * 100);
                if (rand < 15) {
                    type = duet.Block.BLOCK_TYPE_SHORT_H_MOVE;
                }
                else if (rand >= 15 && rand < 25) {
                    type = duet.Block.BLOCK_TYPE_LONG_H_MOVE;
                }
                else {
                    type = Math.floor(Math.random() * typeNum) + 1;
                }
            }
            else if (typeNum == 7) {
                var rand = Math.floor(Math.random() * 100);
                if (rand < 15) {
                    type = duet.Block.BLOCK_TYPE_SHORT_H_MOVE;
                }
                else if (rand >= 15 && rand < 25) {
                    type = duet.Block.BLOCK_TYPE_LONG_H_MOVE;
                }
                else if (rand >= 25 && rand < 35) {
                    type = duet.Block.BLOCK_TYPE_SHORT_FAST;
                }
                else if (rand >= 35 && rand < 45) {
                    type = duet.Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE;
                }
                else {
                    type = Math.floor(Math.random() * typeNum) + 1;
                }
            }
            else if (typeNum == 8) {
                var rand = Math.floor(Math.random() * 100);
                if (rand < 15) {
                    type = duet.Block.BLOCK_TYPE_SHORT_H_MOVE;
                }
                else if (rand >= 15 && rand < 25) {
                    type = duet.Block.BLOCK_TYPE_LONG_H_MOVE;
                }
                else if (rand >= 25 && rand < 35) {
                    type = duet.Block.BLOCK_TYPE_SHORT_FAST;
                }
                else if (rand >= 35 && rand < 45) {
                    type = duet.Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE;
                }
                else if (rand >= 45 && rand < 55) {
                    type = duet.Block.BLOCK_TYPE_LONG_ROTATE_REVERSE;
                }
                else {
                    type = Math.floor(Math.random() * typeNum) + 1;
                }
            }
            else if (typeNum == 10) {
                var rand = Math.floor(Math.random() * 100);
                if (rand < 15) {
                    type = duet.Block.BLOCK_TYPE_SHORT_H_MOVE;
                }
                else if (rand >= 15 && rand < 25) {
                    type = duet.Block.BLOCK_TYPE_LONG_H_MOVE;
                }
                else if (rand >= 25 && rand < 35) {
                    type = duet.Block.BLOCK_TYPE_SHORT_FAST;
                }
                else if (rand >= 35 && rand < 45) {
                    type = duet.Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE;
                }
                else if (rand >= 45 && rand < 55) {
                    type = duet.Block.BLOCK_TYPE_LONG_ROTATE_REVERSE;
                }
                else if (rand >= 55 && rand < 65) {
                    type = duet.Block.BLOCK_TYPE_SQUARE_FAST;
                }
                else if (rand >= 65 && rand < 70) {
                    type = duet.Block.BLOCK_TYPE_LONG_FAST;
                }
                else {
                    type = Math.floor(Math.random() * typeNum) + 1;
                }
            }
            return type;
        };
        //创建一个障碍物
        BlocksManager.createABlock = function (world, factor) {
            var stageW = egret.MainContext.instance.stage.stageWidth;
            var stageH = egret.MainContext.instance.stage.stageHeight;
            this.blockCounter++;
            //            console.log("已经生产的block数量为" + this.blockCounter);
            /*
            for (var i = 0; i < 11; i++)
            {
                this.blockRuleCounter[i]++;
            }
            */
            if (this.blockCounter >= 5 && this.blockCounter < 10) {
                this.curTypeNum = 3;
            }
            else if (this.blockCounter >= 10 && this.blockCounter < 15) {
                this.curTypeNum = 4;
            }
            else if (this.blockCounter >= 15 && this.blockCounter < 20) {
                this.curTypeNum = 5;
            }
            else if (this.blockCounter >= 20 && this.blockCounter < 25) {
                this.curTypeNum = 7;
            }
            else if (this.blockCounter >= 25 && this.blockCounter < 30) {
                this.curTypeNum = 8;
            }
            else if (this.blockCounter >= 30) {
                this.curTypeNum = 10;
            }
            //当前要生产的障碍物类型
            if (this.nextBlockType == 0) {
                this.curBlockType = this.randomBlockType(this.curTypeNum);
            }
            else {
                this.curBlockType = this.nextBlockType;
            }
            this.nextBlockType = this.randomBlockType(this.curTypeNum);
            // console.log("curBlockType:" + this.curBlockType + ",nextBlockType:" + this.nextBlockType);
            /*
            //是否进行随机
            var isRandom: boolean = true;
            for (var i = 0; i < this.curTypeNum; i++) {
                if (((i + 1) == Block.BLOCK_TYPE_SHORT_H_MOVE && this.blockRuleCounter[i] >= 7)
                    || ((i + 1) == Block.BLOCK_TYPE_LONG_H_MOVE && this.blockRuleCounter[i] >= 7)
                    || ((i + 1) == Block.BLOCK_TYPE_SHORT_FAST && this.blockRuleCounter[i] >= 7)
                    || ((i + 1) == Block.BLOCK_TYPE_LONG_ROTATE_CLOCKWISE && this.blockRuleCounter[i] >= 10)
                    || ((i + 1) == Block.BLOCK_TYPE_LONG_ROTATE_REVERSE && this.blockRuleCounter[i] >= 10)
                    || ((i + 1) == Block.BLOCK_TYPE_SQUARE_FAST && this.blockRuleCounter[i] >= 7)
                    || ((i + 1) == Block.BLOCK_TYPE_LONG_FAST && this.blockRuleCounter[i] >= 7)
                    ){
                    blockType = i + 1;
                    this.blockRuleCounter[i] = 0;
                    isRandom = false;
                    break;
                }

            }


            if (isRandom) {
                blockType = Math.floor(Math.random() * this.curTypeNum) + 1;
                this.blockRuleCounter[blockType - 1] = 0;
            }
            */
            //           console.log("生产的block的类型是" + blockType);
            //test
            //           blockType = 4;
            var block = duet.BlocksManager.produce(this.curBlockType);
            // 随机位置
            block.anchorX = block.anchorY = 0.5;
            block.x = Math.random() * (stageW - block.width) + block.width / 2;
            block.y = -block.height / 2;
            //设置初始化位置
            block._initPosition = [block.x, block.y];
            //给block绑定刚体
            block.bindABody(world, factor);
            // 障碍物动画
            //            var tw = egret.Tween.get(block/*, { loop: true }*/);
            //           tw.to({ scaleX: 1.1 }, 1000, egret.Ease.getBackInOut(1.5))
            //               .to({ scaleX: 1.0 }, 1000, egret.Ease.getBackInOut(1.5));
            if (block._type == duet.Block.BLOCK_TYPE_SHORT_H_MOVE || block._type == duet.Block.BLOCK_TYPE_LONG_H_MOVE) {
                //水平来回移动
                if (block.x > stageW / 2) {
                    block.setMovePattern({ velocity: [-2, 0] });
                }
                else {
                    block.setMovePattern({ velocity: [2, 0] });
                }
            }
            else if (block._type == duet.Block.BLOCK_TYPE_SHORT_FAST || block._type == duet.Block.BLOCK_TYPE_LONG_FAST || block._type == duet.Block.BLOCK_TYPE_SQUARE_FAST) {
                //快速下落运动
                block.setMovePattern({ velocity: [0, -2] });
            }
            //            console.log("curTypeNum:" + this.curTypeNum);
            return block;
        };
        BlocksManager.cacheDict = {};
        BlocksManager.curTypeNum = 2; //当前障碍物的种类
        //每种障碍物出现的频率条件计数
        BlocksManager.blockRuleCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        return BlocksManager;
    })();
    duet.BlocksManager = BlocksManager;
    BlocksManager.prototype.__class__ = "duet.BlocksManager";
})(duet || (duet = {}));
