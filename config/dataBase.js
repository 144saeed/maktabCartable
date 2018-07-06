//creating mysql object
let mysql = require('mysql');
//database connection setup
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecartable',
    multipleStatements: true
});
//connectiing to database
connection.connect();

module.exports = {
    checkForUserPassword(username, next) {
        let sqlsttmnt = "select password,id" +
            " from user" +
            " where nationalId=" + username + ";"
        connection.query(sqlsttmnt, (err, results, fields) => {
            next(err, results, fields);
        });
    },
    userPersonalDataByUserId(userId, next) {
        let sqlsttmnt = "select *" +
            " from user" +
            " where id = ?;" +
            " select *" +
            " from proResume" +
            " where user_id=?;" +
            " select *" +
            " from eduResume" +
            " where user_id=?;" +
            " select profiles.id as 'profile_id', profiles.term_id," +
            " profiles.rolls_id, rolls.title as 'roll_title', term.title as 'term_title'" +
            " from profiles" +
            " inner join rolls" +
            " on profiles.rolls_id = rolls.id" +
            " inner join term" +
            " on profiles.term_id = term.id" +
            " where profiles.user_id = ?;";
        connection.query(sqlsttmnt, [userId, userId, userId, userId], (err, results, fields) => {
            let res = {};
            res.personalInformation = results[0];
            res.perofessionalResume = results[1];
            res.educationalResume = results[2];
            res.profilesData = results[3];
            console.log(res.profilesData)
            next(err, res, fields);
        });
    },
    checkForRegisterationEmail(email, next) {
        let sqlsttmnt = "select isMainEmail, isVerified" +
            " from emailinfo" +
            " where email = ?;";
        connection.query(sqlsttmnt, email, (err, results, fields) => {
            if (results == undefined) {
                next({
                    flag: false,
                    status: 0,
                    message: "no such an email"
                })
            } else if (results.isMainEmail != 1) {
                next({
                    flag: false,
                    status: 1,
                    message: "this email address is not a registeration email"
                })
            } else if (results.isVerified) {
                next({
                    flag: false,
                    status: 2,
                    message: "this email address is verified already"
                })
            } else {
                next({
                    flag: true,
                    status: 3,
                    message: "this email should be verified"
                })
            }
        });
    },
    registerEmailbyUserId(id) {
        let sqlsttmnt = "update emailInfo" +
            " set isVerified=true" +
            " where isMainEmail" +
            " and !isVerified" +
            " and user_id=" + id + ";";
        connection.query(sqlsttmnt, (err, results, fields) => {
            next(err, results, fields);
        });
    },
    alterUserInformation(id, dataToReplace, next) {
        if (dataToReplace.type == "personal") {
            alterPersonalInformation(id, dataToReplace.value, next);
        } else if (dataToReplace.type == "professionalResume") {
            alterProfessionalResume(id, dataToReplace.value, next);
        } else if (dataToReplace.type == "educationalResume") {
            alterEducatinalResume(id, dataToReplace.value, next);
        } else if (dataToReplace.type == "addressInformation") {
            alterAddressInformtion(id, dataToReplace.value, next);
        } else if (dataToReplace.type == "callInformation") {
            alterCallInformtion(id, dataToReplace.value, next);
        } else if (dataToReplace.type == "emailInformation") {
            alterEmailInformtion(id, dataToReplace.value, next);
        }
    }
}

let alterPersonalInformation = function (id, data, next) {
    let sqlsttmnt = "update user" +
        " set firstName=?" +
        ",lastName=?" +
        ",nationalId=?" +
        ",fathersName=?" +
        ",personalPic=?" +
        " where id=?";
    connection.query(sqlsttmnt, [data.firsName, data.lastName,
        data.nationalId, data.fathersName, data.personalPic, id
    ], (err, results, fields) => {
        next(err, results, fields);
    })
}

let alterProfessionalResume = function (id, data, next) {
    let sqlsttmnt = "update proResume" +
        " set jobTitle=?" +
        ",institute=?" +
        ",instituteAddress=?" +
        ",phoneNumber=?" +
        ",startDate=?" +
        ",endDate=?" +
        ",endingReason=?" +
        " where id=?";
    connection.query(sqlsttmnt, [data.jobTitle, data.institute,
        data.instituteAddress, data.phoneNumber, data.startDate,
        data.endDate, data.endingReason, id
    ], (err, results, fields) => {
        next(err, results, fields);
    })
}

let alterEducatinalResume = function (id, data, next) {
    let sqlsttmnt = "update eduResume" +
        " set level=?" +
        ",institute=?" +
        ",grade=?" +
        ",startDate=?" +
        ",endDate=?" +
        " where id=?";
    connection.query(sqlsttmnt, [data.level, data.institute, data.grade,
        data.startDate, data.endDate, id
    ], (err, results, fields) => {
        next(err, results, fields);
    })
}

let alterAddressInformtion = function (id, data, next) {
    let sqlsttmnt = "update addressInfo" +
        " set title=?" +
        ",address=?" +
        " where id=?";
    connection.query(sqlsttmnt, [data.title, data.address, id], (err, results, fields) => {
        next(err, results, fields);
    });
}

let alterCallInformtion = function (id, data, next) {
    let sqlsttmnt = "update callInfo" +
        " set title=?" +
        ",number=?" +
        " where id=?";
    connection.query(sqlsttmnt, [data.title, data.number, id], (err, results, fields) => {
        next(err, results, fields);
    });
}

let alterEmailInformtion = function (id, data, next) {
    let sqlsttmnt = "update emailInfo" +
        " set email=?" +
        " where id=?";
    connection.query(sqlsttmnt, [data.email, id], (err, results, fields) => {
        next(err, results, fields);
    });
}