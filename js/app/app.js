var app = angular.module("FractalApp", []);

app.service("FractalRenderer", function () {
    var renderer = {
        canvas: null,
        render: function ($scope) {
            if (this.canvas === null)
                alert("Canvas not set");

            if ($scope.busy)
                return;
            $scope.busy = true;
            $scope.done = 0;

            var context = this.canvas.getContext("2d");
            var width = this.canvas.width;
            var height = this.canvas.height;
            var totalPoints = width * height;

            var stepX = Math.abs($scope.xMax - $scope.xMin) / width;
            var stepY = Math.abs($scope.yMin - $scope.yMax) / height;
            var x = $scope.xMin;
            var y = $scope.yMin;

            for (var i = 0; i < width; i++) {
                y = $scope.yMin;

                for (var j = 0; j < height; j++) {
                    var zr = 0, zi = 0;
                    var n = 0;

                    while (n < $scope.m && zr * zr + zi * zi < 4) {
                        n++;
                        var temp = zr * zr - zi * zi + x;
                        zi = 2 * zr * zi + y;
                        zr = temp;
                    }

                    var nPercent = Math.floor(n / $scope.m*100);
                    this.setPixelColor(context, i, j, nPercent, nPercent, nPercent);
                    y += stepY;
                }

                $scope.done = (i + 1) * height / totalPoints * 100;
                x += stepX;
            }

            $scope.busy = false;
        },

        setPixelColor: function (context, x, y, r, g, b) {
            var imageData = context.createImageData(1, 1);
            var data = imageData.data;
            data[0] = r;
            data[1] = g;
            data[2] = b;
            data[3] = 255;
            context.putImageData(imageData, x, y);
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
    $scope.xMin = -2;
    $scope.xMax = 0.5;
    $scope.yMin = -1.25;
    $scope.yMax = 1.25;
    $scope.m = 100;
    $scope.busy = false;
    $scope.done = 0;

    $scope.renderFractal = function () {
        FractalRenderer.render($scope);
    };
});