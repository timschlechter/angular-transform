(function(global, angular) {
    'use strict';

    var tranform = function(data, template) {
        var doc = angular.element('<at ng-app ng-controller="AngularTransformRuntimeAppController">' + template + '</at>');

        angular.module('angular-transform-runtime-app', ['angular-transform'])
            .controller('AngularTransformRuntimeAppController', ['$scope',
                function($scope) {
                    // place data on scope
                    for (var name in data) {
                        if (data.hasOwnProperty(name)) {
                            $scope[name] = data[name];
                        }
                    }
                }
            ]);

        try {
            angular.bootstrap(doc, ['angular-transform-runtime-app']);

            var result = doc[0].outerHTML;

            // remove angular-transform directives
            result = result.replace(/\s*<\/?at[^>]*>/g, '');

            // remove comments added by angular directives
            result = result.replace(/\s*<!-- ng(.*?) -->/g, '');
            result = result.replace(/<!-- end ng(.*?) -->/g, '');

            // fix processing instructions
            result = result.replace(/\s*<!--\?(.*?)\?-->/g, '<?$1?>');


            return result;
        } finally {
            // TODO: destroy/cleanup the created angular.module('angular-transform-runtime-app')?
        }
    };

    angular.module('angular-transform', []).directive('at', [
        function() {
            return {
                restrict: 'E',
                replace: false,
                link: function($scope, element, attrs) {

                }
            };
        }
    ]);

    // Expose angular-transform depending on runtime environment: NodeJS, AMD or global scope
    if (typeof exports !== "undefined") {
        exports["angularTransform"] = transform;
    } else if (typeof define === 'function') {
        define(function() {
            return tranform;
        });
    } else {
        global.angularTransform = tranform;
    }
})(this, this.angular);
