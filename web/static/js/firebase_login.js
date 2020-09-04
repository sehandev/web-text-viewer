const firebase_signup = () => {
    let email = document.getElementById("email-input").value
    let password = document.getElementById("password-input").value
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch((error) => {
            // error.code, error.message
            switch (error.code) {
                case "auth/email-already-in-use":
                    alert("이미 사용중인 이메일 입니다.")
                    break
                case "auth/invalid-email":
                    alert("유효하지 않은 메일입니다")
                    break
                case "auth/operation-not-allowed":
                    alert("이메일 가입이 중지되었습니다.")
                    break
                case "auth/weak-password":
                    alert("비밀번호를 6자리 이상 필요합니다")
                    break
            }
        })
    console.log("SUCCESS : sign up")
}

const firebase_signin = () => {
    let email = document.getElementById("email-input").value
    let password = document.getElementById("password-input").value
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
            // error.code, error.message
            switch (error.code) {
                case "auth/invalid-email":
                    alert("유효하지 않은 메일입니다")
                    break
                case "auth/user-disabled":
                    alert("사용이 정지된 유저 입니다.")
                    break
                case "auth/user-not-found":
                    alert("사용자를 찾을 수 없습니다.")
                    break
                case "auth/wrong-password":
                    alert("잘못된 패스워드 입니다.")
                    break
            }
        })
    console.log("SUCCESS : sign in")
}

const firebase_signout = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
            // Sign-out successful.
            console.log("SUCCESS : sign out")
            toggle_display_none()
        })
        .catch(function (error) {
            // An error happened.
            console.log(error)
        })
}

document.getElementById("sign-up-btn").onclick = firebase_signup
document.getElementById("sign-in-btn").onclick = firebase_signin
document.getElementById("sign-out-btn").onclick = firebase_signout

const toggle_display_none = () => {
    document.getElementById("email-input").classList.toggle("d-none")
    document.getElementById("password-input").classList.toggle("d-none")
    document.getElementById("welcome-message").classList.toggle("d-none")
    document.getElementById("display-name").classList.toggle("d-none")
    document.getElementById("sign-up-btn").classList.toggle("d-none")
    document.getElementById("sign-in-btn").classList.toggle("d-none")
    document.getElementById("enter-btn").classList.toggle("d-none")
    document.getElementById("sign-out-btn").classList.toggle("d-none")
}

let user_uid

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        let displayName = user.displayName
        user_uid = user.uid

        if (!displayName) {
            user.updateProfile({
                displayName: "New User",
            })
                .then(() => {
                    // Update successful.
                    console.log("SUCCESS : Set display name")
                    document.getElementById("display-name").innerHTML = "New User"
                })
                .catch((error) => {
                    alert(error)
                })
        }
        document.getElementById("display-name").innerHTML = displayName

        toggle_display_none()
    } else {
        // User is signed out.
        console.log("sign out")
    }
})
