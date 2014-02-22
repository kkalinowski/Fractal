var app = angular.module("FractalApp", []);

app.service("FractalRenderer", function() {
    var renderer = {
        canvas: null,
        render: function(scope) {
            if (this.canvas === null)
                alert("Canvas not set");

            var context = this.canvas.getContext("2d");
            var width = this.canvas.width;
            var height = this.canvas.height;

            //this.setBlackBackground(context, width, height);

            var integralX = (scope.xMax - scope.xMin) / width;
            var integralY = (scope.yMin - scope.yMax) / height;
            var x = scope.xMin;
            var y = scope.yMin;

            for (var i = 0; i < width; i++) {
                y = scope.yMin;
                for (var j = 0; j < height; j++) {
                    var x1 = 0, y1 = 0;
                    var k = 0;

                    while (k < scope.iterations && Math.sqrt(x1 * x1 + y1 * y1) < 2 ) {
                        k++;
                        var xx = x1 * x1 - y1 * y1 + x;
                        y1 = 2 * x1 * y1 + y;
                        x1 = xx;
                    }

                    var kPercent = k / scope.iterations;
                    var val = Math.floor(kPercent  * 2000);

                    this.setPixelColor(context, i, j, val, val, val);

                    y += integralY;
                }
                x += integralX;
            }
        },
        setPixelColor: function(context, x, y, r, g, b){
            var imageData = context.createImageData(1, 1);
            var data = imageData.data;
            data[0] = r;
            data[1] = g;
            data[2] = b;
            data[3] = 255;
            context.putImageData(imageData, x, y);
        },
        setBlackBackground: function (context, width, height) {
            context.fillStyle = "#000000";
            context.fillRect(0, 0, width, height);
        },
    };

    return renderer;
});

app.directive("fractalCanvas", ["FractalRenderer", function (FractalRenderer) {
    return {
        restrict: "A",
        transclude: true,
        link: function (scope, element) {
            FractalRenderer.canvas = element[0];
        },
    };
}]);

app.controller("FractalController", function ($scope, FractalRenderer) {
    $scope.xMin = -2.1;
    $scope.xMax = 1;
    $scope.yMin = -1.3;
    $scope.yMax = 1.3;
    $scope.iterations = 100;

    $scope.renderFractal = function() {
        FractalRenderer.render($scope);
    };
});