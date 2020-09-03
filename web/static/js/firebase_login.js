const firebase_signup = () => {
    let email = document.getElementById("email-input").value
    let password = document.getElementById("password-input").value
    console.log("email :", email)
    console.log("password :", password)
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch((error) => {
            var errorCode = error.code
            var errorMessage = error.message

            console.log(errorCode)
            console.log(errorMessage)
            alert(errorMessage)
        })
}

const firebase_signin = () => {
    let email = document.getElementById("email-input").value
    let password = document.getElementById("password-input").value
    console.log("email :", email)
    console.log("password :", password)
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
            var errorCode = error.code
            var errorMessage = error.message

            console.log(errorCode)
            console.log(errorMessage)
            alert(errorMessage)
        })
}

const firebase_signout = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
            // Sign-out successful.
            console.log("sign out successful")
        })
        .catch(function (error) {
            // An error happened.
            console.log("sign out error")
        })
}

document.getElementById("sign-up-btn").onclick = firebase_signup
document.getElementById("sign-in-btn").onclick = firebase_signin
document.getElementById("sign-out-btn").onclick = firebase_signout

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        var displayName = user.displayName
        var email = user.email
        var emailVerified = user.emailVerified
        var uid = user.uid
        var providerData = user.providerData

        console.log("display name :", displayName)
        console.log("email :", email)
        console.log("emailVerified :", emailVerified)
        console.log("uid :", uid)
        console.log("providerData :", providerData[0])

        document.getElementById("sign-up-btn").classList.add("d-none")
        document.getElementById("sign-in-btn").classList.add("d-none")
        document.getElementById("sign-out-btn").classList.remove("d-none")
    } else {
        // User is signed out.
        document.getElementById("sign-up-btn").classList.remove("d-none")
        document.getElementById("sign-in-btn").classList.remove("d-none")
        document.getElementById("sign-out-btn").classList.add("d-none")
        console.log("sign out")
    }
})
