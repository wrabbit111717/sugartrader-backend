$(document).ready(function() {
    $('#btn_post').click(function(){
        toastr['info'](`You can't post. Your membership is 0.`, 'Info!');
    })

    function format(state) {
        if (!state.id) return state.text; // optgroup
        return "<img class='flag' src='../../images/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
    }


    $("#language").select2({
        placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a language',
        allowClear: true,
        formatResult: format,
        formatSelection: format,
        escapeMarkup: function (m) {
            return m;
        },
        minimumResultsForSearch: -1
    });
})