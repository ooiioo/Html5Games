/**
 * Created by zhuochen on 2015/3/13.
 */
    

var weixin_checker = {};

weixin_checker.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return r[2];
    return null;
}

weixin_checker.getCode = function() {
    return weixin_checker.getUrlParam("code");
}

weixin_checker.type = "authorize";      //authorize=微信登录授权；code=手动输入code授权；local=从本地取token
weixin_checker.code = "011c9b9caffb7aa6bac72858669724dv";
weixin_checker.codeShow = false;
weixin_checker.debug = false;

weixin_checker.authorize = function () {
    var runMode = weixin_checker.getUrlParam("runMode");
    if (runMode != null && runMode == "debug")
        weixin_checker.debug = true;

    var loginType = weixin_checker.getUrlParam("loginType");
    if (loginType != null) {
        weixin_checker.type = loginType;
        if (loginType == "codeShow") {
            weixin_checker.type = "code";
            weixin_checker.codeShow = true;
        }
    }

    var WeiXinCode = weixin_checker.getCode();
    if (WeiXinCode != null) {
        weixin_checker.code = WeiXinCode;

        if (weixin_checker.type != "codeShow")
            weixin_checker.type = "code";
    }

    if (weixin_checker.codeShow)
        alert("Code="+weixin_checker.code);
}
