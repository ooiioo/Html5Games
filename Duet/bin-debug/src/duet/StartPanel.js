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
     * 开始游戏界面
     */
    var StartPanel = (function (_super) {
        __extends(StartPanel, _super);
        function StartPanel() {
            _super.call(this);
        }
        // 初始化面板
        StartPanel.prototype.initPanel = function () {
            this.bg = new egret.Bitmap();
            this.bg.texture = RES.getRes("bgImage");
            this.bg.width = egret.MainContext.instance.stage.stageWidth;
            this.bg.height = egret.MainContext.instance.stage.stageHeight;
            this.addChild(this.bg);
            this.logoImg = new egret.Bitmap();
            this.logoImg.texture = RES.getRes("logo");
            this.logoImg.x = (Director.curWidth() - this.logoImg.width) / 2;
            this.logoImg.y = Director.curHeight() / 5 - this.logoImg.height / 2;
            this.addChild(this.logoImg);
            //玩家控制的小球
            this.player = new duet.Player();
            this.player.createPanel(Director.curWidth() / 2, Director.curHeight() / 2);
            this.addChild(this.player);
            this.player.setTouchable(false);
            this.player.setRotatable(true);
            //开始按钮
            this.btnStart = duet.createBitmapByName("btnStart"); //开始按钮
            this.btnStart.x = (Director.curWidth() - this.btnStart.width) / 2; //居中定位
            this.btnStart.y = (Director.curHeight() - this.btnStart.height) / 2; //居中定位
            this.btnStart.touchEnabled = true; //开启触碰
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this); //点击按钮开始游戏
            this.addChild(this.btnStart);
            //排行榜按钮
            this.btnRank = duet.createBitmapByName("top");
            this.btnRank.anchorX = 1;
            this.btnRank.anchorY = 1;
            this.btnRank.x = egret.MainContext.instance.stage.stageWidth - 10;
            this.btnRank.y = egret.MainContext.instance.stage.stageHeight - 10;
            this.btnRank.touchEnabled = true;
            this.btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRank, this); //点击按钮开始游戏
            this.addChild(this.btnRank);
        };
        /**游戏开始*/
        StartPanel.prototype.gameStart = function () {
            console.log("gameStart");
            RES.getRes("s_wing").play();
            Director.gameScene().panelManager.openGamePanel();
            GlobalEvent.getInstance().dispatchEventWith(GlobalEvent.GAME_START);
        };
        //显示排行榜
        StartPanel.prototype.showRank = function () {
            console.log("showRank");
            RankingPanel.show();
            //请求排行榜数据
            DataManager.GetInstance().RequestRankingData();
        };
        return StartPanel;
    })(BasePanel);
    duet.StartPanel = StartPanel;
    StartPanel.prototype.__class__ = "duet.StartPanel";
})(duet || (duet = {}));
