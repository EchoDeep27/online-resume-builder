document.addEventListener('DOMContentLoaded', function () {

    let typingTimer;

    let workExpFormsContainer = document.getElementById('work-exp-forms-container');
    let addAnotherBtn = document.getElementById('add-another-btn');
    let nextBtn = document.getElementById('next-btn');

    nextBtn.addEventListener('click', submitForm);
    addAnotherBtn.addEventListener('click', () => insertWorkExpForm(workExpInfo = {}));

    // Loading cached data if exists
    loadCached();
    setProgressBar(Page.workExperience);

    function setMaxEndDate(form) {
        let today = new Date();
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');
        let todayDate = `${year}-${month}-${day}`;
        form.querySelector('input[name="end-date"]').setAttribute("max", todayDate);
    }

    // setting the end-date of the first workExpcation form
    setMaxEndDate(document.querySelector('.work-exp-form'));

    function removeWorkExpcationForm(workExpFormWrapper) {
        let isConfirmed = confirm("Are you sure you want to delete this workExpcation entry?");

        if (!isConfirmed) {
            return
        }

        workExpFormWrapper.classList.add('fade-out');
        setTimeout(() => {
            workExpFormWrapper.remove();
            // need to cache in case user do not leave with next button such as using progress navigation bar
            handleWorkExpInfo()
        }, 300);
    }

    function submitForm() {
        if (handleWorkExpInfo()) {
            window.location.href = `/resume/section/skill?template_id=${TEMPLATE_ID}`;
        }
    }
    function insertWorkExpForm(workExpInfo = {}, showRemoveBtn = true) {
        if (Object.keys(workExpInfo).length == 0) {
            workExpInfo = {
                job: "",
                company: "",
                location: "",
                start_date: '0-0-0',
                end_date: '0-0-0',
                isWorking: false,
                achievements: ""
            }
                ;
        }


        let workExpFormWrapper = document.createElement('div');
        workExpFormWrapper.classList.add('work-exp-form-wrapper');

        workExpFormWrapper.innerHTML = `
                <form class="work-exp-form">
                    <div>
                        <label for="job">Job Tittle</label>
                        <input type="text" name="job" value="${workExpInfo.job}" required>
                    </div>
                    <div>
                        <label for="company">Company</label>
                        <input type="text" name="company" value="${workExpInfo.company}" required>
                    </div>
                    <div class="location-div">
                        <label for="location">Location</label>
                        <input type="text" name="location" value="${workExpInfo.location}" required>
                    </div>
                    <div class="date-div">
                        <div>
                            <label for="start-date">Start Date</label>
                            <input type="date" name="start-date" value="${workExpInfo.start_date}" id="start-date required>
                        </div>
                        <div>
                            <label for="end-date">End Date</label>
                            <input type="date" name="end-date" value="${workExpInfo.end_date}" ${workExpInfo.isWorking ? 'disabled' : ''} id="end-date">
                            <input type="checkbox" name="is-working" id="is-working" ${workExpInfo.isWorking ? 'checked' : ''}>
                            <label for="is-working">I am in this job right now</label>
                        </div>
                    </div>
                    <div class="achievement-div">
                        <label for="achievements">Achievements</label>
                        <textarea name="achievements" id="achievements">${workExpInfo.achievements}</textarea>
                    </div>

                    

                    ${showRemoveBtn ? '<button type="button" class="remove-form-btn">Remove</button>' : ''}
                    
                </form>
                `;

        workExpFormsContainer.appendChild(workExpFormWrapper);

        setMaxEndDate(workExpFormWrapper);

        let removeBtn = workExpFormWrapper.querySelector(".remove-form-btn");
        let isWorkingCheckbox = workExpFormWrapper.querySelector("#is-working")
        let endDateInput = workExpFormWrapper.querySelector("#end-date")

        isWorkingCheckbox.addEventListener('change', () => {
            if (isWorkingCheckbox.checked) {
                endDateInput.value = "0-0-0"
                endDateInput.disabled = true;
            } else {
                endDateInput.disabled = false;
            }
        })
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeWorkExpcationForm(workExpFormWrapper));

            workExpFormWrapper.addEventListener('mouseover', function () {
                removeBtn.classList.add('showed-remove-btn');
            });

            workExpFormWrapper.addEventListener('mouseout', function () {
                removeBtn.classList.remove('showed-remove-btn');
            });
        }
    }

    function handleWorkExpInfo() {
        let workExpForms = document.querySelectorAll('.work-exp-form');
        let workExpcationData = [];

        workExpForms.forEach(form => {
            let startdateTest = form.querySelector('input[name="start-date"]')
            console.log(`start date obj ${startdateTest}`)
            console.log(`start date ${startdateTest.value}`)
            let workExpData = {
                job: form.querySelector('input[name="job"]').value,
                company: form.querySelector('input[name="company"]').value,
                location: form.querySelector('input[name="location"]').value,
                start_date: form.querySelector('input[name="start-date"]').value,
                end_date: form.querySelector('input[name="end-date"]').value,
                achievements: form.querySelector('textarea').value,
                isWorking: form.querySelector('input[name="is-working"]').checked
            };
            if (workExpData.company.length == 0 || workExpData.job.length == 0 || workExpData.location.length == 0) {
                showInformBox('Please fill all the fields so that employee can find you.', InformType.WARNING);
                return false;
            }

            if (workExpData.start_date.length == 0 || !hasDay(workExpData.start_date)) {
                showInformBox('Please include the day in the start date (format:  09/17/2024).', InformType.FAIL);
                return false;
            }

            if (!hasDay(workExpData.end_date)) {
                if (!workExpData.isWorking) {
                    showInformBox('Please include the day in the end date (format: 09/17/2024) or check "Still working".', InformType.FAIL);
                    return false;
                }
            } else {
                const startDate = new Date(workExpData.start_date);
                const endDate = new Date(workExpData.end_date);

                if (startDate > endDate) {
                    showInformBox('Start date cannot be after the end date.', InformType.FAIL);
                    return false;
                }
            }

            workExpcationData.push(workExpData);
        });
        checkForUpdate(CACHE_NAMES.WORK_EXP, workExpcationData)
        return true;

    }


    function loadCached() {

        let cachedData = localStorage.getItem(CACHE_NAMES.WORK_EXP);

        if (cachedData) {
            let workExpcationData = JSON.parse(cachedData);

            let workExpFormsContainer = document.getElementById('work-exp-forms-container');
            workExpFormsContainer.innerHTML = '';
            formCount = 0
            workExpcationData.forEach(workExpInfo => {
                // Hidden the remove button in the first workExpcation entry form 
                formCount++
                if (formCount == 1) {
                    insertWorkExpForm(workExpInfo, false)
                } else {

                    insertWorkExpForm(workExpInfo)
                }
            });
        } else {
            insertWorkExpForm(workExpInfo = {}, showRemoveBtn = false)
        }
    }

});