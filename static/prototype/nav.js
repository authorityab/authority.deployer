
$.fn.navigation = function (options) {

    var settings = $.extend({
        // These are the defaults.
        zStart : 1000,
        var2 : 2,
        currentView : "",
        pages : "",
        init : 2
    }, options);

    $("#content_area").load("dash.html");

    var $currentView = settings.currentView;
    var $currentListIndex = 0 ;
    var $currentPageIndex = settings.init;
    var $pages = settings.pages;



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
            pageNav(1);
        }
        if(e.keyCode==97){
            // a, left
            console.log("left");
            pageNav(-1);
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


    function pageNav(dir) {

        console.log("PL:" , $pages.length);

        console.log("CP:" , $currentPageIndex );

        var nextPageIndex = $currentPageIndex + dir;

        if (nextPageIndex > 0 && nextPageIndex < $pages.length){


        var page = $pages[nextPageIndex];

            $currentPageIndex = nextPageIndex;

        if (page !== "") {



          $( "#content_area>section" ).fadeOut( "slow", function() {
                $("#content_area").load(page , function(){
                    $( "#content_area" ).fadeIn( 200);
                });
              });
        }


        }
    }


    function listNav(dir){
        if($currentListIndex>=0){
            $currentListIndex = $currentListIndex + dir;
            if($currentListIndex<0){$currentListIndex=0;}
            var _item = $currentView + " nav > ul >li";
            $(_item).each(function(){
                $(this).removeClass("current");
            });
            var _newThis = $(_item+":eq("+$currentListIndex+")");
            _newThis.addClass('current');
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