document.addEventListener('DOMContentLoaded', function () {
    const nextBtn = document.getElementById('confirm-btn');
    const loadingOverlay = document.getElementById('loading-overlay');

    nextBtn.addEventListener('click', function () {
        // Show the loading overlay
        loadingOverlay.style.display = 'flex';

        const cache_names = ["headingInfo", "workExpInfo", "templateInfo", "eduInfo", "skillInfo", "summary"];
        let cachedData = {};

        cache_names.forEach(cache_name => {
            cachedData[cache_name] = localStorage.getItem(cache_name);
        });

        console.log(cachedData)

        // 2-second custom loading time
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));


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
    });
});
