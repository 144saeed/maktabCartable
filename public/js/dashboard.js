$(document).ready(function () {
    $(".content > a").click(function () {
        $(".content > a").removeClass()
        $(this).addClass("sel")
    })

    $("#editUserInfo").click(function(){
        $(this).css({"display":"none"});
        $("#saveUserInfo").css({"display":"block"});
        $("input").prop( "disabled", false );
        
    })

})