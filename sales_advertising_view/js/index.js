$(document).ready(function() {
    var platform, type, total, page = 1,
        token = '';
    var reg = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[!@#.$%^&*? ]).*$/;
    var eml = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    (function(root, factory) {
        //amd
        if (typeof define === 'function' && define.amd) {
            define(['$', 'query'], factory);
        } else if (typeof exports === 'object') { //umd
            module.exports = factory();
        } else {
            root.Paging = factory(window.Zepto || window.jQuery || $, Query);
        }
    })(this, function($, Query) {
        $.fn.Paging = function(settings) {
            var arr = [];
            $(this).each(function() {
                var options = $.extend({
                    target: $(this)
                }, settings);
                var lz = new Paging();
                lz.init(options);
                arr.push(lz);
            });
            return arr;
        };

        function Paging() {
            var rnd = Math.random().toString().replace('.', '');
            this.id = 'Paging_' + rnd;
        }
        Paging.prototype = {
            init: function(settings) {
                this.settings = $.extend({
                    callback: null,
                    pagesize: 100,
                    current: 1,
                    prevTpl: "上一页",
                    nextTpl: "下一页",
                    firstTpl: "首页",
                    lastTpl: "末页",
                    ellipseTpl: "...",
                    toolbar: false,
                    hash: true,
                    pageSizeList: [5, 10, 15, 20]
                }, settings);
                this.target = $(this.settings.target);
                this.container = $('<div id="' + this.id + '" class="ui-paging-container"/>');
                this.target.append(this.container);
                this.render(this.settings);
                this.format();
                this.bindEvent();
            },
            render: function(ops) {
                this.count = ops.count || this.settings.count;
                this.pagesize = ops.pagesize || this.settings.pagesize;
                this.current = ops.current || this.settings.current;
                this.pagecount = Math.ceil(this.count / this.pagesize);
                this.format();
            },
            bindEvent: function() {
                var _this = this;
                this.container.on('click', 'li.js-page-action,li.ui-pager', function(e) {
                    if ($(this).hasClass('ui-pager-disabled') || $(this).hasClass('focus')) {
                        return false;
                    }
                    if ($(this).hasClass('js-page-action')) {
                        if ($(this).hasClass('js-page-first')) {
                            _this.current = 1;
                        }
                        if ($(this).hasClass('js-page-prev')) {
                            _this.current = Math.max(1, _this.current - 1);
                        }
                        if ($(this).hasClass('js-page-next')) {
                            _this.current = Math.min(_this.pagecount, _this.current + 1);
                        }
                        if ($(this).hasClass('js-page-last')) {
                            _this.current = _this.pagecount;
                        }
                    } else if ($(this).data('page')) {
                        _this.current = parseInt($(this).data('page'));
                    }

                    _this.go();
                });
                /*
                $(window).on('hashchange',function(){
                    var page=  parseInt(Query.getHash('page'));
                    if(_this.current !=page){
                        _this.go(page||1);
                    }
                })
                 */
            },
            go: function(p) {
                var _this = this;
                this.current = p || this.current;
                this.current = Math.max(1, _this.current);
                this.current = Math.min(this.current, _this.pagecount);
                this.format();
                getPage(platform, type, this.current)
                if (this.settings.hash) {
                    Query.setHash({
                        page: this.current
                    });
                }

                this.settings.callback && this.settings.callback(this.current, this.pagesize, this.pagecount);
            },
            changePagesize: function(ps) {
                this.render({
                    pagesize: ps
                });
            },
            format: function() {
                var html = '<ul>'
                html += '<li class="js-page-first js-page-action ui-pager" >' + this.settings.firstTpl + '</li>';
                html += '<li class="js-page-prev js-page-action ui-pager">' + this.settings.prevTpl + '</li>';
                if (this.pagecount > 6) {
                    html += '<li data-page="1" class="ui-pager">1</li>';
                    if (this.current <= 2) {
                        html += '<li data-page="2" class="ui-pager">2</li>';
                        html += '<li data-page="3" class="ui-pager">3</li>';
                        html += '<li class="ui-paging-ellipse">' + this.settings.ellipseTpl + '</li>';
                    } else
                    if (this.current > 2 && this.current <= this.pagecount - 2) {
                        html += '<li>' + this.settings.ellipseTpl + '</li>';
                        html += '<li data-page="' + (this.current - 1) + '" class="ui-pager">' + (this.current - 1) + '</li>';
                        html += '<li data-page="' + this.current + '" class="ui-pager">' + this.current + '</li>';
                        html += '<li data-page="' + (this.current + 1) + '" class="ui-pager">' + (this.current + 1) + '</li>';
                        html += '<li class="ui-paging-ellipse" class="ui-pager">' + this.settings.ellipseTpl + '</li>';
                    } else {
                        html += '<li class="ui-paging-ellipse" >' + this.settings.ellipseTpl + '</li>';
                        for (var i = this.pagecount - 2; i < this.pagecount; i++) {
                            html += '<li data-page="' + i + '" class="ui-pager">' + i + '</li>'
                        }
                    }
                    html += '<li data-page="' + this.pagecount + '" class="ui-pager">' + this.pagecount + '</li>';
                } else {
                    for (var i = 1; i <= this.pagecount; i++) {
                        html += '<li data-page="' + i + '" class="ui-pager">' + i + '</li>'
                    }
                }
                html += '<li class="js-page-next js-page-action ui-pager">' + this.settings.nextTpl + '</li>';
                html += '<li class="js-page-last js-page-action ui-pager">' + this.settings.lastTpl + '</li>';
                html += '</ul>';
                this.container.html(html);
                if (this.current == 1) {
                    $('.js-page-prev', this.container).addClass('ui-pager-disabled');
                    $('.js-page-first', this.container).addClass('ui-pager-disabled');
                }
                if (this.current == this.pagecount) {
                    $('.js-page-next', this.container).addClass('ui-pager-disabled');
                    $('.js-page-last', this.container).addClass('ui-pager-disabled');
                }
                this.container.find('li[data-page="' + this.current + '"]').addClass('focus').siblings().removeClass('focus');
                if (this.settings.toolbar) {
                    this.bindToolbar();
                }
            },
            bindToolbar: function() {
                var _this = this;
                var html = $('<li class="ui-paging-toolbar"><input type="text" class="ui-paging-count"/><a href="javascript:void(0)">跳转</a></li>');
                var sel = $('.ui-select-pagesize', html);
                var str = '';
                // for (var i = 0, l = this.settings.pageSizeList.length; i < l; i++) {
                // 	str += '<option value="' + this.settings.pageSizeList[i] + '">' + this.settings.pageSizeList[i] + '条/页</option>';
                // }
                // sel.html(str);
                // sel.val(this.pagesize);
                $('input', html).val(this.current);
                $('input', html).click(function() {
                    $(this).select();
                }).keydown(function(e) {
                    if (e.keyCode == 13) {
                        var current = parseInt($(this).val()) || 1;
                        _this.go(current);
                    }
                });
                $('a', html).click(function() {
                    var current = parseInt($(this).prev().val()) || 1;
                    _this.go(current);
                });
                sel.change(function() {
                    _this.changePagesize($(this).val());
                });
                this.container.children('ul').append(html);
            }
        }
        return Paging;
    })


    $('#btn').click(function() {
        init();
    })

    function initialize() {
        $.ajax({
            type: 'POST',
            url: 'http://pay.rdtuijian.com/wx-application/inside/common/init.action?token=' + token,
            success: function(data) {
                if (data.code == 0) {
                    var sortList = data.data.ads;
                    var typeList = data.data.types;
                    var sortHtml = '';
                    var typeHtml = '';
                    for (var i = 0; i < sortList.length; i++) {
                        sortHtml += '<li data-value="' + sortList[i].value + '"><a href="#">' + sortList[i].name + '</a></li>'
                    }
                    for (var i = 0; i < typeList.length; i++) {
                        typeHtml += '<li data-value="' + typeList[i].value + '"><a href="#">' + typeList[i].platform + '</a></li>'
                    }
                    $('#type .dropdown-menu').html(typeHtml)
                    $('#sort .dropdown-menu').html(sortHtml)
                    $('#type .dropdown-menu li').click(function() {
                        var text = $(this).children().text()
                        $('#type button .text').text(text)
                        platform = $(this).data('value')
                    })
                    $('#sort .dropdown-menu li').click(function() {
                        var text = $(this).children().text()
                        $('#sort button .text').text(text)
                        type = $(this).data('value')
                    })
                    $('#type .dropdown-menu li')[1].click()
                    $('#sort .dropdown-menu li')[0].click()
                    init()
                }
            }
        })
    }

    function init() {
        $.ajax({
            type: 'POST',
            url: 'http://pay.rdtuijian.com/wx-application/inside/common/get.action?platform=' + platform + '&type=' + type + '&page=1&size=100&token=' + token,
            success: function(data) {
                if (data.code == 0) {
                    var images = data.data.datas;
                    var html = '';
                    $('#pageToolbar').html('')
                    total = data.data.total
                    for (var i = 0; i < images.length; i++) {
                        html += '<div class="img_info"><a class="img_title" href="#"> <img class="image" data-url="' +
                            changeUrl(images[i].click_url) + '" src="' +
                            images[i].image_url + '"  title="' +
                            images[i].title + '">' +
                            images[i].title + '</a> </div>'
                    }
                    $('.content .images').html(html)
                    verifyMark($('.content .images .image'));
                    $('#pageToolbar').Paging({ pagesize: 100, count: total, toolbar: true });
                    $('.warp').show();
                    $('.sing_up').hide()
                }
            }
        })
    }

    function getPage(platform, type, current) {
        $.ajax({
            type: 'POST',
            url: 'http://pay.rdtuijian.com/wx-application/inside/common/get.action?platform=' + platform + '&type=' + type + '&page=' + current + '&size=100&token=' + token,
            success: function(data) {
                var html = '';
                var images = data.data.datas;
                if (images.length) {
                    for (var i = 0; i < images.length; i++) {

                        html += '<div class="img_info"><a class="img_title" href="#"> <img class="image" data-url="' +
                            changeUrl(images[i].click_url) + '" src="' +
                            images[i].image_url + '"  title="' +
                            images[i].title + '">' +
                            images[i].title + '</a> </div>'
                    }
                    $('.content .images').html(html)
                    verifyMark($('.content .images .image'));
                }
            }
        })
    }

    function mark(_this, url) {
        var markList = JSON.parse(localStorage.getItem('markList'));
        var mark = url;
        if (!markList) {
            markList = [];
        }
        for (var i = 0; i < markList.length; i++) {
            if (mark == markList[i]) {
                return;
            }
        }
        markList.push(mark);
        localStorage.setItem('markList', JSON.stringify(markList));
        _this.parent().addClass('click_color');
        _this.parents('.img_info').addClass('click_border');
    }

    function changeUrl(url) {
        if (url.indexOf("https://itunes.apple.com/app") >= 0) {
            url = url.replace("https://itunes.apple.com/app", "https://itunes.apple.com/cn/app");
        } else if (url.indexOf("https://lf.snssdk.com/api/ad/") >= 0) {
            url = url.substring(0, url.indexOf("&extra"));
        }


        return url
    }

    function verifyMark(images) {
        var markList = JSON.parse(localStorage.getItem('markList'));
        if (markList) {
            for (var i = 0; i < markList.length; i++) {
                var mark = markList[i];
                for (var j = 0; j < images.length; j++) {
                    if (mark == $(images[j]).data('url')) {
                        $(images[j]).parent().addClass('click_color');
                        $(images[j]).parents('.img_info').addClass('click_border');
                    }
                }
            }
        }
    }

    function verAccount(val) {
        $.ajax({
            type: 'POST',
            url: 'https://pay.rdtuijian.com/wx-application/inside/user/check.action?account=' + val,
            success: function(data) {
                if (data.code != 0) {
                    notice(data.msg)
                }
            }

        })
    }
    $('.content .images').delegate('.image', 'click', function() {
        // $('.dialog').find('span').html($(this).attr('title'));
        // $('.dialog').find('img').attr('src', $(this).attr('src'));
        // $('#click_url').attr('href', $(this).data('url'))
        // $('#img_url').attr('href', $(this).attr('src'))
        // $('.dialog_bg').show();
        // $('.dialog').show()
        mark($(this), $(this).data('url'))
        window.open($(this).data('url'), '_target')
    })
    $('.close').click(function() {
        $('.dialog').hide()
        $('.dialog_bg').hide();
    })
    $('#clearMark').click(function() {
        var markList = JSON.parse(localStorage.getItem('markList'));
        if (markList) {
            markList = [];
            localStorage.setItem('markList', JSON.stringify(markList));
            alert('清空标记成功，请重新点击“确定”按钮！')
        }
    })
    $(".login_sub").click(function() {
        $(this).button('loading').delay(1000).queue(function() {
            $(this).button('reset');
            $(this).dequeue();
        });
    });
    $('.registered_btn').click(function() {
        $('h1').hide();
        $('h6').hide();
        $('.login').hide();
        $('.registered').show();
    })
    $('.change_password_btn').click(function() {
        $('.login').hide();
        $('.change_password').show();
    })
    $('.forgo').click(function() {
        $('h1').show();
        $('h6').show();
        $('.registered').hide();
        $('.change_password').hide();
        $('.login').show();
    })
    $('#registeredAccount').blur(function() {
        var val = $(this).val();
        if (!val) {
            return notice('账号不能为空！');
        } else if (val.match(/[\u4e00-\u9fa5]/)) {
            return notice('账号不能输入汉字！')
        }
        verAccount(val)
    })
    $('.registered_sub').click(function() {
        if ($('#registeredAccount').val().length < 8) {
            return notice('账号长度少于8位!');
        } else if (!reg.test($('#registeredPassword').val())) {
            return notice('密码长度不低于8位且必须包含数字字母特殊符号！')
        } else if ($('#registeredPassword').val() != $('#againPassword').val()) {
            return notice('两次输入的密码不一致！')
        } else if (!$('#registeredPassword').val()) {
            return notice('姓名不能为空！');
        } else if (!$('#registeredDep').val()) {
            return notice('部门不能为空');
        } else if (!/^[1][3,4,5,7,8][0-9]{9}$/.test($('#registeredTel').val())) {
            return notice('请输入正确的手机号码！')
        } else if (!eml.test($('#registeredEml').val())) {
            return notice('请输入正确格式的邮箱地址')
        } else {
            var data = {
                "u_account": $('#registeredAccount').val(),
                "u_password": $('#registeredPassword').val(),
                "u_name": $('#registeredName').val(),
                "u_group": $('#registeredDep').val(),
                "u_tel": $('#registeredTel').val(),
                "u_email": $('#registeredEml').val()
            }

            $.ajax({
                type: 'POST',
                url: 'https://pay.rdtuijian.com/wx-application/inside/user/register.action',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    if (data.code == 0) {
                        $('.login').show();
                        $('.registered').hide();
                        $('h1').show();
                        $('h6').show();
                        notice('申请成功，请等待审核...');
                    } else {
                        notice(data.msg)
                    }
                },
                error: function(data) {
                    notice('服务异常！')
                },


            })
        }
    })
    $('.login_sub').click(function() {
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
                success: function(data) {
                    if (data.code == 0) {
                        token = data.data;
                        sessionStorage.setItem('token', data.data);
                        initialize()
                    } else {
                        notice(data.msg);
                    }
                },
                error: function(data) {
                    notice('服务异常~')
                }
            })
        }
    })
    $('.change_sub').click(function() {
        if (!$('#changeAccount').val()) {
            return notice('请输入账号！')
        } else if ($('#changeAccount').val().length < 8) {
            return notice('账号长度少于八位！')
        } else if (!reg.test($('#changePassword').val()) || !reg.test($('#newChangePassword').val())) {
            return notice('密码长度不低于8位且必须包含数字字母特殊符号！')
        } else {
            var data = {
                "u_account": $('#changeAccount').val(),
                "u_password": $('#changePassword').val(),
                "u_password_new": $('#newChangePassword').val()
            }
            $.ajax({
                type: 'POST',
                url: 'https://pay.rdtuijian.com/wx-application/inside/user/change.action',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    if (data.code == 0) {
                        notice('密码修改成功！');
                        $('.change_password').hide();
                        $('.login').show();
                    } else {
                        notice(data.msg)
                    }
                },
                error: function() {
                    notice('服务异常~')
                }
            })
        }
    })
    $('#loginPassword').bind('keyup', function(event) {
        if (event.keyCode == "13") {
            $('.login_sub').click();
        }
    })
    $('#registeredEml').bind('keyup', function(event) {
        if (event.keyCode == "13") {
            $('.registered_sub').click();
        }
    })
    $('#newChangePassword').bind('keyup', function(event) {
        if (event.keyCode == "13") {
            $('.change_sub').click();
        }
    })
    if (sessionStorage.getItem('token')) {
        token = sessionStorage.getItem('token');
        initialize()
    }

    function notice(str) {
        $('#notice').html(str);
        $('#notice').fadeIn('fast', function() {
            setTimeout(function() {
                $('#notice').fadeOut()
            }, 1500)
        })
    }
})