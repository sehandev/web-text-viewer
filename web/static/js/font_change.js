let font_name_arr = ["font-gothic", "font-sans", "font-serif"]
let font_size_arr = ["font-small", "font-medium", "font-large", "font-xlarge"]

function get_font_info() {
    let class_list = document.getElementById("txt-content-area").classList
    let font_name, font_size
    font_name_arr.some((tmp_font_name) => {
        if (class_list.contains(tmp_font_name)) {
            font_name = tmp_font_name
            return true
        }
    })
    font_size_arr.some((tmp_font_size) => {
        if (class_list.contains(tmp_font_size)) {
            font_size = tmp_font_size
            return true
        }
    })

    return [font_name, font_size]
}

$("#gothic-button").click(() => {
    $("#txt-content-area").addClass("font-gothic")
    $("#txt-content-area").removeClass("font-sans font-serif")
    $("#compute-width").addClass("font-gothic")
    $("#compute-width").removeClass("font-sans font-serif")
    recalculate_page()
})

$("#sans-button").click(() => {
    $("#txt-content-area").addClass("font-sans")
    $("#txt-content-area").removeClass("font-gothic font-serif")
    $("#compute-width").addClass("font-sans")
    $("#compute-width").removeClass("font-gothic font-serif")
    recalculate_page()
})

$("#serif-button").click(() => {
    $("#txt-content-area").addClass("font-serif")
    $("#txt-content-area").removeClass("font-sans font-gothic")
    $("#compute-width").addClass("font-serif")
    $("#compute-width").removeClass("font-sans font-gothic")
    recalculate_page()
})

$("#font-small-button").click(() => {
    $("#txt-content-area").addClass("font-small")
    $("#txt-content-area").removeClass("font-medium font-large font-xlarge")
    $("#compute-width").addClass("font-small")
    $("#compute-width").removeClass("font-medium font-large font-xlarge")
    recalculate_page()
})

$("#font-medium-button").click(() => {
    $("#txt-content-area").addClass("font-medium")
    $("#txt-content-area").removeClass("font-small font-large font-xlarge")
    $("#compute-width").addClass("font-medium")
    $("#compute-width").removeClass("font-small font-large font-xlarge")
    recalculate_page()
})

$("#font-large-button").click(() => {
    $("#txt-content-area").addClass("font-large")
    $("#txt-content-area").removeClass("font-small font-medium font-xlarge")
    $("#compute-width").addClass("font-large")
    $("#compute-width").removeClass("font-small font-medium font-xlarge")
    recalculate_page()
})

$("#font-xlarge-button").click(() => {
    $("#txt-content-area").addClass("font-xlarge")
    $("#txt-content-area").removeClass("font-small font-medium font-large")
    $("#compute-width").addClass("font-xlarge")
    $("#compute-width").removeClass("font-small font-medium font-large")
    recalculate_page()
})
