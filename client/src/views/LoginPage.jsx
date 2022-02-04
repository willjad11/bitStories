import styles from '../components/css/bitStories.module.css'
import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const LoginPage = (props) => {
    const [registerErrors, setRegisterErrors] = useState({});
    const [loginError, setLoginError] = useState({});
    const { user, setUser } = props;
    const history = useHistory();

    useEffect(async () => {
        user && 
            localStorage.setItem('userid', user.id);
        localStorage.getItem('userid') && 
            !user && 
                await axios.get(`http://localhost:8000/api/users/${localStorage.getItem('userid')}`, { withCredentials: true })
                    .then(res => {
                        setUser(res.data)
                    })
        user && 
            history.push('/feed');
    }, [user]);

    const createUser = registerForm => {
        setRegisterErrors({});
        axios.post('http://localhost:8000/api/register', registerForm, { withCredentials: true })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                setRegisterErrors({ err }.err.response.data.errors)
            });
    }

    const loginUser = loginForm => {
        setLoginError({});
        axios.post('http://localhost:8000/api/login', loginForm, { withCredentials: true })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                setLoginError({ err }.err.response.data)
            });
    }


    return (
        <div>
            <div className={ styles.navbar }>
                <h1>bitStories</h1>
            </div>
            <div className={ styles.pageCont }>
                <LoginForm 
                    onSubmitRegisterForm={createUser} 
                    onSubmitLoginForm={loginUser} 
                    registerErrors={registerErrors} 
                    loginError={loginError} 
                />
            </div>
        </div>
    )
}

export default LoginPage;