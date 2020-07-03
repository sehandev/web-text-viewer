$(document).ready(function() {
    $.ajax({
        url: 'http://api.sehandev.com/users',
        type: 'GET',
        dataType: "json",
        cache: true,
        success: (data) => {

            data.forEach(user_map => {
                console.log(user_map);
                $('#user-list').append(
                    '<li>' + 
                    '<a href="/starts/' + user_map['id'] + '">' + user_map['user_name'] + '</a>' +
                    '</li>'
                    ); 
            });
        }
    })
});