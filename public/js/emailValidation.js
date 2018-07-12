$(document).ready(function () {
    $('#btnSaveUser').click(function () {
        console.log("hi")
        var sEmail = $('#txtEmail').val();
        var meli_code = $('#nationalId').val();
        // Checking Empty Fields
        if ($.trim(sEmail).length == 0 || $("#txtName").val() == "" || $("#txtFamily").val() == "" || $("#nationalId").val() == "") {
            $('#emptyFild').css({'display':'block'}) 
        }
        else if (!validateEmail(sEmail) || !checkMelliCode(meli_code)) {
            $('#emptyFild').css({ 'display': 'none' })
         if(!validateEmail(sEmail)) {
             $('#invalidEmail').css({ 'display': 'block' })
        }
         if (!checkMelliCode(meli_code)) {
             $('#invalidNationalId').css({ 'display': 'block' })
        }}

        else {
            $('#emptyFild').css({ 'display': 'none' })
            $('#invalidEmail').css({ 'display': 'none' })
            $('#invalidNationalId').css({ 'display': 'none' })
            $.post("/adminInitiatNewUser", {
                'email': $('#txtEmail').val(),
                'nationalId': $('#nationalId').val(),
                'firstName': $('#txtName').val(),
                'lastName': $('#txtFamily').val(),
                'description': $('#txtDescriptionUser').val()
            }, function (data) {

            })
            alert('Nice!! your Email is valid, now you can continue..');
        }
        //(validateEmail(sEmail) && checkMelliCode(meli_code))
    });
});
// Function that validates email address through a regular expression.
function validateEmail(sEmail) {
    console.log(sEmail)
    var filter = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
}

function checkMelliCode(meli_code) {
    console.log(meli_code)
    if (meli_code.length == 10) {
        if (meli_code == '1111111111' ||
            meli_code == '0000000000' ||
            meli_code == '2222222222' ||
            meli_code == '3333333333' ||
            meli_code == '4444444444' ||
            meli_code == '5555555555' ||
            meli_code == '6666666666' ||
            meli_code == '7777777777' ||
            meli_code == '8888888888' ||
            meli_code == '9999999999') {
            return false;
        }
        c = parseInt(meli_code.charAt(9));
        n = parseInt(meli_code.charAt(0)) * 10 +
            parseInt(meli_code.charAt(1)) * 9 +
            parseInt(meli_code.charAt(2)) * 8 +
            parseInt(meli_code.charAt(3)) * 7 +
            parseInt(meli_code.charAt(4)) * 6 +
            parseInt(meli_code.charAt(5)) * 5 +
            parseInt(meli_code.charAt(6)) * 4 +
            parseInt(meli_code.charAt(7)) * 3 +
            parseInt(meli_code.charAt(8)) * 2;
        r = n - parseInt(n / 11) * 11;
        if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {

            return true;
        } else {

            return false;
        }
    } else {

        return false;
    }
}