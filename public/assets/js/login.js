async function loginFormHandler(event) {
    event.preventDefault();
    
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    if (email && password) {
      console.log(email, password)
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        console.log('logged in!')
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }
    }
  }



  document.querySelector('#submit-login').addEventListener('submit', loginFormHandler);
