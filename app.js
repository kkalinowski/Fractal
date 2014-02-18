var app = angular.module("FractalApp", []);

app.service("FractalRenderer", function() {
    var renderer = {
        canvas: null,
        render: function() {
            if (this.canvas == null)
                alert("Canvas not set");
            else
                alert("render");
        },
    };

    return renderer;
});

app.directive("fractalCanvas", ["FractalRenderer", function (FractalRenderer) {
    return {
        restrict: "A",
        transclude: true,
        link: function (scope, element) {
            FractalRenderer.canvas = element;
        },
    };
}]);

app.controller("FractalController", function($scope, FractalRenderer) {
    $scope.renderFractal = function() {
        FractalRenderer.render();
    };
});