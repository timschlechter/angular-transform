define(
    [
        'src/angular-transform',
        'text!test/some.atpl',
        'lodash'
    ],
    function(angularTransform, template, _) {
        'use strict';

        /**
         * Creates multiple specs at once, which execute the same test code but with
         * different params. The last argument should contain a function which contains
         * the test code. All params before this function are objects containing the
         * params which are passed to the testcases.
         *
         * Example:
         *
         *   it.cases(
         *       { param: 1, expected: 1, description: '1 should equal 1' },
         *       { param: 2, expected: 2, description: '2 should equal 2' },
         *       function (param, expected) {
         *           expect(param).toBe(expected);
         *       }
         *   );
         */
        it.cases = function() {
            var testFn = arguments[arguments.length - 1];
            var testcases = _.map(_.without(arguments, testFn));

            _.each(testcases, function(testcase) {
                var description = testcase.description || "!!! Add a description property to your testcase object !!!";
                it(description, function() {
                    var args = _.map(testcase);
                    testFn.apply(this, args);
                });
            }, this);
        };

        describe('angularTransform', function() {

            describe('to XML', function() {
                it.cases({
                        description: 'no data',
                        config: {
                            template: '<?xml version="1.0" encoding="UTF-8"?>'
                        },
                        expected: '<?xml version="1.0" encoding="UTF-8"?>'
                    }, {
                        description: 'render value in element',
                        config: {
                            data: {
                                key: 'value'
                            },
                            template: '<?xml version="1.0" encoding="UTF-8"?><key><at>{{key}}</at></key>'
                        },
                        expected: '<?xml version="1.0" encoding="UTF-8"?><key>value</key>'
                    }, {
                        description: 'render value in attribute',
                        config: {
                            data: {
                                key: 'value'
                            },
                            template: '<?xml version="1.0" encoding="UTF-8"?><key value="{{key}}"></key>'
                        },
                        expected: '<?xml version="1.0" encoding="UTF-8"?><key value="value"></key>'
                    },
                    function(config, expected) {
                        var result = angularTransform(config);
                        result = result.replace(/\>[\n\t ]+</g, '><');
                        expect(result).toBe(expected);
                    }
                );
            });

            it("first try", function() {
                var data = {
                    company: "Some Company",
                    employees: [{
                        name: 'Jack',
                        age: '31'
                    }, {
                        name: 'Jill',
                        age: '29'
                    }]
                };

                var result = angularTransform({
                    data: data,
                    template: template,
                    output: {
                        format: "xml",
                        indented: true,
                        removeAngularComments: true
                    }
                });

                // Remove whitespace between tags
                result = result.replace(/\>[\n\t ]+</g, '><');

                expect(result).toBe('<?xml version="1.0" encoding="UTF-8"?><company><name>Some Company</name><employees><employee><name>Jack</name><age>31</age></employee><employee><name>Jill</name><age>29</age></employee></employees></company>');
            });
        });
    }
);
