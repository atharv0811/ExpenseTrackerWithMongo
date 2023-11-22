document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password1').value;
    const confirmPassword = document.getElementById('password2').value;

    if (password === confirmPassword) {
        try {
            const id = window.location.href.split('/')[5];
            const response = await axios.post('/user/updatePasswordData', { password, id });
            if (response.status === 200) {
                alert('Password updated successfully');
                window.location.href = '/user/login';
            } else {
                alert('Failed to update password. Please try again later.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update password. Please try again later.');
        }
    } else {
        alert('Both passwords should match.');
    }
});