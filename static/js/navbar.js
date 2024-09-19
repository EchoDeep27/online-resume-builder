document.addEventListener("DOMContentLoaded", function () {
    let showProfileCard = false;

    let menuToggle = document.querySelector('#mobile-menu');
    let navLinks = document.querySelector('.nav-links');
    let profileBtn = document.getElementById('profile-btn');
    let closeBtn = document.getElementById('close-btn');
    let logoutBtn = document.getElementById('logout-btn');
    let profileCard = document.getElementById('profile-card');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            showProfileCard = !showProfileCard;
            profileBtn.classList.toggle('highlighted');
            profileCard.style.display = showProfileCard ? 'flex' : 'none';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeProfileCard)
    }
    if (logoutBtn){
        logoutBtn.addEventListener("click", logout)
    }
    document.addEventListener('click', (event) => {
        if (showProfileCard && !profileCard.contains(event.target) && event.target !== profileBtn) {
            closeProfileCard()
        }

    });

    function closeProfileCard() {
        profileCard.style.display = 'none';
        showProfileCard = false;
        profileBtn.classList.toggle('highlighted');
    }
    function logout(){
        cleanCache();
        window.location.href = "/logout"
    }
});
