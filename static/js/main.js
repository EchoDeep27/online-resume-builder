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
    let profileImg = document.getElementById("pv-profile-img")

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
        console.log("data")
        console.log(data)

        let template = data["templateInfo"] || {}
        let heading = data["headingInfo"] || {}
        let education = data["eduInfo"] || []
        console.log(education)
        console.log(education)

        let workExperience = data["workExpInfo"] || []
        let skill = data["skillInfo"] || []
        let summaryText = data["summary"] || ""

        if (template && template.templateTheme) {
            document.documentElement.style.setProperty('--template-bg-color', template.templateTheme);
        }

        if (heading) {
            console.log("Yes, i am heading")
            console.log(heading)
            typeText(heading?.username, username)
            typeText(heading?.profession, profession)
            typeText(heading?.email, email)
            typeText(heading?.phone, phone)
            typeText(heading?.city, city)
            typeText(heading?.country, country)
            if (heading?.profile_file_name) {
                loadProfile(heading.profile_file_name, imgElements = [profileImg])
            }

        }
        if (summaryText.length > 0) {
            typeText(summaryText, summary)

        }
        if (education.length > 0) {
            let educationList = document.getElementById("education-list");
            while (educationList.firstChild) {
                educationList.removeChild(educationList.firstChild);
            }
            education.forEach(edu => {

                let eduList = getEducationList(edu)
                educationList.appendChild(eduList);
            })



        }
    }

    function getEducationList(education) {

        let educationItem = document.createElement("li");
        // educationItem.classList.add("mb-2");

        // Create a div for the degree
        let degreeDiv = document.createElement("div");
        degreeDiv.classList.add("resume-degree", "font-weight-bold");
        degreeDiv.innerText = education.degree;

        // Create a div for the organization/school name
        let orgDiv = document.createElement("div");
        orgDiv.classList.add("resume-degree-org");
        orgDiv.innerText = education.school;

        // Create a div for the time period
        let timeDiv = document.createElement("div");
        timeDiv.classList.add("resume-degree-time");

        // Add the start date
        if (education.start_date) {
            let startDate = new Date(education.start_date);
            timeDiv.innerText = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        }

        // Adding dash separator between start date and end date (e.g December 2020 - May 2022)
        timeDiv.innerText += " - ";


        if (education.is_studying) {
            timeDiv.textContent += "Attending";
        } else if (education.end_date) {
            let endDate = new Date(education.end_date);
            timeDiv.innerText += endDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        } else {
            timeDiv.innerText += "N/A";
        }


        educationItem.appendChild(degreeDiv);
        educationItem.appendChild(orgDiv);
        educationItem.appendChild(timeDiv);
        return educationItem
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
let isLoaded = false

function loadResumePreview(page) {
    if (isLoaded) {
        return
    }
    let caches = getRequiredCache(page);
    let aggregatedData = {};

    caches.forEach(cache => {
        let cacheData = JSON.parse(localStorage.getItem(cache)) || {};
        aggregatedData[cache] = cacheData;
    });
    updatePreview(aggregatedData)
    isLoaded = true
}

function loadProfile(profileFileName, imgElements) {
    fetch(`/profile/${profileFileName}`, {
        method: "GET"
    }).then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            console.log("reached now")
            imgElements.forEach(img => img.src = url)
        })
        .catch(error => {
            console.error('Failed to fetch profile image:', error);
        });
}


function checkForUpdate(cache_name, updatedData) {

    let dataChanged = false;

    let cache = JSON.parse(localStorage.getItem(cache_name))
    if (typeof updatedData === 'string') {
        dataChanged = updatedData !== cache

    } else {
        let cachedData = Array.isArray(cache) ? cache : [cache];

        let currentData = Array.isArray(updatedData) ? updatedData : [updatedData];


        // Cached value is retrieved based on the length of current value and remove extra items since current value don't contain them  
        if (currentData.length != cachedData.length) {
            dataChanged = true;
        } else {
            // cachedData = cachedData.slice(0, currentData.length);

            for (let i = 0; i < currentData.length; i++) {
                let currentValue = currentData[i]
                let currentCachedValue = cachedData[i]

                dataChanged = Object.keys(currentValue).some(key => {

                    return (currentValue[key] && currentValue[key] != currentCachedValue[key]);
                });

                if (dataChanged) {
                    break;
                }
            }
        }


    }
    console.log(`Data changed? : ${dataChanged}`)

    if (dataChanged) {
        localStorage.setItem(cache_name, JSON.stringify(updatedData));
        updatePreview({ [cache_name]: updatedData });
        console.log("Trigger changed");
    }
}


function setProgressBar(reachedProgress) {

    let res = checkCache(reachedProgress)

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

                return { success: false, name: name, href: `/resume/section/${name}` };
            } else {
                let template_info = localStorage.getItem("templateInfo")
                data = JSON.parse(template_info)


                return { success: false, name: name, href: `/resume/section/${name}?template_id=${data['templateId']}` };
            }

        }
    }

    return { success: true };
}