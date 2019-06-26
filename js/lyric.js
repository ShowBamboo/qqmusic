(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
        times: [], //保存时间
        lyrics: [], //保存歌词
        index: -1, //记录当前播放的索引
        loadLyric: function (callBack) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    $this.parseLyric(data);
                    callBack();
                }
            });
        },
        //处理歌词
        parseLyric: function (data) {
            var $this = this;
            //清空上一首歌曲的歌词信息和时间信息
            $this.lyrics = [];
            $this.times = [];

            var array = data.split("\n");
            //[02:29.23]
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            //遍历取出的每一条歌词
            $.each(array, function (index, ele) {
                var lrc = ele.split("]")[1];

                //排除空字符串
                if (lrc.length == 1) return true;
                $this.lyrics.push(lrc);

                //exec() 方法检索字符串中的指定值。返回值是被找到的值。如果没有发现匹配，则返回 null。
                var res = timeReg.exec(ele);
                if (res == null) return true;
                var timeStr = res[1]; //获取到 02:29.23                        
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2)); //保留两位小数
                $this.times.push(time);
            })
            console.log($this.times);
            console.log($this.lyrics);
        },
        currentIndex: function (currentTime) {
            if (currentTime >= this.times[0]) {
                this.index++;
                this.times.shift(); //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
            }
            return this.index;

        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window)