
$.fn.navigation = function (options) {

    var settings = $.extend({
        // These are the defaults.
        zStart : 1000,
        var2 : 2
    }, options);


    //TODO:populate this in some way

    var $currentView = "#projects_view";
    var $currentListIndex = 0 ;




    //  alert(options.zStart);


    $('body').bind('keypress', function(e) {
        //console.log(e.keyCode);
        if(e.keyCode==119){
            //w, up
            console.log("upp");
            listNav(-1);
        }
        if(e.keyCode==115){
            //s, down
            console.log("down");
            listNav(1);

        }
        if(e.keyCode==100){
            // d, right
            console.log("right");
        }
        if(e.keyCode==97){
            // a, left
            console.log("left");
        }
        if(e.keyCode==32){
            // space, action
            console.log("boom");
        }
    });



    $(".project-list>li").on("click",function(){

        $(this).parent().find("li").each(function(){
            $(this).removeClass("current");

        });

        console.log($(this));
        $(this).addClass("current");

    });






    function listNav(dir){
        if($currentListIndex>=0){
            $currentListIndex = $currentListIndex + dir;
            if($currentListIndex<0){$currentListIndex=0;}


            var _item =     $currentView + " nav > ul >li";
            $(_item).each(function(){
                $(this).removeClass("current");

            });

            $(_item+":eq("+$currentListIndex+")").addClass('current');



        }


    }



};






/*
 *
 *
 * Input from a json file
 * generate the pages on the fly
 * if a list generate a nav
 * if last instatnce generate an article
 * Look up web-components
 * look up using html-templates with jQuery
 *
 * on demo use arrows as input
 *
 *
 * */