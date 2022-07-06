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
    var allCategoriesURL = "http://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHTML = "snippets/categories-title-snippet.html";
    var categoryHTML = "snippets/category-snippet.html";
    var menuItemsURL = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHTML = "snippets/menu-items-title.html";
    var menuItemHTML = "snippets/menu-item.html";
    var insertHTML = function (selector, html) {
        var targetElement = document.querySelector(selector);
        targetElement.innerHTML = html;
    };
    var showLoading = function (selector) {
        var html = "<div class = 'text-center'>";
        html += "<img src='ajax-loader.gif'></div>";
        insertHTML(selector,html);
    };
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace,"g"), propValue);
        return string;
    }
    var switchMenuToActive = function() {
        var classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active","g"), "");
        document.querySelector("#navHomeButton").className = classes;
        classes = document.querySelector("#navMenuButton").className;
        if(classes.indexOf("active")==-1) {
            classes += " active";
            document.querySelector("#navMenuButton").className = classes;
        }
    };
    document.addEventListener("DOMContentLoaded", function (event) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(homeHTML, function (responseText) {
            document.querySelector("#main-content").innerHTML = responseText;
        }, false);
    });
    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesURL, buildAndShowCategoriesHTML);
    }
    dc.loadMenuItems = function (categoryShort) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(menuItemsURL + categoryShort, buildAndShowMenuItemsHTML);
    }
    function buildAndShowCategoriesHTML (categories) {
        $ajaxUtils.sendGetRequest(categoriesTitleHTML, function (categoriesTitleHTML) {
            $ajaxUtils.sendGetRequest(categoryHTML, function (categoryHTML) {
                switchMenuToActive();
                var categoryViewHTML = buildCategoriesViewHTML(categories, categoriesTitleHTML, categoryHTML);
                //console.log(categoryViewHTML);
                insertHTML("#main-content", categoryViewHTML);
            }, false);
        }, false);
    }
    function buildCategoriesViewHTML (categories, categoriesTitleHTML, categoryHTML) {
        var finalHTML = categoriesTitleHTML;
        finalHTML += "<section class='row'>";
        for(var i=0; i < categories.length; i++) {
            var html = categoryHTML;
            var name = "" + categories[i].name;
            //console.log(name);
            var short_name = categories[i].short_name;
            //console.log(short_name);
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHTML += html;
            //console.log(finalHTML);
        }
        finalHTML += "</section>";
        return finalHTML;
        
    }
    function buildAndShowMenuItemsHTML (categoryMenuItems) {
        $ajaxUtils.sendGetRequest(menuItemsTitleHTML, function (menuItemsTitleHTML) {
            $ajaxUtils.sendGetRequest(menuItemHTML, function (menuItemHTML) {
                switchMenuToActive();
                var menuViewHTML = buildMenuViewHTML(categoryMenuItems, menuItemsTitleHTML, menuItemHTML);
                insertHTML("#main-content", menuViewHTML); 
            }, false);
        }, false);
    }
    function buildMenuViewHTML (categoryMenuItems, menuItemsTitleHTML, menuItemHTML) {
        menuItemsTitleHTML = insertProperty(menuItemsTitleHTML, "name", categoryMenuItems.category.name);
        menuItemsTitleHTML = insertProperty(menuItemsTitleHTML, "special_instructions", categoryMenuItems.category.special_instructions);
        var finalHTML = menuItemsTitleHTML;
        finalHTML += "<section class = 'row'>";
        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for(var i=0; i < menuItems.length; i++) {
            var html = menuItemHTML;
            html = insertProperty(html, "short_name", menuItems[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertItemPrice(html, "price_small",menuItems[i].price_small);
            html = insertPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
            html = insertItemPrice(html, "price_large", menuItems[i].price_large);
            html = insertPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
            html = insertProperty(html, "name", menuItems[i].name);
            html = insertProperty(html, "description", menuItems[i].description);
            if(i % 2 != 0) {
                html += "<div class='clearfix visible-md-block visible-lg-block'></div>";
            }
            finalHTML += html;
        }
        finalHTML += "</section>";
        return finalHTML;
    }
    function insertItemPrice(html, pricePropName, priceValue) {
        if(!priceValue) {
            return insertProperty(html, pricePropName, "");
        }
        priceValue = "$" + priceValue.toFixed(2);
        //console.log(priceValue);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }
    function insertPortionName (html, portionPropName, portionValue) {
        if(!portionValue) {
            return insertProperty(html, portionPropName, "");
        }
        portionValue = "(" + portionValue + ")";
        console.log(portionValue);
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }
    global.$dc = dc;
})(window);