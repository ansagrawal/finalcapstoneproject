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
        if (!params.credentials.username || !params.credentials.password || !email) {
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
                const data = await response.json();
                alert('Error! ' + data.message);
            }
        } catch (error) {
            console.error('Error registering user: ', error);
            alert('An error occurred during registration.');
        }
    };

    const handleBackToLogin = () => {
        setShowEmailField(false);
        setEmail('');
    };

    function createAuthHeader() {
        const storedToken = localStorage.getItem(params.currentUser.username);
        const authHeader = storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {};
        return authHeader;
    }

    const handleAuditLogs = async () => {
        const authHeader = createAuthHeader();
        await fetch('/admin/access-logs', { headers: authHeader })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const newTab = window.open();
                const doc = newTab.document;
                doc.write(data);
                doc.close(); // Close the document after writing
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    return (
        <div className="box" style={{ maxWidth: "unset" }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ marginRight: '10px', marginBottom: '10px' }} className={params.currentUser ? "hidden" : "visible"}>
                    <label htmlFor="username">Username: </label>
                    <input type="text" size={10} id="username" required={true} name="username" value={params.credentials.username} onChange={handleChange} />
                </div>
                <div style={{ marginRight: '10px', marginBottom: '10px' }} className={params.currentUser ? "hidden" : "visible"}>
                    <label htmlFor="password">Password: </label>
                    <input type="password" size={10} id="password" required={true} name="password" value={params.credentials.password} onChange={handleChange} />
                </div>
                {showEmailField && (
                    <div style={{ marginRight: '10px', marginBottom: '10px' }}>
                        <label htmlFor="email">Email: </label>
                        <input type="email" size={10} id="email" required={true} name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                )}
                {params.currentUser && localStorage.getItem(params.currentUser.username) && (
                    <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
                        <button onClick={handleAuditLogs}>Audit Logs</button>
                    </div>
                )}
            </div>
            &nbsp;
            <button className={showEmailField ? "hidden" : "visible"} onClick={params.login}>
                {(params.currentUser) ? "Logout" : "Login"}
            </button>
            <p className={showEmailField ? "hidden" : "visible"}>
                User:<span style={{ fontWeight: "bold" }}>{(params.currentUser) ? params.currentUser.username : "not logged in"}</span>
            </p>
            <div className={(params.currentUser) ? "hidden" : "visible"}>
                <div>
                    <button style={{ marginRight: '10px' }} onClick={handleRegisterClick}>Register</button>
                    {showEmailField && (
                        <button onClick={handleBackToLogin}>Back to Login</button>
                    )}
                </div>
            </div>
        </div>
    );
}