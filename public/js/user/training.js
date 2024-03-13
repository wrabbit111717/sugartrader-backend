$(document).ready(function() {
    $('.video_li').click(function() {
        var training_id = $(this).attr('training_id');
        $.ajax({
            url : '/get_training',
            method : 'post',
            data : {
                training_id : training_id
            },
            success : function(data) {
                var video_html = `<h2>${data.training.title}</h2>
                                <video controls style="width: 100%;">
                                    <source src="${data.training.url}" type="video/mp4">
                                </video>`;
                $('#main_video').html(video_html);
            },
            error : function() {
                toastr['error']('Happening any errors on getting video.');
            }
        });
    });

});