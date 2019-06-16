
    // // 当鼠标放到精品案例界面的时候，如果不是再这个li上的其他的li变暗
    var boutiqueLiArr = document.querySelectorAll('.excellentDemo .demoImg ul li');
    var banBlack = document.querySelectorAll('.excellentDemo .demoImg ul li img');

    for(var i = 0; i < boutiqueLiArr.length;i++){
        boutiqueLiArr[i].index = i;
        boutiqueLiArr[i].onmouseenter = function () {
            for (var i = 0; i < boutiqueLiArr.length; i++) {
                // banBlack[i].style.opacity = 0.6;
                // banBlack[i].style.transform = "scale(1)"
                boutiqueLiArr[i].className="o";
            }
            boutiqueLiArr[this.index].className="s";
            // banBlack[this.index].style.opacity = 1;
            // banBlack[this.index].style.transform = "scale(1.3)"
        }
    }

    for(var i = 0; i < boutiqueLiArr.length;i++){
        boutiqueLiArr[i].index = i;
        boutiqueLiArr[i].onmouseleave = function () {
            for (var i = 0; i < boutiqueLiArr.length; i++) {
                boutiqueLiArr[i].className="";
                // banBlack[i].style.opacity = 1;
                // banBlack[i].style.transform = "scale(1)"
            }
        }
    }   

    