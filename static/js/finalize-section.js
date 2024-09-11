document.addEventListener('DOMContentLoaded', function () {
    const CACHE_NAME = "additionalInfo"
    const LANGUAGE_INFO_KEY = "langInfo"
    const SOCIAL_MEDIA_INFO_kEY = "socialMediaInfo"
    const TYPING_DELAY = 2000;

    let typingTimer;
    let isFormShow = false
    // let pollingInterval = 5000
    let nextBtn = document.getElementById('confirm-btn');
    let addAnotherBtn = document.getElementById('add-another-btn');
    let socialMediaBtn = document.getElementById('add-social-media-btn')
    let loadingOverlay = document.getElementById('loading-overlay');
    let formContainer = document.getElementById('social-media-input-container')

    nextBtn.addEventListener('click', sentResume);
    socialMediaBtn.addEventListener('click', showSocialMediaForm)
    addAnotherBtn.addEventListener('click', () => insertLanguageForm(languageInfo = {}));

    setProgressBar(Page.finalize);
    loadResumePreview(Page.finalize)
    // setInterval(handleAdditionalInfo, pollingInterval);
    loadCache();

    function showSocialMediaForm() {
        if (!isFormShow) {
            formContainer.classList.add("fade-in")
            setTimeout(() => {
                formContainer.classList.remove("hidden")
                isFormShow = true
            }, 300);
            socialMediaBtn.innerHTML = '<i class="fas fa-minus-circle" style="color:#d71212"></i> Remove'
            socialMediaBtn.style.borderColor = "#ff0000"
        } else {
            formContainer.classList.remove("fade-in")
            formContainer.classList.add("fade-out")
            removeClassName =
                setTimeout(() => {
                    formContainer.classList.add("hidden")
                    isFormShow = false
                }, 500);

            socialMediaBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add Social Media'
            socialMediaBtn.style.borderColor = "#4caf50"
        }
    }
    function loadSocialMediaData(socialMediaInfo = {}) {
        if (Object.keys(socialMediaInfo).length > 0) {
            formContainer.classList.remove("hidden")
            let socialMediaForm = document.getElementById("social-media-form")
            if (socialMediaForm) {
                socialMediaForm.querySelector('input[name="instagram"]').value = socialMediaInfo.instagram
                socialMediaForm.querySelector('input[name="linkedIn"]').value = socialMediaInfo.linkedIn
                socialMediaForm.querySelector('input[name="gitHub"]').value = socialMediaInfo.gitHub
                socialMediaForm.querySelector('input[name="facebook"]').value = socialMediaInfo.facebook
                socialMediaForm.querySelector('input[name="portfolio"]').value = socialMediaInfo.portfolio
            }
        }

    }
    function getAllCache() {
        const cache_names = ["headingInfo", "workExpInfo", "templateInfo", "eduInfo", "skillInfo", "summary", CACHE_NAME];
        let cachedData = {};

        cache_names.forEach(cache_name => {
            cachedData[cache_name] = localStorage.getItem(cache_name);
        });
        return cachedData
    }

    function loadCache() {
        let cachedData = localStorage.getItem(CACHE_NAME);

        if (cachedData) {
            let additionalData = JSON.parse(cachedData);
            let languageData = additionalData[LANGUAGE_INFO_KEY] || []
            let socialMediaInfo = additionalData[SOCIAL_MEDIA_INFO_kEY]

            let formContainer = document.getElementById('language-forms-container');
            formContainer.innerHTML = '';


            languageData.forEach(languageInfo => {
                insertLanguageForm(languageInfo, true);
            });

            loadSocialMediaData(socialMediaInfo);
            socialMediaBtn.style.display = "none"

        } else {
            insertLanguageForm(languageInfo = {}, showRemoveBtn = true);
        }
    }

    document.addEventListener('input', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(handleAdditionalInfo, TYPING_DELAY);
    });


    function handleAdditionalInfo() {

        let languageForms = document.querySelectorAll('.language-skill-form');
        let socialMediaForm = document.getElementById('social-media-form');

        let languageData = [];
        languageForms.forEach(form => {

            let languageInfo = {
                language: form.querySelector('input[name="language"]').value,
                fluentLevel: form.querySelector('input[name="fluent-level"]').value,
            };
            if (languageInfo.language && languageInfo.fluentLevel) {
                languageData.push(languageInfo);
            }
        });

        let socialMediaInfo = {}
        if (socialMediaForm) {

            socialMediaInfo = {
                instagram: socialMediaForm.querySelector('input[name="instagram"]').value,
                linkedIn: socialMediaForm.querySelector('input[name="linkedIn"]').value,
                gitHub: socialMediaForm.querySelector('input[name="gitHub"]').value,
                facebook: socialMediaForm.querySelector('input[name="facebook"]').value,
                portfolio: socialMediaForm.querySelector('input[name="portfolio"]').value
            }
        }
        // let cache = JSON.parse(localStorage.getItem(CACHE_NAME)) || {};
        let cache = {}

        if (languageData.length > 0) {
            cache[LANGUAGE_INFO_KEY] = languageData;
        }

        cache[SOCIAL_MEDIA_INFO_kEY] = socialMediaInfo;

        checkForUpdate(CACHE_NAME, cache)



        // localStorage.setItem(CACHE_NAME, JSON.stringify(cache));
    }


    function insertLanguageForm(languageInfo = {}, showRemoveBtn = true) {
        if (Object.keys(languageInfo).length == 0) {
            languageInfo = {
                language: "",
                fluentLevel: ""
            }
        }

        let formWrapper = document.createElement('div');
        formWrapper.classList.add('language-skill-form-wrapper');

        formWrapper.innerHTML = `
            <form class="language-skill-form">
                <div>
                    <label for="language">Language</label>
                    <input type="text" name="language" id="language" value="${languageInfo.language}">
                </div>
                <div>
                    <label for="fluent-level">Fluent Level</label>
                    <input type="text" name="fluent-level" id="fluent-level" value="${languageInfo.fluentLevel}">
                </div>
                ${showRemoveBtn ? '<button type="button" class="remove-form-btn"><i class="fas fa-trash-alt"></i></button>' : ''}
            </form>
            
        `;

        let formContainer = document.getElementById('language-forms-container');
        let removeBtn = formWrapper.querySelector(".remove-form-btn");
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeForm(formWrapper));

            formWrapper.addEventListener('mouseover', function () {
                removeBtn.classList.add('showed-remove-btn');
            });

            formWrapper.addEventListener('mouseout', function () {
                removeBtn.classList.remove('showed-remove-btn');
            });
           
        }

        formContainer.appendChild(formWrapper);
    }
    function removeForm(formWrapper) {
        let isConfirmed = confirm("Are you sure you want to delete this skillcation entry?");

        if (!isConfirmed) {
            return
        }
        handleAdditionalInfo()
        formWrapper.classList.add('fade-out');
        setTimeout(() => {
            formWrapper.remove();
        }, 300);
    }

    function sentResume() {
        // Set up the loading animation
        loadingOverlay.style.display = 'flex';
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

        cachedData = getAllCache()

        const createResumeRequest = fetch('/resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cachedData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorText => {
                        throw new Error(errorText || 'Unknown error occurred');
                    });
                }
                return response.json();
            })
            .catch(error => {

                console.error('Error:', error.message);

            });

        // Wait for both the minimum loading time and the create reusme API request to complete
        Promise.all([minLoadingTime, createResumeRequest])
            .then(([_, data]) => {
                console.log('Success:', data);

                loadingOverlay.style.display = 'none';
                console.log("nothting")
                console.log(data.resume_id)
                window.location.href = `/resume/section/complete?resume_id=${data.resume_id}`

            })
            .catch(error => {
                console.error('Error:', error);

                loadingOverlay.style.display = 'none';

            });

    }
});
