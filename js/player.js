(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) {
            //jq包装好的对象
            this.$audio = $audio;
            // 获取原生的，从而操作html对象的属性和方法
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            //判断是否为同一首音乐
            if (this.currentIndex == index) {
                //是同一首音乐
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                //不是同一首
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function () {
            var index = this.currentIndex - 1;
            if (index < 0) {
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1) {
                index = 0;
            }
            return index;
        },
        changeMusic: function (index) {
            //splice(删除的位置，删除的数量)
            this.musicList.splice(index, 1);
            //判断删除的音乐是否为当前播放的之前的音乐
            if (index < this.currentIndex) {
                this.currentIndex -= 1;
            }
        },
        musicTimeUpdate: function (callBack) {
            var $this = this;
            this.$audio.on("timeupdate", function () {
                //获取总得时间
                var duration = $this.audio.duration;
                //获取当前时间
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(currentTime, duration);
                callBack(currentTime, duration, timeStr);
            })
        },
        //创建一个格式化时间的方法
        formatDate: function (currentTime, duration) {
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if (endMin < 10) {
                endMin = "0" + endMin;
            }
            if (endSec < 10) {
                endSec = "0" + endSec;
            }
            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            if (startMin < 10) {
                startMin = "0" + startMin;
            }
            if (startSec < 10) {
                startSec = "0" + startSec;
            }
            return startMin + ":" + startSec + " / " + endMin + ":" + endSec;
        },
        musicSeekTo: function (value) {
            if (isNaN(value) == true) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo: function (value) {
            if (isNaN(value) == true) return;
            //volume属性的取值为0-1
            if (value >= 0 && value <= 1) {
                this.audio.volume = value;
            }
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);