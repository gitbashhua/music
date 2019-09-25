$(function () {

    //获取音频标签
    var audio = $('#audio')[0];

    audio.oncanplay = function () {
        console.log('a');
        this.play();
        $animate.find('.line').css({
            animationPlayState: 'running'
        })

        var $liActive = $('li.active');
        $liActive.attr('name', 1);

        //设置歌曲当前播放时间和歌曲总时间
        $('.dtime').text(dealSongTime(this.duration * 1000));

        var $spans = $('.sing>span');
        $spans.eq(0).text($liActive.find('.st').text());
        $spans.eq(1).text($liActive.find('.sn').text());


        //歌手图片
        $('.singer-img').find('img').attr('src', $liActive.data('img'));

    }

    //监听音频试试变化
    audio.ontimeupdate = function () {
        $('.ctime').text(dealSongTime(this.currentTime * 1000));
    }

    var songsId = [];

    // 歌曲详情
    var songsDetail = [];

    var d = localStorage.songs;
    if (d) {
        d = JSON.parse(d);
        songsDetail = d.playlist.tracks.concat();

        //保存歌曲id
        for (var i = 0; i < d.privileges.length; i++) {
            songsId.push(d.privileges[i].id);
        }

        $('.local-song').text(songsId.length);

    } else {
        //获取歌单
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:3000/top/list?idx=1',
            success: function (data) {
                console.log('data ==> ', data);

                localStorage.setItem('songs', JSON.stringify(data))

                songsDetail = data.playlist.tracks.concat();

                //保存歌曲id
                for (var i = 0; i < data.privileges.length; i++) {
                    songsId.push(data.privileges[i].id);
                }

                $('.local-song').text(songsId.length);

            }
        })
    }

    //处理歌曲时间
    function dealSongTime(time) {
        var second = Math.floor(time / 1000 % 60);
        second = second >= 10 ? second : '0' + second;
        var minute = Math.floor(time / 1000 / 60);
        minute = minute >= 10 ? minute : '0' + minute;

        return minute + ':' + second;

    }
   

    //保存用户浏览器的歌曲id
    var previewIds = [];
    var startsIndex = 0;
    var endIndex = 15;

    $('#all-list>li').on('click', function () {
        $('.list,.nav').hide();
        $('.read-list').show();

        console.log(songsId);

        if (previewIds.length == 0) {
            previewIds = previewIds.concat(songsId.slice(startsIndex, endIndex));
            startsIndex = endIndex;
            endIndex += endIndex;
        }


        for (var i = 0; i < previewIds.length; i++) {
           
            var $li = $(`<li data-id="${songsDetail[i].id}" name="0" data-img="${songsDetail[i].al.picUrl}">
                                <div class="sg fl">
                                    <img class="auto-img" src="${songsDetail[i].al.picUrl}" />
                                </div>
                                <div class="fl info">
                                    <div class="st one-text">${songsDetail[i].name}</div>
                                    
                                </div>
                                <div class="s-time fr clearfix">
                                   <div class="dt fl">${dealSongTime(songsDetail[i].dt)}</div>
                                   <div class="animate fl">
                                        <span class="line fl line1"></span>
                                        <span class="line fl line2"></span>
                                        <span class="line fl line1"></span>
                                        <span class="line fl line2"></span>
                                   </div>
                                </div>
                            </li>`);

            var sg = [];
            for (var j = 0; j < songsDetail[i].ar.length; j++) {
                sg.push(songsDetail[i].ar[j].name);
            }
            var $singers = $(`<div class="sn one-text">${sg.join(' / ')}</div>`);

            $li.find('.info').append($singers);

            $('#current-list').append($li);
        }

    })

    console.log('previewIds ==> ', previewIds);

    var $animate = null;
    $('#current-list').on('click', 'li', function () {

        if (!$(this).hasClass('active')) {
            var $liActive = $('li.active');
            if ($liActive.length > 0) {
                $liActive.removeClass('active');

                if ($liActive.attr('name', 1)) {
                    $liActive.find('.line').css({
                        animationPlayState: 'paused'
                    })
                }
            }
        }

        $animate = $(this).find('.animate');

        $(this).addClass('active');

        //获取歌曲的id
        var id = $(this).data('id');

        console.log('id ==> ', id);

        if (id == $(audio).attr('name')) {
            //播放同一首歌曲
            if ($(this).attr('name') == 0) {
                //播放
                $(this).attr('name', 1);
                audio.play();
                //播放动画
                $(this).find('.line').css({
                    animationPlayState: 'running'
                })
            } else {
                //停止
                $(this).attr('name', 0);
                audio.pause();
                //停止动画
                $(this).find('.line').css({
                    animationPlayState: 'paused'
                })
            }

        } else {
            $(audio).attr('name', id);

            //通过歌曲id获取音频
            audio.src = 'https://music.163.com/song/media/outer/url?id=' + id;
        }

        

    })


    $('.back').on('click', function () {
        $('.list,.nav').show();
        $('.read-list').hide();
    })

})