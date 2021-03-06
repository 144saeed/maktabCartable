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
            " where nationalId=?;"
        connection.query(sqlsttmnt, [username], (err, results, fields) => {
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
    addUserIformation(id, data, next) {
        if (data.type == "callInformation") {
            data = data.value;
            let options = {
                permissionCheck: {
                    id: null,
                    action: []
                },
                mandatoryKeysCheck: {
                    keys: ['title', 'number'],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status);
                    data.user_id = id;
                    addCallInformtion(responses, data, next);
                } else {
                    next(false, [status])
                }
            })
        } else if (data.type == "educationalResume") {
            data = data.value;
            let options = {
                permissionCheck: {
                    id: null,
                    action: []
                },
                mandatoryKeysCheck: {
                    keys: ['level', 'institute', 'grade'],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status);
                    data.user_id = id;
                    addEducationalResumeInformtion(responses, data, next);
                } else {
                    next(false, [status])
                }
            })
        } else if (data.type == "addressInformation") {
            data = data.value;
            let options = {
                permissionCheck: {
                    id: null,
                    action: []
                },
                mandatoryKeysCheck: {
                    keys: ['title', 'address'],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status);
                    data.user_id = id;
                    addAddressInformation(responses, data, next);
                } else {
                    next(false, [status])
                }
            })
        } else if (data.type == "professionalresume") {
            data = data.value;
            let options = {
                permissionCheck: {
                    id: null,
                    action: []
                },
                mandatoryKeysCheck: {
                    keys: ['jobTitle', 'institute'],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status);
                    data.user_id = id;
                    addProfessionalResumeInformtion(responses, data, next);
                } else {
                    next(false, [status])
                }
            })
        } else {
            next([{
                flag: false,
                error: "not an available action"
            }])
        }
    },

    doAnAction(profileId, action, data, next) {
        action = action.toLowerCase();
        if (action == "adduser") {
            addUser(profileId, data, next)
        } else if (action == "addmultipleusers") {
            let options = {
                permissionCheck: {
                    id: profileId,
                    action: 'defineUser'
                },
                mandatoryKeysCheck: {
                    keys: ['nationalId', 'email'],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status);
                    addMultipleUsers(responses, data, next);
                } else {
                    next(false, [status])
                }
            })
        } else if (action == "getregistrationlink") {
            getRegistrationLink(data, next);
        } else if (action == "signupandlinkinvalidation") {
            signUpAndLinkInvalidation(data, next);
        } else if (action == "definenewcourse") {
            let options = {
                permissionCheck: {
                    id: profileId,
                    action: 'defineCourse'
                },
                mandatoryKeysCheck: {
                    keys: ['title', 'subject', 'startDate', 'numOfSessions', "code"],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status)
                    addCourse(responses, data, next);
                } else {
                    next(false, [status])
                }
            });
        } else if (action == "addsupervisortoterm") {
            let options = {
                permissionCheck: {
                    id: profileId,
                    action: 'defineSupervisor'
                },
                mandatoryKeysCheck: {
                    keys: ['user_id', 'term_id'],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status);
                    addSupervisor(responses, data, next);
                } else {
                    next(false, [status])
                }
            })
        } else if (action == "addteachertoterm") {
            let options = {
                permissionCheck: {
                    id: profileId,
                    action: 'defineTeacher'
                },
                mandatoryKeysCheck: {
                    keys: ['user_id', 'term_id'],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status);
                    data.profileId = profileId;
                    addTeacher(responses, data, next);
                } else {
                    next(false, [status])
                }
            })
        } else if (action == "addstudentstoterm") {
            let options = {
                permissionCheck: {
                    id: profileId,
                    action: 'defineStudents'
                },
                mandatoryKeysCheck: {
                    keys: ['user_id', 'term_id'],
                }
            };
            responses = [];
            validateOperation(options, data, status => {
                if (status.flag) {
                    responses.push(status);
                    data.profileId = profileId;
                    addStudent(responses, data, next);
                } else {
                    next(false, [status])
                }
            })
        }
    },

    doHomeWorkAction(profileId, action, data, next) {
        action = action.toLowerCase();
        responses = [];
        if (action == "addquestion") {
            addQuestion(data, responses, next)
        } else if (action == "addfile") {
            addFile(data, responses, next)
        } else {
            next([{
                flag: false,
                error: "not an available action"
            }])
        }
    },

    getInformation(id, type, next) {
        type = type.toLowerCase();
        responses = [];
        if (type == 'listofusers') {
            getListOfAllUsers(responses, next);
        } else if (typ == 'terminformation') {
            getTermData(id, responses, next);
        } else if (type == "profileinformation") {
            getProfileData(id, responses, next);
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

let addAddressInformation = function (responses, data, next) {
    addRecord({
        table: "addressInfo",
        values: data
    }, responses, next)
}

let addCallInformtion = function (responses, data, next) {
    addRecord({
        table: "callInfo",
        values: data
    }, responses, next)
}

let addEducationalResumeInformtion = function (responses, data, next) {
    addRecord({
        table: "eduResume",
        values: data
    }, responses, next)
}

let addProfessionalResumeInformtion = function (responses, data, next) {
    addRecord({
        table: "proResume",
        values: data
    }, responses, next)
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

let addCourse = function (responses, values, next) {
    addRecord({
        table: "term",
        values
    }, responses, next)
}

let addIfDoesntExist = function (table, record, responses, next) {
    let sqlstatment = "select * from ?? where ?=?";
    connection.query(sqlstatment, [table, record], (err, ans, f) => {
        if (err || ans.length > 0) {

        } else {
            responses.push({
                error: err,
                results: ans,
                fields: f,
                table,
                operation: "addIfDoesntExist"
            })
        }
    })
}

let addQuestion = function (data, responses, next) {
    let request = {
        table: "questions",
        values: {
            description: data.value
        }
    }
    addRecord(request, responses, next);
}

let addFile = function (data, responses, next) {
    req = {
        table: "files",
        values: {
            fileNam: data.fileNam,
            description: data.description
        }
    }
    addRecord(request, responses, next);
}

let addMultipleEmails = function (responses, data, next) {
    data = fullFillData(data, data.email.length, [{
            key: 'isMainEmail',
            default: true
        },
        {
            key: 'isVerified',
            default: false
        }
    ]);
    data = object2array(data);
    let keys = data.keys;
    data = data.array;
    addMultipleRecords({
        table: 'emailInfo',
        values: data,
        keys
    }, responses, (responses) => {
        let flag = responses[responses.length - 1].flag;
        if (!flag) {
            flag = getResponsesFlag(responses);
            reverseTheBulkAddChain(responses, () => {
                next(flag, responses);
            })
        } else {
            flag = getResponsesFlag(responses);
            next(flag, responses);
        }
    })
}

let addMultipleFiles = function (responses, data, next) {
    if (data.directory.length != data.type.length) {
        responses.push({
            error: 'number of files and their typs do not pair',
            flag: false
        })
        next(getResponsesFlag(responses), responses);
    } else {
        let fileTableData = data.directory;
        let typeTableData = data.type;
        let fileProfileData = {};
        fileTableData = fullFillData(fileTableData, data.directory.length, [{
            key: 'description',
            value: ''
        }])
        fileTableData = object2array(fileTableData);
        let keys = fileTableData.keys;
        fileTableData = fileTableData.array;
        addMultipleRecords({
            table: 'files',
            values: fileTableData,
            keys
        }, responses, (responses) => {
            if (responses[responses.length - 1].flag) {
                typeTableData = object2array(typeTableData);
                let keys = typeTableData.keys;
                typeTableData = typeTableData.array;
                addMultipleRecords({
                    table: 'fileAccessTypes',
                    valuse: typeTableData,
                    keys
                }, responses, (responses) => {
                    if (responses[responses.length - 1].flag) {
                        let startId = responses[responses.length - 2].results.insertId;
                        let numOfIds = responses[responses.length - 2].results.affectedRows;
                        fileProfileData.files_id = new Array(numOfIds).fill(0).map((x, i) => i + startId);
                        let startId = responses[responses.length - 1].results.insertId;
                        let numOfIds = responses[responses.length - 1].results.affectedRows;
                        fileProfileData.fileAccessTypes_id = new Array(numOfIds).fill(0).map((x, i) => i + startId);
                        fileProfileData = fullFillData(fileProfileData, data.directory.length, [{
                            key: 'description',
                            value: ''
                        }])
                    } else {
                        reverseTheBulkAddChain(responses, next)
                    }
                })
            } else {
                reverseTheBulkAddChain(responses, next)
            }
        })
    }
}

let addMultipleRecords = function (req, res, next) {
    let sqlstatment = 'insert into ecartable.?? (??) values ?';
    connection.query(sqlstatment, [req.table, req.keys, req.values],
        (err, ans, fields) => {
            res.push({
                flag: (err == undefined),
                error: err,
                results: ans,
                fields,
                table: req.table,
                operation: "addrecord"
            })
            next(res)
        });
}

let addMultipleUsers = function (responses, data, next) {
    if (data.nationalId.length != data.email.length) {
        responses.push({
            error: 'email and national IDs are not paired',
            flag: false
        })
        next(getResponsesFlag(responses), responses);
    } else {
        let emailData = {
            email: data.email
        };
        delete data.email;
        data = fullFillData(data, data.nationalId.length, [{
                key: 'firstName',
                default: ''
            },
            {
                key: 'lastName',
                default: ''
            }, {
                key: 'fathersName',
                default: ''
            }, {
                key: 'personalPic',
                default: ''
            }, {
                key: 'description',
                default: ''
            }, {
                key: 'birthDate',
                default: null
            }
        ]);
        data = object2array(data);
        let keys = data.keys;
        data = data.array;
        addMultipleRecords({
            table: 'user',
            values: data,
            keys
        }, responses, (responses) => {
            if (responses[responses.length - 1].flag) {
                let startId = responses[responses.length - 1].results.insertId;
                let numOfIds = responses[responses.length - 1].results.affectedRows;
                emailData.user_id = new Array(numOfIds).fill(0).map((x, i) => i + startId);
                addMultipleEmails(responses, emailData, next);
            } else {
                next(flag, responses);
            }
        })
    }
}

let addRecord = function (req, res, next) {
    let sqlstatment = 'insert into ecartable.?? set ?';
    connection.query(sqlstatment, [req.table, req.values],
        (err, ans, fields) => {
            res.push({
                error: err,
                results: ans,
                fields,
                table: req.table,
                operation: "addrecord"
            })
            let flag = (err == undefined);
            next(flag, res)
        });
}

let addStudent = function (responses, data, next) {
    if (data.user_id.length != data.term_id.length && data.term_id.length != 1) {
        responses.push({
            error: 'users and terms are not paired',
            flag: false
        })
        next(false, responses);
    } else {
        let profileId = data.profileId;
        delete data.profileId;
        sqlstatment = "select * from profiles where profiles_id = ?";
        connection.query(sqlstatment, [profileId], (err, ans, fs) => {
            if (ans[0].rolls_id == 2 && ans[0].term_id != data.term_id) {
                responses.push({
                    error: 'the term is not accessible to the supervisor',
                    flag: false
                })
                next(false, responses)
            } else {
                let termid = data.term_id;
                delete data.term_id
                data = fullFillData(data, data.user_id.length, [{
                        key: 'term_id',
                        default: termid
                    },
                    {
                        key: 'rolls_id',
                        default: 4
                    }
                ]);
                console.log(data)
                data = object2array(data);
                let keys = data.keys;
                data = data.array;
                addMultipleRecords({
                    table: 'profiles',
                    values: data,
                    keys
                }, responses, (responses) => {
                    let flag = getResponsesFlag(responses);
                    next(flag, responses);
                })
            }
        })
    }
}

let addSupervisor = function (responses, data, next) {
    req = {
        table: 'profiles',
        values: {
            user_id: data.user_id,
            term_id: data.term_id,
            rolls_id: 2
        }
    }
    addRecord(req, responses, (flag, responses) => {
        let flagg = getResponsesFlag(responses);
        console.log(flagg);
        next(flagg, responses);
    });
}

let addTeacher = function (responses, data, next) {
    if (data.user_id.length != data.term_id.length && data.term_id.length != 1) {
        responses.push({
            error: 'users and terms are not paired',
            flag: false
        })
        next(false, responses);
    } else {
        let profileId = data.profileId;
        delete data.profileId;
        sqlstatment = "select * from profiles where profiles_id = ?";
        connection.query(sqlstatment, [profileId], (err, ans, fs) => {
            if (ans[0].rolls_id == 2 && ans[0].term_id != data.term_id) {
                responses.push({
                    error: 'the term is not accessible to the supervisor',
                    flag: false
                })
                next(false, responses)
            } else {
                let termid = data.term_id;
                delete data.term_id
                data = fullFillData(data, data.user_id.length, [{
                        key: 'term_id',
                        default: termid
                    },
                    {
                        key: 'rolls_id',
                        default: 3
                    }
                ]);
                console.log(data)
                data = object2array(data);
                let keys = data.keys;
                data = data.array;
                addMultipleRecords({
                    table: 'profiles',
                    values: data,
                    keys
                }, responses, (responses) => {
                    let flag = getResponsesFlag(responses);
                    next(flag, responses);
                })
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

let getProfileData = function (profileId, responses, next) {
    let sqlstatment = "select profiles.*, rolls.*, term.*" +
        " from profiles" +
        " inner join rolls on rolls.rolls_id = profiles.rolls_id" +
        " inner join term on term.id = profiles.term_id" +
        " where profiles.profiles_id=?;";
    connection.query(sqlstatment, [profileId], (error, ans, f) => {
        responses.push({
            error,
            data: ans
        })
        next(responses);
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
                status: 0
            }
            next(responses);
        } else if (res.length == 0) {
            responses = {
                flag: false,
                error: "email address did not found",
                status: 1
            }
            next(responses);
        } else if (res[0].isVerified) {
            responses = {
                flag: false,
                error: "email is verified before",
                status: 2
            }
            next(responses);
        } else {
            next({
                flag: true,
                status: 3,
                error: ''
            }, res[0].link);
        }
    });
}

let getResponsesFlag = function (responses) {
    let flag = true;
    responses.forEach(element => {
        if (element.flag != undefined) {
            flag = flag && element.flag
        } else if (element.status != undefined) {
            flag = flag && element.status;
        }
    });
    return flag;
}

let getTermData = function (id, responses, next) {
    let sqlstatment = "select profiles.*, rolls.*, term.*" +
        " from term" +
        " inner join term on term.id = profiles.term_id" +
        " inner join rolls on rolls.rolls_id = profiles.rolls_id" +
        " where term.id=?;"
    connection.query(sqlstatment, [id], (error, ans, f) => {
        responses.push({
            error,
            data: ans
        })
        next(responses);
    })
}

let getListOfAllUsers = function (responses, next) {
    let sqlsttmnt = "select *" +
        " from user;";
    connection.query(sqlstatment, (error, ans, f) => {
        responses.pus({
            error,
            data: ans
        })
        next(responses);
    });
}

let fullFillData = function (data, dim, keys) {
    let counter1 = 0;
    keys.forEach(element => {
        if (!data.hasOwnProperty(element.key)) {
            data[element.key] = Array(dim).fill(element.default);
        }
        if (data[element.key].length < dim) {
            data[element.key].concat(new Array(dim - data[element.key].length).fill(element.default));
        } else if (data[element.key].length > dim) {
            data[element.key].splice(dim + 1, data[element.key].length - dim);
        }
    });
    return data;
}

let linkInvalidator = function (email, output, next) {
    let sqlstatment = "update verificationLinks" +
        " inner join emailInfo" +
        " on emailInfo.id = verificationLinks.emailInfo_id" +
        " set isVerified=true" +
        " where emailInfo.email=?";
    connection.query(sqlstatment, [email], (error, results) => {
        output.push({
            flag: ((error == null) && (results.affectedRows == 1)),
            error,
            results,
            message: (results.affectedRows == 1 ? 'ok' : 'no such an email exists')
        })
        next(output);
    })
}

let object2array = function (object) {
    array = [];
    let keys = Object.keys(object);
    let kl = keys.length; //keys length
    let al = object[keys[0]].length; //array length
    for (let i = 0; i < al; i++) {
        let element = [];
        for (let j = 0; j < kl; j++) {
            let val = object[keys[j]][i];
            element.push(val);
        }
        array.push(element);
    }
    return {
        array,
        keys
    };
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

let reverseTheBulkAddChain = function (responses, next) {
    responses.forEach(element => {
        if (element.hasOwnProperty('results')) {
            let results = element.results;
            if (results != undefined) {
                if (results.hasOwnProperty('affectedRows')) {
                    for (let id = 0; id < results.affectedRows; id++) {
                        removeRecord(element.table, id + results.insertId);
                    }
                }
            }
        }
    });
    next();
}

let signup = function (email, password, output, next) {
    let sqlstatment = "update user" +
        " inner join emailInfo" +
        " on emailInfo.user_id=user.id" +
        " set password=?" +
        " where emailInfo.email=?";
    password = hasher.hash(password, 10, (err, ans) => {
        connection.query(sqlstatment, [ans, email], (err, res) => {
            output.push({
                flag: ((err == null) && (res.affectedRows == 1)),
                error: err,
                results: res,
                message: (res.affectedRows == 1 ? 'ok' : 'no such an email exists')
            })
            next(output);
        });
    })
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
                    stat = true;
                    responses.forEach(element => {
                        stat = (stat && element.flag)
                    });
                    next(stat, responses);
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