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
    let address = document.getElementById("pv-address")

    function typeText(text, element) {
        if (!text || text == "") {
            return
        }
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

        function type() {
            /*
             Custom function to achieve typing animation by concatenating character
             by charcter per 100 miliseconds
            */

            if (index < newText.length) {

                console.log(`"${newText.charAt(index)}"`)
                element.innerHTML += newText.charAt(index)

                index++;
                setTimeout(type, 100);
            }
        }

        type();
    }

    window.updatePreview = (data) => {
        typeText(data?.username, username)
        typeText(data?.profession, profession)
        typeText(data?.email, email)
        typeText(data?.phone, phone)
        typeText(data?.city + " " + data?.country, address)
    }
});


const ProgressMileStone = {
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

function checkCache(reachedProgress) {


    let requiredCacheKeys = [];

    switch (reachedProgress) {
        case ProgressMileStone.heading:
            requiredCacheKeys.push("templateInfo");
            break;
        case ProgressMileStone.education:
            requiredCacheKeys.push("templateInfo", "headingInfo");
            break;
        case ProgressMileStone.workExperience:
            requiredCacheKeys.push("templateInfo", "headingInfo", "eduInfo");
            break;
        case ProgressMileStone.skill:
            requiredCacheKeys.push("templateInfo", "headingInfo", "eduInfo", "workExpInfo");
            break;
        case ProgressMileStone.summary:
            requiredCacheKeys.push("templateInfo", "headingInfo", "eduInfo", "workExpInfo", "skillInfo");
            break;
        case ProgressMileStone.finalize:
            requiredCacheKeys.push("templateInfo", "headingInfo", "eduInfo", "workExpInfo", "skillInfo", "summary");
            break;
        default:
            return { success: true };
    }


    for (let key of requiredCacheKeys) {
        let data = localStorage.getItem(key)

        if (!data) {

            let name = navigation[key];

            if (key === "templateInfo") {
                console.log(`/resume/section/${name}`)
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