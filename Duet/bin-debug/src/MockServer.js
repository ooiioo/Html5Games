/**
 * Created by zhuochen on 2015/2/9.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function GetLocalOpenID() {
    if (!window.localStorage) {
        console.log("Browser don't support local storage.");
        return "BossGameTestUser";
    }
    var OpenID = window.localStorage.getItem("OpenID");
    if (OpenID) {
        console.log("OpenID = " + OpenID);
    }
    else {
        console.log("OpenID is null");
        OpenID = "Duet" + Date.now();
        window.localStorage.setItem("OpenID", OpenID);
    }
    return OpenID;
}
var MockServer = (function (_super) {
    __extends(MockServer, _super);
    function MockServer(openID, accessToken) {
        _super.call(this, openID, accessToken);
        this.addEventListener(DMPostCompleteEvent.ON_POST_COMPLETE, this.onPostComplete, this);
    }
    MockServer.prototype.onPostComplete = function (event) {
        var obj = event.target;
    };
    //授权
    MockServer.prototype.Authorize = function () {
        this.respondType = "authorize_respond";
        this.accessToken = "aaaaaaaaaaaaa";
        DMPostCompleteEvent.dispatchEvent(this, DMPostCompleteEvent.ON_POST_COMPLETE);
        return true;
    };
    //重新微信授权
    MockServer.prototype.Reauthorize = function () {
    };
    //刷新Token
    MockServer.prototype.RefreshToken = function () {
    };
    MockServer.prototype.WeiXinSdkConfig = function () {
    };
    //登录
    MockServer.prototype.Login = function () {
        this.respondType = "login_respond";
        this.player.score = 888888;
        DMPostCompleteEvent.dispatchEvent(this, DMPostCompleteEvent.ON_POST_COMPLETE);
    };
    //上传得分
    MockServer.prototype.Record = function (score) {
        this.respondType = "record_respond";
        this.player.score = score;
        DMPostCompleteEvent.dispatchEvent(this, DMPostCompleteEvent.ON_POST_COMPLETE);
    };
    //获取排行榜
    MockServer.prototype.Rank = function () {
        this.respondType = "rank_respond";
        this.rank.selfRank.nick = "Jet";
        this.rank.selfRank.score = 1000000;
        this.rank.selfRank.headerURL = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46";
        this.rank.selfRank.index = 1;
        var nickArray = ["Jet", "Bet", "Pet", "Yet", "Wet"];
        var scroeArray = [1000000, 900000, 800000, 700000, 600000];
        this.rank.rankList = [];
        for (var i = 0; i < nickArray.length; i++) {
            var rankItem = new DMRankItem();
            rankItem.nick = nickArray[i];
            rankItem.score = scroeArray[i];
            rankItem.headerURL = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46";
            rankItem.index = i + 1;
            this.rank.rankList.push(rankItem);
        }
        DMPostCompleteEvent.dispatchEvent(this, DMPostCompleteEvent.ON_POST_COMPLETE);
    };
    return MockServer;
})(DMOperation);
MockServer.prototype.__class__ = "MockServer";
