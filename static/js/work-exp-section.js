document.addEventListener('DOMContentLoaded', function () {
    const CACHE_NAME = "workExpInfo"

    let workExpFormsContainer = document.getElementById('work-exp-forms-container');
    let addAnotherBtn = document.getElementById('add-another-btn');
    let submitBtn = document.getElementById('next-btn');

    submitBtn.addEventListener('click', cachedworkExpInfo);
    addAnotherBtn.addEventListener('click', () => insertWorkExpForm(workExpInfo = {}));

    // Loading cached data if exists
    loadCached()

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

    function removeworkExpcationForm(workExpFormWrapper) {
        let isConfirmed = confirm("Are you sure you want to delete this workExpcation entry?");

        if (!isConfirmed) {
            return
        }

        workExpFormWrapper.classList.add('fade-out');
        setTimeout(() => {
            workExpFormWrapper.remove();
        }, 300);
    }



    function insertWorkExpForm(workExpInfo = {}, showRemoveBtn = true) {
        if (Object.keys(workExpInfo).length == 0) {
            workExpInfo =
            {
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
                endDateInput.value = "0-0/-0"
                endDateInput.disabled = true;
            } else {
                endDateInput.disabled = false;
            }
        })
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeworkExpcationForm(workExpFormWrapper));

            workExpFormWrapper.addEventListener('mouseover', function () {
                removeBtn.classList.add('showed-remove-btn');
            });

            workExpFormWrapper.addEventListener('mouseout', function () {
                removeBtn.classList.remove('showed-remove-btn');
            });
        }
    }


    function cachedworkExpInfo() {
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
            workExpcationData.push(workExpData);
        });

        localStorage.setItem(CACHE_NAME, JSON.stringify(workExpcationData));

        window.location.href = '/resume/section/skill';
    }


    function loadCached() {

        let cachedData = localStorage.getItem(CACHE_NAME);

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