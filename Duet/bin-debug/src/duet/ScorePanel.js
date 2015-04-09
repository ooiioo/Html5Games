var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by alexgan on 15-3-17.
 */
var duet;
(function (duet) {
    /**
     * 成绩显示
     */
    var ScorePanel = (function (_super) {
        __extends(ScorePanel, _super);
        //public text: string;    // 文本内容
        function ScorePanel() {
            _super.call(this);
            this.skinName = "skins.panel.ScorePanelSkin";
            GlobalEvent.getInstance().addEventListener(GlobalEvent.UPDATE_SCORE, this.updateScore, this);
        }
        ScorePanel.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
            //绑定成功之后为对应的组件赋值
            if (instance == this.text_area) {
                this.text_area.text = "您的成绩是:" + GameConfig.score + "，是否再来一次？";
            }
            if (instance == this.ok_btn) {
                this.ok_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.okBtnTouchEventHandler, this);
            }
            if (instance == this.cancel_btn) {
                this.cancel_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancelBtnTouchEventHandler, this);
            }
        };
        ScorePanel.prototype.updateScore = function () {
            this.text_area.text = "您的成绩是:" + GameConfig.score + "，是否再来一次？";
        };
        ScorePanel.prototype.okBtnTouchEventHandler = function (e) {
            egret.gui.PopUpManager.removePopUp(this);
            Director.gameScene().panelManager.openGamePanel();
            GlobalEvent.getInstance().dispatchEventWith(GlobalEvent.GAME_START);
        };
        ScorePanel.prototype.cancelBtnTouchEventHandler = function (e) {
            egret.gui.PopUpManager.removePopUp(this);
            Director.gameScene().panelManager.openStartPanel();
        };
        return ScorePanel;
    })(egret.gui.Panel);
    duet.ScorePanel = ScorePanel;
    ScorePanel.prototype.__class__ = "duet.ScorePanel";
})(duet || (duet = {}));
