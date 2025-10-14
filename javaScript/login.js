document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
             e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const userData = {
                email,
                password
            };
            console.log("The user data is: ", userData); 

            if (email === "kripa@yopmail.com" && password === "TEST@123") {
                // alert("logged successfully ")
                window.location.href ="dashboard.html";
            } else{
                alert("Email or Password not found!");
            };

        });
    } else {
        console.error("LoginForm element not found after DOM load!");
    }
});