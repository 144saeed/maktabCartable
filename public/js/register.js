﻿

function check() {
    var data = getCookie('currentUserEmail')

    console.log("data : " + data)
    var pass = $('#password').val()
    var repass = $('#repassword').val()
    if (pass == "" || repass == "") {
        $('#checkFild').css({ 'display': 'block' })
    }
    else if (pass !== repass) {
        $('#checkFild').css({ 'display': 'none' })
        $('#noMatch').css({ 'display': 'block' })
    }
    else {

        $('#checkFild').css({ 'display': 'none' })
        $('#noMatch').css({ 'display': 'none' })
        $.post("/initPasswordByUser", { 'password': $('#password').val(), 'email': data }, function (data) {
            if (data == 0) {
                $('#faild').css({ 'display': 'block' })
            }
            else {
                $('#success').css({ 'display': 'block' })
                $.get('/')
            }
        })
    

    }
}

function getCookie(name) {
    if (document.cookie) {
        var allCookie = document.cookie;
        // var allCookie = 'a=1;b=;c=3;d=4'
        var cookie = []
        var arrayOfCookie = allCookie.split(`;`);
        for (var i = 0 ; i < arrayOfCookie.length ; i++) {
            var miniArrayOfCookie = arrayOfCookie[i].split('=')

            cookie.push(miniArrayOfCookie[0])
            cookie.push(miniArrayOfCookie[1])

        }
        //console.log(cookie)
        // console.log(cookie.length)
        for (var i = 0 ; i < cookie.length ; i++) {
            if (cookie[i] == name) {
                // console.log(cookie[i + 1])
                var str = cookie[i + 1]
                var res = str.replace(/%40/, "@")
                console.log(res)
                return res
            }
        }
    }
    else {
        console.log("کوکی یافت نشد")
        return ""
    }
}