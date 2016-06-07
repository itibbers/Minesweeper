$(document).ready(function() {
    $('input[name=x]').val(10);
    $('input[name=y]').val(10);
    $('input[name=n]').val(10);
    $('a[name=start]').click(function() {
        var x = parseInt($('input[name=x]').val());
        var y = parseInt($('input[name=y]').val());
        var n = parseInt($('input[name=n]').val());
        if (x > 20 || y > 20) {
            alert('小伙子，你确定这么大雷区？\n\n不是我说你，你电脑会炸 -。，- 凸');
            return;
        }
        if (Config.ends > 0) {
            $('a[name=start]').text('EveryBody一起hi');
        }
        var game = new Mine(x, y, n);
        game.start();
    });
});

function Mine(x, y, n) {
    this.x = x ? x : 10;
    this.y = y ? y : 10;
    this.n = n ? n : 10;
    this.m = new Array();
    this.flag = [];
    _this = this;
    this.start = function() {
        this.log('start()');
        $('#container').html('');
        this.generate();
        $('.box').click(function() {
            var x = $(this).attr('x'),
                y = $(this).attr('y');
            if (_this.m[x][y] == -1 && Config.first) {
                alert('你的运气被狗吃了啊\n\n好吧，看你这么可怜，送你一次机会 ლ(•̀ _ •́ ლ)');
                $('a[name=start]').click();
                return;
            }
            Config.first = false;
            _this.check(x, y, $(this));
        });
    }
    this.generate = function() {
        this.log('generate()');
        // generate box and init this.m, this.flag
        for (var i = 0; i < this.x; i++) {
            this.m[i] = new Array();
            this.flag[i] = new Array();
            for (var j = 0; j < this.y; j++) {
                this.m[i][j] = 0;
                this.flag[i][j] = 0;
                var box = "<div class='box' x='" + i + "' y='" + j + "'><div>";
                $('#container').append(box);
            }
            $('#container').append("<br>");
        }
        // generate mine
        for (var i = 0; i < this.n; i++) {
            var px = Math.floor(Math.random() * this.x);
            var py = Math.floor(Math.random() * this.y);
            if (this.m[px][py] == 0) {
                this.m[px][py] = -1;
                if (Config.mineVisible) {
                    $('.box[x=' + px + '][y=' + py + ']').css({ 'background': 'green', 'color': '#fff' });
                }
            } else {
                i--;
            }
        }
        // count
        for (var i = 0; i < this.x; i++) {
            for (var j = 0; j < this.y; j++) {
                if (this.m[i][j] < 0) {
                    (i - 1 >= 0) && (j - 1 >= 0) && (this.m[i - 1][j - 1] >= 0) ? this.m[i - 1][j - 1]++: 0;
                    (j - 1 >= 0) && (this.m[i][j - 1] >= 0) ? this.m[i][j - 1]++: 0;
                    (i + 1 < this.x) && (j - 1 >= 0) && (this.m[i + 1][j - 1] >= 0) ? this.m[i + 1][j - 1]++: 0;

                    (i - 1 >= 0) && (this.m[i - 1][j] >= 0) ? this.m[i - 1][j]++: 0;
                    (i + 1 < this.x) && (this.m[i + 1][j] >= 0) ? this.m[i + 1][j]++: 0;

                    (i - 1 >= 0) && (j + 1 < this.y) && (this.m[i - 1][j + 1] >= 0) ? this.m[i - 1][j + 1]++: 0;
                    (j + 1 < this.y) && (this.m[i][j + 1] >= 0) ? this.m[i][j + 1]++: 0;
                    (i + 1 < this.x) && (j + 1 < this.y) && (this.m[i + 1][j + 1] >= 0) ? this.m[i + 1][j + 1]++: 0;
                }
            }
        }
    }
    this.end = function() {
        this.log('end()');
        for (var i = 0; i < this.x; i++) {
            for (var j = 0; j < this.y; j++) {
                if (this.m[i][j] > 0) {
                    $('.box[x=' + i + '][y=' + j + ']').text(this.m[i][j]);
                    $('.box[x=' + i + '][y=' + j + ']').css({ 'background': '#ddd' });
                } else if (this.m[i][j] == 0) {
                    $('.box[x=' + i + '][y=' + j + ']').css({ 'background': '#ddd' });
                } else if (this.m[i][j] == -1) {
                    $('.box[x=' + i + '][y=' + j + ']').text('X');
                    $('.box[x=' + i + '][y=' + j + ']').css({ 'background': '#f64', 'color': '#fff' });
                }
            }
        }
        alert(Config.end[Config.ends < Config.end.length ? Config.ends : Config.end.length - 1]);
        Config.ends++;
        return;
    }
    this.check = function(x, y, d) {
        if (this.isMine(x, y)) {
            this.end();
        } else {
            if (this.m[x][y] != 0) {
                this.flag[x][y] = 1;
                d.css({ 'background': '#ddd' });
                d.text(this.m[x][y]);
            } else {
                this.expand(x, y);
            }
        }
        this.win();
    }
    this.isMine = function(x, y) {
        this.log(x + ' ' + y);
        if (this.m[x][y] < 0) {
            return true;
        }
        return false;
    }
    this.expand = function(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        var xMin = (x - 1 >= 0) ? x - 1 : x;
        var xMax = (x + 1 < this.x) ? x + 1 : x;
        var yMin = (y - 1 >= 0) ? y - 1 : y;
        var yMax = (y + 1 < this.y) ? y + 1 : y;
        this.log('expand:' + x + ' ' + y);
        d = $('.box[x=' + x + '][y=' + y + ']');
        d.css({ 'background': '#ddd' });
        this.flag[x][y] = 1;
        if (this.m[x][y] > 0) {
            d.text(this.m[x][y]);
            return;
        }
        for (var i = xMin; i <= xMax; i++) {
            for (var j = yMin; j <= yMax; j++) {
                if (this.flag[i][j] == 0 && this.m[i][j] >= 0) {
                    this.expand(i, j);
                }
            }
        }
    }
    this.win = function() {
        this.log('win()');
        var count = 0;
        for (var i = 0; i < this.x; i++) {
            for (var j = 0; j < this.y; j++) {
                if (this.flag[i][j] == 0) {
                    count++;
                }
            }
        }
        this.log('count:' + count + '  n:' + this.n);
        // console.log(this.m);
        // console.log(this.flag);
        if (count == this.n) {
            alert("You Win!");
        }
    }
    this.log = function(e) {
        var log = false;
        if (log) {
            var h = $('#log').html();
            h += "<p>" + e + "</p>";
            $('#log').html(h);
            $('#log').scrollTop($('#log')[0].scrollHeight);
        }
    }
}
var Config = {
    'first': true,
    'ends': 0,
    'end': [
        'GAME OVER',
        'haha the end 你行不行',
        'e......(手动斜眼)',
        'vegetables(菜) & chicken(鸡) !',
        '我走了，你自己玩吧',
        '还是你走吧\n这个游戏不适合你 Out!!errrrr',
        'Warning! Your PC will be shutdown!\nDon\'t play the Game!!',
        'Warning AGAIN! Your PC WILL BE ShutDDDown!\nDon\'T Play the GAME!! Boy!!',
        'OK..',
        'OK OK...',
        'You Win.',
        '好吧，你赢了',
    ],
    'mineVisible': false,
    'zhaohuan': 0,
    'shenlong': false,
}
$(document).ready(function() {
    $('#zhaohuan').click(function() {
        Config.zhaohuan++;
        if (Config.zhaohuan == 3) {
            alert('乖！真听话。\n好了，认真点，你再点三次试试吧 ヾ(≧▽≦*)o');
        } else if (Config.zhaohuan == 6) {
            alert('快看！Σ(っ °Д °;)っ');
            $('#shenlong').fadeIn();
        } else if (Config.zhaohuan > 6 && Config.zhaohuan <= 10) {
            alert('点多了不会隐藏的━━∑(￣□￣*|||━━骚年');
        } else if (Config.zhaohuan > 10) {
            alert('好吧，被你发现了 ＝ ＝ 其实可以隐藏');
            $('#shenlong').fadeToggle();
        }
    });
    $('input[type=checkbox]').click(function() {
        if (Config.shenlong == false) {
            Config.shenlong = true;
        } else {
            Config.shenlong = false;
        }
        if (Config.shenlong) {
            var x = parseInt($('input[name=x]').val());
            var y = parseInt($('input[name=y]').val());
            var n = parseInt($('input[name=n]').val());
            for (var i = 0; i < x; i++) {
                for (var j = 0; j < y; j++) {
                    var px = Math.floor(Math.random() * $(document).width() / 40);
                    var py = Math.floor(Math.random() * $(document).height() / 40);
                    $('.box[x=' + i + '][y=' + j + ']').css({ 'position': 'absolute', 'left': px * 40, 'top': py * 40 });
                }
            }
        }
    });
});
