$(document).ready(function () {
    function getJsonData(requestURL, callback) {
        let myJosn;
        $.ajax({
            type: "GET",
            dataType: "json",
            url: requestURL,
            // async: false,
            success: function (result) {
                callback(result)
            }

        });
    }

    getJsonData("/userRolls", function (data) {
        $("#profile").append("<div id='profileImg' class='white z-depth-1'>" +
            "<img src='" + data.profilesPicture + "' alt='profilesPicture' class='blue-grey lighten-3'>" +
            "</div>")

        for (let i = 0; i < data.profilesData.length; i++) {
            if (data.profilesData[i].rolls_id == 1) {
                $("#subRolls").append("<div class='select col s6 right' value='" + data.profilesData[i].rolls_id + "'>" +
                    "<div class='col s12'>" +
                    "<div class='rollIcon col s4 right student'></div>" +
                    "<h6>دانشجو</h6>" +
                    "<p>ورود به عنوان کاربر دانشجو</p>" +
                    "</div>" +
                    "</div>")
            } else if (data.profilesData[i].rolls_id == 2) {
                $("#subRolls").append("<div class='select col s6 right' value='" + data.profilesData[i].rolls_id + "'>" +
                    "<div class='col s12'>" +
                    "<div class='rollIcon col s4 right teacher'></div>" +
                    "<h6>استاد</h6>" +
                    "<p>ورود به عنوان کاربر استاد</p>" +
                    "</div>" +
                    "</div>")
            } else if (data.profilesData[i].rolls_id == 3) {
                $("#subRolls").append("<div class='select col s6 right' value='" + data.profilesData[i].rolls_id + "'>" +
                    "<div class='col s12'>" +
                    "<div class='rollIcon col s4 right supervisor'></div>" +
                    "<h6>استاد ارشد</h6>" +
                    "<p>ورود به عنوان کاربر استاد ارشد</p>" +
                    "</div>" +
                    "</div>")
            }
            else if (data.profilesData[i].rolls_id == 4) {
                $("#subRolls").append("<div class='select col s6 right' value='" + data.profilesData[i].rolls_id + "'>" +
                    "<div class='col s12'>" +
                    "<div class='rollIcon col s4 right admin'></div>" +
                    "<h6>ادمین</h6>" +
                    "<p>ورود به عنوان کاربر ادمین</p>" +
                    "</div>" +
                    "</div>")
            } 

        }
        $("#subRolls > .select ").on("click", function () {
            rollId = $(this).attr("value");
            console.log(rollId)
            $.post("/dashboard",{rollId:rollId},function(data){window.location="/dashboard";} );
        })
    })


})