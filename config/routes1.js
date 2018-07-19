const database = require('../config/dataBase.js');
const path = require('path');

module.exports = function (app) {


    app.get('/test', function (req, res) {
        //res.send('salam');


        /*============================================
        // get  password of the user
        ==============================================*/
        /**1/
        database.checkForUserPassword('saeed', (err, ans, fields) => {
            // err: error if any exists
            // ans: information json as:{id,password}
            //      empty if no information is available
            // fields: not important here
            res.send(err);
        })


        /**/
        /*============================================
        // get user personal data using its Id
        ==============================================*/
        /**1/
        database.userPersonalDataByUserId(2, (err, ans, fields) => {
            // err: error if any exists
            // ans: information json as:{
            //          personalInformation,
            //          perofessionalResume,
            //          educationalResume,
            //          profileInformation
            //          }
            //      empty if no information is available
            // fields: not important here
            res.send(ans);
        })
        /**/


        /**/
        /*============================================
        // admin adds user
        ==============================================*/
        /**1/
        database.doAnAction(1,"addUser",{
            nationalId:'0123456789',
            email:'saeed.oveisi@yahoo.com',
            firstName:'سعید',
            lastName:'اویسی',
            fathersName:'پدر'
        },(status) => {
            // status.flag: false if there is error
            // status: udefined if everything is ok
            // profile Id must be pointing to an admin user.other wise it produces an error
            // national id must be uniq. other wise it returns an error
            // email and national idmust be provided. otherwise it produces an error
            res.send(status);
        })
        /**/


        /**/
        /*============================================
        // admin adds multiple users
        ==============================================*/
        /**1/
        database.doAnAction(1, "addMultipleUsers", {
            nationalId: ['1', '2', '3', '4', '5', '6'],//mandatory
            email: ['e1@e.c', 'e2@e.c', 'e3@e.c', 'e4@e.c', 'e5@e.c', 'e6@e.c'], //mandatory,must have the same length asnationalId
            firstName: ['saeed'], // automatically will be converted to ['saeed',[],[],[],[],[],[]]
            lastName: ['oveisi','1','1','1','1','1','1','1','1']//automatically drops exceeding ones
            //other fileds will automatically be added
        }, (flag, responses) => {
            // status.flag: false if there is error
            // status: udefined if everything is ok
            // profile Id must be pointing to an admin user.other wise it produces an error
            // national id must be uniq. other wise it returns an error
            // email and national idmust be provided. otherwise it produces an error
            res.send({
                flag,
                responses
            });
        })
        /**/
        /**1/
        database.doAnAction(1, "addMultipleUsers", {
            nationalId: ['7', '8'],//mandatory
            email: ['e7@e.c', 'e8@e.c'], //mandatory,must have the same length asnationalId
            firstName: ['saeed'], // automatically will be converted to ['saeed',[],[],[],[],[],[]]
            lastName: ['oveisi','1','1','1','1','1','1','1','1']//automatically drops exceeding ones
            //other fileds will automatically be added
        }, (flag, responses) => {
            // status.flag: false if there is error
            // status: udefined if everything is ok
            // profile Id must be pointing to an admin user.other wise it produces an error
            // national id must be uniq. other wise it returns an error
            // email and national idmust be provided. otherwise it produces an error
            res.send({
                flag,
                responses
            });
        })
        /**/

        // let a = new Array(5).fill(1).map((x, i) => {
        //     console.log(i);
        //     return i + 3
        // });
        // res.send(a);



        /**/
        /*============================================
        // anyone requests for registeraton link
        ==============================================*/
        /**1/
        database.doAnAction(0, "getregistrationlink", 'saeed.oveisi@yahoo.com', (responses, link) => {
            // responses: null if everything is ok
            // link: verification link for the wmail address
            res.send({
                responses,
                link
            });
        })
        /**/




        /**/
        /*============================================
        // verify user signup
        ==============================================*/
        /**1/
        database.doAnAction(0, "signupAndLinkInvalidation", {
            password: '123456',
            email: 'saeed.oveisi@yahoo.com'
        }, (status, responses) => {
            // status: true if everything is ok
            // responses: detail Information about proccess
            // password must be provided
            // email must be provided
            res.send({
                responses,
                status
            });
        })
        /**/




        /**/
        /*============================================
        // admin adds new course
        ==============================================*/
        /**1/
        database.doAnAction(1, "definenewcourse", {
            title: "مکتب 13",
            subject: "فرانت اند",
            startDate: "2018-10-10",
            numOfSessions: 20,
            code: "m1",
        }, (status, responses) => {
            // status: true if everything is ok
            // responses: detail Information about proccess
            // title, subject,startDate,numOfSessions and code must be provided
            // status: true if everything is ok
            res.send({
                responses,
                status
            });
        })
        /**/



        /**/
        /*============================================
        // admin adds supervisor to specific term
        ==============================================*/
        /**1/
        database.doAnAction(1, "addsupervisortoterm", {
            user_id: 2,//mandatory
            term_id: 1
        }, (flag, responses) => {
            // status.flag: false if there is error
            // status: udefined if everything is ok
            // profile Id must be pointing to an admin user.other wise it produces an error
            // national id must be uniq. other wise it returns an error
            // email and national idmust be provided. otherwise it produces an error
            res.send({
                flag,
                responses
            });
        })
        /**/



        /**/
        /*============================================
        // admin or supervisor adds teachers to specific term
        ==============================================*/
        /**1/
        database.doAnAction(3, "addTeacherToTerm", {
            user_id: [1],//mandatory
            term_id: [2]
        }, (flag, responses) => {
            // status.flag: false if there is error
            // status: udefined if everything is ok
            // profile Id must be pointing to an admin user.other wise it produces an error
            // national id must be uniq. other wise it returns an error
            // email and national idmust be provided. otherwise it produces an error
            res.send({
                flag,
                responses
            });
        })
        /**/



        /**/
        /*============================================
        // admin or supervisor adds students to specific term
        ==============================================*/
        /**1/
        database.doAnAction(2, "addStudentsToTerm", {
            user_id: [4,5,6],//mandatory
            term_id: [2]
        }, (flag, responses) => {
            // status.flag: false if there is error
            // status: udefined if everything is ok
            // profile Id must be pointing to an admin user.other wise it produces an error
            // national id must be uniq. other wise it returns an error
            // email and national idmust be provided. otherwise it produces an error
            res.send({
                flag,
                responses
            });
        })
        /**/

    });
}