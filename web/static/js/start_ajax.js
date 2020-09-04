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
                let div = document.createElement("div")
                div.innerHTML = `
                    <a href="/views/${data["txt_id"]}" class="list-group-item list-group-item-action p-4" aria-current="true">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${data["txt_title"]}</h5>
                        <span class="badge bg-warning text-dark">2020.04.10</span>
                    </div>
                    </a>
                    `
                document.getElementById("start-list").appendChild(div)
            })
        }
    }
    xhr.send()
})
