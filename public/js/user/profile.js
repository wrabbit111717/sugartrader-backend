$(document).ready(function() {
    $('#photo_btn_div').hide();
    $('#btn_profile_save').hide();
    $('#btn_cancel').hide();

    $('#btn_profile_edit').click(function() {
        $('#photo_btn_div').show();
        $('#btn_profile_save').show();
        $('#btn_cancel').show();
        $(this).hide();
        var textarea = '<textarea name="introduction" id="introduction" rows="8" class="form-control">'+$('#introduction_div').text()+'</textarea>';
        $('#introduction_div').html(textarea);
    });

    $('#btn_cancel').click(function() {
        $('#photo_btn_div').hide();
        $('#btn_profile_save').hide();
        $('#btn_cancel').hide();
        $('#btn_profile_edit').show();
        $('#introduction_div').html($('#introduction').text());
    })

    var payment_confirm = function(membership) {
        Metronic.blockUI({
            target: '.modal-body',
            boxed: true,
            message: 'Just a second...'
        });
        $.ajax({
            url : '/membership/update',
            method : 'post',
            data : {
                membership : membership,
                fullname : $('#fullname').val(),
                cardnumber : $('#card_number').val(),
                month : $('#month').val(),
                year : $('#year').val(),
                cvc : $('#cvc').val(),
                amount : $('#payment_ammount').text()
            },
            success : function(data) {
                Metronic.unblockUI('.modal-body');
                if(data.msg === 'success')
                {
                    if(data.old_membership == 1) {
                        $('#pricing_free').removeClass('pricing-active');
                        $('#free_head').removeClass('pricing-head-active');
                        $('#btn_free').html('Get <i class="m-icon-swapright m-icon-white"></i>');
                        $('#btn_free').removeAttr('disabled', 'disabled');
                    }
                    if(data.old_membership == 2) {
                        $('#pricing_common').removeClass('pricing-active');
                        $('#common_head').removeClass('pricing-head-active');
                        $('#btn_common').html('Sign Up <i class="m-icon-swapright m-icon-white"></i>');
                        $('#btn_common').removeAttr('disabled', 'disabled');
                    }
                    if(data.old_membership == 3) {
                        $('#pricing_medium').removeClass('pricing-active');
                        $('#medium_head').removeClass('pricing-head-active');
                        $('#btn_medium').html('Sign Up <i class="m-icon-swapright m-icon-white"></i>');
                        $('#btn_medium').removeAttr('disabled', 'disabled');
                    }
                    if(data.old_membership == 4) {
                        $('#pricing_advance').removeClass('pricing-active');
                        $('#advance_head').removeClass('pricing-head-active');
                        $('#btn_advance').html('Sign Up <i class="m-icon-swapright m-icon-white"></i>');
                        $('#btn_advance').removeAttr('disabled', 'disabled');
                    }
                    if(membership == 1) {
                        $('#pricing_free').addClass('pricing-active');
                        $('#free_head').addClass('pricing-head-active');
                        $('#btn_free').html('Got');
                        $('#btn_free').attr('disabled', 'disabled');
                    }
                    if(membership == 2) {
                        $('#pricing_common').addClass('pricing-active');
                        $('#common_head').addClass('pricing-head-active');
                        $('#btn_common').html('Got');
                        $('#btn_common').attr('disabled', 'disabled');
                    }
                    if(membership == 3) {
                        $('#pricing_medium').addClass('pricing-active');
                        $('#medium_head').addClass('pricing-head-active');
                        $('#btn_medium').html('Got');
                        $('#btn_medium').attr('disabled', 'disabled');
                    }
                    if(membership == 4) {
                        $('#pricing_advance').addClass('pricing-active');
                        $('#advance_head').addClass('pricing-head-active');
                        $('#btn_advance').html('Got');
                        $('#btn_advance').attr('disabled', 'disabled');
                    }
                    $('#confirmModal').modal('hide');
                    toastr['success']('Successfully upgraded.<br> You can use your new membership since next month.');
                    $('#membership_summary').text(membership);
                    console.log(data.date)
                    $('#left_date').html(new Date(data.date).getFullYear()+' / ' +(new Date(data.date).getMonth()+1)+' / ' +new Date(data.date).getDate()+' ~ ' +(new Date(data.date).getDate()+7))
                } else {
                    
                    toastr['error'](data.error_msg);
                    if(data.error_msg === 'Credit card number is invalid.')
                    {
                        $('#card_number').val('');
                        $('#card_number').addClass('edited');
                    }
                    if(data.error_msg === 'CVV must be 4 digits for American Express and 3 digits for other card types.')
                    {
                        $('#cvc').val('');
                        $('#cvc').addClass('edited');
                    }
                    if(data.error_msg === 'Expiration date is invalid.')
                    {
                        $('#month').val('');
                        $('#year').val('');
                        $('#month').addClass('edited');
                        $('#year').addClass('edited');
                    }
                }
                
            },
            error : function() {
                toastr['error']('Happening any errrors in membership upgrade');
            }
        })
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