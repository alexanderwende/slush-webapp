/*
 * slush-webapp
 * https://github.com/alexanderwende/slush-webapp
 *
 * Copyright (c) 2014, Alexander Wende
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    inquirer = require('inquirer');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        workingDirName = process.cwd().split('/').pop().split('\\').pop(),
        osUserName = homeDir && homeDir.split('/').pop() || 'root',
        configFile = homeDir + '/.gitconfig',
        user = {};
    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }
    return {
        appName: workingDirName,
        userName: format(user.name) || osUserName,
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.userName
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts, function (answers) {

        if (!answers.moveon) { return done(); }

        answers.appNameSlug = _.slugify(answers.appName);

        gulp.src(__dirname + '/templates/app/**')
        .pipe(template(answers))
        .pipe(rename(function (file) {
            if (file.basename[0] === '_') {
                file.basename = '.' + file.basename.slice(1);
            }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('end', function () {
            done();
        });
    });
});

gulp.task('test', function (done) {

    var prompts = [
        {
            name: 'modulePath',
            message: 'What is the path of the module?'
        },
        {
            name: 'moduleExport',
            message: 'Which exported feature of the module do you want to test?'
        },
        {
            type: 'confirm',
            name: 'moveon',
            message: 'Continue?'
        }
    ];

    inquirer.prompt(prompts, function (answers) {

        if (!answers.moveon) { return done(); }

        console.log(answers);

        gulp.src(__dirname + '/templates/test/module.test.js')
        .pipe(template(answers))
        .pipe(rename(answers.modulePath + '.test.js'))
        .pipe(conflict('./test'))
        .pipe(gulp.dest('./test'));

        return done();
    });
});
