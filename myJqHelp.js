(function (jq) {
    Date.prototype.format = function (format) {
        var args = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter

            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var i in args) {
            var n = args[i];

            if (new RegExp("(" + i + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
        }
        return format;
    };


    var myJqHelp = {};
    myJqHelp.httpPut = function (url, data, callback) {
        jq.ajax({
            url: url,
            async: true,
            type: "put",
            //contentType: "application/json",
            //dataType: "json",
            data: data,
            //timeout: 20000,
            success: callback,
            error: function (xhr, textstatus, thrown) {

            }
        });
    };
    myJqHelp.httpRawJson = function (url, data, callback) {
        $.ajax(
            {
                url: url,
                'data': JSON.stringify(data),
                'type': 'POST',
                'processData': false,
                'contentType': 'application/json', //typically 'application/x-www-form-urlencoded', but the service you are calling may expect 'text/json'... check with the service to see what they expect as content-type in the HTTP header.
                success: callback
            }
        );
    };

    myJqHelp.dialog = function (container_id, modal_path, handle_function, closeEvent) {
        /// <summary>
        ///  方法介绍:Dialog(bootstrap框),框的地址为部分视图(注意框上弹框时,父框和子框id不能冲突)
        /// </summary>
        /// <param name="container_id">容器的ID</param>
        /// <param name="modal_path">框的地址</param>
        /// <param name="handle_function">框加载完成执形的一系列操作</param>
        var div_container = "<div id='" + container_id + "'></div>";
        $("body").append(div_container);
        $("#" + container_id).load(modal_path, function () {
            $("#" + container_id).find('#myModal').modal({
                show: true,
                backdrop: true
            });
            $("#" + container_id).find('#myModal').on('hide.bs.modal', function () {
                // 执行一些动作...
                if (closeEvent != undefined) {
                    closeEvent();
                }
                $(this).remove();
                $("#" + container_id).remove();
            })

            if (handle_function != undefined) {
                handle_function();
            }
        });
    };


    myJqHelp.parseQueryString = function (query) {
        var reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
        var obj = {};
        while (reg.exec(query)) {
            obj[RegExp.$1] = RegExp.$2;
        }
        return obj;
    };
    myJqHelp.objectConvertToQueryString = function (obj) {
        var strArr = [];
        for (var i in obj) {
            strArr.push(i + "=" + obj[i]);
        }
        return strArr.join("&");
    }
    myJqHelp.nameValueConvertToObject = function (arr) {
        var obj = {};
        $(arr).each(function () {
            obj[this.name] = this.value;
        });
        return obj;
    }
    myJqHelp.formDataLoad = function (domId, obj) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property) == true) {
                if ($("#" + domId + " [name='" + property + "']").size() > 0) {
                    $("#" + domId + " [name='" + property + "']").each(function () {
                        var dom = this;
                        if ($(dom).attr("type") == "radio") {
                            $(dom).filter("[value='" + obj[property] + "']").attr("checked", true);
                        }
                        if ($(dom).attr("type") == "checkbox") {
                            obj[property] == true ? $(dom).attr("checked", "checked") : $(dom).attr("checked", "checked").removeAttr("checked");
                        }
                        if ($(dom).attr("type") == "text" || $(dom).prop("tagName") == "SELECT" || $(dom).attr("type") == "hidden" || $(dom).attr("type") == "textarea") {
                            $(dom).val(obj[property]);
                        }
                        if ($(dom).prop("tagName") == "TEXTAREA") {
                            $(dom).val(obj[property]);
                        }
                    });
                }
            }
        }
    }
    myJqHelp.formDataLoadPlus = function (domId, obj) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property) == true) {
                var currentFilter = $(`#${domId} [name]`).filter(function () {
                    return this.name.toLowerCase() == property.toLowerCase();
                });
                if (currentFilter.size() > 0) {
                    currentFilter.each(function () {
                        var dom = this;
                        if ($(dom).attr("type") == "radio") {
                            $(dom).filter("[value='" + obj[property] + "']").attr("checked", true);
                        }
                        if ($(dom).attr("type") == "checkbox") {
                            obj[property] == true ? $(dom).attr("checked", "checked") : $(dom).attr("checked", "checked").removeAttr("checked");
                        }
                        if ($(dom).attr("type") == "text" || $(dom).prop("tagName") == "SELECT" || $(dom).attr("type") == "hidden" || $(dom).attr("type") == "textarea") {
                            $(dom).val(obj[property]);
                        }
                        if ($(dom).prop("tagName") == "TEXTAREA") {
                            $(dom).val(obj[property]);
                        }
                    });
                }
            }
        }
    }

    myJqHelp.DirtyValueProcessing = function (value) {
        if (value == undefined || value == null) {
            return "";
        } else {
            return value;
        }
    };

    //得到浏览器版本
    myJqHelp.getBrowser = function () {

        var ua = window.navigator.userAgent;
        var isIE = !!window.ActiveXObject || "ActiveXObject" in window;
        var isFirefox = ua.indexOf("Firefox") != -1;
        var isOpera = window.opr != undefined;
        var isChrome = ua.indexOf("Chrome") && window.chrome;
        var isSafari = ua.indexOf("Safari") != -1 && ua.indexOf("Version") != -1;
        if (isIE) {
            return "IE";
        } else if (isFirefox) {
            return "Firefox";
        } else if (isOpera) {
            return "Opera";
        } else if (isChrome) {
            return "Chrome";
        } else if (isSafari) {
            return "Safari";
        } else {
            return "Unkown";
        }
    }
    //字节转换
    myJqHelp.bConvertKBMBGB = function (limit) {
        var size = "";
        if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
            size = limit.toFixed(2) + "B";
        } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB
            size = (limit / 1024).toFixed(2) + "KB";
        } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + "MB";
        } else { //其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        }

        var sizestr = size + "";
        var len = sizestr.indexOf("\.");
        var dec = sizestr.substr(len + 1, 2);
        if (dec == "00") {//当小数点后为00时 去掉小数部分
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
        }
        return sizestr;
    }
    //加载进度条
    myJqHelp.loadingProgress = function (domId) {
        var mask_bg = document.createElement("div");
        mask_bg.id = domId;
        mask_bg.style.position = "absolute";
        mask_bg.style.top = "0px";
        mask_bg.style.left = "0px";
        mask_bg.style.width = "100%";
        mask_bg.style.height = "100%";
        mask_bg.style.backgroundColor = "rgba(7, 7, 7, 0.5)";
        mask_bg.style.zIndex = 10001;
        document.body.appendChild(mask_bg);

        var mask_msg = document.createElement("div");
        mask_msg.style.position = "absolute";
        mask_msg.style.top = "35%";
        mask_msg.style.left = "42%";
        mask_msg.style.width = "20%";
        mask_msg.style.backgroundColor = "white";
        mask_msg.style.border = "#336699 1px solid";
        mask_msg.style.textAlign = "center";
        mask_msg.style.fontSize = "1.1em";
        mask_msg.style.fontWeight = "bold";
        mask_msg.style.padding = "0.5em 3em 0.5em 3em";
        mask_msg.style.zIndex = 10002;
        var progressBar = $(`<div class="progress progress-striped active">
                    <div class="progress-bar progress-bar-success"
                        style="width: 0%;">
                    </div>
                </div><span name='progress'>0/0</span>`);
        progressBar.css("z-index", 10003);
        $(mask_msg).append(progressBar);
        mask_bg.appendChild(mask_msg);
    }
    //关闭进度条
    myJqHelp.closeProgress = function (domId) {
        var mask_bg = document.getElementById(domId);
        if (mask_bg != null)
            mask_bg.parentNode.removeChild(mask_bg);
    }
    //excel下载带进度条
    myJqHelp.excelDownLoad = function (url, progressId, fileName, type) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.responseType = "blob";
        xhr.addEventListener("loadstart", function (ev) {
            myJqHelp.loadingProgress(progressId);
            // 开始下载事件：下载进度条的显示
            $('div.progress-bar').css('width', "0%");
            $("span[name='progress']").text("0/0");
        });
        xhr.addEventListener("progress", function (ev) {
            // 下载中事件：计算下载进度
            var max = ev.total;
            var value = ev.loaded;
            var width = value / max * 100;
            $('div.progress-bar').css('width', width + "%");
            $("span[name='progress']").text(myJqHelp.bConvertKBMBGB(value) + "/" + myJqHelp.bConvertKBMBGB(max));
        });
        xhr.addEventListener("load", function (ev) {
            // 下载完成事件：处理下载文件
            if (type == "2003") {
                type = "application/vnd.ms-excel";
            } else {
                type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }
            if (this.status == 200) {
                var blob = this.response;
                var browser = myJqHelp.getBrowser();
                if (browser == "Chrome") {
                    var link = document.createElement('a');
                    var file = new Blob([blob], { type: type });
                    link.href = window.URL.createObjectURL(file);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                } else if (browser == "Firefox") {
                    var file = new File([blob], fileName, { type: type });
                    var url = URL.createObjectURL(file);
                    parent.location.href = url;
                    window.URL.revokeObjectURL(url);
                }
                //else if (browser == "IE") {
                //    var file = new Blob([blob], { type: 'application/force-download' });
                //    window.navigator.msSaveBlob(file, fileName);
                //}
            }
        });
        xhr.addEventListener("loadend", function (ev) {
            // 结束下载事件：下载进度条的关闭
            myJqHelp.closeProgress(progressId);
        });
        xhr.addEventListener("error", function (ev) {
        });
        xhr.addEventListener("abort", function (ev) {
        });
        xhr.send();
    }



    //防频繁点击
    myJqHelp.frequentClickHandle = function FrequentClickHandle(domId, callback, timeoutTime) {
        var button = {
            enable: true,
            click: function (callback) {
                if (this.enable == true) {
                    this.enable = false;
                    callback();
                    setTimeout(active, timeoutTime);
                }
            }
        }
        var elem = document.getElementById(domId);
        elem.addEventListener("click", bind(button, "click", callback), false);
        function bind(context, name, callback) {
            return function () {
                return context[name].apply(context, [callback]);
            };
        }
        function active() {
            button.enable = true;
        }
    }

    myJqHelp.ServiceRootPath = "http://cashapi.51eagle.com:8090/product";

    //myJqHelp.ServiceRootPath = "http://192.168.2.205:9091";
    myJqHelp.Rex = function () {
        this.isMobile = function (value) {
            return /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(value);
        };
        this.isEmail = function (value) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        };
        this.isbusinessLicence = function (value) {
            //return /^(\d{15}|\d{18})$/.test(value);
            return /^(([0-9a-zA-Z]{15})|([0-9a-zA-Z]{18}))$/.test(value);
        }
    };

    //三级联动通用方法
    myJqHelp.ThreeLevelLinkage = function (obj) {
        this.threeAction = {
            firstAction: {
                domId: obj.firstAction.domId,
                data: obj.firstAction.data,
                defaultText: obj.firstAction.defaultText,
                callbak: function () {
                    $(`#${this.threeAction.firstAction.domId}`).change(function () {
                        this.threeAction.
                            secondAction.
                            bingSelectFunction(this.threeAction.secondAction.domId, this.threeAction.secondAction.data(), this.threeAction.secondAction.callbak.bind(this));
                    }.bind(this));
                    $(`#${this.threeAction.firstAction.domId}`).prepend(`<option selected value=''>${this.threeAction.firstAction.defaultText}</option>`);
                },
                bingSelectFunction: obj.firstAction.bingSelectFunction
            },
            secondAction: {
                domId: obj.secondAction.domId,
                data: obj.secondAction.data,
                defaultText: obj.secondAction.defaultText,
                callbak: function () {
                    $(`#${this.threeAction.secondAction.domId}`).change(function () {
                        this.threeAction.
                            thirdAction.
                            bingSelectFunction(this.threeAction.thirdAction.domId, this.threeAction.thirdAction.data(), this.threeAction.thirdAction.callbak.bind(this));
                    }.bind(this));
                    $(`#${this.threeAction.secondAction.domId}`).prepend(`<option selected value=''>${this.threeAction.secondAction.defaultText}</option>`);
                    $(`#${this.threeAction.secondAction.domId}`).change();//将子级置空
                },
                bingSelectFunction: obj.secondAction.bingSelectFunction
            },
            thirdAction: {
                domId: obj.thirdAction.domId,
                data: obj.thirdAction.data,
                defaultText: obj.thirdAction.defaultText,
                callbak: function () {
                    $(`#${this.threeAction.thirdAction.domId}`).prepend(`<option selected value=''>${this.threeAction.thirdAction.defaultText}</option>`);
                },
                bingSelectFunction: obj.thirdAction.bingSelectFunction
            },
        };
        this.start = function () {
            this.threeAction.
                firstAction.
                bingSelectFunction(this.threeAction.firstAction.domId, this.threeAction.firstAction.data(), this.threeAction.firstAction.callbak.bind(this));
        }
    };


    myJqHelp.ThreeLevelLinkageChangeStart = function (obj) {
        this.threeAction = {
            firstAction: {
                domId: obj.firstAction.domId,
                data: obj.firstAction.data,
                defaultText: obj.firstAction.defaultText,
                callbak: function () {
                    $(`#${this.threeAction.firstAction.domId}`).change(function () {
                        this.threeAction.
                            secondAction.
                            bingSelectFunction(this.threeAction.secondAction.domId, this.threeAction.secondAction.data(), this.threeAction.secondAction.callbak.bind(this));
                    }.bind(this));
                    $(`#${this.threeAction.firstAction.domId}`).prepend(`<option selected value=''>${this.threeAction.firstAction.defaultText}</option>`);
                },
                bingSelectFunction: obj.firstAction.bingSelectFunction
            },
            secondAction: {
                domId: obj.secondAction.domId,
                data: obj.secondAction.data,
                defaultText: obj.secondAction.defaultText,
                callbak: function () {
                    $(`#${this.threeAction.secondAction.domId}`).change(function () {
                        this.threeAction.
                            thirdAction.
                            bingSelectFunction(this.threeAction.thirdAction.domId, this.threeAction.thirdAction.data(), this.threeAction.thirdAction.callbak.bind(this));
                    }.bind(this));
                    $(`#${this.threeAction.secondAction.domId}`).prepend(`<option selected value=''>${this.threeAction.secondAction.defaultText}</option>`);
                    $(`#${this.threeAction.secondAction.domId}`).change();//将子级置空
                },
                bingSelectFunction: obj.secondAction.bingSelectFunction
            },
            thirdAction: {
                domId: obj.thirdAction.domId,
                data: obj.thirdAction.data,
                defaultText: obj.thirdAction.defaultText,
                callbak: function () {
                    $(`#${this.threeAction.thirdAction.domId}`).prepend(`<option selected value=''>${this.threeAction.thirdAction.defaultText}</option>`);
                },
                bingSelectFunction: obj.thirdAction.bingSelectFunction
            },
        };
        this.start = function (startFunc) {
            this.threeAction[startFunc].
                bingSelectFunction(this.threeAction[startFunc].domId, this.threeAction[startFunc].data(), this.threeAction[startFunc].callbak.bind(this));
        }
    };
    myJqHelp.ThreeLevelLinkagePlus = function (obj) {
        this.threeAction = {
            firstAction: {
                domId: obj.firstAction.domId,
                data: obj.firstAction.data,
                defaultText: obj.firstAction.defaultText,
                callbak: function () {
                    if (this.threeAction.firstAction.loadbefore != undefined) {
                        this.threeAction.firstAction.loadbefore();
                        this.threeAction.firstAction.loadbefore = undefined;
                    }
                    $(`#${this.threeAction.firstAction.domId}`).change(function () {
                        debugger;
                        this.threeAction.
                            secondAction.
                            bingSelectFunction(this.threeAction.secondAction.domId, this.threeAction.secondAction.data(), this.threeAction.secondAction.callbak.bind(this));
                    }.bind(this));
                    $(`#${this.threeAction.firstAction.domId}`).prepend(`<option selected value=''>${this.threeAction.firstAction.defaultText}</option>`);
                    if (this.threeAction.firstAction.loadafter != undefined) {
                        this.threeAction.firstAction.loadafter();
                        this.threeAction.firstAction.loadafter = undefined;
                    }
                },
                bingSelectFunction: obj.firstAction.bingSelectFunction,
                loadbefore: obj.firstAction.loadbefore,
                loadafter: obj.firstAction.loadafter
            },
            secondAction: {
                domId: obj.secondAction.domId,
                data: obj.secondAction.data,
                defaultText: obj.secondAction.defaultText,
                callbak: function () {
                    if (this.threeAction.secondAction.loadbefore != undefined) {
                        this.threeAction.secondAction.loadbefore();
                        this.threeAction.secondAction.loadbefore = undefined;
                    }
                    $(`#${this.threeAction.secondAction.domId}`).change(function () {
                        this.threeAction.
                            thirdAction.
                            bingSelectFunction(this.threeAction.thirdAction.domId, this.threeAction.thirdAction.data(), this.threeAction.thirdAction.callbak.bind(this));
                    }.bind(this));
                    $(`#${this.threeAction.secondAction.domId}`).prepend(`<option selected value=''>${this.threeAction.secondAction.defaultText}</option>`);
                    if (this.threeAction.secondAction.loadafter != undefined) {
                        this.threeAction.secondAction.loadafter();
                        this.threeAction.secondAction.loadafter = undefined;
                    } else {
                         $(`#${this.threeAction.secondAction.domId}`).change();//将子级置空
                    }
                },
                bingSelectFunction: obj.secondAction.bingSelectFunction,
                loadbefore: obj.secondAction.loadbefore,
                loadafter: obj.secondAction.loadafter
            },
            thirdAction: {
                domId: obj.thirdAction.domId,
                data: obj.thirdAction.data,
                defaultText: obj.thirdAction.defaultText,
                callbak: function () {
                 
                    if (this.threeAction.thirdAction.loadbefore != undefined) {
                        this.threeAction.thirdAction.loadbefore();
                        this.threeAction.thirdAction.loadbefore = undefined;
                    }
                    $(`#${this.threeAction.thirdAction.domId}`).prepend(`<option selected value=''>${this.threeAction.thirdAction.defaultText}</option>`);
                    if (this.threeAction.thirdAction.loadafter != undefined) {
                        this.threeAction.thirdAction.loadafter();
                        this.threeAction.thirdAction.loadafter = undefined;
                    }
                },
                bingSelectFunction: obj.thirdAction.bingSelectFunction,
                loadbefore: obj.thirdAction.loadbefore,
                loadafter: obj.thirdAction.loadafter
            },
        };
        this.start = function () {
            this.threeAction.
                firstAction.
                bingSelectFunction(this.threeAction.firstAction.domId, this.threeAction.firstAction.data(), this.threeAction.firstAction.callbak.bind(this));
        }
    };


    //取url参数
    myJqHelp.getUrlVars = function () {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function (m, key, value) {
                vars[key] = value;

            }
        );
        return vars;
    }
    this.myJqHelp = myJqHelp;
})(jQuery);