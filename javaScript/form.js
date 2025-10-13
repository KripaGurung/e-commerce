const registerForm = document.getElementById("registerForm"); // HTML element with ID select gareyko jasley form element lai acsess dinxa
registerForm.addEventListener("submit", (e) => { // arrow function ree chy event ko object vayo
    e.preventDefault();
    // gets current value of each field by id
    const fullName = document.getElementById("fullName").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("ConfirmPassword").value;
    const gender = document.getElementById("gender").value;
    const termsChecked = document.getElementById("terms").checked

    // get selected hobbies
    const hobbies = [];
    document.querySelectorAll('input[name="hobbies"]:checked').forEach((hobby) => {
        hobbies.push(hobby.value); // hobbies ko option haru dherai xa so option used garda naya array ma hos vanerw push() used gareyko
    });
    
    // password rw confirm password same xa ki xaina vanerw checked gareyko
    if (password !== confirmPassword){
        alert("Password not match!");
        return;
    };
    
    if(!termsChecked) {
        alert("Please agree with terms and conditions before you register!");
        return;
    }

    //data collect garney
    const userData = {
        fullName,
        dateOfBirth,
        email,
        phone,
        address,
        password,
        confirmPassword,
        gender,
        hobbies
    };
    console.log("The user data : ", userData); // console ma data print garney

    alert("Account created successfully!")
    window.location.href ="login.html"
});
