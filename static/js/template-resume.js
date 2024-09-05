
const CACHE_NAME = "templateInfo"
let selectedTemplateId = null
let isHeadshot = false
let selectedColor = "#ffffff"
let headshotRadios = document.querySelectorAll('input[name="headshot"]');

// Load cache
let templateInfo = JSON.parse(localStorage.getItem(CACHE_NAME))
if (templateInfo) {
    selectedTemplateId = templateInfo["templateId"]
    selectedColor = templateInfo["templateColor"]
    selectTemplate(selectedTemplateId)
    changeSVGBackground(selectedColor);

    isHeadshot = templateInfo["isHeadshot"]
    if (isHeadshot) {
        document.getElementById("with-headshot").checked = true;
    } else {

        document.getElementById("without-headshot").checked = true;
    }
}

// color radio 
document.querySelectorAll(".color-radio").forEach(radio => {
    radio.addEventListener("click", function () {
        selectedColor = this.getAttribute("data-color");
        changeSVGBackground(selectedColor);
    });
});

headshotRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        let headshotValue = document.querySelector('input[name="headshot"]:checked').value;
        console.log(`Selected Value: ${headshotValue}`);
        isHeadshot = headshotValue === '1' ? 1 : 0;

    });
})
function selectTemplate(templateId) {

    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('active');
    });

    const selectedTemplate = document.getElementById(templateId);
    if (selectedTemplate) {
        selectedTemplate.classList.add('active');
        selectedTemplateId = templateId;
        console.log("Selected template: " + templateId);
    }
}




function changeSVGBackground(color) {
    document.querySelectorAll(".template-card svg").forEach(svgElement => {
        svgElement.style.backgroundColor = color;
    });
}

function cachedTemplateInfo() {
    if (selectedTemplateId !== null) {
        tempateInfo = {
            "templateId": selectedTemplateId,
            "isHeadshot": isHeadshot,
            "templateColor": selectedColor
        }
        localStorage.setItem(CACHE_NAME, JSON.stringify(tempateInfo));
        window.location.href = "/resume/section/heading"

    } else {
        alert("Please choose one of the template.")
    }

}
