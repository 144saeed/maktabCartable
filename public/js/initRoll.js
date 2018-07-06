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
        console.log(data);
        // $("#profile").append("<div id='profileImg' class='white z-depth-1'>"
        //     +"<img src='Images/01/images.jpg' alt='' class='blue-grey lighten-3'>"
        // +"</div>")
        
        // for(let i = 1 ; i <= data.length ; i++){
        //     $("#subRolls").append("<div class='col s6 right'>"
        //         +"<div class='col s12'>"
        //             +"<div class='rollIcon col s4 right admin'></div>"
        //             +"<h6>ادمین</h6>"
        //             +"<p>ورود به عنوان کاربرادمین</p>"
        //         +"</div>"
        //     +"</div>")
        // }
    })
})
