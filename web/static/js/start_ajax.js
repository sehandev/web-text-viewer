$(document).ready(function() {
    $.ajax({
        url: 'http://api.sehandev.com/starts/' + document.getElementById("user-id").textContent,
        // url: 'http://api.sehandev.com/starts/' + '5ef5a92b6d3b9f556188a48b',
        type: 'GET',
        dataType: "json",
        cache: true,
        success: (data) => {

            data.forEach(start_map => {
                console.log(start_map);
                $('#start-list').append(
                    '<li>' + 
                    '<a href="/views/' + start_map['txt_id'] + '">' + start_map['txt_title'] + '</a>' +
                    '</li>'
                    ); 
            });
        }
    })
});