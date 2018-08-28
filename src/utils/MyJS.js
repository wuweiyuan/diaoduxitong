//自定义扩展 给String 对象写一个"静态"方法
String.Format = function () {
    if (arguments.length == 0) { return ""; }
    if (arguments.length == 1) { return arguments[0]; }
    var reg = /{(\d+)?}/g;
    var args = arguments;
    var result = arguments[0].replace(reg, function ($0, $1) {
        return args[parseInt($1) + 1];
    });
    return result;
}

export function GetAjax(d, e) {
    var c = String.Format("{0}.ashx?{1}&random={2}", d, e, Math.random());
    var b = $.ajax({ url: c, cache: false, async: false });
    var a = b.responseText;
    return a
}

