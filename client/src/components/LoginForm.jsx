import React, { useState } from 'react'
import styles from './css/bitStories.module.css'

const LoginForm = (props) => {
    const { onSubmitRegisterForm, onSubmitLoginForm, registerErrors, loginError } = props;
    const [registerFirstName, setRegisterFirstName] = useState("");
    const [registerLastName, setRegisterLastName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const registerHandler = e => {
        e.preventDefault();
        const firstName = registerFirstName;
        const lastName = registerLastName;
        const email = registerEmail;
        const password = registerPassword;
        const confirmPassword = registerConfirmPassword;
        onSubmitRegisterForm({ firstName, lastName, email, password, confirmPassword });
    }

    const loginHandler = e => {
        e.preventDefault();
        const email = loginEmail;
        const password = loginPassword;
        onSubmitLoginForm({ email, password });
    }

    return (
        <div className={styles.loginPageCont}>
            <form className={styles.registerForm} onSubmit={registerHandler}>
                <h1>Register</h1>
                {registerErrors.firstName && (<div style={{ color: 'red' }}>{registerErrors.firstName.message}</div>)}
                <p className={styles.input}>
                    <label className={styles.label}>First Name</label>
                    <input type="text" onChange={(e) => setRegisterFirstName(e.target.value)} value={registerFirstName} />
                </p>
                {registerErrors.lastName && (<div style={{ color: 'red' }}>{registerErrors.lastName.message}</div>)}
                <p className={styles.input}>
                    <label className={styles.label}>Last Name</label>
                    <input type="text" onChange={(e) => setRegisterLastName(e.target.value)} value={registerLastName} />
                </p>
                {registerErrors.email && (<div style={{ color: 'red' }}>{registerErrors.email.message}</div>)}
                <p className={styles.input}>
                    <label className={styles.label}>Email</label>
                    <input type="text" onChange={(e) => setRegisterEmail(e.target.value)} value={registerEmail} />
                </p>
                {registerErrors.password && (<div style={{ color: 'red' }}>{registerErrors.password.message}</div>)}
                <p className={styles.input}>
                    <label className={styles.label}>Password</label>
                    <input type="password" onChange={(e) => setRegisterPassword(e.target.value)} value={registerPassword} />
                </p>
                {registerErrors.confirmPassword && (<div style={{ color: 'red' }}>{registerErrors.confirmPassword.message}</div>)}
                <p className={styles.input}>
                    <label className={styles.label}>Confirm Password</label>
                    <input type="password" onChange={(e) => setRegisterConfirmPassword(e.target.value)} value={registerConfirmPassword} />
                </p>
                <input type="submit" className={styles.submit} value="Register" />
            </form>
            <form className={styles.loginForm} onSubmit={loginHandler}>
                <h1>Login</h1>
                {loginError == "Bad Request" && (<div style={{ color: 'red' }}>Wrong email or password</div>)}
                <p className={styles.input}>
                    <label className={styles.label}>Email</label>
                    <input type="text" onChange={(e) => setLoginEmail(e.target.value)} value={loginEmail} />
                </p>
                <p className={styles.input}>
                    <label className={styles.label}>Password</label>
                    <input type="password" onChange={(e) => setLoginPassword(e.target.value)} value={loginPassword} />
                </p>
                <input type="submit" className={styles.submit} value="Login" />
            </form>
        </div>
    )
}

export default LoginForm;

