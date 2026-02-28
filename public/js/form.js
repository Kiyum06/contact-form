document.getElementById("contact-form").onsubmit = () => {

    clearErrors();

    let isValid = true;

    //validate first name
    let fname = document.getElementById("fname").value.trim();
    if(!fname) {
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }

    //validate last name
    let lname = document.getElementById("lname").value.trim();
    if(!lname) {
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }

    //validate linkedin
    let linkedin = document.getElementById("linkedin").value.trim();
    let linkedinPrefix = "https://linkedin.com/in/";

    if (linkedin && !linkedin.startsWith(linkedinPrefix)) {
        document.getElementById("err-url").style.display = "block";
        isValid = false;
    }

    //validate email address
    let email = document.getElementById("email").value.trim();
    let mailingListChecked = document.getElementById("mailing-list").checked;

    //if maillist is checked
    if (mailingListChecked) {
        if (!email) {
            document.getElementById("err-email").textContent =
                "Email is required to join the mailing list!";
            document.getElementById("err-email").style.display = "block";
            isValid = false;
        } else if (!email.includes("@") || !email.includes(".")) {
            document.getElementById("err-email").textContent =
                "Please enter a valid email address!";
            document.getElementById("err-email").style.display = "block";
            isValid = false;
        }
    } else {
        if (email && (!email.includes("@") || !email.includes("."))) {
            document.getElementById("err-email").textContent =
                "Please enter a valid email address!";
            document.getElementById("err-email").style.display = "block";
            isValid = false;
        }
    }

     //validate how
    let how = document.getElementById("how").value;
    if(!how) {
        document.getElementById("err-how").style.display = "block";
        isValid = false;
    }


    return isValid;

}

function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for(let i = 0; i < errors.length ; i++){
        errors[i].style.display = "none";
    }
}
