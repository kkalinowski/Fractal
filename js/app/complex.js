function complex(r, i) {
    this.r = r;
    this.i = i;

    this.sqAbs = function() {
        return this.r * this.r + this.i * this.i;
    };
}