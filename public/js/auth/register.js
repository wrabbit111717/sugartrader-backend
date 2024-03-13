$(document).ready(function() {
    $('#name').change(function(){
        $('#name_error').hide();
    });
    $('#surname').change(function(){
        $('#surname_error').hide();
    });
    $('#phone').change(function(){
        $('#phone_error').hide();
    });
    $('#email').change(function(){
        $('#email_error').hide();
    });
    $('#password').change(function(){
        $('#password_error').hide();
    });
    $('#repassword').change(function(){
        $('#repassword_error').hide();
    });

    $('#name').val('')
    $('#surname').val('')
    $('#phone').val('')
    $('#email').val('')
    $('#password').val('')
    $('#repassword').val('')
    $('input[name=industry]:checked').val(0)

    $('#fullname').val('')
    $('#card_number').val('')
    $('#month').val('')
    $('#year').val('')
    $('#cvc').val('')

    $("#phone").inputmask("+9999999999", {
        placeholder: "",
        clearMaskOnLostFocus: true
    }); //default

    var form_submit = function() {
        $.ajax({
            url : '/auth/signup',
            method: 'post',
            data : {
                language : $('#language').val(),
                name : $('#name').val(),
                surname : $('#surname').val(),
                phone : $('#phone').val(),
                email : $('#email').val(),
                password : $('#password').val(),
                repassword : $('#repassword').val(),
                industry : $('input[name=industry]:checked').val()
            },
            success : function(data) {
                var errors = data.errors;
                console.log(errors)
                if(errors.length > 0) {
                    for(var i = 0 ; i < errors.length ; i ++){
                        toastr['error'](errors[i]);
                    }
                } else{
                    toastr['info']('Please buy your membership');
                    $('#btn_confirm').attr('user_id', data.user_id);
                    $('#membershipModal').modal('show');
                }
                
            },
            error : function() {
                toastr['error']('Happening any errors on user register.');
            }
        });
        
    }

    $('#btn_submit').click(function() {
        form_submit();
    });

    $(':input').keydown(function(e) {
        if(e.which == 13) {
            form_submit();
        }
    });

    var payment_confirm = function(membership) {
        Metronic.blockUI({
            target: '.modal-body',
            boxed: true,
            message: 'Just a second...'
        });
        $('#membership').val(membership);
        $('#user_id').val($('#btn_confirm').attr('user_id'));
        $('#amount').val($('#payment_ammount').text());
        $('#paymentForm').submit();
        // $.ajax({
        //     url : '/auth/membership_save',
        //     method : 'post',
        //     data : {
        //         membership : membership,
        //         fullname : $('#fullname').val(),
        //         cardnumber : $('#card_number').val(),
        //         month : $('#month').val(),
        //         year : $('#year').val(),
        //         cvc : $('#cvc').val(),
        //         amount : $('#payment_ammount').text(),
        //         user_id : $('#btn_confirm').attr('user_id')
        //     },
        //     success : function(data) {
        //         if(data.msg === 'success')
        //         {
        //             if(membership == 1) {
        //                 $('#pricing_free').addClass('pricing-active');
        //                 $('#free_head').addClass('pricing-head-active');
        //                 $('#btn_free').html('Got');
        //                 $('#btn_free').attr('disabled', 'disabled');
        //             }
        //             if(membership == 2) {
        //                 $('#pricing_common').addClass('pricing-active');
        //                 $('#common_head').addClass('pricing-head-active');
        //                 $('#btn_common').html('Got');
        //                 $('#btn_common').attr('disabled', 'disabled');
        //             }
        //             if(membership == 3) {
        //                 $('#pricing_medium').addClass('pricing-active');
        //                 $('#medium_head').addClass('pricing-head-active');
        //                 $('#btn_medium').html('Got');
        //                 $('#btn_medium').attr('disabled', 'disabled');
        //             }
        //             if(membership == 4) {
        //                 $('#pricing_advance').addClass('pricing-active');
        //                 $('#advance_head').addClass('pricing-head-active');
        //                 $('#btn_advance').html('Got');
        //                 $('#btn_advance').attr('disabled', 'disabled');
        //             }
        //             $('#confirmModal').modal('hide');
        //             toastr['success']('Successfully got membership.');
        //             // window.location.href('/');
        //         } else {
        //             Metronic.unblockUI('.modal-body');
        //             toastr['error'](data.error_msg);
        //             if(data.error_msg === 'Credit card number is invalid.')
        //             {
        //                 $('#card_number').val('');
        //                 $('#card_number').addClass('edited');
        //             }
        //             if(data.error_msg === 'CVV must be 4 digits for American Express and 3 digits for other card types.')
        //             {
        //                 $('#cvc').val('');
        //                 $('#cvc').addClass('edited');
        //             }
        //             if(data.error_msg === 'Expiration date is invalid.')
        //             {
        //                 $('#month').val('');
        //                 $('#year').val('');
        //                 $('#month').addClass('edited');
        //                 $('#year').addClass('edited');
        //             }
        //         }
                
        //     },
        //     error : function() {
        //         toastr['error']('Happening any errrors in membership upgrade');
        //     }
        // });
    }

    $('#btn_free').click(function() {
        console.log('free')
        payment_confirm(1);
    });

    $('#btn_common').click(function() {
        $('#btn_confirm').attr('membership', 2);
        $('#payment_ammount').text(20);
        $('#confirmModal').modal('show');
    });

    $('#btn_medium').click(function() {
        $('#btn_confirm').attr('membership', 3);
        $('#payment_ammount').text(25);
        $('#confirmModal').modal('show');
    });

    $('#btn_advance').click(function() {
        $('#btn_confirm').attr('membership', 4);
        $('#payment_ammount').text(30);
        $('#confirmModal').modal('show');
    });

    $('#btn_confirm').click(function() {
        var membership = $(this).attr('membership');
        var fullname = $('#fullname').val();
        var cardnumber = $('#card_number').val();
        var month = $('#month').val();
        var year = $('#year').val();
        var cvc = $('#cvc').val();

        if(fullname == '') {
            toastr['error']('Please enter your Full Name.');
            $('#fullname').addClass('edited');
        }
        if(cardnumber == '') {
            toastr['error']('Please enter your Card Number.');
            $('#card_number').addClass('edited');
        }
        if(month == '') {
            toastr['error']('Please enter Expire Month.');
            $('#month').addClass('edited');
        }
        if(year == '') {
            toastr['error']('Please enter Expire Year.');
            $('#year').addClass('edited');
        }
        if(cvc == '') {
            toastr['error']('Please enter CVC.');
            $('#cvc').addClass('edited');
        }

        if(fullname != '' && cardnumber != '' && month != '' && year != '' && cvc != ''){
            payment_confirm(membership);
        }
        
    });

    $('#fullname').keypress(function() {
        $(this).removeClass('edited');
    });

    $('#card_number').keypress(function() {
        $(this).removeClass('edited');
    });
    $('#month').keypress(function() {
        $(this).removeClass('edited');
    });
    $('#year').keypress(function() {
        $(this).removeClass('edited');
    });
    $('#cvc').keypress(function() {
        $(this).removeClass('edited');
    });

    $("#card_number").inputmask("9999 9999 9999 9999", {
        placeholder: "",
        clearMaskOnLostFocus: true
    }); //default
})