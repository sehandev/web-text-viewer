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
                let a_tag = document.createElement("a")
                a_tag.href = `/views/${data["txt_id"]}`
                a_tag.classList.add("list-group-item", "list-group-item-action", "p-3")
                a_tag.setAttribute("aria-current", "true")
                a_tag.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <span class="mx-2 text-break txt-title">${data["txt_title"]}</span>
                        <span class="badge bg-warning date-badge">2020.04.10</span>
                    </div>
                `
                document.getElementById("start-list").appendChild(a_tag)
            })
        }
    }
    xhr.send()
})
