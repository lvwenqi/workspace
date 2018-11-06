$(document).ready(function () {
    var token = ""
    var reg = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[!@#.$%^&*? ]).*$/;
    var eml = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    $('.registered_btn').click(function () {
        $('h1').hide();
        $('h6').hide();
        $('.login').hide();
        $('.registered').show();
    })
    $('.change_password_btn').click(function () {
        $('.login').hide();
        $('.change_password').show();
    })
    $('.forgo').click(function () {
        $('h1').show();
        $('h6').show();
        $('.registered').hide();
        $('.change_password').hide();
        $('.login').show();
    })
    $('.registered_sub').click(function () {
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
                success: function (data) {
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
                error: function (data) {
                    notice('服务异常！')
                },


            })
        }
    })
    
    $('.change_sub').click(function () {
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
                success: function (data) {
                    if (data.code == 0) {
                        notice('密码修改成功！');
                        $('.change_password').hide();
                        $('.login').show();
                    } else {
                        notice(data.msg)
                    }
                },
                error: function () {
                    notice('服务异常~')
                }
            })
        }
    })
    $('#loginPassword').bind('keyup', function (event) {
        if (event.keyCode == "13") {
            $('.login_sub').click();
        }
    })
    $('#registeredEml').bind('keyup', function (event) {
        if (event.keyCode == "13") {
            $('.registered_sub').click();
        }
    })
    $('#newChangePassword').bind('keyup', function (event) {
        if (event.keyCode == "13") {
            $('.change_sub').click();
        }
    })
    
    function notice(str) {
        $('#notice').html(str);
        $('#notice').fadeIn('fast', function () {
            setTimeout(function () {
                $('#notice').fadeOut()
            }, 1500)
        })
    }
})