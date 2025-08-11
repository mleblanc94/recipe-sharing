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
            <h1 className="f2">Welcome to the best recipe sharing website there is!</h1>
            <div className="flex justify-center">
        <article className="br2 ba dark-gray b--black-10 mv4 w-40-l mw6 mh4 center shadow-1 ">
          <main className="pa4 black-80">
            {/* Login Card */}
            <form className="measure" onSubmit={handleFormSubmit}>              
              <fieldset id="login" className="ba b--transparent ph0 mh0">
                <legend className="f4 fw6 ph0 mh0">Login</legend>
                <div className="mt3">
                  <label className="db fw6 lh-copy f6" htmlFor="email">
                    Email:
                  </label>
                  <input
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="text"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mv3">
                  <label className="db fw6 lh-copy f6" htmlFor="password">
                    Password:
                  </label>
                  <input
                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="password"
                    id="password"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="tc">
                  <input
                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                    type="submit"
                    value={'Login'}
                  />
                </div>
              </fieldset>
              {error && <p>Error: { errorAlert && error.message }</p>}
            </form>
          </main>
        </article>
      </div>
        </div>
    )
}

export default Signin;

