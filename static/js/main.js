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

function setProgressBar(reachedProgress) {

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



