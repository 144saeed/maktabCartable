const database = require('../config/dataBase.js');
const encryptor = require('bcrypt');
const path = require('path');
var nodemailer = require('nodemailer');
module.exports = function (app, passport) {


    app.get('/', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/userAccounts')
        } else {
            res.sendFile(path.join(__dirname, '../views/login.html'), {
                message: req.flash('loginMessage')
            })
        };
    });
    app.get('/initiateRegistration', function (req, res) {

        res.sendFile(path.join(__dirname, '../views/register.html'));
    });
    app.post('/checkRegistrationEmail', function (req, res) {
        database.checkForRegisterationEmail(req.body.email, function (output) {
            let result = {
                'emailExist': '',
                'verificationEmailSent': '',
                'message': ''
            };
            console.log(output.message);
            switch (output.status) {
                case 3:
                    result.emailExist = output.flag;
                    database.doAnAction(0, "getRegistrationLink", req.body.email, (responses, values) => {
                        if (values.length > 0)
                            result.verificationEmailSent = EmailSender(req.body.email, values[0].link);
                        else
                            result.verificationEmailSent = null;
                    });

                    if (result.verificationEmailSent != null)
                        result.message = 'لینک فعال سازی برای شما ارسال شد';
                    else
                        result.message = 'مشکلی در ارسال پیش آمده لطفا دوباره تلاش کنید.';

                    break;
                case 2:
                    result.emailExist = output.flag;
                    result.verificationEmailSent = 'false';
                    result.message = 'این ایمیل در سامانه ثبت و تایید شده است'
                    break;
                case 1:
                    result.emailExist = output.flag;
                    result.verificationEmailSent = 'false';
                    result.message = 'این آدرس یافت نشد';
                    break;
                case 0:
                    result.emailExist = output.flag;
                    result.verificationEmailSent = 'false';
                    result.message = 'این آدرس یافت نشد'
                    break;
            }

            res.send(result);
        })

    });

    app.post('/',
        passport.authenticate('local-login', {
            successRedirect: '/userAccounts', // redirect to the secure profile section
            failureRedirect: '/', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }));

    app.get('/login', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/userAccounts')
        }
        // render the page and pass in any flash data if it exists
        else {
            res.sendFile(path.join(__dirname, '../views/login.html'), {
                message: req.flash('loginMessage')
            })
        };
    });

    app.post('/login',
        passport.authenticate('local-login', {
            successRedirect: '/userAccounts', // redirect to the secure profile section
            failureRedirect: '/', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }));
    app.get('/userRegistration', (req, res) => {
        database.doAnAction(0, "getRegistrationLink", req.query.email, (responses, values) => {
            if (!req.query.verificationCode == values.link)
                res.send("لینک غیر مجاز است");
        });
        res.cookie("currentUserEmail", req.query.email);
        res.sendFile(path.join(__dirname, '../views/register.html'), {
            message: req.flash('loginMessage'),
            function (err) {
                console.log(err);
            }
        })
    })
    app.post('/initPasswordByUser', function (req, res) {
        let userInitPasswordData = {
            password: req.body.password,
            email: req.body.email,

        };
        database.doAnAction(1, "signupandlinkinvalidation", userInitPasswordData, function callback(status, responses) {
            if (status === null)
                res.send("1");
            else
                res.send("0");

        })

    });
    // =====================================
    // User Data Interaction ===============
    // =====================================
    app.get('/userRolls', isLoggedIn, function (req, res) {
        database.userPersonalDataByUserId(req.user, (err, results, fields) => {
            let frontEndResult = {
                'profilesData': '',
                'profilesPicture': ''
            };
            if (results.personalInformation[0].personalPic.toString() == "dir")
                frontEndResult.profilesPicture = "Images/01/images.jpg";
            else
                frontEndResult.profilesPicture = path.join(__dirname, '../attachments/' + results.personalInformation[0].personalPic);
            frontEndResult.profilesData = results.profilesData;

            res.send(frontEndResult);
        })
    });
    app.get('/userAccounts', isLoggedIn, function (req, res) {
        database.userPersonalDataByUserId(req.user, (err, results, fields) => {
            res.sendFile(path.join(__dirname, '../views/roll.html'));
            //With this route u will directed to rolls page to choose a roll wich user has.
        })
    });
    app.get('/UserFullInfo/', function (req, res) {
        database.userPersonalDataByUserId(req.query.userid, (err, results, fields) => {
            res.send(results);
        })
    });
    app.get('/adminInitiatNewUser', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../views/adminInitiatNewUser.html'));
    });
    app.post('/adminInitiatNewUser', isLoggedIn, function (req, res) {
        let userInsertData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            description: req.body.description,
            nationalId: req.body.nationalId
        };
        database.doAnAction(1, "addUser", userInsertData, function callback(status, responses) {
            if (status === null)
                res.send("Succeed!");
            else
                res.send("Faild!");

        })

    });
    app.get('/addPractice', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../views/addPractice.html'));
    });
    app.post('/addPractice', isLoggedIn, function (req, res) {
        res.end();
    });
    app.get('/addClass', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../views/addClass.html'));
    });
    app.post('/addClass', isLoggedIn, function (req, res) {
        res.end();
    });
    app.get('/userProfile', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../views/userProfile.html'));
    });
    // =====================================
    // User Information Interaction ========
    // =====================================
    //====================
    //Add
    //====================
    app.post('/addUserCallInfo/:type', function (req, res) {

        database.addUserIformation(req.body.userId, {
            type: "callInformation",
            value: {
                title: req.params.type,
                number: req.body.data
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });
    app.post('/UserEduResume/', function (req, res) {

        database.addUserIformation(req.body.userId, {
            type: "educationalResume",
            value: {
                level: req.body.level, //Mandatory
                institute: req.body.institute, //Mandatory
                grade: req.body.grade, //Mandatory
                startDate: req.body.startDate,
                endDate: req.body.endDate
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });
    app.post('/UserProResume/', function (req, res) {

        database.addUserIformation(req.body.userId, {
            type: "professionalresume",
            value: {
                jobTitle: req.body.jobTitle, //Mandatory
                institute: req.body.institute, //Mandatory
                instituteAddress: req.body.instituteAddress,
                phoneNumber: req.body.phoneNumber,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                endingReason: req.body.endingReason
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });

    app.post('/UserAddrInfo/', function (req, res) {

        database.addUserIformation(req.body.userId, {
            type: "addressinformation",
            value: {
                title: req.body.title, //Mandatory
                address: req.body.address, //Mandatory
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });
    //====================
    //Alter
    //====================
    app.put('/AlterUserInfo/', function (req, res) {

        database.alterUserInformation(req.body.userId, {
            type: "personal",
            value: {
                firstName: req.body.firstName, //Mandatory
                lastName: req.body.lastName, //Mandatory
                nationalId: req.body.nationalId,
                fathersName: req.body.fathersName,
                personalPic: req.body.personalPic
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });
    app.put('/UserProResume/', function (req, res) {

        database.alterUserInformation(req.body.userId, {
            type: "professionalresume",
            value: {
                jobTitle: req.body.jobTitle, //Mandatory
                institute: req.body.institute, //Mandatory
                instituteAddress: req.body.instituteAddress,
                phoneNumber: req.body.phoneNumber,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                endingReason: req.body.endingReason
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });
    app.put('/UserAddrInfo/', function (req, res) {

        database.alterUserInformation(req.body.userId, {
            type: "addressinformation",
            value: {
                title: req.body.title, //Mandatory
                address: req.body.address, //Mandatory
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });
    app.put('/UserEduResume/', function (req, res) {
        database.alterUserInformation(req.body.userId, {
            type: "educationalResume",
            value: {
                level: req.body.level,
                institute: req.body.institute, 
                grade: req.body.grade, 
                startDate: req.body.startDate,
                endDate: req.body.endDate
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });
    app.put('/UserEmailInfo/', function (req, res) {
        database.alterUserInformation(req.body.userId, {
            type: "emailInformation",
            value: {
                email: req.body.email
            }
        }, (responses, data) => {
            // res.send(responses)
            res.send(data)
        })
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    //======================================
    //Dahsboard ====================
    //======================================
    app.get('/dashboard', isLoggedIn, (req, res) => {
        res.cookie('currentUserProfile', global.currentUserProfile);
        res.sendFile(path.join(__dirname, '../views/dashboard.html'), {
            message: req.flash('loginMessage'),
            function (err) {
                console.log(err);

            }
        })
    })
    app.post('/dashboard', isLoggedIn, (req, res) => {
        global.currentUserProfile = req.body.rollId;
        res.sendFile(path.join(__dirname, '../views/dashboard.html'), {
            message: req.flash('loginMessage'),
            function (err) {
                console.log(err);

            }
        })
    })

    //======================================
    //AdminUserManagemant ==================
    //======================================
    app.post('/dashboard', isLoggedIn, (req, res) => {

        res.end();
    })
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

//Email Sender
function EmailSender(receiverEmail, verificationCode) {


    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.paykanro.ir',
            port: 587,
            secure: false,
            requireTLS: true, //Force TLS
            tls: {
                rejectUnauthorized: false
            }, // true for 465, false for other ports
            auth: {
                user: 'maktab@paykanro.ir', // generated ethereal user
                pass: 'maktab+13' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'maktab@paykanro.ir', // sender address
            to: receiverEmail, // list of receivers
            subject: 'سامانه ثبت نام', // Subject line
            text: 'برای تکمیل ثبت نام خود به آدرس زیر مزاجعه کنید', // plain text body
            html: '<b>برای تکمیل ثبت نام خود به آدرس زیر مراجعه کنید</b>' + '<br><a href="' +
                'http://127.0.0.1:8080/userRegistration?verificationCode=' + verificationCode +
                '&email=' + receiverEmail + '">لینک فعال سازی</a>'

            // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return 0;
            }
            console.log("Email Sent");
            return 1;

        });
    });
}