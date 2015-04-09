/**
 * Created by zhuochen on 2015/2/6.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SERVER_CGI = "/cgi-bin/duet/";
var CGI_ERR_SUCCESS = 0;
var CGI_ERR_COMMON = -2000;
var CGI_ERR_NODATA = -2001;
var CGI_ERR_GAMEOVER = -2002; //游戏结束
var CGI_ERR_PARAM = -2003; //请求参数错误
var CGI_ERR_WEIXIN = -2004; //调用微信接口错误
var CGI_ERR_WXLOGIN = -2005; //微信登录验证失败
var CLT_ERR_NETWORK = -3000;
var WeiXinShareTitle = "Duet";
var WeiXinShareLink = "";
var WeiXinShareImage = "";
var WeiXinShareDesc = "ToDo: Duet Description！";
var WeiXinConfigReady = false;
var WeiXinRefreshExpires = 7 * 24 * 60 * 60;
function SetCookie(name, value, expires, path) {
    var exp = new Date();
    exp.setTime(exp.getTime() + expires * 1000);
    if (path.length > 0)
        document.cookie = name + "=" + value + ";expires=" + exp.toUTCString() + ";path=" + path;
    else
        document.cookie = name + "=" + value + ";expires=" + exp.toUTCString();
}
function GetCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return arr[2];
    else
        return null;
}
function DelCookie(name, path) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    if (cval != null) {
        if (path.length > 0)
            document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString() + ";path=" + path;
        else
            document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
    }
}
var DMPlayer = (function () {
    function DMPlayer(theName) {
        this.name = theName;
        this.score = 0;
    }
    return DMPlayer;
})();
DMPlayer.prototype.__class__ = "DMPlayer";
var DMError = (function () {
    function DMError() {
        this.code = 0;
        this.message = "";
        this.timestamp = 0;
    }
    return DMError;
})();
DMError.prototype.__class__ = "DMError";
var DMRankItem = (function () {
    function DMRankItem() {
        this.nick = "";
        this.score = 0;
        this.headerURL = "";
        this.index = 0;
    }
    return DMRankItem;
})();
DMRankItem.prototype.__class__ = "DMRankItem";
var DMRank = (function () {
    function DMRank() {
        this.selfRank = new DMRankItem();
        this.rankList = [];
    }
    return DMRank;
})();
DMRank.prototype.__class__ = "DMRank";
var DMPostCompleteEvent = (function (_super) {
    __extends(DMPostCompleteEvent, _super);
    function DMPostCompleteEvent() {
        _super.apply(this, arguments);
    }
    DMPostCompleteEvent.ON_POST_COMPLETE = "OnPostComplete";
    return DMPostCompleteEvent;
})(egret.Event);
DMPostCompleteEvent.prototype.__class__ = "DMPostCompleteEvent";
var DMStatusChange = (function (_super) {
    __extends(DMStatusChange, _super);
    function DMStatusChange() {
        _super.apply(this, arguments);
    }
    DMStatusChange.ON_STATUS_CHANGE = "OnStatusChange";
    return DMStatusChange;
})(egret.Event);
DMStatusChange.prototype.__class__ = "DMStatusChange";
var DMErrorEvent = (function (_super) {
    __extends(DMErrorEvent, _super);
    function DMErrorEvent() {
        _super.apply(this, arguments);
    }
    DMErrorEvent.ON_ERROR = "OnPostError";
    return DMErrorEvent;
})(egret.Event);
DMErrorEvent.prototype.__class__ = "DMErrorEvent";
var DMOperation = (function (_super) {
    __extends(DMOperation, _super);
    function DMOperation(openID, accessToken) {
        _super.call(this);
        this.openID = openID;
        this.accessToken = accessToken;
        this.refreshToken = "";
        this.subCommond = "";
        this.commandVar = "";
        this.player = new DMPlayer("DuetPlayer");
        this.error = new DMError();
        this.rank = new DMRank();
    }
    //授权
    DMOperation.prototype.Authorize = function () {
        return false;
    };
    //重新微信授权
    DMOperation.prototype.Reauthorize = function () {
    };
    //刷新Token
    DMOperation.prototype.RefreshToken = function () {
    };
    DMOperation.prototype.WeiXinSdkConfig = function () {
    };
    //登录
    DMOperation.prototype.Login = function () {
    };
    //上传得分
    DMOperation.prototype.Record = function (score) {
    };
    //获取排行榜
    DMOperation.prototype.Rank = function () {
    };
    DMOperation.prototype.onPostComplete = function (event) {
    };
    DMOperation.prototype.onStatus = function (event) {
    };
    DMOperation.prototype.onIOErrorEvent = function (event) {
    };
    return DMOperation;
})(egret.EventDispatcher);
DMOperation.prototype.__class__ = "DMOperation";
var DMNetOperation = (function (_super) {
    __extends(DMNetOperation, _super);
    function DMNetOperation(userName, accessToken) {
        _super.call(this, userName, accessToken);
        this.loader = new egret.URLLoader();
        this.loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        this.loader.addEventListener(egret.HTTPStatusEvent.HTTP_STATUS, this.onStatus, this);
        this.loader.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
        this.loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOErrorEvent, this);
        this.UpdateTokenFromLocalStorage();
    }
    DMNetOperation.prototype.UpdateTokenFromLocalStorage = function () {
        this.openID = GetCookie("openID");
        this.accessToken = GetCookie("accessToken");
        this.refreshToken = GetCookie("refreshToken");
    };
    DMNetOperation.prototype.onIOErrorEvent = function (event) {
        this.respondType = "net_error";
        this.error.code = CLT_ERR_NETWORK;
        this.error.message = "net error";
        this.error.timestamp = Date.now();
        DMErrorEvent.dispatchEvent(this, DMErrorEvent.ON_ERROR);
    };
    DMNetOperation.prototype.onPostComplete = function (event) {
        var loaderResp = event.target;
        var data = loaderResp.data;
        console.log("PostComplete:" + data);
        var jsonObj = JSON.parse(data);
        //console.log(data);
        this.respondType = jsonObj.respond;
        this.error.code = jsonObj.result.code;
        this.error.message = jsonObj.result.msg;
        this.error.timestamp = jsonObj.result.now;
        if (jsonObj.result.code != 0 && jsonObj.result.code != CGI_ERR_GAMEOVER) {
            console.log("Server Error(" + jsonObj.result.code + "):" + jsonObj.result.msg);
            DMErrorEvent.dispatchEvent(this, DMErrorEvent.ON_ERROR);
            return;
        }
        switch (this.respondType) {
            case "authorize_respond":
                this.UpdateTokenData(jsonObj);
                break;
            case "refresh_token_respond":
                this.UpdateTokenData(jsonObj);
                this.HandleSubCommand();
                break;
            case "weixin_config_respond":
                this.UpdateWeiXinConfig(jsonObj);
                break;
            case "login_respond":
                this.UpdateLoginData(jsonObj);
                break;
            case "record_respond":
                this.UpdateRecordData(jsonObj);
                break;
            case "rank_respond":
                this.UpdateRankData(jsonObj);
                break;
        }
        DMPostCompleteEvent.dispatchEvent(this, DMPostCompleteEvent.ON_POST_COMPLETE);
    };
    DMNetOperation.prototype.UpdateTokenData = function (data) {
        SetCookie("openID", data.openID, WeiXinRefreshExpires, "/");
        SetCookie("accessToken", data.accessToken, data.expires, "/");
        SetCookie("refreshToken", data.refreshToken, WeiXinRefreshExpires, "/");
        this.UpdateTokenFromLocalStorage();
        //alert(JSON.stringify(data));
    };
    DMNetOperation.prototype.WeiXinShareDescription = function () {
        return "To Do: Duet Share Description!";
    };
    DMNetOperation.prototype.WeiXinAppShareUpdate = function () {
        if (!WeiXinConfigReady)
            return false;
        WeiXinShareDesc = this.WeiXinShareDescription();
        wx.onMenuShareAppMessage({
            title: WeiXinShareTitle,
            desc: WeiXinShareDesc,
            link: WeiXinShareLink,
            imgUrl: WeiXinShareImage,
            type: '',
            dataUrl: '',
            success: function () {
                // 用户确认分享后执行的回调函数
                if (weixin_checker.debug)
                    alert("onMenuShareAppMessage");
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        return true;
    };
    DMNetOperation.prototype.UpdateWeiXinConfig = function (data) {
        wx.config({
            debug: weixin_checker.debug,
            appId: data.appId,
            timestamp: data.timeStamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "hideMenuItems"]
        });
        wx.ready(function () {
            WeiXinConfigReady = true;
            console.log("wx.ready");
            if (weixin_checker.debug)
                alert("wx.ready");
            var urlPath = window.location.href;
            var pos = urlPath.indexOf("index.html");
            WeiXinShareLink = urlPath.substring(0, pos) + "login.html";
            WeiXinShareImage = urlPath.substring(0, pos) + "resource/assets/share_icon.png";
            wx.onMenuShareTimeline({
                title: WeiXinShareTitle,
                link: WeiXinShareLink,
                imgUrl: WeiXinShareImage,
                success: function () {
                    // 用户确认分享后执行的回调函数
                    if (weixin_checker.debug)
                        alert("onMenuShareTimeline");
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: WeiXinShareTitle,
                desc: WeiXinShareDesc,
                link: WeiXinShareLink,
                imgUrl: WeiXinShareImage,
                type: '',
                dataUrl: '',
                success: function () {
                    // 用户确认分享后执行的回调函数
                    if (weixin_checker.debug)
                        alert("onMenuShareAppMessage");
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.hideMenuItems({
                // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                menuList: ["menuItem:share:qq", "menuItem:share:QZone"],
                success: function (res) {
                    if (weixin_checker.debug)
                        alert('wx.hideMenuItems');
                },
                fail: function (res) {
                    if (weixin_checker.debug)
                        alert("wx.hideMenuItems" + JSON.stringify(res));
                }
            });
        });
        wx.error(function (res) {
            WeiXinConfigReady = false;
            if (weixin_checker.debug)
                alert("wx.error" + JSON.stringify(res));
        });
    };
    DMNetOperation.prototype.UpdateLoginData = function (data) {
        this.player.name = data.playerName;
        this.player.score = data.score;
        if (!this.WeiXinAppShareUpdate()) {
            WeiXinShareDesc = this.WeiXinShareDescription();
            this.WeiXinSdkConfig();
        }
    };
    DMNetOperation.prototype.UpdateRecordData = function (data) {
        this.player.score = data.score;
        this.WeiXinAppShareUpdate();
    };
    DMNetOperation.prototype.UpdateRankData = function (data) {
        if (data.selfIndex > 0 && data.selfRank != null) {
            this.rank.selfRank.nick = data.selfRank.nick;
            this.rank.selfRank.score = data.selfRank.score;
            this.rank.selfRank.headerURL = data.selfRank.headerURL;
            this.rank.selfRank.index = data.selfIndex;
        }
        if (data.rankList != null) {
            this.rank.rankList = [];
            for (var i = 0; i < data.rankList.length; i++) {
                var rankItem = new DMRankItem();
                rankItem.nick = data.rankList[i].nick;
                rankItem.score = data.rankList[i].score;
                rankItem.headerURL = data.rankList[i].headerURL;
                rankItem.index = i + 1;
                this.rank.rankList.push(rankItem);
            }
        }
        this.WeiXinAppShareUpdate();
    };
    DMNetOperation.prototype.CheckAccessToken = function (subCmd, cmdVar) {
        if (GetCookie("accessToken") == null) {
            //Token已过期，刷新Token
            this.RefreshToken();
            this.subCommond = subCmd;
            this.commandVar = cmdVar;
            return false;
        }
        return true;
    };
    DMNetOperation.prototype.HandleSubCommand = function () {
        if (this.subCommond.length > 0) {
            if (this.subCommond == "authorize") {
                //从本地取Token
                this.respondType = "authorize_respond";
                return;
            }
            var url = SERVER_CGI + this.subCommond;
            var request = new egret.URLRequest(url);
            request.method = egret.URLRequestMethod.POST;
            if (this.commandVar.length > 0)
                request.data = new egret.URLVariables(this.commandVar);
            this.loader.load(request);
        }
    };
    DMNetOperation.prototype.Authorize = function () {
        if (weixin_checker.type == "code") {
            var url = SERVER_CGI + "authorize";
            var request = new egret.URLRequest(url);
            request.method = egret.URLRequestMethod.POST;
            request.data = new egret.URLVariables("code=" + weixin_checker.code);
            this.loader.load(request);
        }
        else {
            if (this.CheckAccessToken("authorize", "")) {
                //从本地取Token
                this.respondType = "authorize_respond";
                DMPostCompleteEvent.dispatchEvent(this, DMPostCompleteEvent.ON_POST_COMPLETE);
            }
        }
        return true;
    };
    DMNetOperation.prototype.Reauthorize = function () {
        DelCookie("openID", "/");
        DelCookie("accessToken", "/");
        DelCookie("refreshToken", "/");
        var urlPath = window.location.href;
        var pos = urlPath.indexOf("index.html");
        urlPath = urlPath.substr(0, pos) + "index.html";
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx49ce3f064b234e21&redirect_uri=" + encodeURIComponent(urlPath + "?timestamp=" + Date.now()) + "&response_type=code&scope=snsapi_userinfo&state=78903#wechat_redirect";
    };
    DMNetOperation.prototype.RefreshToken = function () {
        var url = SERVER_CGI + "refresh_token";
        var request = new egret.URLRequest(url);
        request.method = egret.URLRequestMethod.POST;
        request.data = new egret.URLVariables("refreshToken=" + this.refreshToken);
        this.loader.load(request);
    };
    DMNetOperation.prototype.WeiXinSdkConfig = function () {
        var cmdVar = "url=" + encodeURIComponent(window.location.href);
        if (this.CheckAccessToken("weixin_config", cmdVar)) {
            var url = SERVER_CGI + "weixin_config";
            var request = new egret.URLRequest(url);
            request.method = egret.URLRequestMethod.POST;
            request.data = new egret.URLVariables(cmdVar);
            this.loader.load(request);
        }
    };
    DMNetOperation.prototype.Login = function () {
        if (this.CheckAccessToken("login", "")) {
            var url = SERVER_CGI + "login";
            var request = new egret.URLRequest(url);
            request.method = egret.URLRequestMethod.POST;
            this.loader.load(request);
        }
    };
    DMNetOperation.prototype.Record = function (score) {
        var cmdVar = "score=" + score;
        if (this.CheckAccessToken("record", "")) {
            var url = SERVER_CGI + "record";
            var request = new egret.URLRequest(url);
            request.method = egret.URLRequestMethod.POST;
            request.data = new egret.URLVariables(cmdVar);
            this.loader.load(request);
        }
    };
    DMNetOperation.prototype.Rank = function () {
        if (this.CheckAccessToken("rank", "")) {
            var url = SERVER_CGI + "rank";
            var request = new egret.URLRequest(url);
            request.method = egret.URLRequestMethod.POST;
            this.loader.load(request);
        }
    };
    return DMNetOperation;
})(DMOperation);
DMNetOperation.prototype.__class__ = "DMNetOperation";
