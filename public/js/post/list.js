$(document).ready(function() {
    $.ajax({
        url : '/post/selected_category',
        method : 'post',
        data : {
            cat_id : $('#cat_id').val()
        },
        success : function(data) {
            var posts = data.posts;
            var new_posts = [];
            var post_length = posts.length;
            for(var i = 0 ; i < post_length ; i ++)
            {
                var len = posts.length;
                var index = Math.floor(Math.random()*(len--));
                new_posts.push(posts.slice(index, index+1));
                posts.splice(index, 1);
            }
            paginate(new_posts);
        },
        error : function() {
            toastr['error']('Happening any errors in getting post.')
        }
    });

    var paginate = function (posts){
        if(posts.length == 0) {
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
            var search_html = '<h4>No matching post.</h4>';
            console.log(search_html)
            $("#div_posts").html(search_html); // or some ajax content loading...
        }else if(posts.length > 0 && posts.length < 5) {
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
            for(var i = 0 ; i < posts.length ; i ++) {
                var content = posts[i][0].content.slice(0, 100);
                
                var post = `<div class="row">
                                <div class="col-md-4 col-sm-4">
                                    <!-- BEGIN CAROUSEL -->            
                                    <div class="front-carousel">
                                        <div class="carousel slide" id="myCarousel${posts[i][0]._id}">
                                        <!-- Carousel items -->
                                            <div class="carousel-inner">
                                                <div class="item active">
                                                <img alt="" src="../../uploads/posts/${posts[i][0].image}" style="width:300px; height:150px;">
                                                </div>
                                            </div>
                                        </div>                
                                    </div>
                                    <!-- END CAROUSEL -->
                                </div>
                            <div class="col-md-8 col-sm-8">
                            <h2><img src="../../uploads/users/${posts[i][0].poster_id}.png" style="width:45px; height:45px;"> ${posts[i][0].poster}</h2>
                            <ul class="blog-info">
                                <li><i class="fa fa-calendar"></i> ${new Date(posts[i][0].created_at).getFullYear()}-${new Date(posts[i][0].created_at).getMonth()+1}-${new Date(posts[i][0].created_at).getDate()} ${new Date(posts[i][0].created_at).getHours()}:${new Date(posts[i][0].created_at).getMinutes()}:${new Date(posts[i][0].created_at).getSeconds()}</li>
                                <li><i class="fa fa-thumbs-up"></i> ${posts[i][0].shared}</li>
                                <li><i class="fa fa-tags"></i> ${posts[i][0].category}</li>
                            </ul>
                            <p><h4>${posts[i][0].title}</h4></p><br>
                            <a href="/post/view?post=${posts[i][0]._id}" class="more">Read more <i class="icon-angle-right"></i></a>
                            </div>
                        </div>
                        <hr class="blog-post-sep">`;
                search_html = search_html + post;
            }
            $("#div_posts").html(search_html); // or some ajax content loading...
        } else {
            total = parseInt((posts.length+1)/5);
            sub = (posts.length+1)%5;
            if(sub > 0) {
                total = total + 1;
            }
            console.log(total)
            $('#paginater').bootpag({
                paginationClass: 'pagination pagination-sm',
                next: '<i class="fa fa-angle-right"></i>',
                prev: '<i class="fa fa-angle-left"></i>',
                total: total.toFixed(0),
                page: 1,
                maxVisible: 6 
            }).on('page', function(event, num){
                console.log(num)
                if((posts.length - (num-1)*5) >=5 )
                {
                    console.log('middle')
                    var search_html = '';
                    for(var i = (num-1)*5 ; i < 5*num ; i ++) {
                        var content = posts[i][0].content.slice(0, 100);
                        var post = `<div class="row">
                                        <div class="col-md-4 col-sm-4">
                                            <!-- BEGIN CAROUSEL -->            
                                            <div class="front-carousel">
                                                <div class="carousel slide" id="myCarousel${posts[i][0]._id}">
                                                    <!-- Carousel items -->
                                                    <div class="carousel-inner">
                                                        <div class="item active">
                                                        <img alt="" src="../../uploads/posts/${posts[i][0].image}" style="width:300px; height:150px;">
                                                        </div>
                                                    </div>
                                                </div>                
                                            </div>
                                            <!-- END CAROUSEL -->
                                    </div>
                                    <div class="col-md-8 col-sm-8">
                                    <h2><img src="../../uploads/users/${posts[i][0].poster_id}.png" style="width:45px; height:45px;"> ${posts[i][0].poster}</h2>
                                    <ul class="blog-info">
                                        <li><i class="fa fa-calendar"></i> ${new Date(posts[i][0].created_at).getFullYear()}-${new Date(posts[i][0].created_at).getMonth()+1}-${new Date(posts[i][0].created_at).getDate()} ${new Date(posts[i][0].created_at).getHours()}:${new Date(posts[i][0].created_at).getMinutes()}:${new Date(posts[i][0].created_at).getSeconds()}</li>
                                        <li><i class="fa fa-thumbs-up"></i> ${posts[i][0].shared}</li>
                                        <li><i class="fa fa-tags"></i> ${posts[i][0].category}</li>
                                    </ul>
                                    <p><h4>${posts[i][0].title}</h4></p><br>
                                    <a href="/post/view?post=${posts[i][0]._id}" class="more">Read more <i class="icon-angle-right"></i></a>
                                    </div>
                                </div>
                                <hr class="blog-post-sep">`;
                        search_html = search_html + post;
                    }
                } else {
                    console.log('last')
                    var search_html = '';
                    for(var i = (num-1)*5 ; i < posts.length ; i ++) {
                        var content = posts[i][0].content.slice(0, 100);
                        var post = `<div class="row">
                                        <div class="col-md-4 col-sm-4">
                                            <!-- BEGIN CAROUSEL -->            
                                            <div class="front-carousel">
                                                <div class="carousel slide" id="myCarousel${posts[i][0]._id}">
                                                    <!-- Carousel items -->
                                                    <div class="carousel-inner">
                                                        <div class="item active">
                                                        <img alt="" src="../../uploads/posts/${posts[i][0].image}" style="width:300px; height:150px;">
                                                        </div>
                                                    </div>
                                                </div>                
                                            </div>
                                            <!-- END CAROUSEL -->
                                        </div>
                                <div class="col-md-8 col-sm-8">
                                <h2><img src="../../uploads/users/${posts[i][0].poster_id}.png" style="width:45px; height:45px;"> ${posts[i][0].poster}</h2>
                                <ul class="blog-info">
                                    <li><i class="fa fa-calendar"></i> ${new Date(posts[i][0].created_at).getFullYear()}-${new Date(posts[i][0].created_at).getMonth()+1}-${new Date(posts[i][0].created_at).getDate()} ${new Date(posts[i][0].created_at).getHours()}:${new Date(posts[i][0].created_at).getMinutes()}:${new Date(posts[i][0].created_at).getSeconds()}</li>
                                    <li><i class="fa fa-thumbs-up"></i> ${posts[i][0].shared}</li>
                                    <li><i class="fa fa-tags"></i> ${posts[i][0].category}</li>
                                </ul>
                                <p><h4>${posts[i][0].title}</h4></p><br>
                                <a href="/post/view?post=${posts[i][0]._id}" class="more">Read more <i class="icon-angle-right"></i></a>
                                </div>
                            </div>
                            <hr class="blog-post-sep">`;
                    search_html = search_html + post;
                    }
                }
                
                $("#div_posts").html(search_html); // or some ajax content loading...
            });
            var search_html = '';
            for(var i = 0 ; i < 5 ; i ++) {
                var content = posts[i].content.slice(0, 100);
                var post = `<div class="row">
                                <div class="col-md-4 col-sm-4">
                                    <!-- BEGIN CAROUSEL -->            
                                    <div class="front-carousel">
                                        <div class="carousel slide" id="myCarousel${posts[i][0]._id}">
                                            <!-- Carousel items -->
                                            <div class="carousel-inner">
                                                <div class="item active">
                                                <img alt="" src="../../uploads/posts/${posts[i][0].image}" style="width:300px; height:150px;">
                                                </div>
                                            </div>
                                        </div>                
                                    </div>
                                    <!-- END CAROUSEL -->
                                </div>
                            <div class="col-md-8 col-sm-8">
                            <h2><img src="../../uploads/users/${posts[i][0].poster_id}.png" style="width:45px; height:45px;"> ${posts[i][0].poster}</h2>
                            <ul class="blog-info">
                                <li><i class="fa fa-calendar"></i> ${new Date(posts[i][0].created_at).getFullYear()}-${new Date(posts[i][0].created_at).getMonth()+1}-${new Date(posts[i][0].created_at).getDate()} ${new Date(posts[i][0].created_at).getHours()}:${new Date(posts[i][0].created_at).getMinutes()}:${new Date(posts[i][0].created_at).getSeconds()}</li>
                                <li><i class="fa fa-thumbs-up"></i> ${posts[i][0].shared}</li>
                                <li><i class="fa fa-tags"></i> ${posts[i][0].category}</li>
                            </ul>
                            <p><h4>${posts[i][0].title}</h4></p><br>
                            <a href="/post/view?post=${posts[i][0]._id}" class="more">Read more <i class="icon-angle-right"></i></a>
                            </div>
                        </div>
                        <hr class="blog-post-sep">`;
                search_html = search_html + post;
            }
            $("#div_posts").html(search_html); // or some ajax content loading...
        }
    }

    $('#search').keyup(function(){
        // Declare variables
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('search');
        filter = input.value.toUpperCase();
        ul = document.getElementById("categories");
        li = ul.getElementsByTagName('li');
      
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
          a = li[i].getElementsByTagName("a")[0];
          txtValue = a.textContent || a.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
          } else {
            li[i].style.display = "none";
          }
        }
    });
})