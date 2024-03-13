$(document).ready(function() {
    var VideoTable = function () {
    
        var videotable = function () {
    
            var table = $('#video_table');
    
            /* Fixed header extension: http://datatables.net/extensions/keytable/ */
    
            var oTable = table.dataTable({
                // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                "language": {
                    "aria": {
                        "sortAscending": ": activate to sort column ascending",
                        "sortDescending": ": activate to sort column descending"
                    },
                    "emptyTable": "No data available in table",
                    "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                    "infoEmpty": "No entries found",
                    "infoFiltered": "(filtered1 from _MAX_ total entries)",
                    "lengthMenu": "_MENU_ records",
                    "search": "",
                    "zeroRecords": "No matching records found"
                },
                "order": [
                    [1, 'asc']
                ],
                "lengthMenu": [
                    [5, 10, 20, -1],
                    [5, 10, 20, "All"] // change per page values here
                ],
                "pageLength": 10, // set the initial value,
                "columnDefs": [{  // set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    "searchable": false,
                    "targets": [0]
                }] 
            });
    
            var oTableColReorder = new $.fn.dataTable.ColReorder( oTable );
    
            var tableWrapper = $('#video_table_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
            tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
            
            $('#btn_add').click(function() {
                $('#videoModal').modal('show');
            });

            table.on('click', '.btn_delete', function() {
                var video_id = $(this).parents('tr').eq(0).attr('training_id');
                var nRow = $(this).parents('tr')[0];
                $.ajax({
                    url : '/admin/video_delete',
                    method : 'post',
                    data : {
                        video_id : video_id
                    },
                    success : function(data) {
                        oTable.fnDeleteRow(nRow);
                    }
                })
            })

            $('input[type=file]').change(function() {
                $('#video').val('enable');
            });

            $('#btn_video_save').click(function() {
                var video = $('#video').val();
                var title = $('#title').val();
                var description = $('#description').val();

                if(video == '')
                {
                    toastr['error']('Please select video.');
                }
                if(title == '')
                {
                    toastr['error']('Please enter title.');
                }
                if(description == '')
                {
                    toastr['error']('Please type description.');
                }
                if(video != '' && title != '' && description != '')
                {
                    var data = new FormData();
                    $.each($('#video_file')[0].files, function(i, file) {
                        data.append('file-'+i, file);
                    });
                    
                    var video_type = $('#video_type').val();
                    var page_type = $('#page_type').val();
                    if(video_type === 'info')
                    {
                        $.ajax({
                            url: '/admin/infoupload',
                            data: data,
                            cache: false,
                            contentType: false,
                            processData: false,
                            method: 'POST',
                            type: 'POST', // For jQuery < 1.9
                            success: function(data){
                                var video_url = '../../videos/info.mp4';
                                $.ajax({
                                    url : '/admin/training_save',
                                    method : 'post',
                                    data : {
                                        video_lang : $('#video_lang').val(),
                                        title : title,
                                        type : video_type,
                                        page_type : page_type,
                                        description : description,
                                        url : video_url
                                    },
                                    success : function(data) {
                                        toastr['success']('Successfully saved.');
                                        var video_html = `<video style="width: 100%;" controls title="${data.video.description}" class="video_li">
                                                            <source src="${data.video.url}" type="video/mp4">
                                                        </video>`;
                                        if(data.video.language === 'EN')
                                        {
                                            var text_color = 'text-danger';
                                        }
                                        if(data.video.language === 'GR')
                                        {
                                            var text_color = 'text-primary';
                                        }
                                        var button_html = `<button class="btn btn-danger btn_delete" title="delete"><i class="fa fa-trash"></i></button>`
                                        oTable.fnAddData([video_html, `<label class="bold ${text_color}">${data.video.language}</label>`, `<span class="label label-primary">${video_type}</span>`, `<label class="bold">${page_type}</label>`, data.video.title, data.video.description, button_html]);
                                        $('#videoModal').modal('hide');
                                        window.location.reload();
                                    },
                                    error : function() {
                                        toastr['error']('Happening any errors on deleteing video');
                                    }
                                });
                                
                            }
                        });
                    } else {
                        $.ajax({
                            url: '/admin/trainingupload',
                            data: data,
                            cache: false,
                            contentType: false,
                            processData: false,
                            method: 'POST',
                            type: 'POST', // For jQuery < 1.9
                            success: function(data){
                                var video_name = data.video_name;
                                var video_url = '../../videos/trainings/'+video_name;
                                $.ajax({
                                    url : '/admin/training_save',
                                    method : 'post',
                                    data : {
                                        video_lang : $('#video_lang').val(),
                                        title : title,
                                        type : video_type,
                                        page_type : page_type,
                                        description : description,
                                        url : video_url
                                    },
                                    success : function(data) {
                                        toastr['success']('Successfully saved.');
                                        var video_html = `<video style="width: 100%;" controls title="${data.video.description}" class="video_li">
                                                            <source src="${data.video.url}" type="video/mp4">
                                                        </video>`;
                                        if(data.video.language === 'EN')
                                        {
                                            var text_color = 'text-danger';
                                        }
                                        if(data.video.language === 'GR')
                                        {
                                            var text_color = 'text-primary';
                                        }
                                        var button_html = `<button class="btn btn-danger btn_delete" title="delete"><i class="fa fa-trash"></i></button>`
                                        oTable.fnAddData([video_html, `<label class="bold ${text_color}">${data.video.language}</label>`, `<span class="label label-danger">${video_type}</span>`, `<label class="bold">${page_type}</label>`, data.video.title, data.video.description, button_html]);
                                        $('#videoModal').modal('hide');
                                        window.location.reload();
                                    },
                                    error : function() {
                                        toastr['error']('Happening any errors on deleteing video');
                                    }
                                });
                                
                            }
                        });
                    }
                    
                }
            })

        }
    
        return {
    
            //main function to initiate the module
            init: function () {
    
                if (!jQuery().dataTable) {
                    return;
                }
                videotable();
            }
    
        };
    
    }();
    VideoTable.init();
})