document.addEventListener("DOMContentLoaded", function () {

    // Preview resume elements that need will be updated
    let username = document.getElementById("pv-username")
    let profession = document.getElementById("pv-profession")
    let email = document.getElementById("pv-email")
    let phone = document.getElementById("pv-phone")
    let city = document.getElementById("pv-city")
    let country = document.getElementById("pv-country")
    let summary = document.getElementById("pv-summary")
    let profileImg = document.getElementById("pv-profile-img")
    let profileDiv = document.getElementsByClassName("profile-div")

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

    function typeText(text, element) {
        if (!text || text == "") {
            return
        }

        let currentText = element.innerHTML;
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
    function isEmptyObj(obj) {
        return (Object.keys(obj).length == 0)
    }


    function updateList(parentId, createElementFunc, items) {
        // Allow to update the preview only if the updated data has at least one item
        if (items.length == 0) {
            return
        }
        const listItem = document.getElementById(parentId);

        // Remove all current children
        while (listItem.firstChild) {
            listItem.removeChild(listItem.firstChild);
        }
        items.forEach(item => {
            listItem.appendChild(createElementFunc(item));
        });
    };

    // Making the updatePreview function global so that any files can access this function
    window.updatePreview = (data) => {

        let template = data[CACHE_NAMES.TEMPLATE] || {}
        let heading = data[CACHE_NAMES.HEADING] || {}
        let educations = data[CACHE_NAMES.EDU] || []
        let workExperiences = data[CACHE_NAMES.WORK_EXP] || []
        let skills = data[CACHE_NAMES.SKILL] || []
        let additionalInfo = data[CACHE_NAMES.ADDITIONAL] || {}
        let summaryText = data[CACHE_NAMES.SUMMARY] || ""

        let languages = []
        let socialMedia = []

        if (!isEmptyObj(template)) {
            document.documentElement.style.setProperty('--template-bg-color', template.templateTheme);
            Array.from(profileDiv).forEach(profile => profile.style.display = template.isHeadshot ? "block" : "none")
        }

        if (!isEmptyObj(heading)) {
            typeText(heading.username, username)
            typeText(heading.profession, profession)
            typeText(heading.email, email)
            // optional
            typeText(heading?.phone, phone)
            typeText(heading.city, city)
            typeText(heading.country, country)
            if (heading?.profile_file_name) {
                loadProfile(heading.profile_file_name, imgElements = [profileImg])
            }

        }

        if (summaryText.length > 0) {
            typeText(summaryText, summary)

        }
        updateList(parentId = "education-list", createElementFunc = createEducationList, items = educations);
        updateList(parentId = "work-experience-parent", createElementFunc = createWorkExperienceList, items = workExperiences);
        updateList(parentId = "skill-list", createElementFunc = createSkillList, items = skills);

        if (!isEmptyObj(additionalInfo)) {
            languages = additionalInfo[LANGUAGE_INFO_KEY] || [];
            socialMedia = additionalInfo[SOCIAL_MEDIA_INFO_kEY] || {};

            if (!isEmptyObj(socialMedia)) {
                loadSocialMediaPreview(socialMedia)
            }

            if (languages.length > 0) {
                let parent = document.getElementById("language-list")
                loadLanguageList(languages, parent)
            }
        }
    }


    function loadLanguageList(languages, parent) {

        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
        languages.forEach(language => {

            let languageItem = document.createElement("li");
            let languageName = document.createElement("span");
            let fluentLevel = document.createElement("small");

            languageName.classList.add("resume-lang-name", "font-weight-bold");
            languageName.textContent = language.language;


            fluentLevel.classList.add("text-muted", "font-weight-normal");
            fluentLevel.textContent = `(${language.fluentLevel})`;


            languageItem.appendChild(languageName);
            languageItem.appendChild(fluentLevel);

            parent.appendChild(languageItem);
        });
    }



    function loadSocialMediaPreview(socialMediaInfo) {
        for (let key of Object.values(socialMedia)) {

            let data = socialMediaInfo[key]
            let id = `${key.toLocaleLowerCase()}-item`;
            let socialElement = document.getElementById(id);

            if (data) {
                socialElement.style.display = "block";
                addSocialLink(socialElement, data);
            } else {
                socialElement.style.display = "none";
            }

        }

    }
    function addSocialLink(mediaElement, data) {
        let socialLink = mediaElement.querySelector("a");
        // updating the reference link
        socialLink.href = data;
        // Updating the display link text of the  media link by not overwriting span and icon
        socialLink.lastChild.textContent = data

    }

    function createEducationList(education) {

        let educationItem = document.createElement("li");


        let degreeDiv = document.createElement("div");
        let orgDiv = document.createElement("div");

        let timeDiv = document.createElement("div");
        let startDate = education.start_date ? formatDate(education.start_date) : '';
        let endDate = education.is_studying ? 'Attending' : (education.end_date ? formatDate(education.end_date) : 'N/A');

        degreeDiv.classList.add("resume-degree", "font-weight-bold");
        degreeDiv.innerText = education.degree;

        orgDiv.classList.add("resume-degree-org");
        orgDiv.innerText = education.school;


        timeDiv.classList.add("resume-degree-time");
        timeDiv.innerText = startDate
        // Adding dash separator between start date and end date (e.g December 2020 - May 2022)
        timeDiv.innerText += " - ";
        timeDiv.innerText += endDate

        educationItem.appendChild(degreeDiv);
        educationItem.appendChild(orgDiv);
        educationItem.appendChild(timeDiv);
        return educationItem
    }
    function capitalizeFirstLetter(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }


    function createSkillList(skill) {

        let skillItem = document.createElement("li");

        let skillNameDiv = document.createElement("div");
        let skillProficiencySpan = document.createElement("span");

        let progressDiv = document.createElement("div");
        let progressBarDiv = document.createElement("div");

        let proficiency = skill.expertiseLevel.toUpperCase()
        let proficiecnyLevel = proficiencyLevels[proficiency]

        skillNameDiv.classList.add("resume-skill-name");
        skillNameDiv.innerText = skill.skill;

        skillProficiencySpan.classList.add("resume-skill-proficiency");

        skillProficiencySpan.innerText = capitalizeFirstLetter(skill.expertiseLevel)

        skillNameDiv.appendChild(skillProficiencySpan);

        progressDiv.classList.add("progress", "resume-progress");

        progressBarDiv.classList.add("progress-bar", "theme-progress-bar-dark");
        progressBarDiv.setAttribute("role", "progressbar");

        progressBarDiv.setAttribute("aria-valuemin", "0");
        progressBarDiv.setAttribute("aria-valuemax", "100");
        progressBarDiv.setAttribute("aria-valuenow", proficiecnyLevel);
        progressBarDiv.style.width = proficiecnyLevel + "%";

        skillItem.appendChild(skillNameDiv);

        progressDiv.appendChild(progressBarDiv);
        skillItem.appendChild(progressDiv);

        return skillItem
    }



    function createWorkExperienceList(experience) {

        let experienceItem = document.createElement("article");
        let headerDiv = document.createElement("div");
        let positionTitle = document.createElement("h3");

        let titleCompanyDiv = document.createElement("div");
        let companyNameDiv = document.createElement("div");

        let descriptionDiv = document.createElement("div");
        let achievementList = document.createElement("ul");

        let timePeriodDiv = document.createElement("div");

        let startDate = experience.start_date ? formatDate(experience.start_date) : '';
        let endDate = experience.isWorking ? 'Present' : (experience.end_date ? formatDate(experience.end_date) : 'N/A');

        experienceItem.classList.add("resume-timeline-item", "position-relative", "pb-5");
        headerDiv.classList.add("resume-timeline-item-header", "mb-2");
        titleCompanyDiv.classList.add("d-flex", "flex-column", "flex-md-row");

        positionTitle.classList.add("resume-position-title", "font-weight-bold", "mb-1");
        positionTitle.innerText = experience.job;

        companyNameDiv.classList.add("resume-company-name", "ml-auto");
        companyNameDiv.innerText = experience.company;


        titleCompanyDiv.appendChild(positionTitle);
        titleCompanyDiv.appendChild(companyNameDiv);

        timePeriodDiv.classList.add("resume-position-time");


        timePeriodDiv.innerText = `${startDate} - ${endDate}`;

        headerDiv.appendChild(titleCompanyDiv);
        headerDiv.appendChild(timePeriodDiv);


        descriptionDiv.classList.add("resume-timeline-item-desc");
        achievementList.classList.add("work-achievements")

        achievementList.innerHTML = experience.achievements.replace(/\n/g, "<li>");

        descriptionDiv.appendChild(achievementList);

        experienceItem.appendChild(headerDiv);
        experienceItem.appendChild(descriptionDiv);
        return experienceItem;
    }


    function formatDate(dateString) {
        let date = new Date(dateString);
        // Formatting date obj in September 2024 format
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }
});

// =============================
// ===== Constant Variable ====
// ============================
const CACHE_NAMES = {
    TEMPLATE: "templateInfo",
    HEADING: "headingInfo",
    EDU: "eduInfo",
    WORK_EXP: "workExpInfo",
    SKILL: "skillInfo",
    SUMMARY: "summary",
    ADDITIONAL: "additionalInfo",
};

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

const proficiencyLevels = {
    'BEGINNER': 25,
    'INTERMEDIATE': 50,
    'PROFICIENT': 75,
    'EXPERT': 100
};
const socialMedia = {
    LINKEDIN: "linkedIn",
    GITHUB: "gitHub",
    FACEBOOK: "facebook",
    PORTFOLIO: "portfolio",
    INSTAGRAM: "instagram",
}


const INPUT_TYPING_DELAY = 2000


const LANGUAGE_INFO_KEY = "langInfo";
const SOCIAL_MEDIA_INFO_kEY = "socialMediaInfo";

const WORK_FLOW_CACHE_DATA = ["templateInfo", "headingInfo", "eduInfo", "workExpInfo", "skillInfo", "summary"]


let template = JSON.parse(localStorage.getItem(CACHE_NAMES.TEMPLATE)) || {};
const TEMPLATE_ID = template.templateId
let isLoaded = false

function loadResumePreview(page) {
    if (isLoaded) {
        return
    }
    console.log(page)
    let caches = getRequiredCache(page);
    console.log("getRequiredCache")
    console.log(caches)
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
    } else if (!cache) {
        // Case: first time caching
        dataChanged = true;
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
                console.log("currentValue")
                console.log(currentValue)
                console.log("currentCachedValue")
                console.log(currentCachedValue)

                dataChanged = Object.keys(currentCachedValue).some(key => {

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
        console.log("Update data")
        console.log(updatedData)
        localStorage.setItem(cache_name, JSON.stringify(updatedData));
        updatePreview({ [cache_name]: updatedData });
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
    return reachedProgress > 0 ? WORK_FLOW_CACHE_DATA.slice(0, reachedProgress) : [];
}

function checkCache(reachedProgress) {

    let requiredCache = getRequiredCache(reachedProgress)

    for (let key of requiredCache) {
        let data = localStorage.getItem(key)

        if (!data) {

            let name = navigation[key];

            if (key === CACHE_NAMES.TEMPLATE) {

                return { success: false, name: name, href: `/resume/section/${name}` };
            } else {
                let template_info = localStorage.getItem(CACHE_NAMES.TEMPLATE)
                data = JSON.parse(template_info)


                return { success: false, name: name, href: `/resume/section/${name}?template_id=${data['templateId']}` };
            }

        }
    }

    return { success: true };
}

async function copyAnswer(answer, button) {
    button.innerHTML = '<i class="fa-regular fa-circle-check" style="color:var(--primary-color);"></i>';
    /*    
    adopted from https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    */
    await navigator.clipboard.writeText(answer)
        .then(() => {
            console.log("Text copied to clipboard:", answer);
            showInformBox("Copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy text:", err);
            showInformBox("Failed to copy!");
        });
}

function showInformBox(message, isError = false) {

    const informBox = document.createElement("div");
    informBox.id = "inform-box";
    informBox.textContent = message;
    if (isError) {
        informBox.style.color = "red"
    }

    document.body.appendChild(informBox);

    setTimeout(() => {
        informBox.remove();
    }, 2000);
}