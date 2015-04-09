var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * 排行列表项
 */
var RankingItemRender = (function (_super) {
    __extends(RankingItemRender, _super);
    function RankingItemRender() {
        _super.call(this);
    }
    RankingItemRender.prototype.dataChanged = function () {
        this.id_value.text = this.data.nick;
        this.score_value.text = this.data.score.toString();
        this.ranking_value.text = this.data.index.toString();
        if (this.data.index <= 3) {
            this.item_bg.source = "level_" + this.data.index;
            this.medal.source = "medal_" + this.data.index;
        }
        //       this.photo.source = this.data.headerURL;
        //       this.photo.source = "http://billbao1988.github.io/space_shooter/resource/assets/p1"
        this.loadPhoto(this.data.headerURL);
    };
    /**
     * 加载头像*/
    RankingItemRender.prototype.loadPhoto = function (url) {
        RES.getResByUrl(url, this.picloadComplete, this, RES.ResourceItem.TYPE_IMAGE);
    };
    RankingItemRender.prototype.picloadComplete = function (data, url) {
        //console.log("load avatar completed: " + data.textureWidth + " x " + data.textureHeight);
        this.photo._content = data;
    };
    return RankingItemRender;
})(egret.gui.ItemRenderer);
RankingItemRender.prototype.__class__ = "RankingItemRender";
/**
 * 排行面板
 */
var RankingPanel = (function (_super) {
    __extends(RankingPanel, _super);
    function RankingPanel() {
        _super.call(this);
        this.skinName = "skins.panel.RankingPanelSkin";
        DataManager.GetInstance().addEventListener(DataManager.REFRESH_RANKING, this.refreshRanking, this);
    }
    RankingPanel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
        //绑定成功之后为对应的组件赋值
        if (instance == this.close_btn) {
            this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeBtnTouchEventHandler, this);
        }
        if (instance == this.ranking_list) {
            this.ranking_list.itemRendererFunction = function () {
                return new egret.gui.ClassFactory(RankingItemRender);
            };
        }
    };
    RankingPanel.prototype.refreshRanking = function (event) {
        var dataMgr = DataManager.GetInstance();
        /*
                this.player_id.text = dataMgr.selfNick;
                this.player_money.text = Utils.addCommaForNum(dataMgr.selfRankingMoney.toString());
                this.player_ranking.text = dataMgr.selfRanking.toString();
        */
        // 刷新排行列表
        var rankingCollection = new egret.gui.ArrayCollection(dataMgr.rankingList);
        this.ranking_list.dataProvider = rankingCollection;
        this.ranking_list.invalidateDisplayList();
    };
    RankingPanel.prototype.closeBtnTouchEventHandler = function (e) {
        DataManager.GetInstance().removeEventListener(DataManager.REFRESH_RANKING, this.refreshRanking, this);
        egret.gui.PopUpManager.removePopUp(this);
    };
    RankingPanel.show = function () {
        var ranking = new RankingPanel();
        egret.gui.PopUpManager.addPopUp(ranking, true, true);
    };
    return RankingPanel;
})(egret.gui.Panel);
RankingPanel.prototype.__class__ = "RankingPanel";
