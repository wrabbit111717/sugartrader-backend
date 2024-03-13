$(document).ready(function() {
    var UserTable = function () {
    
        var usertable = function () {
    
            var table = $('#user_table');
    
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
                    [4, 'asc']
                ],
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                "pageLength": 5, // set the initial value,
                "columnDefs": [{  // set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    "searchable": false,
                    "targets": [0]
                }] 
            });
    
            var oTableColReorder = new $.fn.dataTable.ColReorder( oTable );
    
            var tableWrapper = $('#user_table_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
            tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

            table.on('change', '.state', function() {
                $.ajax({
                    url : '/admin/user/change_state',
                    method : 'post',
                    data : {
                        state : $(this).val(),
                        user_id : $(this).parents('tr').eq(0).attr('user_id')
                    },
                    success : function(data) {
                        toastr['success']('State is changed successfully.');
                    },
                    error : function() {
                        toastr['error']('Happening any errors in user state');
                    }
                })
            });

            table.on('change', '.permission', function() {
                $.ajax({
                    url : '/admin/user/change_permission',
                    method : 'post',
                    data : {
                        permission : $(this).val(),
                        user_id : $(this).parents('tr').eq(0).attr('user_id')
                    },
                    success : function(data) {
                        toastr['success']('Permission is changed successfully.');
                    },
                    error : function() {
                        toastr['error']('Happening any errors in user permission');
                    }
                })
            });

            table.on('click', '.btn_close', function() {
                $.ajax({
                    url : '/admin/user/close',
                    method : 'post',
                    data : { user_id : $(this).parents('tr').eq(0).attr('user_id') },
                    success : function(data) {
                        $(this).removeClass('purple');
                        $(this).removeClass('btn_close');
                        $(this).addClass('btn-danger');
                        $(this).addClass('btn_unclose');
                        toastr['success']('This user successfully closed.');
                    },
                    error : function () {
                        toastr['error']('Happenning any errors on user close.');
                    }
                })
            });

            table.on('click', '.btn_unclose', function() {
                $.ajax({
                    url : '/admin/user/unclose',
                    method : 'post',
                    data : { user_id : $(this).parents('tr').eq(0).attr('user_id') },
                    success : function(data) {
                        $(this).addClass('purple');
                        $(this).addClass('btn_close');
                        $(this).removeClass('btn-danger');
                        $(this).removeClass('btn_unclose');
                        toastr['success']('This user successfully unclosed.');
                    },
                    error : function () {
                        toastr['error']('Happenning any errors on user close.');
                    }
                })
            });

            table.on('click', '.btn_user_delete', function(e) {
                var nRow = $(this).parents('tr')[0];
                $.ajax({
                    url : '/admin/user/delete',
                    method : 'post',
                    data : {
                        user_id : $(this).parents('tr').eq(0).attr('user_id')
                    },
                    success : function(data) {
                        toastr['success']('Successfully deleted.');
                        oTable.fnDeleteRow(nRow);
                    },
                    error : function() {
                        toastr['error']('Happening any errors on user delete.');
                    }
                })
            })
        }
    
        return {
    
            //main function to initiate the module
            init: function () {
    
                if (!jQuery().dataTable) {
                    return;
                }
    
                console.log('me 1');
    
                usertable();
    
                console.log('me 2');
            }
    
        };
    
    }();

    var CategoryTable = function () {

        var categorytable = function () {
    
            function restoreRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
    
                for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                    oTable.fnUpdate(aData[i], nRow, i, false);
                }
    
                oTable.fnDraw();
            }
    
            function editRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                jqTds[0].innerHTML = '<input type="text" class="form-control input-small language" style="width:100%!important;" value="' + aData[0] + '" autofocus>';
                jqTds[1].innerHTML = '<input type="text" class="form-control input-small category" style="width:100%!important;" value="' + aData[1] + '" autofocus>';
                jqTds[2].innerHTML = '<a class="edit btn btn-sm blue save" href="" title="save"><i class="fa fa-save"></i></a>&nbsp;<a class="cancel btn btn-sm yellow" href="" title="cancel"><i class="fa fa-times"></i></a>';
            }
    
            function saveRow(oTable, nRow, cat_id) {
                var jqInputs = $('input', nRow);
                if(jqInputs[1].value == ''){
                    toastr['error']('Please enter category.');
                    return false;
                }
                if(jqInputs[0].value == ''){
                    toastr['error']('Please enter language.');
                    return false;
                }
                if(jqInputs[0].value != 'EN' || jqInputs[0].value != 'GR')
                {
                    toastr['error']('Please type language "EN" or "GR".');
                }
                if((jqInputs[0].value == 'EN' || jqInputs[0].value == 'GR') && jqInputs[1].value != '') {
                    $.ajax({
                        url : '/admin/category/save',
                        method : 'post',
                        data : {
                            language : jqInputs[0].value,
                            category : jqInputs[1].value,
                            cat_id : cat_id
                        },
                        success : function (data) {
                            if(data.msg == 'save') {
                                toastr['success']('Successfully saved.');
                                $(nRow).attr('cat_id', data.category._id);
                                var append_html = '<option value="'+data.category._id+'">'+data.category.name+'</option>';
                                $('#category').append(append_html);
                                $('#category').select2();
                            } else {
                                toastr['success']('Successfully updated.');
                                $('#category>option').each(function() {
                                    if($(this).val() === data.category._id) {
                                        $(this).text(data.category.name);
                                    }
                                })
                            }
                            if(jqInputs[0].value == 'EN')
                            {
                                var text_color = 'text-danger';
                            }
                            if(jqInputs[0].value == 'GR')
                            {
                                var text_color = 'text-primary';
                            }
                            oTable.fnUpdate(`<label class="bold ${text_color}">${jqInputs[0].value}</label>`, nRow, 0, false);
                            oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                            oTable.fnUpdate('<a class="edit btn btn-sm btn-success" href="" title="edit"><i class="fa fa-pencil"></i></a>&nbsp;<a class="delete btn btn-sm btn-danger" href="" title="delete"><i class="fa fa-trash"></i></a>', nRow, 2, false);
                            oTable.fnDraw();
                            
                            $('.edit').removeAttr('disabled');
                            $('.delete').removeAttr('disabled');
                            $('#btn_add').removeAttr('disabled');
                            return true;
                        },
                        error : function() {
                            toastr['error']('Happening any errors in server.');
                            return false;
                        }
                    })
                    
                }
                
            }
    
            function cancelEditRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable.fnUpdate('<a class="edit btn btn-sm btn-success" href="" title="edit"><i class="fa fa-pencil"></i></a>', nRow, 2, false);
                oTable.fnDraw();
            }
    
            var table = $('#category_table');
    
            var oTable = table.dataTable({
    
                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
                // So when dropdowns used the scrollable div should be removed. 
                //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
    
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
    
                // Or you can use remote translation file
                //"language": {
                //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
                //},
    
                // set the initial value
                "pageLength": 15,
    
                "language": {
                    "lengthMenu": " _MENU_ records",
                    "search": "",
                },
                "columnDefs": [{ // set default column settings
                    'orderable': true,
                    'targets': [0]
                }, {
                    "searchable": true,
                    "targets": [0]
                }],
                "order": [
                    [1, "asc"]
                ] // set first column as a default sort by asc
            });
    
            var tableWrapper = $("#category_table_wrapper");
    
            tableWrapper.find(".dataTables_length select").select2({
                showSearchInput: false //hide search box with special css class
            }); // initialize select2 dropdown
    
            var nEditing = null;
            var nNew = false;
    
            $('#btn_add').click(function (e) {
                console.log('click')
                e.preventDefault();
                $('.edit').attr('disabled', 'disabled');
                $('.delete').attr('disabled', 'disabled');
                $(this).attr('disabled', 'disabled');
    
                var aiNew = oTable.fnAddData(['', '', '']);
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable, nRow);
                nEditing = nRow;
                nNew = true;
            });
            
            table.on('keydown', '.category', function(e) {
                if(e.which === 13) {
                    var flag;
                    
                    var nRow = $(this).parents('tr')[0];
                    if(!$(this).parents('tr').eq(0).attr('cat_id')) {
                        cat_id = '';
                    } else {
                        cat_id = $(this).parents('tr').eq(0).attr('cat_id');
                    }
                    if(saveRow(oTable, nEditing, cat_id)){
                        nEditing = null;
                    }
                }
            });

            table.on('click', '.delete', function (e) {
                e.preventDefault();
    
                var nRow = $(this).parents('tr')[0];
                var cat_id = $(this).parents('tr').eq(0).attr('cat_id');
                bootbox.dialog({
                    message: "Are you sure to delete this row ?",
                    title: "<i class='fa fa-trash'></i> DELETE",
                    buttons: {
                      success: {
                        label: "YES",
                        className: "green",
                        callback: function() {
                            $.ajax({
                                url : '/admin/category/delete',
                                method : 'post',
                                data : {
                                    cat_id : cat_id
                                },
                                success : function(data) {
                                    $('#category>option').each(function() {
                                        if($(this).val() == data.category._id) {
                                            $(this).remove();
                                        }
                                    });
                                    toastr['success']('Successfully deleted.');
                                    oTable.fnDeleteRow(nRow);
                                },
                                error : function() {
                                    toastr['error']('Happening any errors in server.');
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
    
            table.on('click', '.cancel', function (e) {
                e.preventDefault();
                if (nNew) {
                    oTable.fnDeleteRow(nEditing);
                    nEditing = null;
                    nNew = false;
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
                
                $('.edit').removeAttr('disabled');
                $('.delete').removeAttr('disabled');
                $('#btn_add').removeAttr('disabled');
            });
    
            table.on('click', '.edit', function (e) {
                e.preventDefault();
    
                $('.edit').attr('disabled', 'disabled');
                $('.delete').attr('disabled', 'disabled');
                $('#btn_add').attr('disabled', 'disabled');
                $('.save').removeAttr('disabled', 'disabled');
                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];
    
                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && $(this).hasClass('save')) {
                    /* Editing this row and want to save it */
                    var flag;
                    if(!$(this).parents('tr').eq(0).attr('cat_id')) {
                        cat_id = '';
                    } else {
                        cat_id = $(this).parents('tr').eq(0).attr('cat_id');
                    }
                    if(saveRow(oTable, nEditing, cat_id)){
                        nEditing = null;
                    }
                    
                } else {
                    /* No edit in progress - let's start one */
                    editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });

            var save = function() {
                
            }
        }
    
        return {
    
            //main function to initiate the module
            init: function () {
                categorytable();
            }
    
        };
    
    }();

    var IndustryTable = function () {

        var industrytable = function () {
    
            function restoreRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
    
                for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                    oTable.fnUpdate(aData[i], nRow, i, false);
                }
    
                oTable.fnDraw();
            }
    
            function editRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);
                jqTds[0].innerHTML = '<input type="text" class="form-control input-small industry" style="width:100%!important;" value="' + aData[0] + '" autofocus>';
                jqTds[1].innerHTML = '<a class="industry_edit btn btn-sm blue industry_save" href="" title="save"><i class="fa fa-save"></i></a>&nbsp;<a class="industry_cancel btn btn-sm yellow" href="" title="cancel"><i class="fa fa-times"></i></a>';
            }
    
            function saveRow(oTable, nRow, industry_id) {
                var jqInputs = $('input', nRow);
                if(jqInputs[0].value == ''){
                    toastr['error']('Please enter category.');
                    return false;
                }else {
                    $.ajax({
                        url : '/admin/industry/save',
                        method : 'post',
                        data : {
                            industry : jqInputs[0].value,
                            industry_id : industry_id
                        },
                        success : function (data) {
                            if(data.msg == 'industry_save') {
                                toastr['success']('Successfully saved.');
                                $(nRow).attr('industry_id', data.category._id);
                            } else {
                                toastr['success']('Successfully updated.');
                            }
                            oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                            oTable.fnUpdate('<a class="industry_edit btn btn-sm btn-success" href="" title="edit"><i class="fa fa-pencil"></i></a>&nbsp;<a class="industry_delete btn btn-sm btn-danger" href="" title="delete"><i class="fa fa-trash"></i></a>', nRow, 1, false);
                            oTable.fnDraw();
                            
                            $('.industry_edit').removeAttr('disabled');
                            $('.industry_delete').removeAttr('disabled');
                            $('#btn_industry_add').removeAttr('disabled');
                            return true;
                        },
                        error : function() {
                            toastr['error']('Happening any errors in server.');
                            return false;
                        }
                    })
                    
                }
                
            }
    
            function cancelEditRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate('<a class="industry_edit btn btn-sm btn-success" href="" title="edit"><i class="fa fa-pencil"></i></a>', nRow, 1, false);
                oTable.fnDraw();
            }
    
            var table = $('#industry_table');
    
            var oTable = table.dataTable({
    
                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
                // So when dropdowns used the scrollable div should be removed. 
                //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
    
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
    
                // Or you can use remote translation file
                //"language": {
                //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
                //},
    
                // set the initial value
                "pageLength": 5,
    
                "language": {
                    "lengthMenu": " _MENU_ records",
                    "search": "",
                },
                "columnDefs": [{ // set default column settings
                    'orderable': true,
                    'targets': [0]
                }, {
                    "searchable": true,
                    "targets": [0]
                }],
                "order": [
                    [0, "asc"]
                ] // set first column as a default sort by asc
            });
    
            var tableWrapper = $("#industry_table_wrapper");
    
            tableWrapper.find(".dataTables_length select").select2({
                showSearchInput: false //hide search box with special css class
            }); // initialize select2 dropdown
    
            var nEditing = null;
            var nNew = false;
    
            $('#btn_industry_add').click(function (e) {
                e.preventDefault();
                $('.industry_edit').attr('disabled', 'disabled');
                $('.industry_delete').attr('disabled', 'disabled');
                $(this).attr('disabled', 'disabled');
    
                var aiNew = oTable.fnAddData(['', '']);
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable, nRow);
                nEditing = nRow;
                nNew = true;
            });
            
            table.on('keydown', '.industry', function(e) {
                if(e.which === 13) {
                    var flag;
                    
                    var nRow = $(this).parents('tr')[0];
                    if(!$(this).parents('tr').eq(0).attr('industry_id')) {
                        industry_id = '';
                    } else {
                        industry_id = $(this).parents('tr').eq(0).attr('industry_id');
                    }
                    if(saveRow(oTable, nEditing, industry_id)){
                        nEditing = null;
                    }
                }
            });

            table.on('click', '.industry_delete', function (e) {
                e.preventDefault();
    
                var nRow = $(this).parents('tr')[0];
                var industry_id = $(this).parents('tr').eq(0).attr('industry_id');
                bootbox.dialog({
                    message: "Are you sure to delete this row ?",
                    title: "<i class='fa fa-trash'></i> DELETE",
                    buttons: {
                      success: {
                        label: "YES",
                        className: "green",
                        callback: function() {
                            $.ajax({
                                url : '/admin/industry/delete',
                                method : 'post',
                                data : {
                                    industry_id : industry_id
                                },
                                success : function(data) {
                                    toastr['success']('Successfully deleted.');
                                    oTable.fnDeleteRow(nRow);
                                },
                                error : function() {
                                    toastr['error']('Happening any errors in server.');
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
    
            table.on('click', '.industry_cancel', function (e) {
                e.preventDefault();
                if (nNew) {
                    oTable.fnDeleteRow(nEditing);
                    nEditing = null;
                    nNew = false;
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
                
                $('.industry_edit').removeAttr('disabled');
                $('.industry_delete').removeAttr('disabled');
                $('#btn_industry_add').removeAttr('disabled');
            });
    
            table.on('click', '.industry_edit', function (e) {
                e.preventDefault();
    
                $('.industry_edit').attr('disabled', 'disabled');
                $('.industry_delete').attr('disabled', 'disabled');
                $('#btn_industry_add').attr('disabled', 'disabled');
                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];
    
                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && $(this).hasClass('industry_save')) {
                    /* Editing this row and want to save it */
                    var flag;
                    if(!$(this).parents('tr').eq(0).attr('industry_id')) {
                        industry_id = '';
                    } else {
                        industry_id = $(this).parents('tr').eq(0).attr('industry_id');
                    }
                    if(saveRow(oTable, nEditing, industry_id)){
                        nEditing = null;
                    }
                    
                } else {
                    /* No edit in progress - let's start one */
                    editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });

        }
    
        return {
    
            //main function to initiate the module
            init: function () {
                industrytable();
            }
    
        };
    
    }();

    var PostTable = function () {
    
        var posttable = function () {
    
            var table = $('#post_table');
    
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
                "columns": [
                    { "width": "5%" },
                    { "width": "10%" },
                    { "width": "10%" },
                    { "width": "40%" },
                    { "width": "10%" },
                    { "width": "10%" },
                    { "width": "15%" },
                  ],
                "order": [
                    [5, 'desc']
                ],
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                "pageLength": 5, // set the initial value,
                "columnDefs": [{  // set default column settings
                    'orderable': false,
                    'targets': [0]
                }, {
                    "searchable": false,
                    "targets": [0]
                }] 
            });
    
            var oTableColReorder = new $.fn.dataTable.ColReorder( oTable );
    
            var tableWrapper = $('#post_table_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
            tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

            

            $('#category').change(function() {
                $('#categoryname').val($('#category>:selected').text());
            });

            var get_skip_content = function(content) {
                var str = '';
                var content_arr = Array();
                content_arr = content.split('<p>');
                for(var j = 0 ; j < content_arr.length ; j ++) {
                    str = str + content_arr[j];
                }
                str_arr = str.split('</p>');
                var new_str = '';
                for(var j = 0 ; j < str_arr.length ; j ++) {
                    new_str = new_str + str_arr[j];
                }
                new_str = new_str.slice(0, 65)+'......';
                return new_str;
            }
            $.ajax({
                url : '/post/get',
                method : 'get',
                success : function(data) {
                    for(var i = 0 ; i < data.posts.length ; i ++ ){
                        
                        var content = get_skip_content(data.posts[i].content);
                        console.log(content)
                        if(data.posts[i].language == 'GR')
                        {
                            var color = 'text-primary';
                        }
                        if(data.posts[i].language == 'EN')
                        {
                            var color = 'text-danger';
                        }
                        oTable.fnAddData([`<label class="${color} bold">${data.posts[i].language}</label>`, `<label class="bold">${data.posts[i].industry}</label>`, data.posts[i].category, content, data.posts[i].poster, new Date(data.posts[i].created_at).getFullYear()+'-'+(new Date(data.posts[i].created_at).getMonth()+1)+'-'+new Date(data.posts[i].created_at).getDate()+' '+new Date(data.posts[i].created_at).getHours()+':'+new Date(data.posts[i].created_at).getMinutes()+':'+new Date(data.posts[i].created_at).getSeconds(), '<button class="btn btn-sm blue btn_view" post_id="'+data.posts[i]._id+'"><i class="icon-eye"></i> View</button>&nbsp;<button class="btn btn-sm btn-danger btn_post_delete" post_id="'+data.posts[i]._id+'"><i class="fa fa-trash"></i></button>']);
                        
                    }
                },
                error : function() {
                    toastr['error']('Happening any errors in post side.');
                }
            });

            table.on('click', '.btn_post_delete', function() {
                var post_id = $(this).attr('post_id');
                var nRow = $(this).parents('tr')[0];
                bootbox.dialog({
                    message: "Are you sure to delete this Post ?",
                    title: "<i class='fa fa-trash'></i> DELETE",
                    buttons: {
                      success: {
                        label: "YES",
                        className: "green",
                        callback: function() {
                            $.ajax({
                                url : '/admin/post/delete',
                                method : 'post',
                                data : {
                                    post_id : post_id
                                },
                                success : function(data) {
                                    toastr['success']('Successfully deleted post.');
                                    oTable.fnDeleteRow(nRow);
                                },
                                error : function() {
                                    toastr['error']('Happening any errors on post delete.');
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

            table.on('click', '.btn_view', function() {
                $.ajax({
                    url : '/post/preview',
                    method :'post',
                    data : {
                        post_id : $(this).attr('post_id')
                    },
                    success : function(data) {
                        console.log(data.post)
                            var slide_html = `<div class="blog-item-img">
                                                <!-- BEGIN CAROUSEL -->            
                                                <div class="front-carousel">
                                                    <div id="myCarousel" class="carousel slide">
                                                        <!-- Carousel items -->
                                                        <div class="carousel-inner" id="carousel_image">
                                                            <div class="item active">
                                                                <img src="../../uploads/posts/${data.post.image}" style="height: 100%; width:100%;" alt="">
                                                            </div>
                                                        </div>
                                                    </div>                
                                                </div>
                                                <!-- END CAROUSEL -->             
                                            </div><br>`;
                        $('#slide_div').html(slide_html);
                        $('#post_title').text(data.post.title);
                        $('#preview_body').html(data.post.content);
                        $('#label_name').html(data.post.poster);
                        $('#label_email').html(data.post.poster_email);
                        $('#label_phone').html(data.post.poster_phone);
                        $('#label_created_at').html(new Date(data.post.created_at).getFullYear()+'-'+(new Date(data.post.created_at).getMonth()+1)+'-'+new Date(data.post.created_at).getDate()+' '+new Date(data.post.created_at).getHours()+':'+new Date(data.post.created_at).getMinutes()+':'+new Date(data.post.created_at).getSeconds());
                        $('#label_category').html(data.post.category);
                        $('#label_lang').html(data.post.language);
                        $('#label_industry').html(data.post.industry);
                        $('#preview').modal('show');
                    },
                    error : function() {
                        toastr['error']('Happening any errors in post preview.')
                    }
                })
            });

            $('#btn_div').hide();

            $('#btn_save').click(function() {
    
                var category_id = $('#category').val();
                var content = CKEDITOR.instances.content.getData();
                console.log($('#category>:selected').text());
                var category = $('#category>:selected').text();
                var title = $('#title').val();
                var fullname = $('#fullname').val();
                var email = $('#email').val();
                var phone = $('#phone').val();
                var industry = $('#industry').val();

                if(fullname == '')
                {
                  toastr['warning']('Please enter Full Name.');
                }
                if(email == '')
                {
                  toastr['warning']('Please enter Email');
                }
                if(phone == '')
                {
                  toastr['warning']('Please enter Phone Number.');
                }
                if(title == '')
                {
                  toastr['warning']('Please enter Title.')
                }
                if(content == '')
                {
                  toastr['warning']('Please enter Content.');
                }
                if(fullname != '' && email != '' && phone != '' && title != '' && content != '')
                {
                  var image = $('#file').val();
                  Metronic.blockUI({
                    boxed : true,
                    message: 'Post saving...'
                    });
                  $.ajax({
                      url : '/post/save',
                      method : 'post',
                      data : {
                          category_id : category_id,
                          categoryname : category,
                          content : content,
                          title : title,
                          fullname : $('#fullname').val(),
                          email : $('#email').val(),
                          phone : $('#phone').val(),
                          file : image,
                          language : $('#language').val(),
                          industry : industry
                      },
                      success : function (data) {
                        //   window.location.reload();
                        if(data.post.language == 'GR')
                        {
                            var color = 'text-primary';
                        }
                        if(data.post.language == 'EN')
                        {
                            var color = 'text-danger';
                        }
                        var content = get_skip_content(data.post.content);
                        var created_at = new Date(data.post.created_at).getFullYear()+'-'+(new Date(data.post.created_at).getMonth()+1)+'-'+new Date(data.post.created_at).getDate()+' '+new Date(data.post.created_at).getHours()+':'+new Date(data.post.created_at).getMinutes()+':'+new Date(data.post.created_at).getSeconds();
                        oTable.fnAddData([`<label class="${color} bold">${data.post.language}</label>`, `<label class="bold">${data.post.industry}</label>`, data.post.category, content, data.post.poster, created_at, '<button class="btn btn-sm blue btn_view" post_id="'+data.post._id+'"><i class="icon-eye"></i> View</button>&nbsp;<button class="btn btn-sm btn-danger btn_post_delete" post_id="'+data.post._id+'"><i class="fa fa-trash"></i></button>'])
                        toastr['success']('Successfully posted.');
                        $('#title').val('');
                        CKEDITOR.instances.content.setData('');
                        $('#postForm').html('<input type="hidden" id="file" value="">');
                        Metronic.unblockUI();
                      },
                      error : function () {
                          toastr['error']('Happening any errors in server.');
                      }
                  });
                }
                
            });

            $('#btn_preview').click(function() {
                
                var slide_html = `<div class="blog-item-img">
                                    <!-- BEGIN CAROUSEL -->            
                                    <div class="front-carousel">
                                        <div id="myCarousel" class="carousel slide">
                                            <!-- Carousel items -->
                                            <div class="carousel-inner" id="carousel_image">
                                                <div class="item active">
                                                    <img src="../../uploads/posts/${$('#file').val()}" style="height: 100%; width:100%;" alt="">
                                                </div>
                                            </div>
                                        </div>                
                                    </div>
                                    <!-- END CAROUSEL -->             
                                </div><br>`;
                $('#pre_slide_div').html(slide_html);
                
                var today = new Date();
                console.log($('#email').val())
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+ ' ' + today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
                $('#pre_label_created_at').html(date);
                $('#pre_label_category').html($('#category>:selected').text());
                $('#pre_post_title').html($('#title').val());
                $('#pre_preview_body').html(CKEDITOR.instances.content.getData());
                $('#pre_label_email').html($('#email').val());
                $('#pre_label_phone').html($('#phone').val());
                $('#pre_label_name').html($('#fullname').val());
                $('#pre_label_lang').html($('#language').val());
                $('#pre_label_industry').html($('#industry').val());
                var count = 0;
                setInterval(function(){ 
                    count++;
                    if(count == 30) {
                        $('#previewModal').modal('hide');
                    }
                }, 1000);
            });

            $('#btn_upload').hide();
            $('input[type=file]').change(function () {
                $('#btn_upload').show(500);
            });

            $('#btn_reset').click(function() {
                CKEDITOR.instances.content.setData('');
                $('#btn_upload').hide(500);
            })
                
            $('#btn_upload').click(function() {
                var data = new FormData();
                $.each($('#photo')[0].files, function(i, file) {
                    data.append('file-'+i, file);
                });
                Metronic.blockUI({
                    boxed : true,
                    message: 'Image uploading...'
                });
                $.ajax({
                    url: '/post/filesupload',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    method: 'POST',
                    type: 'POST', // For jQuery < 1.9
                    success: function(data){
                        toastr['success']('Successfully uploaded.');
                        Metronic.unblockUI();
                        $('#postForm').html('<input type="hidden" id="file" value="'+data.image_name+'">');
                    }
                });
                $('#btn_div').show(500);
            });

            $('.btn_file_cancel').click(function() {
                var file_num = $(this).parents('tr').eq(0).attr('file_id');
                console.log(file_num)
            })
        }
    
        return {
    
            //main function to initiate the module
            init: function () {
    
                if (!jQuery().dataTable) {
                    return;
                }
                posttable();
            }
    
        };
    
    }();

    UserTable.init();
    CategoryTable.init();
    IndustryTable.init(); 
    PostTable.init();

    $('#category').select2();
    $("#phone").inputmask("+9999999999", {
        placeholder: "",
        clearMaskOnLostFocus: true
    }); //default
    

})