import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import 'tachyons';
import './Signup.css'; // reuse the same auth-* styles

const Signin = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const [formState, setFormState] = useState({ email: '', password: '' });
  const [uiError, setUiError] = useState('');
  const [login, { loading }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUiError('');

    try {
      const { data } = await login({ variables: { ...formState } });
      Auth.login(data.login.token);
      navigate('/', { replace: true });
    } catch (e) {
      console.error(e);
      setUiError('Invalid email or password. Please try again.');
    }
  };

  const canSubmit = formState.email.trim() && formState.password.trim();

  return (
    <div className="auth-wrap">
      <header className="auth-hero">
        <h1>Welcome to the best recipe sharing website there is!</h1>
      </header>

      <section className="auth-card shadow-5">
        <h2 className="auth-title">Login</h2>

        <form className="auth-form" onSubmit={handleFormSubmit} noValidate>
          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <input
            className="auth-input"
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <div className="auth-input-group">
            <input
              className="auth-input"
              type={showPw ? 'text' : 'password'}
              id="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>

          {uiError && <div className="auth-error">{uiError}</div>}

          <button className="auth-btn" type="submit" disabled={!canSubmit || loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="auth-footnote">
          Don’t have an account?{' '}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Signin;
