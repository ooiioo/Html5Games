var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var skins;
(function (skins) {
    var panel;
    (function (panel) {
        var RankingPanelSkin = (function (_super) {
            __extends(RankingPanelSkin, _super);
            function RankingPanelSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["height", "width"], [960, 640]);
                this.elementsContent = [this.__3_i(), this.__4_i(), this.close_btn_i(), this.__5_i(), this.ranking_list_i()];
                this.states = [
                    new egret.gui.State("normal", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            Object.defineProperty(RankingPanelSkin.prototype, "skinParts", {
                get: function () {
                    return RankingPanelSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            RankingPanelSkin.prototype.__4_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["horizontalCenter", "source", "y"], [-40, "rank", 178]);
                return t;
            };
            RankingPanelSkin.prototype.__5_i = function () {
                var t = new egret.gui.Label();
                this.__s(t, ["bold", "horizontalCenter", "size", "text", "textColor", "y"], [true, 30.5, 26, "排行榜", 0x365665, 184]);
                return t;
            };
            RankingPanelSkin.prototype.close_btn_i = function () {
                var t = new egret.gui.Button();
                this.close_btn = t;
                this.__s(t, ["skinName", "x", "y"], [new egret.gui.ButtonSkin("close_dialog", "close_dialog"), 546, 176]);
                return t;
            };
            RankingPanelSkin.prototype.ranking_list_i = function () {
                var t = new egret.gui.List();
                this.ranking_list = t;
                this.__s(t, ["height", "horizontalCenter", "itemRendererSkinName", "skinName", "verticalCenter", "width"], [540, 1, skins.panel.RankingItemRenderSkin, skins.simple.ListSkin, 17, 540]);
                return t;
            };
            RankingPanelSkin.prototype.__3_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["height", "horizontalCenter", "scale9Grid", "source", "verticalCenter", "width"], [710, 0, egret.gui.getScale9Grid("10,95,540,44"), "ranking_bg", 0, 560]);
                return t;
            };
            RankingPanelSkin._skinParts = ["close_btn", "ranking_list"];
            return RankingPanelSkin;
        })(egret.gui.Skin);
        panel.RankingPanelSkin = RankingPanelSkin;
        RankingPanelSkin.prototype.__class__ = "skins.panel.RankingPanelSkin";
    })(panel = skins.panel || (skins.panel = {}));
})(skins || (skins = {}));
