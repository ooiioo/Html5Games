/**
 * Created by shaorui on 14-6-6.
 */
var duet;
(function (duet) {
    var GameUtil = (function () {
        function GameUtil() {
        }
        /**基于矩形的碰撞检测*/
        //public static hitTest(obj1: egret.DisplayObject, obj2: egret.DisplayObject): boolean {
        //    var rect1: egret.Rectangle = obj1.getBounds();
        //    var rect2: egret.Rectangle = obj2.getBounds();
        //    rect1.x = obj1.x;
        //    rect1.y = obj1.y;
        //    rect2.x = obj2.x;
        //    rect2.y = obj2.y;
        //    return rect1.intersects(rect2);
        //}
        GameUtil.hitTest = function (obj1, point) {
            var rect1 = obj1.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            return rect1.containsPoint(point);
        };
        return GameUtil;
    })();
    duet.GameUtil = GameUtil;
    GameUtil.prototype.__class__ = "duet.GameUtil";
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    function createBitmapByName(name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    duet.createBitmapByName = createBitmapByName;
})(duet || (duet = {}));
