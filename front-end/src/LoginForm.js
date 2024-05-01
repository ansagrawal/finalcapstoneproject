import { useState } from 'react';

export function LoginForm(params) {

    const [showEmailField, setShowEmailField] = useState(false);
    const [email, setEmail] = useState('');

    const handleChange = (event) => {
        let newCredentials = { ...params.credentials };
        newCredentials[event.target.name] = event.target.value;
        params.setCredentials(newCredentials);
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleRegisterClick = async () => {
        if (!showEmailField) {
            setShowEmailField(true);
            params.credentials.username = '';
            params.credentials.password = '';
            return;
        }
        if (!params.credentials.username && !params.credentials.password || !email) {
            alert("Missing required fields!");
            return;
        }
        if (!validateEmail(email)) {
            alert('Invalid email format');
            return;
        }
        try {
            const response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: params.credentials.username,
                    password: params.credentials.password,
                    email: email
                })
            });
            if (response.ok) {
                await response.json();
                alert('User registered!');
            } else {
                throw new Error('Failed to register user');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred during registration.');
        }
    };

    const handleBackToLogin = () => {
        setShowEmailField(false);
        setEmail('');
    };

    return (
        <div className="box" style={{ maxWidth: "unset" }}>
            <button className={showEmailField ? "hidden" : "visible"} onClick={params.login}>
                {(params.currentUser) ? "Logout" : "Login"}
            </button>
            <p className={showEmailField ? "hidden" : "visible"}>
                User: <span style={{ fontWeight: "bold" }} >{(params.currentUser) ? params.currentUser.username : "not logged in"}</span>
            </p>
            <div className={(params.currentUser) ? "hidden" : "visible"}>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" size={10} id="username" required={true} name="username" value={params.credentials.username} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" size={10} id="password" required={true} name="password" value={params.credentials.password} onChange={handleChange} />
                </div>
                {showEmailField && (
                    <div>
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input type="email" size={10} id="email" required={true} name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <button onClick={handleBackToLogin}>Back to Login</button>
                        </div>
                    </div>
                )}
                &nbsp;
                <div>
                    <button onClick={handleRegisterClick}>Register</button>
                </div>
            </div>

        </div>
    );
}