import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationForm = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the confirmation code is valid
    // Replace this with your validation logic
    const isValid = confirmationCode === '1234'; // Example validation code

    if (isValid) {
      navigate(`/resetpassword/${confirmationCode}`);
    } else {
      // Handle invalid confirmation code
      // You can display an error message or take appropriate action
    }
  };

  return (
    <div>
      <h2>Confirmation Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Enter Confirmation Code"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ConfirmationForm;
