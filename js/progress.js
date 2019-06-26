(function (window) {
    function Progress($progressBar, $progressLine, $progressDot) {
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        isMove: false,
        init: function ($progressBar, $progressLine, $progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        progressClick: function (callBack) {
            //谁调用函数、谁触发事件，this就是谁
            var $this = this; //当前的this为progress
            this.$progressBar.click(function (event) {
                //获取背景距离窗口的位置
                var normalLeft = $(this).offset().left;
                //获取鼠标位置距离窗口的位置
                var eventLeft = event.pageX;
                //设置前景的宽度
                $this.$progressLine.css("width", eventLeft - normalLeft);
                //设置圆点的位置
                $this.$progressDot.css("left", eventLeft - normalLeft);

                //计算进度条比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            })
        },
        progressMove: function (callBack) {
            var $this = this;
            //获取背景距离窗口的位置
            var normalLeft = $this.$progressBar.offset().left;
            var eventLeft;
            //监听鼠标的按下事件
            this.$progressBar.mousedown(function () {
                //监听鼠标的移动事件
                $(document).mousemove(function (event) {
                    $this.isMove = true;
                    //获取鼠标位置距离窗口的位置
                    eventLeft = event.pageX;
                    if (eventLeft - normalLeft >= 0 && eventLeft - normalLeft <= $this.$progressBar.width()) {
                        //设置前景的宽度
                        $this.$progressLine.css("width", eventLeft - normalLeft);
                        //设置圆点的位置
                        $this.$progressDot.css("left", eventLeft - normalLeft);
                    }
                })
            })
            //监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");

                //计算进度条比例
                var value = (eventLeft - normalLeft) / $this.$progressBar.width();
                callBack(value);
                $this.isMove = false;
            })
        },
        setProgress: function (value) {
            if (this.isMove == true) return;
            if (value > 100 || value < 0) return;
            this.$progressLine.css({
                width: value + "%"
            })
            this.$progressDot.css({
                left: value + "%"
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)