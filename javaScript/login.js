document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
             e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // const userName = email.split("@")[0];

            // username lai store gareyko
            // localStorage.setItem("userLogIn", userName)

            // const userData = {
            //     email,
            //     password
            // };
            // console.log("The user data is: ", userData); 

            // // checking email and password 
            // if (email === "kripa@yopmail.com"  && password === "TEST@123") {
            //     // alert("logged successfully ")
            //     window.location.href ="dashboard.html";
            // } else{
            //     alert("Email or Password not found!");
            // };


            
            // get stored users
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // find user by email & password
            const validUser = users.find(user => user.email === email && user.password === password);
            
            if (validUser) {
                
                  // save login info
                const userName = validUser.fullName || email.split("@")[0];
                localStorage.setItem("userLogIn", userName);
                localStorage.setItem("loggedInUserEmail", validUser.email); // important for cart tracking
                window.location.href = "dashboard.html";
            } else {
                alert("Email or Password not found!");
            }
        });
    } else {
        console.error("LoginForm element not found after DOM load!");
    }
});