// load 완료하면 ajax로 id에 해당하는 txt 불러오기
document.addEventListener("DOMContentLoaded", () => {
    let user_id = document.getElementById("user-id").textContent
    var xhr = new XMLHttpRequest()
    var url = "http://api.sehandev.com/starts/" + user_id
    xhr.open("GET", url, true)
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var ajax_data = JSON.parse(xhr.responseText)
            ajax_data.forEach((data) => {
                let li = document.createElement("li")
                li.innerHTML = `
                    <a href="/views/${data["txt_id"]}">
                        ${data["txt_title"]}
                    </a>
                    `
                document.getElementById("start-list").appendChild(li)
            })
        }
    }
    xhr.send()
})
