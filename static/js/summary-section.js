document.addEventListener('DOMContentLoaded', function () {
  
    // let pollingInterval = 5000
    let typingTimer;
    let submitBtn = document.getElementById('next-btn');
    submitBtn.addEventListener('click', submitForm);
    loadCached();
    setProgressBar(Page.summary)
    loadResumePreview(Page.summary)


    // setInterval(handleSummaryInfo, pollingInterval);
    document.addEventListener('input', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(handleSummaryInfo, INPUT_TYPING_DELAY);
    });

    function handleSummaryInfo() {
        let summaryForm = document.getElementById('summary-form');

        let summary = summaryForm.querySelector('textarea').value;
        checkForUpdate(CACHE_NAMES.SUMMARY, summary)
    
    }

    function submitForm() {
        handleSummaryInfo()
        window.location.href = `/resume/section/finalize?template_id=${TEMPLATE_ID}`;
    }



    function loadCached() {
        let cachedData = localStorage.getItem(CACHE_NAMES.SUMMARY);

        if (cachedData) {
            let summary = JSON.parse(cachedData)

            let summaryForm = document.getElementById('summary-form');
            summaryForm.querySelector('textarea').value = summary;
            handleSummaryInfo()

        }
    }


});