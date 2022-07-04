$(function () { // similar to DOMContentOverloaded in JS
    $("#navbarToggle").blur(function (event) { // similar to JS addEventListener
        var screenWidth = window.innerWidth;
        console.log(screenWidth);
        if(screenWidth < 768) {
            console.log(screenWidth);
            $("#collapsable-nav").collapse('hide');
        }
        
    });
});