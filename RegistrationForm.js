document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const mobile = document.getElementById('mobile');
    const language = document.getElementById('language');
    const attachment = document.getElementById('attachment');
    const gender = document.getElementsByName('gender');
    const terms = document.getElementById('terms');

    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const mobileError = document.getElementById('mobileError');
    const languageError = document.getElementById('languageError');
    const attachmentError = document.getElementById('attachmentError');
    const genderError = document.getElementById('genderError');
    const termsError = document.getElementById('termsError');
    const passwordStrength = document.getElementById('passwordStrength');

    // Helper functions
    function validateName() {
        if (name.value.trim() === '') {
            nameError.textContent = 'Please enter your name!';
            return false;
        }
        nameError.textContent = '';
        return true;
    }
    function validateEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            emailError.textContent = 'Please enter an email!';
            return false;
        } else if (!emailPattern.test(email.value.trim())) {
            emailError.textContent = 'Please enter a valid email!';
            return false;
        }
        emailError.textContent = '';
        return true;
    }
    function validatePassword() {
        if (password.value.length < 6) {
            passwordError.textContent = 'Please enter password (min 6 chars).';
            return false;
        }
        passwordError.textContent = '';
        return true;
    }
    function validateConfirmPassword() {
        if (confirmPassword.value !== password.value || confirmPassword.value === '') {
            confirmPasswordError.textContent = 'Please enter confirm password.';
            return false;
        }
        confirmPasswordError.textContent = '';
        return true;
    }
    function validateMobile() {
        const mobilePattern = /^\d{10,15}$/;
        if (mobile.value.trim() === '') {
            mobileError.textContent = 'Please enter mobile number.';
            return false;
        } else if (!mobilePattern.test(mobile.value.trim())) {
            mobileError.textContent = 'Please enter a valid mobile number (10-15 digits).';
            return false;
        }
        mobileError.textContent = '';
        return true;
    }
    function validateLanguage() {
        if (language.value === '') {
            languageError.textContent = 'Please select your language!';
            return false;
        }
        languageError.textContent = '';
        return true;
    }
    function validateAttachment() {
        if (!attachment.value) {
            attachmentError.textContent = 'Please select .JPG, .PNG, .PDF or .ZIP file.';
            return false;
        }
        const allowed = ['jpg', 'jpeg', 'png', 'pdf', 'zip'];
        const ext = attachment.value.split('.').pop().toLowerCase();
        if (!allowed.includes(ext)) {
            attachmentError.textContent = 'Please select .JPG, .PNG, .PDF or .ZIP file.';
            return false;
        }
        attachmentError.textContent = '';
        return true;
    }
    function validateGender() {
        let checked = false;
        for (let i = 0; i < gender.length; i++) {
            if (gender[i].checked) checked = true;
        }
        if (!checked) {
            genderError.textContent = 'You must select a gender.';
            return false;
        }
        genderError.textContent = '';
        return true;
    }
    function validateTerms() {
        if (!terms.checked) {
            termsError.textContent = 'Please confirm terms of use!';
            return false;
        }
        termsError.textContent = '';
        return true;
    }
    function checkPasswordStrength() {
        const val = password.value;
        let strength = 0;
        if (val.length >= 6) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;
        if (val.length === 0) {
            passwordStrength.textContent = '';
            return;
        }
        if (strength <= 1) {
            passwordStrength.textContent = 'Weak';
            passwordStrength.style.color = '#e74c3c';
        } else if (strength === 2) {
            passwordStrength.textContent = 'Medium';
            passwordStrength.style.color = '#f39c12';
        } else {
            passwordStrength.textContent = 'Strong';
            passwordStrength.style.color = '#27ae60';
        }
    }

    // Real-time validation
    name.addEventListener('input', validateName);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', function() {
        validatePassword();
        checkPasswordStrength();
        validateConfirmPassword();
    });
    confirmPassword.addEventListener('input', validateConfirmPassword);
    mobile.addEventListener('input', validateMobile);
    language.addEventListener('change', validateLanguage);
    attachment.addEventListener('change', validateAttachment);
    gender.forEach(radio => radio.addEventListener('change', validateGender));
    terms.addEventListener('change', validateTerms);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let valid = true;
        if (!validateName()) valid = false;
        if (!validateEmail()) valid = false;
        if (!validatePassword()) valid = false;
        if (!validateConfirmPassword()) valid = false;
        if (!validateMobile()) valid = false;
        if (!validateLanguage()) valid = false;
        if (!validateAttachment()) valid = false;
        if (!validateGender()) valid = false;
        if (!validateTerms()) valid = false;
        
        if (!valid) {
            return;
        }

        // Get form data
        const formData = new FormData();
        formData.append('name', name.value.trim());
        formData.append('email', email.value.trim());
        formData.append('password', password.value);
        formData.append('mobile', mobile.value.trim());
        formData.append('language', language.value);
        formData.append('gender', document.querySelector('input[name="gender"]:checked').value);
        formData.append('terms', terms.checked);
        
        if (attachment.files[0]) {
            formData.append('attachment', attachment.files[0]);
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                form.reset();
                passwordStrength.textContent = '';
                // Clear all error messages
                [nameError, emailError, passwordError, confirmPasswordError, mobileError, languageError, attachmentError, genderError, termsError].forEach(el => el.textContent = '');
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the form. Please try again.');
        }
    });
});