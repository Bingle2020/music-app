$(function () {

    // $.ajax({
    //     type: 'GET',
    //     url: 'https://music.163.com/song/media/outer/url',
    //     success: function (data) {
    //         console.log('data==>',data);
    //     }

    // })



    //格式化时间
    function formatTime(time) {
        var minutes = Math.floor(time / 60);
        minutes = minutes >= 10 ? minutes : '0' + minutes;

        var seconds = Math.floor(time % 60);
        seconds = seconds >= 10 ? seconds : '0' + seconds;

        return minutes + ':' + seconds;
    }

    //初始化音乐总时长
    var duration = 0;
    //初始化实时时间
    var currentTime = 0;

    //保存上一首
    var lastId = null;

    //绑定滑块
    var $mask = $('.mask');
    //绑定事件层
    var $layer = $('.layer');
    //滑块长度
    var maskWidth = $mask.width();
    //进度条长度
    var progressWidth = $('.progress').width();
    //滑块移动的范围
    var minLeft = 0;
    var maxLeft = progressWidth - maskWidth;

    //点击播放
    $('.play-pause').click(function () {
        var $img = $(this).children();
        var isPlay = $img.attr('name');
        if (isPlay == 0) {
            var $src = $('#audio').attr('src');
            if ($src == undefined)
                $('#audio').attr('src', song.url);
            $('#audio')[0].play();
            //实时播放的时添加滑块动画
            $('.mask').addClass('flash');
            //写真动画
            $('.photo').addClass('light');
            $('.photo>img').addClass('circleFlash');
            $img.attr('src', './icon/play1.png');
            $img.attr('name', '1');
            //改变音乐总时长
            $('.end-time').text(formatTime(duration));
        } else {
            $('#audio')[0].pause();
            $('.mask').removeClass('flash');
            $('.photo').removeClass('light');
            $('.photo>img').removeClass('circleFlash');
            $img.attr('src', './icon/play.png');
            $img.attr('name', '0');
        }
    })

    //获取播放总时长
    $('#audio')[0].oncanplay = function () {
        duration = this.duration;
    }

    function follow() {
        //可以播放的时候
        $('.photo').addClass('light');
        $('.photo>img').addClass('circleFlash');
        $('.play-pause>img').attr('src', './icon/play1.png');
        $('.play-pause>img').attr('name', '1');
        //改变音乐总时长
        $('.end-time').text(formatTime(duration));
    }


    $('#audio')[0].ontimeupdate = function () {
        currentTime = this.currentTime;

        if (currentTime > 0 && currentTime <= 1)
            follow();
        $('.active-time').text(formatTime(currentTime));

        //设置滑块实时变化
        var left = currentTime / duration * progressWidth;
        left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;
        //设置滑块的left
        $('.mask').css({
            left,
        })

        //设置激活条的宽度
        var wid = currentTime / duration * progressWidth;
        wid = wid >= progressWidth ? progressWidth : wid <= 0 ? 0 : wid;
        $('.active-progress').css({
            width: wid,
        })


        //时间结束时归0
        if (duration - currentTime < 1) {
            //记录播放的歌曲id
            lastId = Number($('#audio').attr('data-id'));

            //按照模式自动播放歌曲
            let id = $('.mode').attr('data-id');
            followMode(id);
        }
        //实时匹配歌词移动
        moveLrc(currentTime);
    }

    //模式函数
    function followMode(num) {
        //顺序播放
        if (num == 1 || num == 4) {
            var songId = Number($('#audio').attr('data-id'));

            let nextId = songId + 1;

            //划分顺序还是列表循环
            if (nextId > songData.length - 1) {
                if (num == 1) {
                    endingPlay();
                    return;
                } else
                    nextId = 0;
            }
            //加载歌曲src
            $('#audio').attr('src', songData[nextId].url);
            //标记序号
            $('#audio').attr('data-id', nextId);
            //加载写真
            $('.photo>img').attr('src', songData[nextId].img);
            //加载歌词
            dealLrc(songData[nextId].lrc);
            $('#audio')[0].play();
        }
        //随机播放
        else if (num == 2) {
            //产生随机下标
            let randomN = Math.floor(Math.random() * songData.length);
            //加载歌曲src
            $('#audio').attr('src', songData[randomN].url);
            //标记序号
            $('#audio').attr('data-id', randomN);
            //加载写真
            $('.photo>img').attr('src', songData[randomN].img);
            //加载歌词
            dealLrc(songData[randomN].lrc);
            $('#audio')[0].play();
        }
        //单曲循环
        else {
            let songId = Number($('#audio').attr('data-id'));
            //加载歌曲src
            $('#audio').attr('src', songData[songId].url);
            //标记序号
            $('#audio').attr('data-id', songId);
            //加载写真
            $('.photo>img').attr('src', songData[songId].img);
            //加载歌词
            dealLrc(songData[songId].lrc);
            $('#audio')[0].play();
        }
    }

    //下一首
    $('.nextone').click(function () {
        //记录播放的歌曲id
        lastId = Number($('#audio').attr('data-id'));

        //按照模式播放歌曲
        let id = $('.mode').attr('data-id');
        followMode(id);
    })

    //上一首  
    $('.preone').click(function () {
        if(lastId == null)
            return;
        //加载歌曲src
        $('#audio').attr('src', songData[lastId].url);
        //标记序号
        $('#audio').attr('data-id', lastId);
        //加载写真
        $('.photo>img').attr('src', songData[lastId].img);
        //加载歌词
        dealLrc(songData[lastId].lrc);
        $('#audio')[0].play();
    })

    //顺序播放结束的时候
    function endingPlay() {
        //加载歌曲src
        $('#audio').attr('src', songData[0].url);
        //标记序号
        $('#audio').attr('data-id', 0);
        //加载写真
        $('.photo>img').attr('src', songData[0].img);
        //加载歌词
        dealLrc(songData[0].lrc);

        $('.active-time').text('00:00');
        $('.end-time').text('00:00');
        $('.mask').css({
            left: '0rem',
        })
        $('.mask').removeClass('flash');
        $('.active-progress').css({
            width: '0rem',
        })
        $('.photo').removeClass('light');
        $('.photo>img').removeClass('circleFlash');
        $('.play-pause>img').attr('src', './icon/play.png');
        $('.play-pause>img').attr('name', '0');
    }


    //
    //进度条
    //
    function move(e) {
        //获取触碰屏幕的x坐标
        var x = e.targetTouches[0].pageX;
        //获取进度条到最左边的距离
        var offsetLeft = $(this).offset().left;
        //计算触碰点到进度条最左边的距离
        var left = x - offsetLeft - maskWidth / 2;
        //判断left的合理性
        left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;
        //设置滑块的left
        $('.mask').css({
            left,
        })
        //设置激活进度条的width
        var wid = x - offsetLeft;
        wid = wid >= progressWidth ? progressWidth : wid <= 0 ? 0 : wid;
        $('.active-progress').css({
            width: wid,
        })

        //改变音乐播放的进度
        $('#audio')[0].currentTime = wid / progressWidth * duration;
    }

    //点击进度条改变进度
    $layer.on('touchstart', function (e) {
        $('#lrc>p').data('isOut', false);
        move.call(this, e);
    })

    //拖动进度条改变进度
    $layer.on('touchmove', function (e) {
        $('#lrc>p').data('isOut', false);
        move.call(this, e);
    })

    //触摸模式
    var modeCount = 1;
    $('.mode ').on('touchstart', function () {
        modeCount++;

        //顺序播放
        if (modeCount == 1) {
            $(this).children('img').attr('src', './icon/order.png');
            $(this).attr('data-id', 1);
        }
        //随机播放
        else if (modeCount == 2) {
            $(this).children('img').attr('src', './icon/random.png');
            $(this).attr('data-id', 2);
        }
        //单曲循环
        else if (modeCount == 3) {
            $(this).children('img').attr('src', './icon/SingleCycle.png');
            $(this).attr('data-id', 3);
        }
        //列表循环
        else if (modeCount == 4) {
            modeCount = 0;
            $(this).children('img').attr('src', './icon/ListLoop.png');
            $(this).attr('data-id', 4);
        }
    })


    //点击打开歌曲列表
    $('.list').on('touchstart', function () {
        $('.songLists').show();
    })

    //点击关闭歌曲列表
    $('.lis-icon').on('touchstart', function () {
        $('.songLists').hide();
    })

    //歌词处理并加载到界面
    function dealLrc(data) {
        //创建歌词
        var data = data.replace(/\s/g, '');
        var data = data.split('[').slice(1);
        var $frag = $(document.createDocumentFragment());
        var $5p = $('<p></p><p></p><p></p><p></p><p></p><p></p>');
        for (let i = 0; i < data.length; i++) {
            var minute = Number(data[i].split(']')[0].split(':')[0]);
            var second = Number(Number(data[i].split(']')[0].split(':')[1]).toFixed(1));
            var text = data[i].split(']')[1];
            var time = minute * 60 + second;

            //创建歌词p标签
            var $p = $('<p></p>');
            $p.html(text);
            $p.data('time', time);
            $p.data('isOut', false);
            $frag.append($p);
        }
        //重置歌词盒子的top值
        $('#lrc').css({
            top: 0 + 'px',
        });
        //清空歌词内容重新加载
        $('#lrc').empty().append($5p).append($frag);
    }


    //移动歌词代码
    function moveLrc(curTime) {
        if (curTime >= 0.5) {
            let min = curTime - 0.5;
            let max = curTime + 0.5;
            let ps = $('#lrc>p');
            let nowTop = parseFloat($('#lrc').css('top'));
            // console.log(nowTop);
            for (let i = 5; i < ps.length; i++) {
                let pTime = ps.eq(i).data('time');
                if (pTime >= min && pTime <= max) {
                    if (!ps.eq(i).data('isOut')) {
                        if ($('.active-p'))
                            $('.active-p').removeClass();
                        ps.eq(i).addClass('active-p').data('isOut', 'true');;
                        $('#lrc').animate({
                            top: -30 * (i - 5) + 'px',
                        }, 500);
                        break;
                    }

                }
            }
        }

    }

    //加载歌曲列表
    function loadSongs(data) {
        let frag = $(document.createDocumentFragment());
        for (let i = 0, len = data.length; i < len; i++) {
            let li = $('<li></li>');
            let str = `<div class="discribe fl">
                <img src="${data[i].img}" class="auto-img">
            </div>
            <div class="songTitle fl">
                <span class="song-name fl">${data[i].title}</span>
                <span class="songer fl">${data[i].singer}</span>
            </div>
            <div class="rhythm fr">
                <div class="collect" data-heart="white">
                    <img src="./icon/heart_blank.png" class="auto-img">
                </div>
                <div class="line-box">
                    <i class="line l1"></i>
                    <i class="line l2"></i>
                    <i class="line l3"></i>
                    <i class="line l4"></i>
                    <i class="line l5"></i>
                </div>
            </div>`;
            li.data('url', data[i].url);
            li.data('lrc', data[i].lrc);
            li.data('img', data[i].img);
            li.data('id', i);
            li.html(str);
            frag.append(li);
        }
        $('.songs>ul').append(frag);
    }


    //初始化界面
    function initPlay() {

        let songActive = songData[0];

        //加载歌曲src
        $('#audio').attr('src', songActive.url);
        //标记序号
        $('#audio').attr('data-id', 0);
        //加载写真
        $('.photo>img').attr('src', songActive.img);
        //加载歌词
        dealLrc(songActive.lrc);
        //加载歌曲列表
        loadSongs(songData);

        //歌曲列表绑定播放事件
        $('.songs>ul').on('touchstart', 'li', function () {
            let url = $(this).data('url');
            let lrc = $(this).data('lrc');
            let img = $(this).data('img');
            let id = $(this).data('id');
            //加载歌曲src
            $('#audio').attr('src', url);
            //加载写真
            $('.photo>img').attr('src', img);
            //加载歌词
            dealLrc(lrc);
            $('#audio')[0].play();
        })

        //点击红心事件
        $('.collect').on('touchstart',function(){
            let heart = $(this).attr('data-heart');
            if(heart == 'white'){
                $(this).children('img').attr('src','./icon/heart_red.png');
                $(this).attr('data-heart','red');
            }
            else{
                $(this).children('img').attr('src','./icon/heart_blank.png');
                $(this).attr('data-heart','white');
            }
        })
    }
    initPlay();
})