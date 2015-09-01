#!/usr/bin/env node

'use strict';

var greeting = 'Welcome to Operation Spark';
lg(greeting);

var customers,
	_,
	fs
	;

//load JSON file
fs = require('fs');
customers = JSON.parse(fs.readFileSync('data/customers.json', 'utf8'));

_ = require('./lodown'); // do not need to include file extension '.js'

// how many males, how many females
var males = _.filter(customers, function(customer) {
	return customer.gender === 'male';
});
var females = _.filter(customers, function(customer) {
	return customer.gender === 'female';
});


lg('# males: ' + males.length + '\n# females: ' + females.length);


// oldest customer, youngest customer

var ages = _.pluck(customers, 'age');

var youngest = _.reduce(ages, function(youngest, age) {
	return (youngest < age) ? youngest : age;
});

var oldest = _.reduce(ages, function(oldest, age) {
	return (oldest > age) ? oldest : age;
});

lg('oldest: ' + oldest + ' youngest: ' + youngest);

// average balance

var balances = _.map(_.pluck(customers, 'balance'), function(item){
	return parseFloat(item.replace(/[$,]/g, ''));
});

var total = _.reduce(balances, function(total, balance) {
	return total + balance;
});

var average = (total/balances.length);

lg('average balance: ' + numToUSD(average));

// how many customer's names begin with some letter

lg(countFirstLetters(customers));

// how many customer's friend's names begin with some letter
_.each(customers, function(customer){
	// lg(countFirstLetters(customer.friends));
});

// how many customers are friends
var custFriends = [];
_.each(customers, function(customer){
	var otherCustomers = _.reject(customers, function(item){
		return customer === item;
	});
	_.each(otherCustomers, function(item){
		var result = _.filter(item.friends, function(friend){
			return friend.name === customer.name;
		});
		if (result.length !== 0) {
			custFriends.push(item.name + ' is friends with ' + result[0].name);
		} 
	});
});
lg(custFriends);
// how many customers have friends in common


// most common tags
var allTags = [];
var tagCounts = {};
var filteredTags = {};

_.each(_.pluck(customers, 'tags'), function(arrOfTags) {
	return _.each(arrOfTags, function(item) {
		return allTags.push(item);
	});
});

_.each(allTags, function(tag){
	tagCounts[tag] !== undefined ? tagCounts[tag] += 1 : tagCounts[tag] = 1;
});

_.each(tagCounts, function(key, val){
	if (val > 1){
		return filteredTags[key] = val;
	}
});

lg(filteredTags);

//Get Initials
var initials = _.map(customers, function(customer){
	var names = customer.name.split(' ');
	return names[0][0] + '.' + names[1][0] + '.';
});

lg(initials);

//Functions
function numToUSD(num) {
	num = num.toFixed(2);
	var numLength = num.toString().length;
	return numLength > 6 ? ['$', num.slice(0, (numLength-6)), ',', num.slice(-6)].join('') : '$' + num;
}

function lg(string) {
	console.log(string);
}

function countFirstLetters(collection){
	var firstLetters = _.map(_.pluck(collection, 'name'), function(name){
		return name.slice(0,1);
	});
	var result = {};

	_.each(firstLetters, function(letter){
		return result[letter] = 0;
	});
	_.each(firstLetters, function(letter){
		if (_.contains(result, letter)) {
			return result[letter] += 1;
		}
	});
	return result;
}