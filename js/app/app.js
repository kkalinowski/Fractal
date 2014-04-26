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

            var fractalFunc = this.getFractalFunc($scope);
            if (fractalFunc == null) {
                alert("Unknown fractal");
                return;
            }

            for (var i = 0; i < width; i++) {
                y = $scope.yMin;
                for (var j = 0; j < height; j++) {
                    var n = fractalFunc(x, y, $scope.m);
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

        getFractalFunc: function ($scope) {
            var fractalIndex = $scope.availableFractals.indexOf($scope.chosenFractal);
            if (fractalIndex == 0)
                return this.mandelbrot;
            else if (fractalIndex == 1)
                return this.julia1;
            else if (fractalIndex == 2)
                return this.julia2;
            else if (fractalIndex == 3)
                return this.julia3;
            else
                return null;
        },

        mandelbrot: function (x, y, m) {
            var z = new complex(0, 0);
            var n = 0;

            while (n < m && z.sqAbs() < 4) {
                n++;
                var temp = z.r * z.r - z.i * z.i + x;
                z.i = 2 * z.r * z.i + y;
                z.r = temp;
            }

            return n;
        },

        julia1: function (x, y, m) {
            var z = new complex(x, y);
            var n = 0;
            var c = new complex(-0.1, 0.65);

            while (n < m && z.sqAbs() < 4) {
                n++;
                var temp = z.r * z.r - z.i * z.i + c.r;
                z.i = 2 * z.r * z.i + c.i;
                z.r = temp;
            }

            return n;
        },

        julia2: function (x, y, m) {
            var z = new complex(x, y);
            var n = 0;
            var c = new complex(-0.70176, 0.3842);

            while (n < m && z.sqAbs() < 4) {
                n++;
                var temp = z.r * z.r - z.i * z.i + c.r;
                z.i = 2 * z.r * z.i + c.i;
                z.r = temp;
            }

            return n;
        },

        julia3: function (x, y, m) {
            var z = new complex(x, y);
            var n = 0;
            var c = new complex(-0.8, 0.156);

            while (n < m && z.sqAbs() < 4) {
                n++;
                var temp = z.r * z.r - z.i * z.i + c.r;
                z.i = 2 * z.r * z.i + c.i;
                z.r = temp;
            }

            return n;
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
    $scope.xMax = 1.5;
    $scope.yMin = -1.25;
    $scope.yMax = 1.25;
    $scope.m = 50;
    $scope.availableFractals = ["Mandelbrot", "Julia's C=-0.1+0.65i", "Julia's C=-0.70176+0.3842i", "Julia's C=-0.8+0.156i"];
    $scope.chosenFractal = "Mandelbrot";

    $scope.renderFractal = function () {
        FractalRenderer.render($scope);
    };
});