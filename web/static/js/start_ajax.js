$(document).ready(() => {
    $.ajax({
        url: "http://api.sehandev.com/starts/" + document.getElementById("user-id").textContent,
        type: "GET",
        dataType: "json",
        cache: true,
        success: (data) => {
            data.forEach((start_map) => {
                console.log(start_map)
                $("#start-list").append("<li>" + '<a href="/views/' + start_map["txt_id"] + '">' + start_map["txt_title"] + "</a>" + "</li>")
            })
        },
    })
})
