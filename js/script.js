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

(function (global) {
    var dc = {};
    var homeHTML = "snippets/home-snippet.html";
    var insertHTML = function (selector, html) {
        var targetElement = document.querySelector(selector);
        targetElement.innerHTML = html;
    };
    var showLoading = function (selector) {
        var html = "<div class = 'text-center'>";
        html += "<img src='ajax-loader.gif'></div>";
        insertHTML(selector,html);
    };
    document.addEventListener("DOMContentLoaded", function (event) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(homeHTML, function (responseText) {
            document.querySelector("#main-content").innerHTML = responseText;
        }, false);
    });
    global.$dc = dc;
})(window);