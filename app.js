#!/usr/bin/env node

'use strict';

var greeting = 'Welcome to Operation Spark';
console.log(greeting);

var lodown = require('./lodown/lodown.js');

console.log(lodown);
var arr = [2,3,4,2,1,2,5];
var newArr = lodown.map(arr, function(item){
	return item * item;
});

console.log(newArr);