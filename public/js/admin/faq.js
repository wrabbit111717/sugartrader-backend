$(document).ready(function() {
    var FaqTable = function () {
    
        var faqtable = function () {
    
            var table = $('#faq_table');
    
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
                    [0, 'asc']
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
    
            var tableWrapper = $('#faq_table_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
            tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
            
            $('#btn_add').click(function() {
                $('#faqModal').modal('show');
            });

            table.on('click', '.btn_delete', function() {
                var faq_id = $(this).attr('faq_id');
                var nRow = $(this).parents('tr')[0];

                bootbox.dialog({
                    message: "Are you sure to delete this row ?",
                    title: "<i class='fa fa-trash'></i> DELETE",
                    buttons: {
                      success: {
                        label: "YES",
                        className: "green",
                        callback: function() {
                            $.ajax({
                                url : '/admin/faq/delete',
                                method : 'post',
                                data : {
                                    faq_id : faq_id
                                },
                                success : function(data) {
                                    toastr['success']('Successfully deleted.');
                                    oTable.fnDeleteRow(nRow);
                                },
                                error : function() {
                                    toastr['error']('Happening any errors on faq delete.');
                                }
                            })
                        }
                      },
                      danger: {
                        label: "NO",
                        className: "red",
                        callback: function() {

                        }
                      },
                    }
                });
            });

            table.on('click', '.btn_edit', function() {
                var language = $(this).attr('faq_language');
                var category = $(this).attr('faq_category');
                var title = $(this).attr('faq_title');
                var content = $(this).attr('faq_content');
                var faq_id = $(this).attr('faq_id');

                $('#faq_lang').val(language);
                $.ajax({
                    url : '/admin/faq/change_language',
                    method : 'post',
                    data : {
                        language : language
                    },
                    success : function(data) {
                        var category_html = '';
                        data.categories.forEach(function(category) {
                            category_html += `<option value="${category.name}">${category.name}</option>`;
                        });
                        $('#category').html(category_html);
                        $('#category').val(category);
                        $('#title').val(title);
                        $('#content').html(content);
                        $('#faqModal').modal('show');
                        $('#btn_faq_save').attr('faq_id', faq_id);
                    },
                    error : function() {
                        toastr['error']('Happening any errors on changing language.');
                    }
                });
                
            });

            $('#faq_lang').change(function() {
                $.ajax({
                    url : '/admin/faq/change_language',
                    method : 'post',
                    data : {
                        language : $(this).val()
                    },
                    success : function(data) {
                        var category_html = '';
                        data.categories.forEach(function(category) {
                            category_html += `<option value="${category.name}">${category.name}</option>`;
                        });
                        $('#category').html(category_html);
                    },
                    error : function() {
                        toastr['error']('Happening any errors on changing language.');
                    }
                })
            });


            $('#btn_faq_save').click(function() {
                var title = $('#title').val();
                var content = $('#content').val();
                var faq_id = $(this).attr('faq_id');
                if(title == '')
                {
                    toastr['error']('Please enter title.');
                }
                if(content == '')
                {
                    toastr['error']('Please type description.');
                }
                if(title != '' && content != '')
                {
                    if(faq_id != '')
                    {
                        $.ajax({
                            url : '/admin/faq/update',
                            method : 'post',
                            data : {
                                faq_id : faq_id,
                                language :$('#faq_lang').val(),
                                category : $('#category').val(),
                                title : title,
                                content : content
                            },
                            success : function (data) {
                                toastr['success']("Successfully saved.");
                                if(data.faq.language == 'EN')
                                {
                                    var text_color = 'text-danger';
                                } else {
                                    var text_color = 'text-primary';
                                }
                                var buttons = `<button faq_id="${data.faq._id}" faq_language="${data.faq.language}" faq_category="${data.faq.category}" faq_title="${data.faq.title}" faq_content="${data.faq.content}" type="button" class="btn btn-sm btn_edit blue" title="Edit"><i class="fa fa-pencil"></i></button>&nbsp;<button faq_id="${data.faq._id}" type="button" class="btn btn-sm btn-danger btn_delete" title="delete"><i class="fa fa-trash"></i></button>`;
                                // oTable.fnAddData([`<label class="bold ${text_color}">${data.faq.language}</label>`, data.faq.category, data.faq.email, data.faq.title, data.faq.content.slice(0,85)+'... ...', buttons])
                                $('#faqModal').modal('hide');
                                window.location.reload();
                            },
                            error : function() {
                                toastr['error']('Happening any errors on FAQ saving.');
                            }
                        })
                    } else {
                        $.ajax({
                            url : '/admin/faq/save',
                            method : 'post',
                            data : {
                                language :$('#faq_lang').val(),
                                category : $('#category').val(),
                                title : title,
                                content : content
                            },
                            success : function (data) {
                                toastr['success']("Successfully saved.");
                                if(data.faq.language == 'EN')
                                {
                                    var text_color = 'text-danger';
                                } else {
                                    var text_color = 'text-primary';
                                }
                                var buttons = `<button faq_id="${data.faq._id}" faq_language="${data.faq.language}" faq_category="${data.faq.category}" faq_title="${data.faq.title}" faq_content="${data.faq.content}" type="button" class="btn btn-sm btn_edit blue" title="Edit"><i class="fa fa-pencil"></i></button>&nbsp;<button faq_id="${data.faq._id}" type="button" class="btn btn-sm btn-danger btn_delete" title="delete"><i class="fa fa-trash"></i></button>`;
                                oTable.fnAddData([`<label class="bold ${text_color}">${data.faq.language}</label>`, data.faq.category, data.faq.email, data.faq.title, data.faq.content.slice(0,85)+'... ...', buttons])
                                $('#faqModal').modal('hide');
                            },
                            error : function() {
                                toastr['error']('Happening any errors on FAQ saving.');
                            }
                        })
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
                faqtable();
            }
    
        };
    
    }();
    FaqTable.init();
})