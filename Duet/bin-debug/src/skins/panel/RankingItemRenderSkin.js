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
        var RankingItemRenderSkin = (function (_super) {
            __extends(RankingItemRenderSkin, _super);
            function RankingItemRenderSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["height", "width"], [72, 540]);
                this.elementsContent = [this.item_bg_i(), this.photo_i(), this.medal_i(), this.id_value_i(), this.score_value_i(), this.ranking_value_i()];
                this.states = [
                    new egret.gui.State("up", []),
                    new egret.gui.State("down", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            Object.defineProperty(RankingItemRenderSkin.prototype, "skinParts", {
                get: function () {
                    return RankingItemRenderSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            RankingItemRenderSkin.prototype.item_bg_i = function () {
                var t = new egret.gui.UIAsset();
                this.item_bg = t;
                this.__s(t, ["height", "source", "percentWidth"], [66, "list_item", 100]);
                return t;
            };
            RankingItemRenderSkin.prototype.medal_i = function () {
                var t = new egret.gui.UIAsset();
                this.medal = t;
                this.__s(t, ["height", "width"], [60, 60]);
                return t;
            };
            RankingItemRenderSkin.prototype.photo_i = function () {
                var t = new egret.gui.UIAsset();
                this.photo = t;
                this.__s(t, ["height", "source", "width", "x", "y"], [58, "user_photo", 58, 60, 4]);
                return t;
            };
            RankingItemRenderSkin.prototype.ranking_value_i = function () {
                var t = new egret.gui.Label();
                this.ranking_value = t;
                this.__s(t, ["bold", "italic", "size", "text", "textAlign", "textColor", "verticalAlign", "x", "y"], [true, true, 24, "1", "center", 0x365665, "middle", 26, 24]);
                return t;
            };
            RankingItemRenderSkin.prototype.score_value_i = function () {
                var t = new egret.gui.Label();
                this.score_value = t;
                this.__s(t, ["bold", "right", "size", "text", "textAlign", "textColor", "verticalAlign", "verticalCenter", "width"], [true, 20, 24, "0", "right", 0x365665, "middle", 0, 159]);
                return t;
            };
            RankingItemRenderSkin.prototype.id_value_i = function () {
                var t = new egret.gui.Label();
                this.id_value = t;
                this.__s(t, ["bold", "size", "text", "textAlign", "textColor", "verticalAlign", "verticalCenter", "x"], [true, 24, "nickname", "left", 0x365665, "middle", 0, 130]);
                return t;
            };
            RankingItemRenderSkin._skinParts = ["item_bg", "photo", "medal", "id_value", "score_value", "ranking_value"];
            return RankingItemRenderSkin;
        })(egret.gui.Skin);
        panel.RankingItemRenderSkin = RankingItemRenderSkin;
        RankingItemRenderSkin.prototype.__class__ = "skins.panel.RankingItemRenderSkin";
    })(panel = skins.panel || (skins.panel = {}));
})(skins || (skins = {}));
