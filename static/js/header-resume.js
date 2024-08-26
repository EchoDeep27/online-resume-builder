document.addEventListener('DOMContentLoaded', function () {
    const pollingInterval = 3000;
    let isHeadshot = false;


    let form = document.getElementById('heading-form');
    let profileImageUpload = document.getElementById('profile-image-upload');
    let profileImageInput = document.getElementById('profile-image');
    let profileImagePreview = document.getElementById('profile-image-preview');

    // Load cached data
    let savedData = JSON.parse(localStorage.getItem('heading')) || {};
    let storedInfo = localStorage.getItem('template_info');

    let profileFileName = savedData["profile_file_name"] || null

    if (storedInfo) {
        let templateInfo = JSON.parse(storedInfo);
        console.log(templateInfo);
        isHeadshot = templateInfo["isHeadshot"];
    } else {
        alert("No template selected. Please choose one of the templates.");
        window.location.href = "/resume/select-template";
    }

    for (let [key, value] of Object.entries(savedData)) {
        let input = document.querySelector(`[name="${key}"]`);
        if (input && input.type !== "file") {
            input.value = value;
        }
    }

    // Profile Image div handler
    console.log(`isHeadshot: ${isHeadshot}`);
    profileImageUpload.style.display = isHeadshot ? "flex" : "none";

    if (profileFileName) {
        loadProfile(profileFileName)
    }


    profileImageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImagePreview.src = e.target.result;
                profileImagePreview.style.display = 'block';
                uploadProfile(file);
            };
            reader.readAsDataURL(file);
        } else {
            profileImagePreview.src = '';
            profileImagePreview.style.display = 'none';
        }
    });

    function loadProfile(profileFileName) {
        fetch(`/profile/${profileFileName}`, {
            method: "GET"
        }).then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                profileImagePreview.src = url;
            })
            .catch(error => {
                console.error('Failed to fetch profile image:', error);
            });
    }


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
                    checkForUpdates()
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

    function checkForUpdates() {
        let currentData = getFormData();
        let savedData = JSON.parse(localStorage.getItem('heading')) || {};
        if (profileFileName) {
            currentData['profile_file_name'] = profileFileName;
        }
        let dataChanged = Object.keys(currentData).some(key => currentData[key] !== savedData[key]);
        if (dataChanged) {
            localStorage.setItem('heading', JSON.stringify(currentData));
            // updatePreview(currentData);
        }
    }

    setInterval(checkForUpdates, pollingInterval);



    document.getElementById('heading-form').addEventListener('submit', function (event) {
        event.preventDefault();
        console.log(isHeadshot)
        console.log(profileFileName)
        if (isHeadshot && profileFileName === null) {
            alert("Please upload your profile")
            return
        }
        checkForUpdates()

        window.location.href = "/resume/section/education"



    });

});
