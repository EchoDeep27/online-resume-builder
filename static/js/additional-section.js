document.addEventListener('DOMContentLoaded', function () {
    const nextBtn = document.getElementById('confirm-btn');
    let addAnotherBtn = document.getElementById('add-another-btn');
    const loadingOverlay = document.getElementById('loading-overlay');

    nextBtn.addEventListener('click', sentResume);
    addAnotherBtn.addEventListener('click', () => insertLanguageForm(skillInfo = {}));


    function loadCache() {
        const cache_names = ["headingInfo", "workExpInfo", "templateInfo", "eduInfo", "skillInfo", "summary"];
        let cachedData = {};

        cache_names.forEach(cache_name => {
            cachedData[cache_name] = localStorage.getItem(cache_name);
        });
        return cachedData
    }



    function insertLanguageForm(skillInfo = {}, showRemoveBtn = true) {
        if (Object.keys(skillInfo).length == 0) {
            skillInfo = {
                skill: "",
                expertiseLevel: ExpertiseLevel.Beginner
            }
        }

        let skillFormWrapper = document.createElement('div');
        skillFormWrapper.classList.add('skill-form-wrapper');

        skillFormWrapper.innerHTML = `
            <form class="skill-form">
                <div>
                    <label for="skill">Skill</label>
                    <input type="text" name="skill" value="${skillInfo.skill}" required>
                </div>
    
                <div>
                    <label for="expertiseLevel">Expertise Level</label>
                    <select name="expertiseLevel" required>
                        ${generateOptions(ExpertiseLevel, skillInfo.expertiseLevel)}
                    </select>
                </div>
    
                ${showRemoveBtn ? '<button type="button" class="remove-form-btn"><i class="fas fa-trash-alt"></i></button>' : ''}
            </form>
        `;

        let skillFormsContainer = document.getElementById('skill-forms-container');
        let removeBtn = skillFormWrapper.querySelector(".remove-form-btn");
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeSkillForm(skillFormWrapper));

            skillFormWrapper.addEventListener('mouseover', function () {
                removeBtn.classList.add('showed-remove-btn');
            });

            skillFormWrapper.addEventListener('mouseout', function () {
                removeBtn.classList.remove('showed-remove-btn');
            });
        }

        skillFormsContainer.appendChild(skillFormWrapper);
    }


    function sentResume() {
        // Set up the loading animation
        loadingOverlay.style.display = 'flex';
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

        cachedData = loadCache()

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
                // window.location.ref ="/resume/finalize"

            })
            .catch(error => {
                console.error('Error:', error);

                loadingOverlay.style.display = 'none';

            });

    }
});
