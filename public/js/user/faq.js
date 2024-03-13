$(document).ready(function() {
    $('.faq_tab').click(function() {
        var category = $(this).attr('category');
        $.ajax({
            url : '/get_faqs',
            method : 'post',
            data : {
                category : category
            },
            success :function(data) {
                var faqs_html = '';
                for(var i = 0 ; i < data.faqs.length ; i ++)
                {
                    faqs_html += `<div class="panel panel-default">
                                    <div class="panel-heading">
                                    <h4 class="panel-title">
                                        <a href="#faqs_${i+1}" data-parent="#faqs" data-toggle="collapse" class="accordion-toggle collapsed">
                                        ${i+1}. ${data.faqs[i].title}
                                        </a>
                                    </h4>
                                    </div>
                                    <div class="panel-collapse collapse" id="faqs_${i+1}">
                                    <div class="panel-body">
                                        <p style="font-size : 15px;">${data.faqs[i].content}</p>
                                    </div>
                                    </div>
                                </div>`;
                }
                if(data.faqs.length == 0)
                {
                    faqs_html = '';
                }
                $('#faqs').html(faqs_html);
            }, 
            error : function() {
                toastr['error']('Happening any errors on getting faqs.');
            }
        })
    })
})