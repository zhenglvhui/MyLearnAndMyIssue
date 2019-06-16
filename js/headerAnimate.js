
    //设置顶部导航的样式变化
    var navLiArr = $('.header .nav ul li'); //导航栏中所有的li标签
    var huakuaiW = $('.header .nav .huakuai');//获取滑块
    for (var i = 0; i < navLiArr.length; i++) {
        navLiArr[i].index = i;
        navLiArr[i].onmouseenter = function () {
            var w = $(navLiArr[this.index]).css('width'); //滑块移动时，根据不同li改变滑块的长度
            var left = 0; //这里是为了获取到滑块要移动的距离
            huakuaiW.css('width', w);
            for (var i = 0; i < this.index; i++) {
                left += parseInt($(navLiArr[i]).css('width'));
                left += parseInt($(navLiArr[i]).css('marginRight'));
            }
            animate(huakuaiW.get(0), { left: left });
            // huakuaiW.css('width',)
            for (var i = 0; i < navLiArr.length; i++) {
                navLiArr[i].className = "";
            }

            navLiArr[this.index].className = "fontactive";
        }
    }

    for (var i = 0; i < navLiArr.length; i++) {
        navLiArr[i].index = i;
        navLiArr[i].onclick = function () {
            if (this.index == 1) {
                window.location.href = "../html/buildWeb.html";
            } else if (this.index == 0) {
                window.location.href = "../index.html"
            } else if (this.index == 2) {
                window.location.href = "../html/productService.html"
            } else if(this.index == 3){
                window.location.href = "../html/boutiqueCase.html"
            } else if(this.index == 4){
                window.location.href = "../html/aboutUs.html"
            }
        }
    }
