let content_string = ""
let content_arr = []
let page_index = 0
let max_page_index = 0

function getType(tmp) {
    return Object.prototype.toString.call(tmp).slice(8, -1)
}

function isString(tmp) {
    let type = getType(tmp)
    if (type == "String") {
        return true
    }
    return false
}

// split_txt_content : content를 한 page에 보이게 (scroll 안해도 되도록) 나눠서 content_arr에 저장
// txt_content (String) : TODO
function split_txt_content(txt_content) {
    let margin_height = 0
    let textarea_height = parseInt($("#txt-content-area").height())
    let line_height = parseInt($("#txt-content-area").css("lineHeight"))
    let line_limit = Math.floor((textarea_height - margin_height * 2) / line_height)

    content_arr = [] // 초기화
    let content_line_arr = txt_content.split("\n")

    let full_line_count = 0 // 누적 줄 수
    let content_part_arr = [] // 누적 문자열 배열
    for (let index = 0; index < 300; index++) {
        let line_count = 0 // 현재 줄 수
        let content_line = content_line_arr[index] // 현재 문자열

        // string 확인
        if (!isString(content_line)) {
            continue
        }

        // 몇 줄인지 확인
        document.getElementById("compute-width").innerText = content_line
        line_count = document.getElementById("compute-width").offsetHeight / 40
        if (line_count < 1) {
            line_count = 1
        }

        // 줄 수 제한을 넘어갈 예정이라면 다음 page로 넘기기
        if (line_limit < full_line_count + line_count) {
            // 누적 문자열 추가
            content_arr.push(content_part_arr.join("\n"))

            // 변수 초기화
            full_line_count = 0
            content_part_arr = []
        }

        // 현재 줄 추가
        content_part_arr.push(content_line)
        full_line_count += line_count
    }

    max_page_index = content_arr.length - 1
    document.getElementById("compute-width").innerText = ""
}

function recalculate_page() {
    split_txt_content(content_string)
    $("#txt-content-area").html(content_arr[page_index])
    $("#page-index").html(page_index)
    $("#max-index").html(max_page_index)
}

// 페이지 열면 바로 ajax로 id에 해당하는 txt 불러오기
$(document).ready(() => {
    $.ajax({
        url: "http://api.sehandev.com/contents/" + $("#txt-id").attr("value"),
        type: "GET",
        dataType: "json",
        cache: true,
        success: (data) => {
            $("#txt-title").html(data.title)
            $("#prev-id").attr("value", data.prevID)
            $("#next-id").attr("value", data.nextID)

            // content를 한 페이지에 보이게 (스크롤 안해도 되도록) 나누기
            content_string = data.content
            console.log(content_string)
            recalculate_page()

            $("#previous-button").click(previous_page)
            $("#next-button").click(next_page)
            document.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 37: // 키보드 왼쪽 화살표
                        previous_page()
                        break
                    case 39: // 키보드 오른쪽 화살표
                        next_page()
                        break
                    case 27: // 키보드 Esc
                        $("#nav-overlay").toggleClass("hide-menu")
                }
            }
        },
    })
})

// 이전 페이지
function previous_page() {
    if (page_index > 0) {
        page_index -= 1
        $("#txt-content-area").html(content_arr[page_index])
        $("#page-index").html(page_index)
    } else {
        // 첫 페이지면 이전 부분으로 넘어가기
        move_prev_part()
    }
}

function move_prev_part() {
    // 첫 부분인 경우 메세지
    let prev_id = $("#prev-id").attr("value")
    if (prev_id == "000000000000000000000000") {
        alert("처음입니다.")
    }
    // 첫 부분이 아닌 경우 이전 부분으로 이동
    else {
        let font_info_arr = get_font_info()
        let font_name = font_info_arr[0]
        let font_size = font_info_arr[1]
        window.location.href = "/views/" + prev_id + "?font-name=" + font_name + "&font-size=" + font_size
    }
}

// 다음 페이지
function next_page() {
    if (page_index < max_page_index) {
        page_index += 1
        $("#txt-content-area").html(content_arr[page_index])
        $("#page-index").html(page_index)
    } else {
        // 마지막 페이지면 다음 부분으로 넘어가기
        move_next_part()
    }
}

function move_next_part() {
    // 마지막 부분인 경우 메세지
    let next_id = $("#next-id").attr("value")
    if (next_id == "000000000000000000000000") {
        alert("마지막입니다.")
    }
    // 마지막 부분이 아닌 경우 다음 부분으로 이동
    else {
        let font_info_arr = get_font_info()
        let font_name = font_info_arr[0]
        let font_size = font_info_arr[1]
        window.location.href = "/views/" + next_id + "?font-name=" + font_name + "&font-size=" + font_size
    }
}
