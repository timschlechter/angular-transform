define(
    [
        'src/angular-transform',
        'text!test/some.atpl',
        'lodash'
    ],
    function(angularTransform, template, _) {
        'use strict';

        describe('angularTransform', function() {

            describe('template contains', function() {
                it.cases(
                    {   description: 'comment like AngularJS directives generate',
                        config: { template: '<!-- ngIf -->'}
                    },
                    {   description: 'tag containing colon',
                        config: { template: '<some:tag>inner</some:tag>' }
                    },
                    {   description: 'tag containing trailing digit',
                        config: { template: '<tag1>inner</tag1>' }
                    },
                    {   description: 'tag containing digit',
                        config: { template: '<tag1tag>inner</tag1tag>' }
                    },
                    {   description: 'tag containing starting digit',
                        config: { template: '<1tag>inner</1tag>' }
                    },
                    {   description: 'tag',
                        config: { template: '<tag>inner</tag>' }
                    },

                    {   description: 'tag containing dot',
                        config: { template: '<ta.g>inner</ta.g>' }
                    },
                    {   description: 'processing instruction',
                        config: { template: '<?xml version="1.0" encoding="UTF-8"?>' }
                    },
                    function(config) {
                        var result = angularTransform(config);
                        expect(result).toBe(config.template);
                    }
                );
            });

            describe('to Plain Text', function() {
                it.cases({
                        description: 'no data and no template',
                        config: {},
                        expected: '',
                    },
                    {
                        description: 'no data',
                        config: {
                            template: 'template'
                        },
                        expected: 'template',
                    },
                    {
                        description: 'no template',
                        config: {
                            data: {
                                value: 1
                            }
                        },
                        expected: '',
                    },
                    {
                        description: 'render value in text',
                        config: {
                            data: {
                                value: 1
                            },
                            template: "template nr: {{value}}"
                        },
                        expected: 'template nr: 1',
                    },
                    function(config, expected) {
                        var result = angularTransform(config);
                        result = result.replace(/\>[\n\t ]+</g, '><');
                        expect(result).toBe(expected);
                    }
                );
            });

            describe('to Xml', function() {
                it.cases({
                        description: 'no data',
                        config: {
                            template: '<?xml version="1.0" encoding="UTF-8"?>',
                            output: { format: "xml" }
                        },
                        expected: '<?xml version="1.0" encoding="UTF-8"?>'
                    }, {
                        description: 'render in element',
                        config: {
                            data: {
                                value: 1
                            },
                            template: '<?xml version="1.0" encoding="UTF-8"?><value><at>{{value}}</at></value>',
                            output: { format: "xml" }
                        },
                        expected: '<?xml version="1.0" encoding="UTF-8"?><value>1</value>'
                    }, {
                        description: 'render in attribute',
                        config: {
                            data: {
                                value: 1
                            },
                            template: '<?xml version="1.0" encoding="UTF-8"?><value is="{{value}}"></value>',
                            output: { format: "xml" }
                        },
                        expected: '<?xml version="1.0" encoding="UTF-8"?><value is="1"></value>'
                        
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
