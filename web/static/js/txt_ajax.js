let content_string = "";
let content_arr = [];
let page_index = 0;
let max_page_index = 0;

function getType(tmp) {
    return Object.prototype.toString.call(tmp).slice(8, -1);
}

function isString(tmp) {
    let type = getType(tmp);
    if (type == "String") {
        return true;
    }
    return false;
}

// split_txt_content : content를 한 페이지에 보이게 (스크롤 안해도 되도록) 나눠서 content_arr에 저장
// txt_content (String) : TODO
function split_txt_content(txt_content) {
    let textarea_height = $("#txt-content-area").height();
    let line_height = parseInt($("#txt-content-area").css("lineHeight"));
    let line_limit = Math.floor(textarea_height / line_height);

    content_arr = []; // 초기화
    let content_line_arr = txt_content.split("\n");
    for (let split_index = 0; split_index < 300; split_index += line_limit) {

        let auto_new_line_count = 0;

        for (let i = split_index; i < split_index + line_limit; i++) {
            const content_line = content_line_arr[i];
            if (isString(content_line)) {

                // 몇 줄인지 확인해서 추가
                document.getElementById('compute-width').innerText = content_line;
                let line_count = document.getElementById('compute-width').offsetHeight / 40 - 1;
                auto_new_line_count += line_count;
            }
        }

        // 자동으로 넘어간 만큼 앞당겨서 자르기
        let tmp_content_part = content_line_arr.slice(split_index, split_index + line_limit - auto_new_line_count).join("\n");
        content_arr.push(tmp_content_part);

        // 원래보다 앞당겨서 자른 만큼 다음 자르기도 앞당겨서 시작
        split_index -= auto_new_line_count;
    }

    max_page_index = content_arr.length - 1;
    document.getElementById('compute-width').innerText = "";

    // console.log("textarea width : ", textarea_width);
    // console.log("textarea height : ", textarea_height);
    // console.log("line height : ", line_height);
    // console.log("line limit : ", line_limit);
    // console.log("page length : ", max_page_index);

}

function recalculate_page() {
    split_txt_content(content_string);
    $('#txt-content-area').html(content_arr[page_index]);
    $('#page-index').html(page_index);
    $('#max-index').html(max_page_index);
}

// 페이지 열면 바로 ajax로 id에 해당하는 txt 불러오기
$(document).ready(function() {
    $.ajax({
        url: 'http://api.sehandev.com/contents/' + $("#txt-id").attr("value"),
        type: 'GET',
        dataType: "json",
        cache: true,
        success: (data) => {

            $('#txt-title').html(data.title);
            $('#next-id').attr('value', data.nextID);

            // content를 한 페이지에 보이게 (스크롤 안해도 되도록) 나누기
            content_string = data.content;
            recalculate_page();

            $("#previous-button").click(previous_page);
            $("#next-button").click(next_page);
            document.onkeydown = function(e) {
                switch (e.keyCode) {
                    case 37: // 키보드 왼쪽 화살표
                        previous_page();
                        break;
                    case 39: // 키보드 오른쪽 화살표
                        next_page();
                        break;
                    case 27: // 키보드 Esc
                        $("#nav-overlay").toggleClass("hide-menu");
                }
            };
        }
    })
});

// 이전 페이지
function previous_page() {
    if (page_index > 0) {
        page_index -= 1;
    } else {
        page_index = 0;
    }
    $('#txt-content-area').html(content_arr[page_index]);
    $('#page-index').html(page_index);
}

// 다음 페이지
function next_page() {
    if (page_index < max_page_index) {
        page_index += 1;
        $('#txt-content-area').html(content_arr[page_index]);
        $('#page-index').html(page_index);
    } else {
        // 마지막 페이지면 다음 부분으로 넘어가기
        move_next_part();
    }
}

function move_next_part() {
    // 마지막 부분인 경우 메세지
    let next_id = $("#next-id").attr("value");
    if (next_id == "000000000000000000000000") {
        alert("마지막입니다.");
    }
    // 마지막 부분이 아닌 경우 다음 부분으로 이동
    else {
        let font_info_arr = get_font_info();
        let font_name = font_info_arr[0];
        let font_size = font_info_arr[1];
        window.location.href = '/views/' + next_id + "?font-name=" + font_name + "&font-size=" + font_size;
    }
}