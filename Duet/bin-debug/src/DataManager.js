var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//游戏数据管理器
var DataManager = (function (_super) {
    __extends(DataManager, _super);
    function DataManager() {
        _super.call(this);
        this._rank = new DMRank();
        this.Init();
    }
    DataManager.GetInstance = function () {
        if (this._dataManager == null) {
            this._dataManager = new DataManager();
        }
        return this._dataManager;
    };
    //初始化
    DataManager.prototype.Init = function () {
        //this._operation = new DMNetOperation(GetLocalOpenID(), "123");
        this._operation = new MockServer(GetLocalOpenID(), "123");
        this._operation.addEventListener(DMPostCompleteEvent.ON_POST_COMPLETE, this.onPostComplete, this);
        this._operation.addEventListener(DMErrorEvent.ON_ERROR, this.onPostError, this);
    };
    DataManager.prototype.onPostComplete = function (event) {
        console.log("getted ON_POST_COMPLETE event");
        var obj = event.target;
        switch (obj.respondType) {
            case "authorize_respond":
                {
                    console.log("authorize_respond");
                    this.Login();
                }
                break;
            case "refresh_token_respond":
                {
                    console.log("refresh_token_respond");
                }
                break;
            case "login_respond":
                {
                    console.log("login_respond");
                }
                break;
            case "rank_respond":
                {
                    console.log("rank_respond");
                }
                break;
        }
    };
    DataManager.prototype.onPostError = function (event) {
        console.log("getted ON_POST_ERROR event");
        var obj = event.target;
        switch (obj.respondType) {
            case "authorize_respond":
                {
                    //授权失败，需要重新授权
                    console.log("authorize_respond error");
                }
                break;
            case "refresh_token_respond":
                {
                    //验证过期，需要重新授权
                    console.log("refresh_token_respond error");
                }
                break;
            case "login_respond":
                {
                    //登录失败
                    console.log("login_respond error");
                }
                break;
            case "net_error":
                {
                    //网络错误
                    console.log("net_error error");
                }
                break;
            default: {
            }
        }
    };
    Object.defineProperty(DataManager.prototype, "selfNick", {
        //排行数据
        //获取玩家的昵称
        get: function () {
            return this._rank.selfRank.nick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataManager.prototype, "selfRankingScore", {
        //获取玩家的排行分数
        get: function () {
            return this._rank.selfRank.score;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataManager.prototype, "selfRanking", {
        //获取玩家的排行名次
        get: function () {
            return this._rank.selfRank.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataManager.prototype, "selfPhotoUrl", {
        //获取玩家的头像url
        get: function () {
            return this._rank.selfRank.headerURL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataManager.prototype, "rankingList", {
        //获取排行列表
        get: function () {
            return this._rank.rankList;
        },
        enumerable: true,
        configurable: true
    });
    //授权接口
    DataManager.prototype.Authorize = function () {
        this._operation.Authorize();
    };
    //登录接口
    DataManager.prototype.Login = function () {
        this._operation.Login();
    };
    //玩家操作接口
    //请求排行榜数据
    DataManager.prototype.RequestRankingData = function () {
        this._rank.selfRank.nick = "Jet";
        this._rank.selfRank.score = 100;
        this._rank.selfRank.headerURL = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46";
        this._rank.selfRank.index = 1;
        var nickArray = ["Jet", "Bet", "Pet", "Yet", "Wet"];
        var scoreArray = [100, 90, 80, 70, 60];
        this._rank.rankList = [];
        for (var i = 0; i < nickArray.length; i++) {
            var rankItem = new DMRankItem();
            rankItem.nick = nickArray[i];
            rankItem.score = scoreArray[i];
            rankItem.headerURL = "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46";
            rankItem.index = i + 1;
            this._rank.rankList.push(rankItem);
        }
        var evt = new egret.Event(DataManager.REFRESH_RANKING);
        this.dispatchEvent(evt);
    };
    //事件
    DataManager.REFRESH_DATA = "refresh_data";
    DataManager.REFRESH_RANKING = "refresh_ranking";
    return DataManager;
})(egret.EventDispatcher);
DataManager.prototype.__class__ = "DataManager";
