$(document).ready(function () {
    var token = sessionStorage.getItem('token');
    var tab = '';
    var options = {};
    var reg = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[!@#.$%^&*? ]).*$/;

    function getArticle(tab) {
        $.ajax({
            url: 'http://120.92.77.212/wx/inside/article/data.action?u_token=' + token,
            type: 'POST',
            data: {
                page: 1,
                size: 10000
            },
            success: function (res) {
                if (tab == 'tab-1') {
                    initTable_1(res.result)
                } else if (tab == 'tab-3') {
                    initTable_3(res.result)
                }

            }
        })
    }

    function forTimeStamp(str) {
        return Date.parse(new Date(str)) / 1000;
    }

    function formatDateTime(timeStamp) {
        var date = new Date();
        date.setTime(timeStamp * 1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d;
    };

    function getPush() {
        $.ajax({
            url: 'http://120.92.77.212/wx/inside/push/data.action?u_token=' + token,
            type: 'POST',
            data: {
                page: 1,
                size: 10000
            },
            success: function (res) {
                if (res.retCode == 0) {
                    for (var i = 0; i < res.result.length; i++) {
                        var item = res.result[i]
                        item.p_display = item.p_display == 1 ? '在线' : item.p_display == 0 ? '已删除' : '离线'
                        item.p_startTime = formatDateTime(item.p_startTime)
                        item.p_endTime = formatDateTime(item.p_endTime)
                    }
                    initTable_4(res.result)
                }

            }
        })
    }
    // getPush()
    // ----------------------------------------------------------------- 删除文章
    function delArticle(id, tr) {
        $.ajax({
            url: 'http://120.92.77.212/wx/inside/article/delete.action?u_token=' + token,
            type: 'POST',
            data: {
                n_id: id
            },
            success: function (res) {
                console.log(res)
                if (res.retCode == 0) {
                    tr.remove()
                }

            }
        })
    }
    // ---------------------------------------------------------------- 清空modal框数据
    function resetBeforeModal() {
        $('#insterTitle').val('');
        $('#insterSubtitle').val('');
        $('#insterUrl').val('');
        $('#insterRead').val('');
        $('#insterwrap').val('');
        $('#acticleType').val(1001);
        $('#insterOpen').val('webview');
        $('#insterPoint').val('');
        $('#insterImageUrl').val('');
    }

    function inspectForm(form) {

        if (!$(form).find('.form_image_type').val()) {
            notice('请选择图片类型')
            return false
        } else if (!$(form).find('.form_title').val()) {
            notice('请输入文章主标题')
            return false
        } else if (!$(form).find('.form_subtitle').val()) {
            notice('请输入文章副标题')
            return false
        } else if (!$(form).find('.form_article_id').val()) {
            notice('请输入文章ID')
            return false
        } else if (!$(form).find('.form_acticle_type').val()) {
            notice('请选择文章类型')
            return false
        } else if (!$(form).find('.form_acticle_count').val()) {
            notice('请输入文章初始化阅读数')
            return false
        } else if (!$(form).find('.form_open_type').val()) {
            notice('请选择打开方式')
            return false
        }
        if(!$(form).find('.form_image_url').val()) {
            if ($(form).find('.form_image_type').val() != '2') {
                notice('请输入图片url')
                return false
            }
        }
        data = {
            "t_img": $(form).find('.form_image_url').val(),
            "t_topic": $(form).find('.form_title').val(),
            "t_desc": $(form).find('.form_subtitle').val(),
            "t_read": $(form).find('.form_acticle_count').val(),
            "t_flag": $(form).find('.form_acticle_type').val(),
            "n_id": $(form).find('.form_article_id').val(),
            "t_kind": $(form).find('.form_image_type').val(),
            "p_otype": $(form).find('.form_open_type').val()
        }
        return data;
    }
    // ------------------------------------------------------------------- 初始化文章展示类型
    function initType(data) {
        for (var i = 0; i < data.length; i++) {
            switch (data[i].n_type) {
                case 1:
                    data[i].n_type = '大图';
                    break;
                case 2:
                    data[i].n_type = '小图';
                    break;
                default:
                    data[i].n_type = '文字';
                    break;
            }
        }
    }
    //  ----------------------------------------------------------------- 修改文章权重
    function changeWeight(id, num, times) {
        $.ajax({
            url: 'http://120.92.77.212/wx/inside/article/values.action?u_token=' + token,
            type: 'POST',
            data: {
                n_id: id,
                n_value: num
            },
            success: function (res) {

                $('#myModal').modal('hide')
                alert('文章权重修改成功')
            }
        })
    }
    //  ------------------------------------------------------------ 文章前插入信息、编辑文章信息
    function insterChange() {
        var action = $('#insterChange').data('opts').action;
        var id = $('#insterChange').data('opts').id;

        if (!$('#insterChange').data('opts').id) {
            return notice('系统错误，请联系技术人员')
        } else if (!$('#insterTitle').val()) {
            return notice('请输入文章主标题')
        } else if (!$('#insterSubtitle').val()) {
            return notice('请输入文章副标题')
        } else if (!$('#acticleType').val()) {
            return notice('请选择文章类型')
        } else if (!$('#insterImageUrl').val()) {
            return notice('请输入图片地址')
        } else if (!$('#insterUrl').val()) {
            return notice('请输入文章地址')
        } else if (!$("#insterBefore input[type='radio']:checked").val()) {
            return notice('请选择文章展示类型')
        } else if (!$('#insterPoint').val()) {
            return notice('请输入埋点信息')
        } else if (!$('#insterOpen').val()) {
            return notice('请选择打开方式')
        } else if (!$('#insterwrap').val()) {
            return notice('请输入目标包名')
        } else if (!$('#insterRead').val()) {
            return notice('请输入初始化阅读数')
        }
        var data = {
            n_id: $('#insterChange').data('opts').id,
            n_name: $('#insterTitle').val(),
            n_desc: $('#insterSubtitle').val(),
            n_cid: $('#acticleType').val(),
            n_image: $('#insterImageUrl').val(),
            n_url: $('#insterUrl').val(),
            n_type: $("#insterBefore input[type='radio']:checked").val(),
            n_point: $('#insterPoint').val(),
            p_otype: $('#insterOpen').val(),
            p_pkg: $('#insterwrap').val(),
            n_views: $('#insterRead').val()
        }

        $.ajax({
            url: 'http://120.92.77.212/wx/inside/article/' + action + '.action?u_token=' + token,
            type: 'POST',
            data: data,
            success: function (res) {
                console.log(res)
                if (res.retCode == 0) {
                    $('#insterBefore').modal('hide')

                    resetBeforeModal()
                    if (action == 'update') {
                        alert('文章编辑成功')
                    } else if (action == 'before') {
                        alert('文章前插入信息成功')
                    }
                    $("#table2").bootstrapTable('destroy');

                    $('#sync').click()
                }
                // $('#insterBefore').modal('hide')
            }
        })
    }
    // ----------------------------------------------------------------- 获取文章类型
    function getArticleType() {
        $.ajax({
            url: 'http://120.92.77.212/wx/article/inside/config.action?u_token=' + token,
            type: 'GET',
            success: function (res) {
                var seclets = $('.acticle_type');
                var optionstring = '';
                $.each(res.result, function (key, value) {
                    optionstring += "<option value=\"" + value.n_cid + "\" >" + value.n_name + "</option>";
                })
                $('.acticle_type').html(optionstring)
            }
        })
    }
    // --------------------------------------------------------------------上线\下线\删除 push
    function pushLine(row, display) {
        console.log(display)
        // var r = confirm("确定要" + display == 1 ? '下线' : '上线' + "： " + row.p_name + " 吗？")
        var r = confirm('确定要 ' + (display == 1 ? '上线' : display == 0 ? '删除' : '下线') + ' ' + row.p_name + ' 吗？')
        if (r) {
            $.ajax({
                url: 'http://120.92.77.212/wx/inside/push/control.action?u_token=' + token,
                type: 'POST',
                data: {
                    p_display: display,
                    p_id: row.p_id
                },
                success: function (res) {
                    if (res.retCode == 0) {
                        $("#table4").bootstrapTable('destroy');
                        getPush()
                    }
                }
            })
        }

    }
    // -----------------------------------------------------------------------编辑push
    var reDateTime = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/

    function editorPush() {
        if (!$('#editPushName').val()) {
            return notice('请输入活动名称');
        } else if (!reDateTime.test($('#editPushStart').val())) {
            return notice('请确认开始时间的格式')
        } else if (!reDateTime.test($('#editPushEnd').val())) {
            return notice('请确认结束时间的格式')
        } else if (!$('#changePush').data('id')) {
            return notice('系统错误，请联系技术人员')
        }
        var data = {
            p_id: $('#changePush').data('id'),
            p_name: $('#editPushName').val(),
            p_startTime: forTimeStamp($('#editPushStart').val()),
            p_endTime: forTimeStamp($('#editPushEnd').val())
        }
        $.ajax({
            url: 'http://120.92.77.212/wx/inside/push/edit.action?u_token=' + token,
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.retCode == 0) {
                    $("#table4").bootstrapTable('destroy');
                    $('#editPush').modal('hide')
                    getPush()

                }
            }
        })
    }

    function initTable_1(data) {
        initType(data)
        $('#table1').bootstrapTable({
            data: data,
            pagination: true,
            pageNumber: 1,
            sidePagination: "client",
            cache: false,
            pageSize: 10,
            search: true,
            searchOnEnterKey: true,
            paginationLoop: false,
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            uniqueId: "ID",
            columns: [{
                    field: 'n_id',
                    title: 'ID'
                }, {
                    field: 'n_name',
                    title: '标题'
                }, {
                    field: 'n_time',
                    title: '发布时间'
                }, {
                    field: 'n_type',
                    title: '类型'
                }, {
                    field: 'n_url',
                    title: 'URL'
                }, {
                    field: 'n_point',
                    title: '埋点'
                },
                {
                    field: 'n_handle',
                    title: '操作',
                    events: operateEvents,
                    formatter: tab1Del
                }
            ]

        });
    }

    function initTable_3(data) {
        initType(data)
        $('#table2').bootstrapTable({
            columns: [{
                    field: 'n_id',
                    title: 'ID'
                }, {
                    field: 'n_name',
                    title: '标题'
                }, {
                    field: 'n_time',
                    title: '发布时间'
                }, {
                    field: 'n_type',
                    title: '类型'
                }, {
                    field: 'n_url',
                    title: 'URL'
                },
                {
                    field: 'n_handle',
                    title: '操作',
                    events: operateEvents,
                    formatter: operateFormatter
                }
            ],
            data: data,
            pagination: true,
            pageNumber: 1,
            sidePagination: "client",
            cache: false,
            pageSize: 10,
            search: true,
            searchOnEnterKey: true,
            paginationLoop: false,
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            uniqueId: "ID",

        });
    }

    function initTable_4(data) {

        $('#table4').bootstrapTable({
            columns: [{
                    field: 'p_id',
                    title: 'ID'
                }, {
                    field: 'p_name',
                    title: '活动名称'
                }, {
                    field: 'p_startTime',
                    title: '开始时间'
                }, {
                    field: 'p_endTime',
                    title: '结束时间'
                },
                {
                    field: 'p_display',
                    title: '状态'
                },
                {
                    field: 'n_handle',
                    title: '操作',
                    events: operateEvents,
                    formatter: table4Form
                }
            ],
            data: data,
            pagination: true,
            pageNumber: 1,
            sidePagination: "client",
            cache: false,
            pageSize: 10,
            search: true,
            searchOnEnterKey: true,
            paginationLoop: false,
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            uniqueId: "ID",

        });
        $('#table4 tbody tr').each(function (index, item) {
            if ($(this).children().eq(-2).html() == '在线') {
                $(this).children().eq(-1).find('.online').addClass('disabled');
            } else if ($(this).children().eq(-2).html() == '离线') {
                $(this).children().eq(-1).find('.offline').addClass('disabled');
            }
        })
    }

    function tab1Del(value, row, index) {
        return [
            '<span class="del">删除</span>'
        ].join('');
    }

    function operateFormatter(value, row, index) {
        return [
            '<span class="table3_handle insterbefore" data-toggle="modal" data-target="#insterBefore">插入信息</span>',
            '<span class="table3_handle changeinfo"  data-toggle="modal" data-target="#insterBefore">编辑信息</span>',
            '<span class="table3_handle changeWeight"  data-toggle="modal" data-target="#myModal">修改权重</span>',
            '<span class="del">删除</span>'
        ].join('');
    }

    function table4Form(value, row, index) {
        return [
            '<span class="editor" data-toggle="modal" data-target="#editPush">编辑</span>',
            '<span class="online">上线</span>',
            '<span class="offline">下线</span>',
            '<span class="tab3Del">删除</span>'
        ].join('')
    }
    window.operateEvents = {
        'click .editor': function (e, value, row, index) {
            console.log('editor', row)
            $('#editPushName').val(row.p_name);
            $('#editPushStart').val(row.p_startTime);
            $('#editPushEnd').val(row.p_endTime);
            $('#changePush').data('id', row.p_id)
        },
        'click .changeWeight': function (e, value, row, index) {
            $('#saveWeight').data('id', row.n_id)
            $('#myModalLabel').html(row.n_name)
        },
        'click .del': function (e, value, row, index) {

            var r = confirm("确定要删除： " + row.n_name + " 吗？")
            if (r == true) {
                var tr = $(e.currentTarget).parents('tr');
                delArticle(row.n_id, tr);
            }
        },
        'click .tab3Del': function (e, value, row, index) {

            // var r = confirm("确定要删除： " + row.p_name + " ？")
            // if (r == true) {
            var tr = $(e.currentTarget).parents('tr');
            // delArticle(row.n_id, tr);
            pushLine(row, 0)
            // }
        },
        'click .online': function (e, value, row, index) {
            console.log('online', row)
            pushLine(row, 1)
        },
        'click .offline': function (e, value, row, index) {
            console.log('offline', row)
            pushLine(row, 5)
        },
        'click .insterbefore': function (e, value, row, index) {
            $('#insterBefore h3').html('文章前新增信息')
            resetBeforeModal()
            $('#insterChange').data('opts', {
                'action': 'before',
                'id': row.n_id
            })
        },
        'click .changeinfo': function (e, value, row, index) {
            $('#insterBefore h3').html('编辑信息')
            $('#insterChange').data('opts', {
                'action': 'update',
                'id': row.n_id
            })
            $("#insterBefore input").eq(row.n_type - 1).attr('checked', true).siblings().attr('checked', false)
            $('#insterTitle').val(row.n_name);
            $('#insterSubtitle').val(row.n_desc);
            $('#insterUrl').val(row.n_url);
            $('#insterRead').val(row.n_views);
            $('#insterwrap').val(row.p_pkg);
            $('#acticleType').val(row.n_cid);
            $('#insterOpen').val(row.p_otype);
            $('#insterPoint').val(row.n_point);
            $('#insterImageUrl').val(row.n_image);
        }
    }


    $('.sidebar-list li').click(function (e) {
        tab = $(this).data('tab');
        var el = document.getElementById(tab)
        $(el).show().siblings().hide();
        if (tab == 'tab-1') {
            getArticle(tab)
        }
        if (tab == 'tab-4') {
            getPush()
        }

    })

    $('#saveWeight').click(function () {
        var id = $('#saveWeight').data('id');
        if ($('#highestWeight').val()) {

        } else {
            var weight = $('#commonWeight').val();
            var times = $('#commonTimes').val();
            changeWeight(id, weight, times)
        }
    })
    $('#sync').click(function () {
        getArticle('tab-3')
    })
    $('#insterChange').click(function () {
        insterChange()
    })
    $('#addPush').click(function () {
        // pushStart  pushEnd pushIcon pushTitle pushSubTitle pushUrl pushOpenType pushWrap
        var pushName = $('#pushName').val()
    })
    $('#changePush').click(function () {
        editorPush()
    })
    $('#topForm .add_form').click(function () {
        $('.sub_form').removeClass('hide')
        $(this).remove()
    })
    $('#subForm .add_form').click(function () {
        $('.sec_form').removeClass('hide')
        $(this).remove()
    })
    $('.save-online').click(function () {
        // form_image_type form_image_url form_title form_subtitle form_article_id form_acticle_type form_acticle_count form_open_type form_wrap

        var list = []
        if (!$('#readCardTitle').val()) {
            return notice('请输入读书卡主标题')
        }
        if (inspectForm($('#topForm'))) {
            list.push(inspectForm($('#topForm')))
        } else {
            return false
        }
        if (!$('.sub_form').hasClass('hide')) {
            if (inspectForm($('#subForm'))) {
                list.push(inspectForm($('#subForm')))
            } else {
                return false
            }
        }
        if (!$('.sec_form').hasClass('hide')) {
            if (inspectForm($('#secForm'))) {
                list.push(inspectForm($('#secForm')))
            } else {
                return false
            }
        }
        data = {
            "p_topic": $('#readCardTitle').val(),
            "ads": list
        }
        $.ajax({

            url: 'http://120.92.77.212/wx/inside/tail/create.action?u_token=' + token,
            type: 'POST',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(data),
            success: function (res) {
                if(res.retCode == 0){
                    alert('读书卡创建成功')
                }
            }
        })
    })
    $('#newPush').click(function(){
        $('.read_push').hide()
        $('.set_push').show()
    })
    $('.add_push_next').click(function(){
        $(this).parents('.self_form').next().removeClass('hide');
        $(this).remove()
    })
    $('#addPhsh').click(function () { 
        console.log(this)
     })
    function notice(str) {
        $('#notice').html(str);
        $('#notice').fadeIn('fast', function () {
            setTimeout(function () {
                $('#notice').fadeOut()
            }, 1500)
        })
    }
    if (sessionStorage.getItem('token')) {
        // token = sessionStorage.getItem('token');
        $('.sing_up').hide();
        $('.wrap').css('visibility', 'visible')
        $('.sidebar-list li')[3].click()
        getArticleType()
    }
    $('.login_sub').click(function () {
        if (!$('#loginAccount').val()) {
            return notice('请输入账号！')
        } else if ($('#loginAccount').val().length < 8) {
            return notice('账号长度少于八位！')
        } else if (!reg.test($('#loginPassword').val())) {
            return notice('密码长度不低于8位且必须包含数字字母特殊符号！')
        } else {
            var data = {
                "u_account": $('#loginAccount').val(),
                "u_password": $('#loginPassword').val()
            }
            $.ajax({
                type: 'POST',
                url: 'https://pay.rdtuijian.com/wx-application/inside/user/login.action',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.code == 0) {
                        token = data.data;
                        sessionStorage.setItem('token', data.data);
                        $('.sing_up').hide();
                        $('.wrap').css('visibility', 'visible')
                        $('.sidebar-list li')[0].click()
                        getArticleType()

                    } else {
                        notice(data.msg);
                    }
                },
                error: function (data) {
                    notice('服务异常~')
                }
            })
        }
    })
})