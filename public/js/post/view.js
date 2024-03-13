$(document).ready(function() {

  toastr['info']('To share post on social site, please follow as following steps.<br><br>1. Generate logo.<br>( If you have your logo, you can skip logo generating. )<br><br>2. Upload logo.<br><br>3. Preview the post.<br><br>4. Share on social site.');
  
  // var my_url = 'https://app.social-media-builder.com';

  $.ajax({
      url : '/post/view_ajax',
      method : 'post',
      data : {
          post_id : $('#post_id').val()
      },
      success : function(data) {
        var post = data.post;
        var post_html = `<h2 id="title">${post.title}</h2>
                            <div id="content">${post.content}</div><br>
                            <div class="blog-item-img">
                              <!-- BEGIN CAROUSEL -->            
                              <div class="front-carousel">
                                <div id="myCarousel" class="carousel slide">
                                  <!-- Carousel items -->
                                  <div class="carousel-inner">
                                    <div class="item active">
                                    <input type="hidden" id="image" value="${post.image}">
                                      <img src="../../uploads/posts/${post.image}" style="height: 100%; width:100%;" alt="">
                                    </div>
                                  </div>
                                </div>                
                              </div>
                              <!-- END CAROUSEL -->
                            </div>`;
        $('#post_div').html(post_html);
        
      },
      error : function () {
          toastr['error']('Happening any errors in view');
      }
  });


  $('.btn_preview').click(function() {
    $('#btn_copy_img').hide();
    $('#btn_copy_text').hide();
    $('#btn_download').hide();
    $('#modal_title').html(`<i class="icon-eye" style="font-size: 23px;"></i> Preview post`);
    var share_img_url;
    if($('#share_img').val() == '')
    {
      share_img_url = `../../uploads/posts/${$('#image').val()}`;
    } else {
      share_img_url = `../../uploads/shares/images/${$('#share_img').val()}`;
    }
      $('#preview_title').text($('#title').text());
      $('#preview_body').html($('#content').html());
      var share_img_div = `<div class="blog-item-img">
                            <!-- BEGIN CAROUSEL -->            
                            <div class="front-carousel">
                              <div id="myCarousel" class="carousel slide">
                                <!-- Carousel items -->
                                <div class="carousel-inner">
                                  <div class="item active">
                                    <img src="${share_img_url}" style="height: 100%; width:100%;" alt="">
                                  </div>
                                </div>
                              </div>                
                            </div>
                            <!-- END CAROUSEL -->
                          </div>`;
      $('#slide_div').html(share_img_div);
      $('#previewModal').modal('show');
      var count = 0;
      setInterval(function(){ 
          count++;
          if(count == 30) {
              $('#previewModal').modal('hide');
          }
      }, 1000);
  });

  $('#btn_purchase').click(function() {
    var share_img= $('#share_img').val();
    var title = $('#title').text();
    var content = $('#content').text();
    var share_img_url;
    if(share_img == '')
    {
      share_img_url = `uploads/posts/${$('#image').val()}`;
    } else {
      share_img_url = `uploads/shares/images/${share_img}`;
    }
    var left_membership = $('#left_membership').val();
    if(left_membership > 0){
      $.ajax({
        url : '/share',
        methdod : 'post',
        data : { 
          post_id : $('#post_id').val(),
          title : title,
          content : content,
          image_url : share_img_url
        },
        success : function(data){
          $('body').removeAttr('onCopy', 'return false');
          $('body').attr('onCopy', 'return true');
          $('body').removeAttr('onselectstart', 'return false');
          $('body').attr('onselectstart', 'return true');
          $('body').unbind();
          $('#left_membership').val(data.left_membership);
          $('#shared_span').text(data.shared);
          $('#modal_title').html(`<i class="icon-basket" style="font-size: 23px;"></i> Purchase post`);
          var new_share_img_url;
          if($('#share_img').val() == '')
          {
            new_share_img_url = `../../uploads/posts/${$('#image').val()}`;
          } else {
            new_share_img_url = `../../uploads/shares/images/${$('#share_img').val()}`;
          }
          $('#preview_title').text($('#title').text());
          $('#preview_body').html($('#content').html());
          var share_img_div = `<div class="blog-item-img">
                                <!-- BEGIN CAROUSEL -->            
                                <div class="front-carousel">
                                  <div id="myCarousel" class="carousel slide">
                                    <!-- Carousel items -->
                                    <div class="carousel-inner">
                                      <div class="item active">
                                        <img src="${new_share_img_url}" id="img_purchase" style="height: 100%; width:100%;" alt="">
                                      </div>
                                    </div>
                                  </div>                
                                </div>
                                <!-- END CAROUSEL -->
                              </div>`;
            $('#slide_div').html(share_img_div);
            $('#btn_download').attr('href', `/${data.zip_url}`);
            $('#btn_copy_img').show();
            $('#btn_copy_text').show();
            $('#btn_download').show();
            $('#previewModal').modal('show');
        },
        error:function() {
          toastr['error']('Happening any errors on sharing post');
        }
      });
    } else {
      toastr['info'](`You can't share post. Your left membership is 0.`);
    }
  });

  async function askWritePermission() {
    try {
      // The clipboard-write permission is granted automatically to pages 
    // when they are the active tab. So it's not required, but it's more safe.
      const { state } = await navigator.permissions.query({ name: 'clipboard-write' })
      return state === 'granted'
    } catch (error) {
      // Browser compatibility / Security error (ONLY HTTPS) ...
      return false
    }
  }

  const setToClipboard = async blob => {
    const data = [new ClipboardItem({ [blob.type]: blob })]
    await navigator.clipboard.write(data)
  }

  $('#btn_copy_text').click(async function() {
    
    // var element = document.getElementById('modal_body');
    // // var img = document.getElementById('post_img');
    // var r = document.createRange();
    // r.selectNode(element);
    // var s = window.getSelection();
    // s.removeAllRanges();
    // s.addRange(r);
    // // Copy - requires clipboardWrite permission + crbug.com/395376 must be fixed
    // document.execCommand('copy');

    const canWriteToClipboard = await askWritePermission()
    // Copy a text to clipboard
    if (canWriteToClipboard) {
      const blob = new Blob([$('#preview_body').text()], { type: 'text/plain' })
      toastr['success']('Copied text');
      await setToClipboard(blob)
    }

  });

  $('#btn_copy_img').click(async function() {
    const canWriteToClipboard = await askWritePermission();

    // Copy a PNG image to clipboard
    if (canWriteToClipboard) {
     
      const response = await fetch($('#img_purchase').attr('src'));
      var blob = await response.blob();
      // blob = blob.slice(0, blob.size, "image/png");
      toastr['success']('Copied image');
      await setToClipboard(blob);
    }
  });

  // $('#btn_facebook').click(function() {
  //   var share_img= $('#share_img').val();
  //   var title = $('#title').text();
  //   var content = $('#content').text();
  //   var share_img_url;
  //   if(share_img == '')
  //   {
  //     share_img_url = `http://app.social-media-builder.com/uploads/posts/${$('#image').val()}`;
  //   } else {
  //     share_img_url = `http://app.social-media-builder.com/uploads/shares/${share_img}`;
  //   }
  //   var left_membership = $('#left_membership').val();
  //   if(left_membership > 0){
  //     $.ajax({
  //       url : '/share',
  //       methdod : 'post',
  //       data : { post_id : $('#post_id').val()},
  //       success : function(data){
  //         $('#left_membership').val(data.left_membership);
  //         $('#shared_span').text(data.shared);
  //         // var total_url = encodeURIComponent(my_url+'?img='+share_img_url);
  //         // window.open(`https://www.facebook.com/sharer.php?u=${share_img_url}&t=${title}&u=${content}`, 'NewWindow');
  //         // window.open(`https://www.facebook.com/sharer.php?u=${encodeURIComponent(share_img_url)}&t=${encodeURIComponent(title)}`,'sharer','toolbar=0,status=0,width=626,height=436', 'NewWindow');
          
          
  //         FB.ui({
  //           method: 'feed',
  //           name: title,
  //           link: my_url,
  //           picture: share_img_url,
  //           caption: my_url,
  //           description: content,
  //           message: content
  //         }, function(response) {
  //           if (response && response.post_id) {
  //               console.log(response);
  //           } else {
  //               console.log("Post not shared");
  //           }
  //         });
  //       },
  //       error : function() {
  //         toastr['error']('Happening any errors on update membership');
  //       }
  //     })
  //   } else {
  //     toastr['info'](`You can't share post. Your left membership is 0.`);
  //   } 
  // });

  // $('#btn_twitter').click(function() {
  //   var share_img= $('#share_img').val();
  //   var title = $('#title').text();
  //   var content = $('#content').text();
  //   var share_img_url;
  //   if(share_img == '')
  //   {
  //     share_img_url = `http://app.social-media-builder.com/uploads/posts/${$('#image').val()}`;
  //   } else {
  //     share_img_url = `http://app.social-media-builder.com/uploads/shares/${share_img}`;
  //   }
  //   var left_membership = $('#left_membership').val();
  //   if(left_membership > 0){
  //     $.ajax({
  //       url : '/share',
  //       methdod : 'post',
  //       data : { post_id : $('#post_id').val()},
  //       success : function(data){
  //         $('#left_membership').val(data.left_membership);
  //         $('#shared_span').text(data.shared);
  //         // window.open(`https://twitter.com/share?url=${my_url}&image=${share_img_url}&title=${title}&text=${content}`, 'NewWindow');
  //         window.open(`https://twitter.com/share?url=${share_img_url}&title=${title}&text=${content}`, 'NewWindow');
  //       },
  //       error : function() {
  //         toastr['error']('Happening any errors on update membership');
  //       }
  //     });
  //   } else {
  //     toastr['info'](`You can't share post. Your left membership is 0.`);
  //   }
  // });

  // $('#btn_linkedin').click(function() {
  //   var share_img= $('#share_img').val();
  //   var title = $('#title').text();
  //   var content = $('#content').text();
  //   var share_img_url;
  //   if(share_img == '')
  //   {
  //     share_img_url = `http://app.social-media-builder.com/uploads/posts/${$('#image').val()}`;
  //   } else {
  //     share_img_url = `http://app.social-media-builder.com/uploads/shares/${share_img}`;
  //   }
  //   var left_membership = $('#left_membership').val();
  //   if(left_membership > 0){
  //     $.ajax({
  //       url : '/share',
  //       methdod : 'post',
  //       data : { post_id : $('#post_id').val()},
  //       success : function(data){
  //         $('#left_membership').val(data.left_membership);
  //         $('#shared_span').text(data.shared);
  //         window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${share_img_url}&title=${title}&summary=${content}`, 'NewWindow');
  //         // window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(share_img_url)}&title=${encodeURIComponent(title)}&summary=${content}`, '', 'left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0', 'NewWindow');

  //         // navigator.share({
  //         //   url: 'http://app.social-media-builder.com/',
  //         //   title: title,
  //         //   text: content,
  //         //   image : share_img_url
  //         // });
  //       },
  //       error : function() {
  //         toastr['error']('Happening any errors on update membership');
  //       }
  //     });
  //   } else {
  //     toastr['info'](`You can't share post. Your left membership is 0.`);
  //   }
  // });

  $('#btn_close').click(function() {
    $('body').removeAttr('onCopy', 'return true');
    $('body').attr('onCopy', 'return false');
    $('body').removeAttr('onselectstart', 'return true');
    $('body').attr('onselectstart', 'return false');
    $('body').bind('contextmenu', function(e) {
      e.preventDefault();
    });
  });

  $('#btn_upload').click(function() {
    if($('#photo').val() == '') {
      toastr['error']('Please select logo.');
    } else {
      Metronic.blockUI({
        boxed : true,
        message: 'Image Processing...'
      });
      var data = new FormData();
      $.each($('#photo')[0].files, function(i, file) {
          data.append('file-'+i, file);
      });
      var logo_position = $('input[name=logo_position]:checked').val();
      $.ajax({
          url: '/share/logo_upload',
          data: data,
          cache: false,
          contentType: false,
          processData: false,
          method: 'POST',
          type: 'POST', 
          success: function(data){
              toastr['success']('Successfully uploaded.');
              $('#logo').val(data.image_name);
              var logo = $('#logo').val();
              $.ajax({
                url : '/share/image_jimp',
                methdod : 'get',
                data : {
                  image : $('#image').val(),
                  logo : logo,
                  logo_position : logo_position
                },
                success : function(data) {
                  toastr['success']('Successfully image process.');
                  Metronic.unblockUI();
                  $('#share_img').val(data.share_img);
                },
                error : function() {
                  toastr['error']('Happening any errors on image processing.');
                }
              });
          }
      });
    }
    
  });

  $('input[name=logo_position]').change(function() {
    var logo_position = $('input[name=logo_position]:checked').val();
    var logo = $('#logo').val();
    console.log(logo)
    if(logo != '')
    {
      Metronic.blockUI({
        boxed : true,
        message: 'Image Processing...'
      });
      $.ajax({
        url : '/share/image_jimp_position_change',
        methdod : 'post',
        data : {
          image : $('#image').val(),
          logo : logo,
          logo_position : logo_position
        },
        success : function(data) {
          Metronic.unblockUI();
          toastr['success']('Successfully image process.');
          $('#share_img').val(data.share_img);
        },
        error : function() {
          Metronic.unblockUI();
          toastr['error']('Happening any errors on position change.');
        }
      });
    }
    console.log(logo_position);
    
  });

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

});