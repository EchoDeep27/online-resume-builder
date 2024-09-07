
const CACHE_NAME = "templateInfo"
let selectedTemplateId = null
let isHeadshot = false
let selectedColor = "#434E5E"
let headshotRadios = document.querySelectorAll('input[name="headshot"]');

// Load cache
let templateInfo = JSON.parse(localStorage.getItem(CACHE_NAME))
if (templateInfo) {
    selectedTemplateId = templateInfo["templateId"]
    selectedColor = templateInfo["templateTheme"]

    selectTemplate(selectedTemplateId)
    changeTemplateTheme(selectedColor);

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
        changeTemplateTheme(selectedColor);
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
    console.log("here")
    document.querySelectorAll('.resume-template').forEach(card => {
        card.classList.remove('active');
    });

    const selectedTemplate = document.getElementById(templateId);
    if (selectedTemplate) {
        selectedTemplate.classList.add('active');
        selectedTemplateId = templateId;
        console.log("Selected template: " + templateId);
    }
}




function changeTemplateTheme(color) {
    const root = document.documentElement;
    root.style.setProperty('--template-bg-color', color);
}

function cachedTemplateInfo() {
    if (selectedTemplateId !== null) {
        tempateInfo = {
            "templateId": selectedTemplateId,
            "isHeadshot": isHeadshot,
            "templateTheme": selectedColor
        }
        localStorage.setItem(CACHE_NAME, JSON.stringify(tempateInfo));
        window.location.href = `/resume/section/heading?template_id=${selectedTemplateId}`

    } else {
        alert("Please choose one of the template.")
    }

}
