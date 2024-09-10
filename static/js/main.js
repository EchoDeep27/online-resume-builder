document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("form input").forEach(input => {
        input.addEventListener("focus", function () {
            this.previousElementSibling.style.color = "var(--primary-color)";
            this.style.borderColor = "var(--primary-color)";
        });
        input.addEventListener("blur", function () {
            this.previousElementSibling.style.color = "black";
            this.style.borderColor = "#8f8f9d";
        });
    });


    let username = document.getElementById("pv-username")
    let profession = document.getElementById("pv-profession")
    let email = document.getElementById("pv-email")
    let phone = document.getElementById("pv-phone")
    let city = document.getElementById("pv-city")
    let country = document.getElementById("pv-country")
    let summary = document.getElementById("pv-summary")

    function typeText(text, element) {
        if (!text || text == "") {
            return
        }
        // let originalText = text
        // convert to lower case because the display text is in uppercase
        text = text.toLowerCase();
        let currentText = element.innerHTML.toLowerCase();
        if (currentText === text) {
            return;
        }

        let oldTextPart = "";
        let newText = "";
        let i = 0;

        while (i < currentText.length && i < text.length && text[i] === currentText[i]) {
            oldTextPart += text[i];
            i++;
        }

        newText = text.slice(i);


        element.innerHTML = oldTextPart;

        let index = 0;
        let minSpeed = 20;
        let maxSpeed = 100;
        let textLength = newText.length
        // delay time is calculated based on the text length i.e if the text is too long, the typing animation will very quick
        let delay = Math.max(minSpeed, Math.min(maxSpeed, maxSpeed - textLength));


        function type() {
            /*
             Custom function to achieve typing animation by concatenating character
             by charcter per 100 miliseconds
            */

            if (index < newText.length) {
                element.innerHTML += newText.charAt(index)

                index++;
                setTimeout(type, delay);
            }
        }

        type();
    }

    window.updatePreview = (data) => {
        typeText(data?.username, username)
        typeText(data?.profession, profession)
        typeText(data?.email, email)
        typeText(data?.phone, phone)
        typeText(data?.city, city)
        typeText(data?.country, country)
        typeText(data?.summary, summary)
    }
});


const Page = {
    heading: 1,
    education: 2,
    workExperience: 3,
    skill: 4,
    summary: 5,
    finalize: 6
};
const navigation = {
    templateInfo: "select-template",
    headingInfo: "heading",
    eduInfo: "education",
    workExpInfo: "work_experience",
    skillInfo: "skill",
    summary: "summary"
};
let template = JSON.parse(localStorage.getItem("templateInfo")) || {};
const TEMPLATE_ID = template["templateId"]


function checkForUpdate(page, cache_name, currentData) {
    let caches = getRequiredCache(page);
    caches.push(cache_name)
  
    let dataChanged = false;


    let aggregatedData = {}; 

    caches.forEach(cache => {
        let cacheData = JSON.parse(localStorage.getItem(cache)) || {};    
        aggregatedData[cache] = cacheData;
    });

    if (typeof currentData === 'string') {
        if (!aggregatedData.summary || currentData !== aggregatedData.summary) {
            console.log("old summary")
            console.log(aggregatedData.summary)
            console.log("New summary")
            console.log(currentData)
            dataChanged = true;
            aggregatedData.summary = currentData;
        }
    } else {

        dataChanged = Object.keys(currentData).some(key =>
            currentData[key] !== "" && currentData[key] !== aggregatedData[key]
        );

        if (dataChanged) {
            aggregatedData = { ...aggregatedData, ...currentData };
        }
    }

    if (dataChanged) {
        localStorage.setItem(cache_name, JSON.stringify(currentData));
        updatePreview(aggregatedData);
        console.log("Trigger changed");
    }
}


function setProgressBar(reachedProgress) {
    console.log("trigger")
    let res = checkCache(reachedProgress)
    console.log("res")
    console.log(res)

    if (!res.success) {
        alert(`Plesase fill the ${res.name} first!`)
        window.location.href = res.href
    }

    const steps = document.querySelectorAll("#progress-bar-container .step");

    steps.forEach((step, index) => {
        const stepNumber = index + 1;

        if (stepNumber < reachedProgress) {
            step.classList.add("completed");
            step.classList.remove("active");
        } else if (stepNumber === reachedProgress) {
            step.classList.add("completed", "active");
        }
    });
}

function getRequiredCache(reachedProgress) {
    let requiredCacheKeys = [];

    switch (reachedProgress) {
        case Page.heading:
            requiredCacheKeys.push("templateInfo");
            break;
        case Page.education:
            requiredCacheKeys.push("templateInfo", "headingInfo");
            break;
        case Page.workExperience:
            requiredCacheKeys.push("templateInfo", "headingInfo", "eduInfo");
            break;
        case Page.skill:
            requiredCacheKeys.push("templateInfo", "headingInfo", "eduInfo", "workExpInfo");
            break;
        case Page.summary:
            requiredCacheKeys.push("templateInfo", "headingInfo", "eduInfo", "workExpInfo", "skillInfo");
            break;
        case Page.finalize:
            requiredCacheKeys.push("templateInfo", "headingInfo", "eduInfo", "workExpInfo", "skillInfo", "summary");
            break;
        default:
            return [];
    }
    return requiredCacheKeys;
}
function checkCache(reachedProgress) {

    let requiredCache = getRequiredCache(reachedProgress)

    for (let key of requiredCache) {
        let data = localStorage.getItem(key)

        if (!data) {

            let name = navigation[key];

            if (key === "templateInfo") {
                console.log(`/resume/section/${name}`)
                return { success: false, name: name, href: `/resume/section/${name}` };
            } else {
                let template_info = localStorage.getItem("templateInfo")
                data = JSON.parse(template_info)
                console.log(`/resume/section/${name}?template_id=${data['templateId']}`)

                return { success: false, name: name, href: `/resume/section/${name}?template_id=${data['templateId']}` };
            }

        }
    }

    return { success: true };
}