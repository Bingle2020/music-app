$(function () {
    //以375px 100px设置页面rem
    var $w = $('body').width();

    var $fontSize = $w / 375 * 100;

    var $style = $('<style>html{font-size: ' + $fontSize + 'px;}</style>');

    $('head').append($style);
})