var app = angular.module("FractalApp", []);

app.service("FractalRenderer", function () {
    var renderer = {
        canvas: null,
        render: function ($scope) {
            if (this.canvas === null)
                alert("Canvas not set");

            var ctx = this.canvas.getContext("2d");
            var width = this.canvas.width;
            var height = this.canvas.height;

            var memCanvas = document.createElement("canvas");
            var memCtx = memCanvas.getContext("2d");
            memCanvas.width = width;
            memCanvas.height = height;

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

                    var nPercent = n / $scope.m;
                    if (n != $scope.m)
                        this.setPixelColor(memCtx, i, j, nPercent, 0.85, 0.8);
                    else
                        this.setPixelColor(memCtx, i, j, 0, 0, 0);

                    y += stepY;
                }

                x += stepX;
            }

            ctx.drawImage(memCtx.canvas, 0, 0);
        },

        setPixelColor: function (ctx, x, y, h, s, v) {
            var imageData = ctx.createImageData(1, 1);
            var rgb = this.HSVtoRGB(h, s, v);
            imageData.data[0] = rgb.r;
            imageData.data[1] = rgb.g;
            imageData.data[2] = rgb.b;
            imageData.data[3] = 255;
            ctx.putImageData(imageData, x, y);
        },

        HSVtoRGB: function (h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (h && s === undefined && v === undefined) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return {
                r: Math.floor(r * 255),
                g: Math.floor(g * 255),
                b: Math.floor(b * 255)
            }
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

app.controller("FractalController", function ($scope, $timeout, FractalRenderer) {
    $scope.xMin = -2;
    $scope.xMax = 0.5;
    $scope.yMin = -1.25;
    $scope.yMax = 1.25;
    $scope.m = 50;

    $scope.renderFractal = function () {
        FractalRenderer.render($scope);
    };
});