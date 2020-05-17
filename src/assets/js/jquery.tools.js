(function ($) {
    /*
    TODO:获取文本长度
    */
    $.getTextLength = function (str) {
        return str.replace(/[^\x00-\xff]/g, "xx").length;
    }
     /*
    TODO:获取文本长度
    */
   $.getGuid = function () {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /*
    TODO:cookie操作
    */
    $.cookie = {
        set: function (name, value) {
            var argv = arguments, argc = arguments.length, expires = (argc > 2) ? argv[2] : null, path = (argc > 3) ? argv[3] : '/', domain = (argc > 4) ? argv[4] : null, secure = (argc > 5) ? argv[5] : false;
            document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
        },
        get: function (name) {
            var arg = name + "=", alen = arg.length, clen = document.cookie.length, i = 0, j = 0;
            while (i < clen) {
                j = i + alen;
                if (document.cookie.substring(i, j) == arg) {
                    var endstr = document.cookie.indexOf(";", j);
                    if (endstr == -1) {
                        endstr = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(j, endstr));
                }
                i = document.cookie.indexOf(" ", i) + 1;
                if (i == 0)
                    break;
            }
            return null;
        },
        remove: function (name) {
            if ($.cookie.get(name)) {
                var expdate = new Date();
                expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
                $.cookie.set(name, null, expdate);
            }
        }
    }
    /*
    TODO:获取url参数
    */
    $.queryString = new function () {
        var queryObject = function () {
            var self = this;
            self.keys = {};
            $.each(arguments, function () {
                var q = "" + this;
                q = q.replace(/^[?#]/, '');
                q = q.replace(/[;&]$/, '');
                $.each(q.split(/[&;]/), function () {
                    var key = decodeURIComponent(this.split('=')[0] || "");
                    var val = decodeURIComponent(this.split('=')[1] || "");
                    if (!key) return;
                    self.set(key, val);
                });
            });
        };
        queryObject.prototype = {
            get: function (key) {
                return this.keys[key];
            },
            set: function (key, val) {
                this.keys[key] = val;
            }
        };
        return new queryObject(location.search);
    }
    /*
    TODO:文本框输入控制
    @param  elementName 显示文本字数元素
    @param maxSize 文本最大输入字数
    */
    $.fn.limit = function (maxSize, elementName) {
        var opts = { elementName: elementName, maxSize: (maxSize || 20) };
        var textChange = function (obj) {
            var text = $(obj).val();
            var count = $.getTextLength(text);
            if (count > opts.maxSize) {
                for (var i = 0; i < text.length; i++) {
                    if ($.getTextLength(text.substr(0, i)) >= opts.maxSize) {
                        $(obj).val(text.substr(0, i));
                        display(count);
                        break;
                    }
                }
            } else {
                display(count);
            }
        };
        var display = function (count) {
            if (opts.elementName != "") {
                var lave = opts.maxSize - count;
                if (lave < 0) { lave = 0; }
                $(opts.elementName).text(lave);
            }
        };
        $(this).keyup(function () {
            textChange(this);
        });
        textChange(this);
    }
    /*
    TODO:选取颜色
    @param colorList 颜色值 不建议修改
    @param fn(颜色值) 自定义函数 返回当前选择颜色值
    */
    $.fn.selectColor = function (fn) {
        var defaults = {
            colorList: ["bgnone", "c00000", "f79646", "9bbb59", "4bacc6", "00b0f0", "8064a2", "c0504d", "cccccc", "ea9999", "f9cb9c", "b6d7a8", "a2c4c9", "9fc5e8", "b4a7d6", "d5a6bd", "999999", "e06666", "f6b26b", "93c47d", "76a5af", "6fa8dc", "8e7cc3", "d5a6bd", "666666", "cc0000", "e69138", "6aa84f", "45818e", "3d85c6", "674ea7", "a64d79", "444444", "990000", "b45f06", "38761d", "134f5c", "0b5394", "351c75", "741b47", "000000", "660000", "783f04", "274e13", "0c343d", "073763", "20124d", "4c1130", "8ca226", "ff0000", "ffc000", "339900", "00a4c7", "0000ff", "9900ff", "ff00ff"]
        };
        var opts = $.extend({}, defaults, { fn: fn });
        var bgColor = "";
        var colorHtml = '<div id="colorPanel" style="background-color: #FFFFFF; border: 1px solid #6AC334; display: none; left: 0;overflow: hidden; padding: 5px;  position: absolute; width: 160px;"><div style="margin-bottom: 6px;height: 20px;">';
        var j = 1;
        for (i = 0; i < opts.colorList.length; i++) {
            if (opts.colorList[i] == "bgnone") {
                colorHtml += '<a href="javascript:;" style="border: 1px solid #FFFFFF; display: block;  float: left; height: 18px; width: 18px;"  bgcolor=""></a>';
            } else {
                colorHtml += '<a href="javascript:;" style="background-color:#' + opts.colorList[i] + ';border: 1px solid #FFFFFF; display: block;  float: left; height: 18px; width: 18px;" bgcolor="#' + opts.colorList[i] + '"></a>';
            }
            if ((i + 1) % 8 == 0 && (i + 1) < opts.colorList.length) {
                colorHtml += '</div><div style="height: 20px;';
                if (j == 5) {
                    colorHtml += "margin-bottom: 6px;";
                }
                colorHtml += '">';
                j++;
            }
        }
        colorHtml += "</div></div>";
        $("body").append(colorHtml);
        var colorPanel = $("#colorPanel");
        var obj = $(this);
        var offset = obj.offset();
        colorPanel.css({ top: (offset.top < 150) ? offset.top : offset.top - 150, left: offset.left });
        var colorPiece = colorPanel.find("a");
        obj.click(function () {
            if (colorPanel.is(":visible") == false) {
                colorPanel.show();
                $('body').one('click', function () {
                    colorPanel.hide();
                });
                return false;
            }
        });
        colorPiece.click(function () {
            bgColor = $(this).attr("bgcolor");
            colorPanel.hide();
            if ($.isFunction(opts.fn)) {
                opts.fn(bgColor);
            }
            return false;
        });
    }
    /*
    TODO:json数据分页
    @param pageSize 分页大小
    @param currentPage 当前页码
    @param fn(结果集) 回调函数 
    @param isShow 是否始终显示分页 
    @param url 请求的地址
    @param type 请求类型(POST,GET)
    */
    $.fn.page = function (options) {
        $.fn.page.defaults = { pageSize: 8, currentPage: 1, fn: null, isShow: false, url: null, type: "POST" };
        var loadPage = function (obj, options, result) {
            var pageCount = Math.ceil((result.total / options.pageSize)), currentPage = (parseInt(options.currentPage) > pageCount || parseInt(options.currentPage) < 1) ? 1 : parseInt(options.currentPage);
            if (options.isShow || result.total > 1) {
                var page = [];
                if (currentPage == 1) {
                    page.push("<a>首页</a>");
                    page.push("<a>上一页</a>");
                } else {
                    page.push("<a href='javascript:;'   page=\"1\">首页</a>");
                    page.push("<a href='javascript:;'   page=\"" + (parseInt(currentPage) - 1) + "\">上一页</a>");
                }
                for (var i = (currentPage > pageCount ? 1 : (currentPage > 5 ? pageCount >= 9 ? ((currentPage + 4) > pageCount ? (pageCount - 8) : (currentPage - 4)) : 1 : 1)); i <= (pageCount >= 9 ? ((currentPage > 5 ? ((currentPage + 4) > pageCount ? pageCount : (currentPage + 4)) : 9)) : pageCount); i++) {
                    if (i == currentPage) {
                        page.push("<a class=\"now\" href='javascript:;' >" + i + "</a>");
                    } else {
                        page.push("<a href='javascript:;'  page=\"" + i + "\">" + i + "</a>");
                    }
                }
                if (currentPage == pageCount) {
                    page.push("<a>下一页</a>");
                    page.push("<a>尾页</a>");
                } else {
                    page.push("<a  href='javascript:;'  page=\"" + (currentPage + 1) + "\">下一页</a>");
                    page.push("<a  href='javascript:;' page=\"" + (pageCount) + "\">尾页</a>");
                }
                $(obj).html(page.join(" "));
                addEvent(obj, options);
            }
            if ($.isFunction(options.fn))
                options.fn(result.rows);
        };
        var addEvent = function (obj, options) {
            $(obj).find("a").click(function () {
                var page = $(this).attr("page");
                if (typeof page != "undefined") {
                    var opts = $.extend({}, options, { currentPage: page });
                    loadData(obj, opts);
                }
            });
        };
        var loadData = function (obj, options) {
            var opts = $.extend({}, $.fn.page.defaults, options);
            $.ajax({
                type: opts.type,
                url: opts.url,
                data: { page: opts.currentPage, rows: opts.pageSize },
                dataType: "json",
                success: function (result) {
                    loadPage(obj, opts, result);
                }
            });
        };
        loadData(this, options);
    }

    /*
    TODO:调整图片大小
    @param maxWidth
    @param maxHeight
    */
    $.fn.resizeImage = function (maxWidth, maxHeight) {
        var obj = $(this), maxWidth = maxWidth || obj.attr("width"), maxHeight = maxHeight || obj.attr("height"), img = new Image();
        img.src = obj.attr("src");
        img.onload = function () {
            var w = img.width, h = img.height, hRatio = maxWidth / w, wRatio = maxHeight / h, Ratio = 1;
            if (maxWidth == 0) {
                if (hRatio < 1) Ratio = hRatio;
            } else if (maxHeight == 0) {
                if (wRatio < 1) Ratio = wRatio;
            } else if (wRatio < 1 || hRatio < 1) {
                Ratio = (wRatio <= hRatio ? wRatio : hRatio);
            }
            if (Ratio < 1) {
                w = w * Ratio;
                h = h * Ratio;
            }
            obj.attr("width", w).attr("height", h);
        }
    }
})(jQuery);