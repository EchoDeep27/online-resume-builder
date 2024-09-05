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
        if (!localStorage.getItem(key)) {
            let name = navigation[key];
            console.log(`/resume/section/${name}`)
            return { success: false, name: name, href: `/resume/section/${name}` };
        }
    }

    return { success: true };
}