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

let txt_content_area_class_list = document.getElementById("txt-content-area").classList
let compute_width_class_list = document.getElementById("compute-width").classList

document.getElementById("gothic-button").addEventListener("click", () => {
    txt_content_area_class_list.add("font-gothic")
    txt_content_area_class_list.remove("font-sans")
    txt_content_area_class_list.remove("font-serif")
    compute_width_class_list.add("font-gothic")
    compute_width_class_list.remove("font-sans")
    compute_width_class_list.remove("font-serif")
    recalculate_page()
})

document.getElementById("sans-button").addEventListener("click", () => {
    txt_content_area_class_list.add("font-sans")
    txt_content_area_class_list.remove("font-gothic")
    txt_content_area_class_list.remove("font-serif")
    compute_width_class_list.add("font-sans")
    compute_width_class_list.remove("font-gothic")
    compute_width_class_list.remove("font-serif")
    recalculate_page()
})

document.getElementById("serif-button").addEventListener("click", () => {
    txt_content_area_class_list.add("font-serif")
    txt_content_area_class_list.remove("font-sans")
    txt_content_area_class_list.remove("font-gothic")
    compute_width_class_list.add("font-serif")
    compute_width_class_list.remove("font-sans")
    compute_width_class_list.remove("font-gothic")
    recalculate_page()
})

document.getElementById("font-small-button").addEventListener("click", () => {
    txt_content_area_class_list.add("font-small")
    txt_content_area_class_list.remove("font-medium")
    txt_content_area_class_list.remove("font-large")
    txt_content_area_class_list.remove("font-xlarge")
    compute_width_class_list.add("font-small")
    compute_width_class_list.remove("font-medium")
    compute_width_class_list.remove("font-large")
    compute_width_class_list.remove("font-xlarge")
    recalculate_page()
})

document.getElementById("font-medium-button").addEventListener("click", () => {
    txt_content_area_class_list.add("font-medium")
    txt_content_area_class_list.remove("font-small")
    txt_content_area_class_list.remove("font-large")
    txt_content_area_class_list.remove("font-xlarge")
    compute_width_class_list.add("font-medium")
    compute_width_class_list.remove("font-small")
    compute_width_class_list.remove("font-large")
    compute_width_class_list.remove("font-xlarge")
    recalculate_page()
})

document.getElementById("font-large-button").addEventListener("click", () => {
    txt_content_area_class_list.add("font-large")
    txt_content_area_class_list.remove("font-small")
    txt_content_area_class_list.remove("font-medium")
    txt_content_area_class_list.remove("font-xlarge")
    compute_width_class_list.add("font-large")
    compute_width_class_list.remove("font-small")
    compute_width_class_list.remove("font-medium")
    compute_width_class_list.remove("font-xlarge")
    recalculate_page()
})

document.getElementById("font-xlarge-button").addEventListener("click", () => {
    txt_content_area_class_list.add("font-xlarge")
    txt_content_area_class_list.remove("font-small")
    txt_content_area_class_list.remove("font-medium")
    txt_content_area_class_list.remove("font-large")
    compute_width_class_list.add("font-xlarge")
    compute_width_class_list.remove("font-small")
    compute_width_class_list.remove("font-medium")
    compute_width_class_list.remove("font-large")
    recalculate_page()
})
