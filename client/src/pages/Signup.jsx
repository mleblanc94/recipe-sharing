import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import 'tachyons';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [createUser, { error, loading }] = useMutation(CREATE_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((s) => ({ ...s, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createUser({
        variables: { ...formState },
      });
      // Log in & take them to the home page (you can change to /profile if you prefer)
      Auth.login(data.createUser.token);
      navigate('/', { replace: true });
    } catch (e) {
      // handled visually below
      console.error(e);
    }
  };

  const canSubmit =
    formState.email.trim() &&
    formState.username.trim() &&
    formState.password.trim();

  return (
    <div className="auth-wrap">
      <header className="auth-hero">
        <h1>Welcome to the best recipe sharing website there is!</h1>
      </header>

      <section className="auth-card shadow-5">
        <h2 className="auth-title">Sign up to see great recipe ideas!</h2>

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

          <label className="auth-label" htmlFor="username">
            Username
          </label>
          <input
            className="auth-input"
            type="text"
            id="username"
            name="username"
            value={formState.username}
            onChange={handleChange}
            autoComplete="username"
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
              autoComplete="new-password"
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

          {error && (
            <div className="auth-error">
              <strong>Sign up failed:</strong>{' '}
              {error.message?.replace('GraphQL error:', '').trim()}
            </div>
          )}

          <button
            className="auth-btn"
            type="submit"
            disabled={!canSubmit || loading}
          >
            {loading ? 'Creating…' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footnote">
          Already have an account?{' '}
          <Link to="/signin" className="auth-link">
            Log in
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Signup;