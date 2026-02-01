document.getElementById("contact-form").onsubmit = () => {

    clearErrors();

    let isValid = true;

    //validate first name
    let fname = document.getElementById("firstName").value.trim();
    if(!fname) {
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }

    //validate last name
    let lname = document.getElementById("lastName").value.trim();
    if(!lname) {
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }

    //validate linkedin
    let linkedin = document.getElementById("linkedin").value.trim();
    if(!linkedin) {
        document.getElementById("err-url").style.display = "block";
        isValid = false;
    }

    //validate email address
    let email = document.getElementById("email").value.trim();
    if(!email) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

     //validate how
    let how = document.getElementById("how").value;
    if(how == "none") {
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
