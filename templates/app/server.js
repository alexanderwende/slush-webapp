#!/usr/bin/env node

'use strict';

var express = require('express');
var morgan = require('morgan');

var server = express();

server.use(express.static(__dirname + '/src'));
server.use('/dist', express.static(__dirname + '/dist'));
server.use('/test', express.static(__dirname + '/test'));

server.use('/bower_components', express.static(__dirname + '/bower_components'));
server.use('/node_modules', express.static(__dirname + '/node_modules'));

server.use(morgan('dev'));

server.listen(3000, function () {
    console.log('Server started, listening on port 3000');
});
