document.addEventListener('DOMContentLoaded', function () {
    const nextBtn = document.getElementById('confirm-btn');
    const loadingOverlay = document.getElementById('loading-overlay');

    nextBtn.addEventListener('click', function () {
        // Show the loading overlay
        loadingOverlay.style.display = 'flex';

        // Fetch API call to submit data
        const cache_names = ["headingInfo","workExpInfo", "templateInfo", "eduInfo", "skillInfo"];
        let cachedData = {};

        // Retrieve data from localStorage
        cache_names.forEach(cache_name => {
            cachedData[cache_name] = localStorage.getItem(cache_name);
        });
      
        console.log(cachedData)
        
        // Start the 3-second timeout
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 3000));

       
        const apiRequest = fetch('/resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cachedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        });

        // Wait for both the minimum loading time and the API request to complete
        Promise.all([minLoadingTime, apiRequest])
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
