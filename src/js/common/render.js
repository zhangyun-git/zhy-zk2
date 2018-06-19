define(['jquery','handlebars'],function($,handlebars){
    function render(source,target,data){
        // 1、引入handlebars模板
        var tpl = $(source).html();
        // 2、预编译模板
        var template = handlebars.compile(tpl);
        // 3、传入数据
        var html = template(data);
        // 4、渲染数据
        $(target).html(html);
    }
    return render;
})