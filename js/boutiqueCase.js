    var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]; //定义一个数组，说明分页一共有那些页面
    var fenyeFrontFourLis = $('.boutiqueCase .fenye .ye ul li:nth-child(-n + 4)');//分页中前四个li
    var fenyeLastLi = $('.boutiqueCase .fenye .ye ul li:last-child');//分页中最后一个li
    var beforeYe = $('.boutiqueCase .fenye .ye .before');//上一页的按钮
    var afterYe = $('.boutiqueCase .fenye .ye .after');//下一页的按钮
    var ipt = $('.boutiqueCase .fenye .ye .tiaozhuang input');
    //获取分页的上数字的方法
    function getFenyeNum(){
        for(var i=0;i<fenyeFrontFourLis.length + 1;i++){
        if(i<fenyeFrontFourLis.length){
            fenyeFrontFourLis[i].innerText = arr[i];
        }else{
            fenyeLastLi[0].innerText = arr.length;
        }
      }
    }
    getFenyeNum();
    //点击下一页按钮时触发此事件
    afterYe.click(function(){
        var firstNum = arr.shift();
        arr.push(firstNum);
        getFenyeNum();
    }); 
    //点击上一页按钮时触发此事件
    beforeYe.click(function(){
        if(arr[0] == 1){
            alert("前面没有更多的页面了");
            return;
        }
        var lastNum = arr.pop();
        arr.unshift(lastNum);
        getFenyeNum();
    });
    //点击数字按钮15时触发此事件
    fenyeLastLi.click(function(){
        var lastNum = arr.pop();
        arr.unshift(lastNum);
        getFenyeNum();
    })
    //点击其他的数字按钮时触发此事件
    for(var i=0;i<fenyeFrontFourLis.length;i++){
        $(fenyeFrontFourLis[i]).bind("click",{index:i},clickHandler)
    }
    function clickHandler(i){
        // console.log(i.data.index)
        var index = i.data.index;
       for(var i=0; i< index; i++){
        var firstNum = arr.shift();
        arr.push(firstNum);
        getFenyeNum();
       }
    }

    //页面跳转到第几页的功能
    $(document).keydown(function (event) {
        if(event.keyCode == 13){
            var index = arr.findIndex(function(item){
                if(item == ipt.val()){
                    return true;
                }
        })
        for(var i=0; i< index; i++){
        var firstNum = arr.shift();
        arr.push(firstNum);
        getFenyeNum();
       } 
        }else{
            return;
        }
    });

    var boutiqueCaseDomeLiArr = $('.boutiqueCase .jufengDemo .demos ul li');
    for(var i=0;i<boutiqueCaseDomeLiArr.length; i++){
        boutiqueCaseDomeLiArr.eq(i).click(function(){
            for(var i=0;i<boutiqueCaseDomeLiArr.length; i++){
                boutiqueCaseDomeLiArr.eq(i).removeClass('active');
            }
            $(this).addClass('active');
        })

        boutiqueCaseDomeLiArr.eq(i).mouseenter(function(){
            for(var i=0;i<boutiqueCaseDomeLiArr.length; i++){
                boutiqueCaseDomeLiArr.eq(i).removeClass('active');
            }
            $(this).addClass('active');
        })
    }