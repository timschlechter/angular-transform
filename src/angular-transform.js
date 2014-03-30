(function(global, angular) {
    'use strict';

    var regex = {
        angularTransformDirectives: /<\/?at ?(?:.|\n)*?>/g,
        angularDirectiveComments: /<!-- (end )?ng(.*?) -->/g,
        htmlTags: /<(\/?(?:[a-zA-Z-]*)(?:(?:\s+[a-zA-Z-]+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?)>/g,
        tags: /<((.|\n)*?)>/g,
        encodedTags: /&lt;((.|\n)*?)&gt;/g
    };

    function angularTransform(config) {
        config = config || {};

        // get config values
        var data = config.data,
            template = config.template || '',
            output = config.output || {},
            modules = config.modules || [];

        // bootstrap the application
        var doc = angular.element(encodeTemplate(template));
        modules.push('angular-transform-utilities');
        angular.module('angular-transform-app', modules);
        angular.bootstrap(doc, ['angular-transform-app']);
            
        // place data on scope
        var scope = doc.scope();
        for (var name in data) {
            if (data.hasOwnProperty(name)) {
                scope[name] = data[name];
            }
        }

        // Transform and get the result string
        scope.$apply();
        var result = doc[0].outerHTML;

        // Post processing
        result = result.replace(regex.angularTransformDirectives, '');
        result = result.replace(regex.angularDirectiveComments, '');
        
        return decode(result);
    }

    function encode(value) {
        // Encode tags which will cause problems when processing in Angular:
        // 1. encode all valid html tags
        // 2. double html encode angle brackets of tags which would be invalid in HTML
        // 3. decode encoded valid html tags
        value = value.replace(regex.htmlTags, '&lt;$1&gt;');
        value = value.replace(regex.tags, '&amp;lt;$1&amp;gt;');
        value = value.replace(regex.encodedTags, '<$1>');
        
        // Encode comments formatted like the ones generated by Angular directives
        value = value.replace(regex.angularDirectiveComments, '&lt;!-- $1ng$2 --&gt;');
        
        return value;
    }

    function encodeTemplate(template) {
        return '<at>' + encode(template) + '</at>';
    }

    function decode(value) {
        // Decode comments formatted like the ones generated by Angular directives
        value = value.replace(/&lt;!-- (end )?ng(.*?) --&gt;/g, '<!-- $1ng$2 -->');
        
        // Decode double-encoded angle brackets
        value = value.replace(/&amp;lt;/g, '<');
        value = value.replace(/&amp;gt;/g, '>');

        return value;
    }

    /**
     * Module which provided utilities to be used in plugins
     */
    angular.module('angular-transform-utilities', [])
        .directive('at', [
            function() {
                return {
                    restrict: 'E',
                    replace: false,
                    link: function($scope, element, attrs) { }
                };
            }
        ])
        .factory('atService', [
            '$templateCache',
            function ($templateCache) {
                return {
                    prepareTemplate: encodeTemplate,
                    getPreparedTemplate: function(templateUrl) {
                        var template = $templateCache.get(templateUrl);
                        return this.prepareTemplate(template);
                    }
                };
            }
        ]);

    // Expose angular-transform depending on runtime environment: NodeJS, AMD or global scope
    if (typeof exports !== "undefined") {
        exports["angularTransform"] = angularTransform;
    } else if (typeof define === 'function') {
        define(function() {
            return angularTransform;
        });
    } else {
        global.angularTransform = angularTransform;
    }
})(this, this.angular);
