var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * 全局事件
 */
var GlobalEvent = (function (_super) {
    __extends(GlobalEvent, _super);
    function GlobalEvent() {
        _super.call(this);
    }
    GlobalEvent.getInstance = function () {
        if (this._singleton == null) {
            this._singleton = new GlobalEvent();
        }
        return this._singleton;
    };
    GlobalEvent.GAME_START = "game_start";
    GlobalEvent.GAME_PAUSE = "game_pause";
    GlobalEvent.GAME_STOP = "game_stop";
    GlobalEvent.UPDATE_SCORE = "update_score";
    return GlobalEvent;
})(egret.EventDispatcher);
GlobalEvent.prototype.__class__ = "GlobalEvent";
