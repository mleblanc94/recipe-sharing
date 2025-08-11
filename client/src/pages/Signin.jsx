import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import 'tachyons';

import Auth from '../utils/auth';

const Signin = () => {
    //State setup
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [errorAlert, setError] = useState(null);
    const [login, { error, data }] = useMutation(LOGIN_USER);

    //Update the state based on form input changes function
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    //Submit form function
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await login({
                variables: { ...formState }
            });

            Auth.login(data.login.token);
        } catch (e) {
            setError('Login Credentials are invalid. Please try again.');
            console.error(e);
        }

        // Clear the form values
        setFormState({ email: '', password: ''})
    }

    return (
        <div className="tc">
            <h1 className="f3">Welcome to the best recipe sharing website there is!</h1>
        </div>
    )
}

export default Signin;

