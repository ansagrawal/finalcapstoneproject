import { useState } from 'react';

export function LoginForm(params) {

    const [showEmailField, setShowEmailField] = useState(false);
    const [email, setEmail] = useState('');

    const handleChange = (event) => {
        let newCredentials = { ...params.credentials };
        newCredentials[event.target.name] = event.target.value;
        params.setCredentials(newCredentials);
    };

    const handleRegisterClick = () => {
        setShowEmailField(true);
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