//creating mysql object
let mysql = require('mysql');
let hasher = require('bcrypt');
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
            " select profiles.profiles_id, profiles.term_id," +
            " profiles.rolls_id, rolls.rolls_title, term.title as 'term_title'" +
            " from profiles" +
            " inner join rolls" +
            " on profiles.rolls_id = rolls.rolls_id" +
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
            } else {
                results = results[0];
                if (!results.isMainEmail) {
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
    },

    doAnAction(profileId, action, data, next) {
        action = action.toLowerCase();
        if (action == "adduser") {
            addUser(profileId, data, next)
        } else if (action == "getregistrationlink") {
            getRegistrationLink(data, next);
        } else if (action == "signupandlinkinvalidation") {
            signUpAndLinkInvalidation(data, next);
        }
    },
    regenerateVerificationLink(email, next) {
        let responses = [];
        let sqlstatment = "select emailInfo.*, verificationLinks.*, user.*, verificationLinks.id as linkId" +
            " from emailInfo" +
            " inner join verificationLinks" +
            " on verificationLinks.emailInfo_id = emailInfo.id" +
            " inner join user" +
            " on user.id = emailInfo.user_id" +
            " where emailInfo.email=?";
        connection.query(sqlstatment, email, (err, ans) => {
            if (ans.length == 0) {
                responses.push({
                    error: "no such an email"
                });
                next(responses);
            } else {
                removeRecord("verificationLinks", ans.linkId, (err, res) => {
                    generateSignUpLink(ans.nationalId, (link) => {
                        addRecord({
                            table: "verificationLinks",
                            values: {
                                link,
                                date: new Date().getTime(),
                                isUsed: false,
                                emailInfo_id: ans[0].emailInfo_id
                            }
                        }, responses, (flag, responses) => {
                            if (flag) {
                                next(null, responses, link)
                            } else {
                                reverseTheAddChain(responses, () => {
                                    next(responses);
                                })
                            }
                        });
                    })
                })
            }
        })
    },
    verifySignUp(link, nationalId, next) {
        let responses = [];
        let sqlstatment = "select emailInfo.*, verificationLinks.*, user.*, verificationLinks.id as linkId" +
            " from emailInfo" +
            " inner join verificationLinks" +
            " on verificationLinks.emailInfo_id = emailInfo.id" +
            " inner join user" +
            " on user.id = emailInfo.user_id" +
            " where user.nationalId=?" +
            " and verificationLinks.link=?";
        connection.query(sqlstatment, [nationalId, link],
            (err, res) => {
                console.log(err);
                if (err) {
                    responses.push({
                        error: "wrong national Id. or email address"
                    })
                    next(responses);
                } else if (res.length == 0) {
                    responses.push({
                        error: "wrong national Id. or email address"
                    })
                    next(responses);
                }
                if ((new Date().getTime() - res.date) / (3 * 24 * 1000 * 3600) > 1) {
                    responses.push({
                        error: "link is expired"
                    })
                    next(responses);
                } else if (res.isUsed) {
                    responses.push({
                        error: "link is used"
                    })
                    next(responses);
                } else {
                    next(responses, res)
                }
            })
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

let addUser = function (id, data, next) {
    let options = {
        permissionCheck: {
            id,
            action: 'defineUser'
        },
        mandatoryKeysCheck: {
            keys: ['nationalId', 'email'],
        }
    };
    validateOperation(options, data, (status) => {
        if (status.flag) {
            let responses = [];
            let registerationEmail = data.email;
            delete data.email;
            addRecord({
                table: "user",
                values: data
            }, responses, (flag, responses) => {
                if (flag) {
                    addRecord({
                        table: 'emailInfo',
                        values: {
                            user_id: responses[responses.length - 1].results.insertId,
                            email: registerationEmail,
                            isMainEmail: true,
                            isVerified: false
                        }
                    }, responses, (flag, responses) => {
                        if (flag) {
                            generateSignUpLink(data.nationalId, link => {
                                addRecord({
                                    table: "verificationLinks",
                                    values: {
                                        link,
                                        date: new Date().getTime(),
                                        isUsed: false,
                                        emailInfo_id: responses[responses.length - 1].results.insertId
                                    }
                                }, responses, (flag, responses) => {
                                    if (flag) {
                                        next(null, responses)
                                    } else {
                                        reverseTheAddChain(responses, () => {
                                            next(responses);
                                        })
                                    }
                                });
                            })
                        } else {
                            reverseTheAddChain(responses, () => {
                                next(responses);
                            })
                        }
                    })
                } else {
                    reverseTheAddChain(responses, () => {
                        next(responses);
                    })
                }
            })
        } else {
            next(status);
        }
    })
}

let addRecord = function (req, res, next) {
    let sqlstatment = 'insert into ecartable.?? set ?';
    connection.query(sqlstatment, [req.table, req.values],
        (err, ans, fields) => {
            res.push({
                error: err,
                results: ans,
                fields,
                table: req.table
            })
            let flag = (err == undefined);
            next(flag, res)
        });
}

let checkForMandatoryKeys = function (keys, data, output, next) {
    let listOfMissing = [];
    let flag = true;
    keys.forEach(element => {
        if (!data.hasOwnProperty(element)) {
            listOfMissing.push(element);
        }
    });
    if (listOfMissing.length > 0) {
        flag = false;
    }
    output.mandatoryKeysCheck = {
        flag,
        listOfMissing
    };
    next(output);
}

let checKforPermissioin = function (id, action, output, next) {
    if (id == null) {
        next(output);
    } else {
        let sqlstatment = "select count(*) as 'count'" +
            " from profiles" +
            " inner join rolls" +
            " on profiles.rolls_id = rolls.rolls_id" +
            " inner join rolls_has_procedures" +
            " on rolls_has_procedures.rolls_id = profiles.rolls_id" +
            " inner join procedures" +
            " on procedures.procedures_id = rolls_has_procedures.procedures_id" +
            " where profiles_id = ?" +
            " and procedures_title=?;";
        connection.query(sqlstatment, [id, action],
            (err, ans) => {
                let permissionCheck = {
                    error: err,
                    results: ans,
                    flag: false
                };
                if (ans[0].count == 1) {
                    permissionCheck.flag = true;
                }
                output.permissionCheck = permissionCheck;
                next(output);
            })
    }
}

let generateSignUpLink = function (id, next) {
    hasher.hash(new Date().getTime() + "_" + id, 10,
        (err, ans) => {
            next(ans);
        })
}

let getRegistrationLink = function (email, next) {
    let sqlstatment = "select emailInfo.*, verificationLinks.*, verificationLinks.id as linkId" +
        " from emailInfo" +
        " inner join verificationLinks" +
        " on verificationLinks.emailInfo_id = emailInfo.id" +
        " where emailInfo.email=?";
    connection.query(sqlstatment, email, (err, res) => {
        if (err) {
            responses = {
                flag: false,
                error: err,
            }
            next(responses);
        } else if (res.length == 0) {
            responses = {
                flag: false,
                error: "email address did not found",
            }
            next(responses);
        } else {
            next(null, res)
        }
    });
}

let linkInvalidator = function (email, output, next) {
    let sqlstatment = "update verificationLinks" +
        " inner join emailInfo" +
        " on emailInfo.id = verificationLinks.emailInfo_id" +
        " set isVerified=true" +
        " where emailInfo.email=?";
    connection.query(sqlstatment, [email], (error, results) => {
        output.push({
            error,
            results
        })
        next(output);
    })
}

let removeRecord = function (table, id, next) {
    let sqlstatment = "delete from ?? where id=?";
    if (next == undefined) {
        connection.query(sqlstatment, [table, id]);
    } else {
        connection.query(sqlstatment, [table, id], (err, res) => {
            next(err, res);
        });
    }
}

let reverseTheAddChain = function (responses, next) {
    for (let i = 0; i < responses.length - 1; i++) {
        removeRecord(responses[i].table, responses[i].results.insertId);
    }
    next();
}

let signup = function (email, password, output, next) {
    let sqlstatment = "update user" +
        " inner join emailInfo" +
        " on emailInfo.user_id=user.id" +
        " set password=?" +
        " where emailInfo.email=?";
    connection.query(sqlstatment, [password, email], (err, res) => {
        output.push({
            error: err,
            results: res
        })
        next(output);
    });
}

let signUpAndLinkInvalidation = function (data, next) {
    let options = {
        permissionCheck: {
            id: null,
            action: 'signup'
        },
        mandatoryKeysCheck: {
            keys: ['password', 'email'],
        }
    };
    let responses = [];
    validateOperation(options, data, (status) => {
        if (status.flag) {
            responses.push(status);
            signup(data.email, data.password, responses, (responses) => {
                linkInvalidator(data.email, responses, (responses) => {
                    next(responses);
                })
            })
        } else {
            next(status)
        }
    })
}

let validateOperation = function (options, data, next) {
    let validationStatus = {};
    checKforPermissioin(options.permissionCheck.id, options.permissionCheck.action,
        validationStatus, (validationStatus) => {
            checkForMandatoryKeys(options.mandatoryKeysCheck.keys, data,
                validationStatus, (validationStatus) => {
                    validationFlagConstructor(validationStatus, next)
                })
        })
}

let validationFlagConstructor = function (validationStatus, next) {
    flag = true;
    Object.keys(validationStatus).forEach(element => {
        if (!validationStatus[element].flag) {
            flag = false;
        }
    })
    validationStatus.flag = flag;
    next(validationStatus);
}