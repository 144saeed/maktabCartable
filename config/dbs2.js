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
    doAnAction(profileId, action, data, next) {
        if (action.toLowerCase() == "adduser") {
            addUser(profileId, data, next)
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

let generateSignUpLink = function (id, next) {
    hasher.hash(new Date().getTime() + "_" + id, 10,
        (err, ans) => {
            next(ans);
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