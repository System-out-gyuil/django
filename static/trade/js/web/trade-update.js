const imageWraps = document.querySelectorAll(".prev-img-box-item")
const imageTags = document.querySelectorAll(".prev-img")
const imageSources = document.querySelectorAll("input[name=image-src]");
if (imageSources) {
    imageSources.forEach((src, i) => {
        imageTags[i].src = '/upload/' + src.value;
        imageWraps[i].style.display = "block";
    })
}