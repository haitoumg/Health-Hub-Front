import Cookies from "js-cookie";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordStrengthMeter from './PasswordStrengthMeter';


const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      const userData =JSON.parse(Cookies.get("token"));
      const response = await fetch(`http://localhost:9090/changepassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:userData.email,
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmedPassword: confirmPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        navigate('/');
      } else if (response.status === 401) {
        setErrorMessage('Incorrect current password');
      } else {  
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while changing the passwo rd');
    }
  };

  // CSS styles
  const styles = {
    cardBody: {
      maxWidth: '50rem',
      height: '25rem',
      margin: 'auto',
      marginTop: '7rem',
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
              Change Password
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3" style={styles.input}>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Current Password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
               {/* <div className='w-full'>  */}
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
              <PasswordStrengthMeter password={newPassword} />
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
              <button id="changepwd" className="btn btn-primary" style={styles.button} type="submit">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChangePasswordForm;