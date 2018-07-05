$(document).ready(function () {
    $("#signUp").on("click", function () {
        $("#logBox > .container").remove();
        $("#signInfo").css({
            "display": "none"
        });
        $("#logBox").css({
            "right": "350px"
        }).delay(800).fadeIn("slow", function () {
            $("#logBox").append("<div class='container'>" +
                "<h5 class='center-align green-text text-darken-4'>ثبت نام</h5>" +
                "<div class='row mar-t-3'>" +
                "<div class='input-field inline'>" +
                "<input id='email' type='email' class='validate' name=''>" +
                "<label for='email'>رایانامه</label>" +
                "<span class='helper-text' data-error='اشتباه است!!' data-success='سپاس!'>" +
                "لطفا برای ثیت نام رایانامه خود را وارد کنید" +
                "</span>" +
                "</div>" +
                " <button class='waves-effect waves-light btn mar-t-3' type='submit' name='action'> ثبت نام</button>" +
                "</div>" +
                "</div>"
            )

            $("#logInfo").css({"display": "block"})
        })
    })

    $("#logIn").on("click", function () {
        $("#logBox > .container").remove();
        $("#logInfo").css({
            "display": "none"
        });
        $("#logBox").css({
            "right": "100px"
        }).delay(800).fadeIn("slow", function () {
            $("#logBox").append("<div class='container'>" 
            +"<h5 class='center-align green-text text-darken-4'>ورود</h5>"
                +"<div class='row mar-t-2'>"
                   +"<div class='input-field col s12'>"
                        +"<input id='username' type='text' class='validate'>"
                        +"<label for='username'>نام کاربری</label>"
                        +"<span class='helper-text' data-error='wrong' data-success='right'>نام کاربری همان کد ملی می باشد</span>"
                    +"</div>"
                    +"<div class='input-field col s12'>"
                        +"<input id='password' type='password' class='validate'>"
                        +"<label for='password'>گذرواژه</label>"
                    +"</div>"
                    +"<button class='waves-effect waves-light btn mar-t-2' type='submit' name='action'> ورود"
                    +"</button>"
            )
            $("#signInfo").css({"display": "block"})
        })
      })



})