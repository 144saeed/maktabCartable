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
    alterMyUserInformation() {}
}

let alterMyPersonalInformation = function (id, data) {
    let sqlsttmnt = 'update user'
}