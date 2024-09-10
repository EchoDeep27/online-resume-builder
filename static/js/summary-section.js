document.addEventListener('DOMContentLoaded', function () {
    const CACHED_NAME = "summary"
    let pollingInterval = 5000
    let submitBtn = document.getElementById('next-btn');
    submitBtn.addEventListener('click', submitForm);
    loadCached();
    setProgressBar(Page.summary)
    loadResumePreview(Page.summary)


    setInterval(handleSummaryInfo, pollingInterval);

    function handleSummaryInfo() {
        let summaryForm = document.getElementById('summary-form');

        let summary = summaryForm.querySelector('textarea').value;
        checkForUpdate(CACHED_NAME, summary)
        // localStorage.setItem(CACHED_NAME, summary);
    }

    function submitForm() {
        handleSummaryInfo()
        window.location.href = `/resume/section/finalize?template_id=${TEMPLATE_ID}`;
    }



    function loadCached() {
        let cachedData = localStorage.getItem(CACHED_NAME);

        if (cachedData) {
            let summary = JSON.parse(cachedData)

            let summaryForm = document.getElementById('summary-form');
            summaryForm.querySelector('textarea').value = summary;
            handleSummaryInfo()

        }
    }


});