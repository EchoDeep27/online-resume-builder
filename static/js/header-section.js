document.addEventListener('DOMContentLoaded', function () {
    // let pollingInterval = 5000;
    let typingTimer;
    let isHeadshot = false;

    let form = document.getElementById('heading-form');
    let profileImageUpload = document.getElementById('profile-image-upload');
    let profileImageInput = document.getElementById('profile-image');
    let profileImagePreview = document.getElementById('profile-image-preview');
    let previewProfile = document.getElementById("pv-profile-img");

    // Load cached data
    let headingInfo = JSON.parse(localStorage.getItem(CACHE_NAMES.HEADING)) || {};
    let storedInfo = localStorage.getItem(CACHE_NAMES.TEMPLATE);

    let profileFileName = headingInfo?.profile_file_name || null

    if (headingInfo) {
        updatePreview(headingInfo)
    }
    form.addEventListener('submit', submitHeadingForm);

    setProgressBar(Page.heading)
    loadResumePreview(Page.heading)

    if (storedInfo) {
        let templateInfo = JSON.parse(storedInfo);
        console.log(templateInfo);
        isHeadshot = templateInfo["isHeadshot"];
    }

    for (let [key, value] of Object.entries(headingInfo)) {
        let input = document.querySelector(`[name="${key}"]`);
        if (input && input.type !== "file") {
            input.value = value;
        }
    }

    // Profile Image div handler
    console.log(`isHeadshot: ${isHeadshot}`);
    profileImageUpload.style.display = isHeadshot ? "flex" : "none";

    if (isHeadshot && profileFileName) {
        loadProfile(profileFileName, [profileImagePreview, previewProfile])

    }

    profileImageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImagePreview.src = e.target.result;
                previewProfile.src = e.target.result
                profileImagePreview.style.display = 'block';
                uploadProfile(file);
            };
            reader.readAsDataURL(file);
        } else {
            profileImagePreview.src = '';
            previewProfile.src = 'images/profile/default_profile.jpg';
            profileImagePreview.style.display = 'none';
        }
    });


    function uploadProfile(file) {
        let formData = new FormData();
        formData.append('profile-image', file);

        fetch("/profile/upload", {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Image uploaded successfully');
                    profileFileName = data.file_name
                    handleHeadingInfo()
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => {
                console.error('Failed to upload profile:', error);
            });
    }

    function getFormData() {
        let formData = new FormData(form);
        let data = {};
        formData.forEach((value, key) => {
            if (key !== 'profile-image') {
                data[key] = value;
            }
        });
        return data;
    }

    function handleHeadingInfo() {
        let currentData = getFormData();

        if (typeof profileFileName !== 'undefined' && profileFileName) {

            currentData['profile_file_name'] = profileFileName;
            console.log("got in")

        }
 
        checkForUpdate(CACHE_NAMES.HEADING, currentData)
    }


    // setInterval(handleHeadingInfo, pollingInterval);
    document.addEventListener('input', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(handleHeadingInfo, INPUT_TYPING_DELAY);
    });


    function submitHeadingForm(event) {

        event.preventDefault();

        if (isHeadshot && profileFileName === null) {
            alert("Please upload your profile")
            return
        }
        handleHeadingInfo()

        window.location.href = `/resume/section/education?template_id=${TEMPLATE_ID}`

    }

});
