# Transform JSON to *any* text format [![Build Status](https://travis-ci.org/timschlechter/angular-transform.png?branch=master)](https://travis-ci.org/TimSchlechter/angular-transform)

## Features:
* 1 function which transforms JSON to __any text format__
* Use the __full power of AngularJS__ (templates, directives, filters, services, controllers)
* Extendable: easy to write your own plugins. Checkout the [MS Word 2003 plugin](https://github.com/TimSchlechter/angular-transform-msword2003) which is currently used to test out these things
* Very testable! Just use the testtools you allready know to write your Javascript tests

## Why?
<blockquote>"Who likes writing XSLT, please raise hands?"</blockquote>
<blockquote>"...and who likes maintaining XSLT?"</blockquote>
<blockquote>"...and who likes testing XSLT?"</blockquote>

At this moment, there probably aren't that many raised hands left.XSLT is very powerfull, but writing, maintaining and testing it is pretty hard.

# Wouldn't it be nice...
...if we could transform data using the simplicity and power of AngularJS? Think about it:

* Nowadays most of our data is available in JSON, we loooove JSON
* Javascript is gaining more and more popularity, it runs both in client browsers as standalone using NodeJS.
* AngularJS offers enormous power, simplicity and testability
* Binding JSON to a template is very easy when using AngularJS
* Easy to extend by using your own directives, filter and controllers in templates

Why not trying to use all this stuff to transform JSON to... any text format?

Maybe we don't get the performance we can get using XSLT or the streaming capabilities, but I think for most use cases using AngularJS will be sufficient. And next to NodeJS and browsers, it shouldn't be that hard to make this useable in other environments like .Net or Java.

## But first...
To avoid any confusion: this is __not an AngularJS module__. This library exposes a transform function, which internally bootstraps an AngularJS app. This app is used to perform the transformation.

## This will look something like...
Well this is a fairly simple example, but you get the idea.

### Data:
<pre>
	var data = {
		company: "Some Company",
		employees: [
			{ name: 'Jack', age: '31'},
			{ name: 'Jill', age: '29'}
		]
	};
</pre>

### Template:
<pre>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;company&gt;
	&lt;name&gt;&lt;at&gt;{{company}}&lt;/at&gt;&lt;/name&gt;
	&lt;at ng-if="employees.length"&gt;
		&lt;employees&gt;
			&lt;at ng-repeat="employee in employees | orderBy:'age'"&gt;
				&lt;employee&gt;
					&lt;name age="{{age}}"&gt;&lt;at&gt;{{employee.name}}&lt;/at&gt;&lt;/name&gt;
				&lt;/employee&gt;
			&lt;/at&gt;
		&lt;/employees&gt;
	&lt;/at&gt;
&lt;/company&gt;
</pre>

### Transform:
<pre>
var result = angularTransform({
    data: data,
    template: template
});
</pre>

### Result:
<pre>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;company&gt;
	&lt;name&gt;Some Company&lt;/name&gt;
	&lt;employees&gt;
		&lt;employee&gt;
			&lt;name age="29"&gt;Jill&lt;/name&gt;
		&lt;/employee&gt;
		&lt;employee&gt;
			&lt;name age="31"&gt;Jack&lt;/name&gt;
		&lt;/employee&gt;		
	&lt;/employees&gt;
&lt;/company&gt;
</pre>

## Run tests
<pre>
npm install 
npm install -g bower
bower install
npm test
</pre>

## Dependencies
* AngularJS
