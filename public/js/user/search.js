$(document).ready(function() {
    var search = function(keyword) {
        $.ajax({
            url : '/search/get_category',
            method : 'post',
            data : {
                keyword : keyword
            },
            success : function(data) {
                toastr['success']('Successfully got categories from server.');
                var search_html = '';
                // for(var i = 0 ; i < data.categories.length ; i ++) {
                //     search_html = search_html + '<a class="btn btn-default btn-lg" href="/post/list?category='+data.categories[i]._id+'">'+data.categories[i].name+'</a>';
                // }
                // if(data.categories.length == 0) {
                //     search_html = '<h4>No matching category.</h4>';
                // }
                // $('#div_categories').html(search_html);
                paginate(data.categories);
            },
            error : function() {
                toastr['error']('Happening any errors in search.');
            }
        });
    }

    var paginate = function (categories){
        if(categories.length == 0) {
            console.log('0000000000000')
            $('#paginater').bootpag({
                paginationClass: 'pagination pagination-sm',
                next: '<i class="fa fa-angle-right"></i>',
                prev: '<i class="fa fa-angle-left"></i>',
                total: 0,
                page: 0,
                maxVisible: 6 
            }).on('page', function(event, num){
                console.log(num)
                
            });
            var search_html = '<h4>No matching category.</h4>';
            console.log(search_html)
            $("#div_categories").html(search_html); // or some ajax content loading...
        }else if(categories.length > 0 && categories.length < 100) {
            $('#paginater').bootpag({
                paginationClass: 'pagination pagination-sm',
                next: '<i class="fa fa-angle-right"></i>',
                prev: '<i class="fa fa-angle-left"></i>',
                total: 1,
                page: 1,
                maxVisible: 6 
            }).on('page', function(event, num){
                console.log(num)
                
            });
            var search_html = '';
            for(var i = 0 ; i < categories.length ; i ++) {
                search_html = search_html + '<a class="btn btn-default btn-lg" href="/post/list?category='+categories[i]._id+'">'+categories[i].name+'</a>';
            }
            $("#div_categories").html(search_html); // or some ajax content loading...
        } else {
            total = parseInt((categories.length+1)/100);
            sub = (categories.length+1)%100;
            if(sub > 0) {
                total = total + 1;
            }
            $('#paginater').bootpag({
                paginationClass: 'pagination pagination-sm',
                next: '<i class="fa fa-angle-right"></i>',
                prev: '<i class="fa fa-angle-left"></i>',
                total: parseInt(categories.length/100),
                page: 1,
                maxVisible: 6 
            }).on('page', function(event, num){
                console.log(num)
                if((categories.length - (num-1)*100) >= 100 )
                {
                    var search_html = '';
                    for(var i = (num-1)*100 ; i < 100*num ; i ++) {
                        search_html = search_html + '<a class="btn btn-default btn-lg" href="/post/list?category='+categories[i]._id+'">'+categories[i].name+'</a>';
                    }
                } else {
                    var search_html = '';
                    for(var i = (num-1)*100 ; i < categories.length ; i ++) {
                        search_html = search_html + '<a class="btn btn-default btn-lg" href="/post/list?category='+categories[i]._id+'">'+categories[i].name+'</a>';
                    }
                }
                
                $("#div_categories").html(search_html); // or some ajax content loading...
            });
            var search_html = '';
            for(var i = 0 ; i < 100 ; i ++) {
                search_html = search_html + '<a class="btn btn-default btn-lg" href="/post/list?category='+categories[i]._id+'">'+categories[i].name+'</a>';
            }
            $("#div_categories").html(search_html); // or some ajax content loading...
        }
    }

    $('#btn_search').click(function(){
        search($('#keyword').val());
    });

    $('#keyword').keydown(function(e) {
        if(e.which == 13) {
            search($(this).val());
        }
    });

    $.ajax({
        url : '/search/all',
        method : 'post',
        success : function(data) {
            console.log(data);
            paginate(data.categories);
        },
        error : function() {
            toastr['error']('Happening any errors in search all.');
        }
    })
    
    
});