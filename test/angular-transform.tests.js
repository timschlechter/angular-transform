define(
    [
        'src/angular-transform',
        'text!test/some.atpl'
    ],
    function(transform, template) {
        'use strict';
        describe('angular-transform', function() {
            it("first try", function() {
                var data = {
                    company: "Some Company",
                    employees: [
                        { name: 'Jack', age: '31'},
                        { name: 'Jill', age: '29'}
                    ]
                };
                
                var result = transform(data, template);

                // Remove whitespace between tags
                result = result.replace(/\>[\n\t ]+</g, '><');
                
                expect(result).toBe('<?xml version="1.0" encoding="UTF-8"?><company><name>Some Company</name><employees><employee><name>Jack</name><age>31</age></employee><employee><name>Jill</name><age>29</age></employee></employees></company>');
            });
        });
    }
);