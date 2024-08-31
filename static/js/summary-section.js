document.addEventListener('DOMContentLoaded', function () {
    const CACHED_NAME = "summary"
    let submitBtn = document.getElementById('next-btn');
    submitBtn.addEventListener('click', cachedSummaryInfo);
    loadCached()



    function cachedSummaryInfo() {
        let summaryForm = document.getElementById('summary-form');
 
        let summary = summaryForm.querySelector('textarea').value;

        localStorage.setItem(CACHED_NAME, summary);

        window.location.href = '/resume/section/finalize';
    }


    function loadCached() {
        let cachedData = localStorage.getItem(CACHED_NAME);

        if (cachedData) {
            let summary = cachedData;

            let summaryForm = document.getElementById('summary-form');
            summaryForm.querySelector('textarea').value = summary;

        }
    }


});