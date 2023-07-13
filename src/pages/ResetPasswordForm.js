/* import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordForm = () => {
  const { email } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateEmail = async () => {
      try {

        const response = await fetch(`http://localhost:9090/validateemail/${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setEmailValid(true);
        } else {
          setErrorMessage('Invalid Email');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('An error occurred while validating the email');
      }
    };

    validateEmail();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      const response = await fetch(`http://localhost:9090/resetpassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "email": email ,"newPassword": newPassword, "confirmedPassword":confirmPassword }),
      });

      if (response.ok) {
        toast.success('Password reset successfully');
        navigate('/');
      } else if (response.status === 404) {
        setErrorMessage('Invalid email');
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
            {emailValid ? (
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
                <button id="resetpwd" className="btn btn-primary" style={styles.button} type="submit">
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
  */