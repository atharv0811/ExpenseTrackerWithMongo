const forgotBtn = document.getElementById('forgotBtn');
const btnSubmit = document.getElementById('loginForm')

if (btnSubmit) {
    btnSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('emailInput').value;
        const passwordInput = document.getElementById('passwordInput').value;
        const data = {
            emailInput: emailInput,
            passwordInput: passwordInput
        }

        try {
            const result = await axios.post('/user/check-login', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (result.data.data == 'success') {
                alert('Login Successfull');
                localStorage.setItem('token', result.data.token)
                window.location = '/expense/expense'
            }
        } catch (error) {
            if (error.response.data.data) {
                if (error.response.data.data == 'Failed') {
                    alert('Invalid Password');
                }
                if (error.response.data.data == 'notExist') {
                    alert('User Not Found!')
                }
                if (error.response.data.data == 'error') {
                    alert('Something went wrong...')
                }
            }
        }
    })
}


if (forgotBtn) {
    forgotBtn.addEventListener('click', async (e) => {
        const emailId = document.getElementById('EmailId').value;
        if (emailId == '') {
            alert('Please enter valid email address');
        }
        else {
            try {
                const response = await axios.post('/user/forgetPassword', { emailId });
                console.log(response)
                if (response.data.message == 'success') {
                    alert('Email Sent successfully check the email for further instructions!');
                    window.location.href = '/user/login';
                }
            } catch (error) {
                console.log(error);
                alert('Something went wrong');
            }
        }
    })
}