let display_name // 접속 user의 firebase display_name
let user_uid // 접속 user의 firebase uid
let is_signup = false // 회원가입 진행 유무

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
            is_signup = false
        })
    is_signup = true
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
    document.getElementById("display-name").classList.toggle("d-none")
    document.getElementById("sign-up-btn").classList.toggle("d-none")
    document.getElementById("sign-in-btn").classList.toggle("d-none")
    document.getElementById("enter-btn").classList.toggle("d-none")
    document.getElementById("sign-out-btn").classList.toggle("d-none")
}

const update_display_name = (user, new_display_name) => {
    user.updateProfile({
        displayName: new_display_name,
    })
        .then(() => {
            // Update successful.
            console.log("SUCCESS : update display name")
        })
        .catch((error) => {
            console.error(error)
        })
}

const send_verify_email = (user) => {
    user.sendEmailVerification()
        .then(function () {
            // Email sent.
            console.log("SUCCESS : verify email send")
        })
        .catch(function (error) {
            // An error happened.
            console.log("FAIL : verify email send")
            console.log(error)
        })
}

const post_new_user = (user_name, user_email, firebase_uuid) => {
    let xhr = new XMLHttpRequest()
    let url = "http://api.sehandev.com/users"
    let user_form_data = new FormData()
    user_form_data.append("user_name", user_name)
    user_form_data.append("user_email", user_email)
    user_form_data.append("firebase_uuid", firebase_uuid)

    xhr.open("POST", url, true)
    xhr.send(user_form_data)

    xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
            console.log("SUCCESS post new user :", xhr.responseText)
        } else {
            console.error("FAIL post new user :", xhr.responseText)
        }
    }
}

firebase.auth().onAuthStateChanged((user) => {
    document.getElementById("email-input").value = null
    document.getElementById("password-input").value = null
    if (user) {
        if (is_signup) {
            // sign up

            update_display_name(user, "new_user")
            send_verify_email(user)
            post_new_user("new_user", user.email, user.uid)

            document.getElementById("display-name").innerHTML = "new_user"
            is_signup = false
            user_uid = user.uid
        } else {
            // sign in

            let displayName = user.displayName
            user_uid = user.uid

            document.getElementById("display-name").innerHTML = displayName
        }

        if (user.emailVerified) {
            // email 인증을 마친 user
            document.getElementById("welcome-message").classList.remove("d-none")
            document.getElementById("email-verify-message").classList.add("d-none")
            document.getElementById("enter-btn").disabled = false
        } else {
            // email 인증을 마치지 않은 user
            document.getElementById("welcome-message").classList.add("d-none")
            document.getElementById("email-verify-message").classList.remove("d-none")
            document.getElementById("enter-btn").disabled = true
        }

        toggle_display_none()
    } else {
        // User is signed out.
        console.log("sign out")
        document.getElementById("welcome-message").classList.add("d-none")
        document.getElementById("email-verify-message").classList.add("d-none")
    }
})
