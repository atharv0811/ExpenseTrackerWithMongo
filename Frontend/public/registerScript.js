document.getElementById('registerationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('nameInput').value;
    const emailInput = document.getElementById('emailInput').value;
    const passwordInput = document.getElementById('passwordInput').value;
    const confirmPasswordInput = document.getElementById('confirmPasswordInput').value;

    if (passwordInput === confirmPasswordInput) {
        const formData = {
            nameInput: nameInput,
            emailInput: emailInput,
            passwordInput: passwordInput
        }
        try {
            const response = await axios.post('/user/addUser', formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = response.data;
            console.log(data)
            if (data.data === "success") {
                alert("Registration successful!");
                window.location = '/user/login';
            } else if (data.data === "exist") {
                alert("User already exists!");
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            alert("Something went wrong!");
            console.error('Error:', error);
        }
    }
    else {
        alert('Passwords do not match.');
    }
})