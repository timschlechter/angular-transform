(function(global, angular) {
    'use strict';
    
    var angularTransform = function(config) {
        // get config values
        var data = config.data,
            template = config.template,
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

        // bootstrap the application
        var doc = angular.element('<at ng-app>' + (template || '') + '</at>'),
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

        // remove angular-transform directives
        result = result.replace(/\s*<\/?at[^>]*>/g, '');

        // remove comments added by angular directives
        result = result.replace(/\s*<!-- ng(.*?) -->/g, '');
        result = result.replace(/<!-- end ng(.*?) -->/g, '');

        // XML post processing
        if (output.format == "xml") {
            // fix processing instructions
            result = result.replace(/\s*<!--\?(.*?)\?-->/g, '<?$1?>');
        }

        return result;
    };

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
