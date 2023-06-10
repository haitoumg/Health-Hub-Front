import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordForm = () => {
    const { resetToken } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [tokenValid, setTokenValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the token is valid by making an API request to validate the token
        const validateToken = async () => {
            try {
                const response = await fetch(`http://localhost:9090/validatetoken/${resetToken}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setTokenValid(true);
                } else {
                    setErrorMessage('Invalid reset token');
                }
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred while validating the token');
            }
        };

        validateToken();
    }, [resetToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords don't match");
            return;
        }

        try {
            const response = await fetch(`http://localhost:9090/resetpassword/${resetToken}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword }),
            });

            if (response.ok) {
                toast.success('Password reset successfully');
                navigate('/');
                // Redirect or perform any other action upon successful password reset
            } else if (response.status === 404) {
                setErrorMessage('Invalid reset token');
            } else {
                throw new Error('Failed to reset password');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred while resetting the password');
        }
    };

// CSS styles
const styles = {

    cardBody: {
        maxWidth: '50rem',
        height: '25rem',
        margin: 'auto',
        marginTop: '18rem',
        padding: '20px',
        borderRadius: '25px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        border: 'none',
    },
    title: {
        textAlign: 'center',
        marginBottom: '4rem',
    },
    input: {
        height: '2.5rem',
        marginTop: '25px',
    },
    alert: {
        marginBottom: '15px',
    },
    button: {
        marginTop: '4rem',
        width: '50%',
        display: 'block',
        margin: '0 auto',
    },

};

return (
    <div>
        <div className="container">
            <div className="card" style={styles.cardBody}>
                <div className="card-body">
                    <h2 className="card-title" style={styles.title}>
                        Reset Password
                    </h2>
                    {tokenValid ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3" style={styles.input}>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="New Password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-3" style={styles.input}>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger" style={styles.alert} role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <button className="btn btn-primary" style={styles.button} type="submit">
                                Reset Password
                            </button>
                        </form>
                    ) : (
                        <p className="text-center">Loading...</p>
                    )}
                </div>
            </div>
        </div>
    </div>
);
};

export default ResetPasswordForm;