$(document).ready(function() {
    var ask = $('#ask').val();
    var left_membership = $('#left_membership').val();

    if(left_membership == 0) {
        toastr['info'](`You can't ask for a post. Your left membership is 0.`);
    } else {
        if(ask == 0) {
            toastr['info'](`You can't ask for a post. Your package is 0.`);
        }
    }
    var ask_save = function() {
        var title = $('#title').val();
        var category = $('#category>:selected').text();
        var email = $('#email').val();
        var content = $('#content').val();
        console.log(content);
        if(title == '') 
        {
            toastr['error']('Please enter title.');
        }
        if(email == '')
        {
            toastr['error']('Please enter your email.');
        }
        if(content == '')
        {
            toastr['error']('Please enter content.');
        }
        if(title != '' && email != '' && content != '')
        {
            $('#askForm').submit();
        }
    }
    $('#btn_save').click(function() {
        var ask = $('#ask').val();
        var left_membership = $('#left_membership').val();

        if(left_membership == 0) {
            toastr['info'](`You can't ask for a post. Your left membership is 0.`);
        } else {
            if(ask == 0) {
                toastr[info](`You can't ask for a post. Your package is 0.`);
            } else {
                ask_save();
            }
        }
        
    });

    // $('askForm>:input').keydown(function(e) {
    //     if(e.which == 13) {
    //         var ask = $('#ask').val();
    //         var left_membership = $('#left_membership').val();

    //         if(left_membership == 0) {
    //             toastr['info'](`You can't ask for a post. Your left membership is 0.`);
    //         } else {
    //             if(ask == 0) {
    //                 toastr[info](`You can't ask for a post. Your package is 0.`);
    //             } else {
    //                 ask_save();
    //             }
    //         }
    //     }
        
    // })
});