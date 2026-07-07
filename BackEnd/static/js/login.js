document.addEventListener('DOMContentLoaded', function () {
    var navbarCollapse = document.querySelector('#navbarSupportedContent');
    var navbarToggler = document.querySelector('.navbar-toggler');

    navbarToggler.addEventListener('click', function () {
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('glassmorphism');
        } else if (window.innerWidth < 992) {
            navbarCollapse.classList.add('glassmorphism');
        }
    });

    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
        navbarCollapse.classList.remove('glassmorphism');
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) {
            navbarCollapse.classList.remove('glassmorphism');
            navbarCollapse.classList.remove('show');
        } else if (!navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.add('glassmorphism');
        }
    });

});

function switchToSignin() {
    const signinTab = new bootstrap.Tab(document.getElementById('signin-tab'));
    signinTab.show();
    const signInAnimate = document.getElementsByClassName('animateElement');
    for (let i = 0; i < signInAnimate.length; i++) {
        signInAnimate[i].classList.remove('signup');
        signInAnimate[i].classList.add('signin');
    }
}
function switchToSignup() {
    const signupTab = new bootstrap.Tab(document.getElementById('signup-tab'));
    signupTab.show();
    const signUpAnimate = document.getElementsByClassName('animateElement');
    for (let i = 0; i < signUpAnimate.length; i++) {
        signUpAnimate[i].classList.remove('signin');
        signUpAnimate[i].classList.add('signup');
    }
}

function toggleRoles() {
    const roleSelection = document.getElementById('roleSelection');
    const instituteSelect = document.querySelector('input[name="institution"]:checked').value;
    // Show role selection if either "School" or "College" is selected
    roleSelection.style.display = (instituteSelect === 'school' || instituteSelect === 'college') ? 'flex' : 'none';
}

function validateSignup() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('signupPassword').value;
    if (!email || !username || !password) {
        alert("Please fill in all fields.");
        return false;
    }
    return true;
}

function validateSignin() {
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    if (!email || !password) {
        alert("Please fill in your email and password.");
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const element1 = document.getElementById('ele1');
    const element2 = document.getElementById('ele2');
    const element3 = document.getElementById('ele3');
    const element4 = document.getElementById('ele4');
    if (tab === 'signup') {
        document.getElementById('signup-tab').classList.add('active');
        document.getElementById('signin-tab').classList.remove('active');
        document.getElementById('signup').classList.add('show', 'active');
        document.getElementById('signin').classList.remove('show', 'active');
    } else {
        document.getElementById('signin-tab').classList.add('active');
        document.getElementById('signup-tab').classList.remove('active');
        document.getElementById('signin').classList.add('show', 'active');
        document.getElementById('signup').classList.remove('show', 'active');
        element1.classList.remove('signup');
        element1.classList.add('signin');
        element2.classList.remove('signup');
        element2.classList.add('signin');
        element3.classList.remove('signup');
        element3.classList.add('signin');
        element4.classList.remove('signup');
        element4.classList.add('signin');
    }
});


function showForgetPassword() {
    const signinTab = document.getElementById('signin');
    const selectRole = document.getElementById('selectRole')
    const myTab = document.getElementById('myTab');
    const forgetScreen = document.getElementById('forgetPassword');
    const card = document.getElementById('card');
    const otpScreen = document.getElementById('OTPPage')

    signinTab.style.display = 'none';
    myTab.style.display = 'none';
    selectRole.style.display = 'none';

    setTimeout(() => {
        forgetScreen.style.display = 'flex';
    }, 300)
    card.classList.add('flipped');
    otpScreen.style.display = 'none';
}


function otpScreen() {
    const forgetScreen = document.getElementById('forgetScreen');
    const OTPScreen = document.getElementById('OTPPage');
    const forgetEmail = document.getElementById('forget-email').value; // Correct ID used here
    if (!forgetEmail || !forgetEmail.includes("@")) {
        alert("Enter Valid Email");
        return false;
    } else {
        forgetScreen.style.display = 'none';
        OTPScreen.style.display = 'block';
        startTimer();
        return false;
    }
}


function startTimer() {
    let timeLeft = 149;
    const resendOTP = document.getElementById('resendOTP');
    const timerElement = document.getElementById('timer');
    const countdown = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerElement.textContent = "You Can Resend OTP!";
            resendOTP.classList.remove("resendDisabled");
            resendOTP.classList.add("resendEnabled");
        }
        timeLeft--;
    }, 1000);

    if (timeLeft > 0) {
        resendOTP.classList.add("resendDisabled");
    }
}


function moveToNext(current) {
    if (current.value.length >= current.maxLength) {
        const next = current.nextElementSibling;
        if (next) {
            next.focus();
        }
    }
}

function handleBackspace(event) {
    if (event.key === 'Backspace') {
        const current = event.target;
        if (current.value === '') {
            const previous = current.previousElementSibling;
            if (previous) {
                previous.focus();
                previous.value = '';
            }
        }
    }
}
function allowOnlyNumbers(event) {
    const key = event.key;
    if (!/^[0-9]$/.test(key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
    }
}
6
document.querySelectorAll('.otp-box').forEach(input => {
    input.addEventListener('keydown', handleBackspace);
    input.addEventListener('keydown', allowOnlyNumbers);
});


function verifyOTP() {
    const otpInputs = document.querySelectorAll('.otp-box');
    let allFilled = true;
    const resetpass = document.getElementById('PasswordReset');

    otpInputs.forEach(input => {
        if (input.value === '') {
            allFilled = false;
        }
    });

    if (!allFilled) {
        alert('Please fill in all OTP fields.');
        return false;
    }
    else {
        const passwordResetModal = new bootstrap.Modal(resetpass);
        passwordResetModal.show();
        return true;
    }
};

function ResetPassword() {
    const newPass = document.getElementById('newPass').value;
    const confPass = document.getElementById('confirmPass').value;
    const PasswordAlert = document.getElementById('PasswordAlert');
    if (newPass != confPass) {
        PasswordAlert.style.display = "block";
        return false;
    }
    else {
        switchToSignin();
        return true;
    }

}
function resendOTP() {
    alert("OTP Resent Successfully");
}

function togglePasswordVisibility() {
    const signinPass = document.getElementById('signinPassword');
    const signupPass = document.getElementById('signupPassword');
    const SignintoggleIcon = document.getElementById('SignintogglePasswordIcon');
    const SignuptoggleIcon = document.getElementById('SignuptogglePasswordIcon');

    if (signinPass.type === 'password' || signupPass.type === 'password') {
        signupPass.type = 'text';
        signinPass.type = 'text';
        SignuptoggleIcon.classList.remove('fa-eye');
        SignuptoggleIcon.classList.add('fa-eye-slash');
        SignintoggleIcon.classList.remove('fa-eye');
        SignintoggleIcon.classList.add('fa-eye-slash');
    } else {
        signinPass.type = 'password';
        signupPass.type = 'password';
        SignuptoggleIcon.classList.remove('fa-eye-slash');
        SignuptoggleIcon.classList.add('fa-eye');
        SignintoggleIcon.classList.remove('fa-eye-slash');
        SignintoggleIcon.classList.add('fa-eye');
    }
}