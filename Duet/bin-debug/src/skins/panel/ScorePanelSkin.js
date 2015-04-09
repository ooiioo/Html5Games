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
        var ScorePanelSkin = (function (_super) {
            __extends(ScorePanelSkin, _super);
            function ScorePanelSkin() {
                _super.call(this);
                this.__s = egret.gui.setProperties;
                this.__s(this, ["height", "width"], [300, 480]);
                this.elementsContent = [this.__3_i(), this.ok_btn_i(), this.cancel_btn_i(), this.text_area_i()];
                this.states = [
                    new egret.gui.State("normal", []),
                    new egret.gui.State("disabled", [])
                ];
            }
            Object.defineProperty(ScorePanelSkin.prototype, "skinParts", {
                get: function () {
                    return ScorePanelSkin._skinParts;
                },
                enumerable: true,
                configurable: true
            });
            ScorePanelSkin.prototype.cancel_btn_i = function () {
                var t = new egret.gui.Button();
                this.cancel_btn = t;
                t.setStyle("textColor", 0x000000);
                this.__s(t, ["height", "label", "skinName", "width", "x", "y"], [50, "取消", skins.simple.ButtonSkin, 150, 277, 200]);
                return t;
            };
            ScorePanelSkin.prototype.ok_btn_i = function () {
                var t = new egret.gui.Button();
                this.ok_btn = t;
                t.setStyle("textColor", 0x000000);
                this.__s(t, ["height", "label", "skinName", "width", "x", "y"], [50, "确定", skins.simple.ButtonSkin, 150, 48, 200]);
                return t;
            };
            ScorePanelSkin.prototype.__3_i = function () {
                var t = new egret.gui.UIAsset();
                this.__s(t, ["height", "horizontalCenter", "source", "verticalCenter", "width"], [300, 0, "alertBg", 0, 480]);
                return t;
            };
            ScorePanelSkin.prototype.text_area_i = function () {
                var t = new egret.gui.Label();
                this.text_area = t;
                this.__s(t, ["height", "size", "text", "textColor", "width", "x", "y"], [120, 20, "文本内容", 0x000000, 400, 40, 50]);
                return t;
            };
            ScorePanelSkin._skinParts = ["ok_btn", "cancel_btn", "text_area"];
            return ScorePanelSkin;
        })(egret.gui.Skin);
        panel.ScorePanelSkin = ScorePanelSkin;
        ScorePanelSkin.prototype.__class__ = "skins.panel.ScorePanelSkin";
    })(panel = skins.panel || (skins.panel = {}));
})(skins || (skins = {}));
