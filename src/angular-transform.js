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

        angular.module('angular-transform-app', modules).directive('at', [
            function() {
                return {
                    restrict: 'E',
                    replace: false,
                    link: function($scope, element, attrs) {

                    }
                };
            }
        ]);

        // encode template before processing it by Angular
        template = encode(template);
        // bootstrap the application
        var doc = angular.element('<at ng-app>' + template + '</at>'),
            app = angular.bootstrap(doc, ['angular-transform-app']),
            scope = doc.scope();

        // put data on scope
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

    function decode(value) {
        // Decode comments formatted like the ones generated by Angular directives
        value = value.replace(/&lt;!-- (end )?ng(.*?) --&gt;/g, '<!-- $1ng$2 -->');
        
        // Decode double-encoded angle brackets
        value = value.replace(/&amp;lt;/g, '<');
        value = value.replace(/&amp;gt;/g, '>');

        return value;
    }

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
