var System = require('systemjs');
var assert = require('chai').assert;

System.config({
    baseURL: 'src/js'
});

describe('<%= moduleExport %>', function () {

    'use strict';

    var <%= moduleExport %>;

    before(function (done) {

        System.import('./<%= modulePath %>')
            .then(function (module) {
                <%= moduleExport %> = module.default;
                done();
            })
            .catch(function (error) {
                throw error;
            });
    });

    describe('#someMethod()', function () {

        it('should do something', function (done) {

            // assert something

            done();
        });
    });
});
