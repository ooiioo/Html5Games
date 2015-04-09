/**
  * 面板管理类
  * by alexgan
  * (c) copyright false,0,0,2014 - 2035
  * All Rights Reserved.
  * 面板的管理类
  */
var PanelManager = (function () {
    function PanelManager() {
        //当前面板
        this.curPanel = null;
    }
    // 初始化所有面板
    PanelManager.prototype.initPanel = function () {
    };
    PanelManager.prototype.switchPanel = function (panelName) {
        var thisPanel;
        if (this.curPanel != null) {
            Director.gameScene().uiLayer.removeChild(this.curPanel);
        }
        // 开始界面
        if (panelName === "StartPanel") {
            if (this.startPanel == null) {
                this.startPanel = new duet.StartPanel();
            }
            Director.gameScene().uiLayer.addChild(this.startPanel);
            thisPanel = this.startPanel;
        }
        else if (panelName === "GamePanel") {
            if (this.gamePanel == null) {
                this.gamePanel = new duet.GameContainer();
            }
            Director.gameScene().uiLayer.addChild(this.gamePanel);
            thisPanel = this.gamePanel;
        }
        else if (panelName === "OverPanel") {
            if (this.gameOverPanel == null) {
                this.gameOverPanel = new duet.ScorePanel();
            }
            Director.gameScene().uiLayer.addChild(this.gameOverPanel);
            thisPanel = this.gameOverPanel;
        }
        this.curPanel = thisPanel;
    };
    // 打开开始界面
    PanelManager.prototype.openStartPanel = function () {
        this.switchPanel("StartPanel");
    };
    // 打开游戏界面
    PanelManager.prototype.openGamePanel = function () {
        this.switchPanel("GamePanel");
    };
    // 打开结束界面
    PanelManager.prototype.openOverPanel = function () {
        this.switchPanel("OverPanel");
    };
    return PanelManager;
})();
PanelManager.prototype.__class__ = "PanelManager";
