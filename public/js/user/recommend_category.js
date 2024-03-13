$(document).ready(function() {
    
    var recommend_save = function() {
        var email = $('#email').val();
        var content = $('#content').val();
        console.log(content);
        if(email == '')
        {
            toastr['error']('Please enter your email.');
        }
        if(content == '')
        {
            toastr['error']('Please enter content.');
        }
        if(email != '' && content != '')
        {
            $('#recommendForm').submit();
        }
    }
    $('#btn_save').click(function() {
        recommend_save();
        
    });

    // $('recommendForm>:input').keydown(function(e) {
    //     if(e.which == 13) {
    //         recommend_save();
    //     }
        
    // })
});