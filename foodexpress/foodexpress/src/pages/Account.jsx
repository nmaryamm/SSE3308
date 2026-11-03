import { useState } from 'react'

export default function Account({
  currentUser,
  onRegister,
  onLogin,
  onProfileSave,
  onLogout,
}) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setNotice('')
  }

  function submitAccount(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    const result = mode === 'register'
      ? onRegister({ name: name.trim(), email: email.trim(), password })
      : onLogin({ email: email.trim(), password })

    if (result.error) {
      setError(result.error)
      return
    }
    setName(result.user.name)
    setEmail(result.user.email)
    setPhone(result.user.phone ?? '')
    setPassword('')
  }

  function logout() {
    onLogout()
    setName('')
    setEmail('')
    setPassword('')
    setPhone('')
    setMode('login')
    setError('')
    setNotice('')
  }

  function saveProfile(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    const result = onProfileSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    })
    if (result) setError(result)
    else setNotice('Your profile has been updated for this session.')
  }

  if (currentUser) {
    return (
      <section className="page-section account-page">
        <div className="page-heading">
          <span className="section-kicker">Your MeyYum account</span>
          <h1>Manage profile</h1>
          <p>Update your details for this session.</p>
        </div>
        <form className="account-form" onSubmit={saveProfile}>
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="profile-phone">Phone (optional)</label>
          <input
            id="profile-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          {error && <p className="account-message account-error" role="alert">{error}</p>}
          {notice && <p className="account-message account-notice" role="status">{notice}</p>}
          <div className="account-actions">
            <button className="button-primary" type="submit">Save profile</button>
            <button className="account-secondary-button" type="button" onClick={logout}>Log out</button>
          </div>
        </form>
        <p className="account-demo-notice">Demo only: account details are temporary and will be cleared when this page is refreshed. Do not enter sensitive or real account information.</p>
      </section>
    )
  }

  return (
    <section className={`page-section account-page account-auth-page ${mode === 'register' ? 'register-mode' : 'login-mode'}`}>
      <div className="account-welcome-art" aria-hidden="true">
        <span>🍓</span><span>🧁</span><span>💛</span>
      </div>
      <div className="page-heading account-auth-heading">
        <span className="section-kicker">{mode === 'register' ? 'A little account magic' : 'Welcome back, foodie'}</span>
        <h1>{mode === 'register' ? 'Join the yum club!' : 'Let’s get you fed!'}</h1>
        <p>{mode === 'register' ? 'Make an account and get ready for your next delicious find.' : 'Sign in to pick up where the good food left off.'}</p>
      </div>
      <div className="account-mode-switch account-auth-tabs" role="tablist" aria-label="Account options">
        <button
          className={mode === 'login' ? 'active' : ''}
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          onClick={() => switchMode('login')}
        >
          Sign in
        </button>
        <button
          className={mode === 'register' ? 'active' : ''}
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          onClick={() => switchMode('register')}
        >
          Register
        </button>
      </div>
      <form className="account-form account-auth-form" onSubmit={submitAccount}>
        {mode === 'register' && (
          <>
            <label htmlFor="account-name">Name</label>
            <input
              id="account-name"
              type="text"
              autoComplete="name"
              placeholder="What should we call you?"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </>
        )}
        <label htmlFor="account-email">Email</label>
        <input
          id="account-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="account-password">Password</label>
        <input
          id="account-password"
          type="password"
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {mode === 'register' && <p className="account-password-hint">A little secret just for this demo (8+ characters).</p>}
        {error && <p className="account-message account-error" role="alert">{error}</p>}
        <button className="button-primary account-submit-button" type="submit">
          {mode === 'register' ? 'Let’s get munching!' : 'Let me in!'}
        </button>
      </form>
      <p className="account-demo-notice account-auth-notice">Demo only: accounts are temporary, stored only in this page session, and not secure. Do not use a real password or sensitive information.</p>
    </section>
  )
}
