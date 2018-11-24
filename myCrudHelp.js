
(function () {
    $.fn.extend({
        myTable: function (option) {
            var layerIndex = layer.load(1);
            var table = this;
            table.find("tbody tr").remove();
            $.getJSON(option.url, option.data, function (msg) {
                if (msg.code != 200) {
                    return false;
                }
                $(msg.data).each(function (index, element) {
                    var tdArr = [],
                        primaryKeyValue = "";
                    $(option.Colmns).each(function () {
                        if (this.isPrimaryKey != true) {
                            if (this.formatter != undefined) {
                                tdArr.push(this.formatter.call(this, element));
                            } else {
                                var td = `<td>${$ace.DirtyValueProcessing(element[this.name])}</td>`;
                                tdArr.push(td);
                            }

                        } else {
                            primaryKeyValue = element[this.name];
                        }
                    });
                    table.find("tbody").append(`<tr data-rowdata='${JSON.stringify(this)}' data-rowid='${primaryKeyValue}' >
                        <td>${index + 1}</td>
                        ${tdArr.join("")}
                    </tr>`);
                    if (option.rowLoadComplete != undefined) {
                        option.rowLoadComplete(element);
                    }
                });
                table.find("tbody tr").click(function () {
                    $(this).addClass("warning").siblings().removeClass("warning");
                });
                if (option.paging == true) {
                    if (option.init == true) {
                        table.next(".pages").remove();
                        table.after(`<div class="pages">
                                <div id="Pagination"></div>
                                <div class="searchPage">
                                    <span class="record-sum">
                                        共
                                        <strong id="totalRecord"></strong>条
                                    </span>
                                    <span class="page-sum">
                                        共
                                        <strong id="totalPages" class="allPage"></strong>页
                                    </span>
                                    <span class="page-go">
                                        跳转
                                        <input min="1" onkeyup="this.value=this.value.replace(/\D/, '');" type="number">页
                                    </span>
                                    <a href="javascript:;" class="page-btn">确定</a>
                                </div>
                            </div>`);
                        $("#totalPages").text(msg.pageInfo.pageCount);
                        $("#totalRecord").text(msg.pageInfo.recordCount);
                        $("#Pagination").pagination(msg.pageInfo.pageCount, {
                            callback: function (pageIndex) {
                                option.change(pageIndex + 1, option.data.size);
                            }
                        });
                    }
                }
            }).then(function () {
                layer.close(layerIndex);
            });
        },
        getSelectedRow: function () {
            return {
                rowid: this.find("tbody tr.warning").data("rowid"),
                rowDom: this.find("tbody tr.warning"),
                rowData: this.find("tbody tr.warning").data("rowdata")
            }
        }
    });
    var crud = function () {

        this.add = function (option) {
            myJqHelp.dialog(option.dialogId, option.dialogUrl, function () {
                $(`#${option.dialogId} #Modal-Add`).click(function () {
                    $.post(`${myJqHelp.ServiceRootPath}${option.addUrl}`, $(`#${option.formId}`).serializeArray(), function (msg) {
                        if (msg.code == 200) {
                            $ace.msg("添加成功！");
                            $("#myModal").modal("hide");
                            option.addComplete();
                        } else {
                            $ace.msg(msg.message);
                        }
                    });
                });
                option.dialogLoadComplete();
            });
        };
        this.del = function (option) {
            var selectedRow = $(`#${option.tableId}`).getSelectedRow();
            if (selectedRow.rowDom.size() > 0) {
                $ace.confirm("确定要删除该条数据吗？", function () {
                    myJqHelp.httpPut(`${myJqHelp.ServiceRootPath}${option.delUrl}` + selectedRow.rowid, {}, function (msg) {
                        if (msg.code == 200) {
                            $ace.msg("删除成功！");
                            option.delComplete();
                        } else {
                            $ace.msg(msg.message);
                        }
                    });
                });
            }
        };
        this.edit = function (option) {
            var selectedRow = $(`#${option.tableId}`).getSelectedRow();
            if (selectedRow.rowDom.size() > 0) {
                myJqHelp.dialog(option.dialogId, option.dialogUrl, function () {
                    $(`#${option.dialogId} #Modal-Add`).click(function () {
                        myJqHelp.httpPut(`${myJqHelp.ServiceRootPath}${option.editUrl}` + selectedRow.rowid, $(`#${option.formId}`).serializeArray(), function (msg) {
                            if (msg.code == 200) {
                                $ace.msg("修改成功！");
                                $("#myModal").modal("hide");
                                option.editComplete();
                            } else {
                                $ace.msg(msg.message);
                            }
                        });
                    });
                    option.dialogLoadComplete(selectedRow);
                });
            }
        };
        this.select = function (option) {
            $(`#${option.tableId}`).myTable({
                init: option.init,
                url: myJqHelp.ServiceRootPath + option.url,
                data: option.data,
                Colmns: option.Colmns,
                paging: option.paging,
                change: option.change,
                rowLoadComplete: option.rowLoadComplete
            });
        }
    }
    this.CRUD = crud;
})();