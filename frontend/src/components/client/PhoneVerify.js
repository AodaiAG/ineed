import React, { useState } from 'react';

function PhoneVerify() {
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    // Handle phone number submission
    const handlePhoneSubmit = async () => {
        const response = await fetch(`/api/phone/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });
        const data = await response.json();
        if (data.success) {
            alert('Verification code sent!');
        } else {
            alert('Error sending code');
        }
    };

    // Handle verification code submission
    const handleCodeSubmit = async () => {
        const response = await fetch(`/api/phone/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, verificationCode })
        });
        const data = await response.json();
        if (data.success) {
            setIsVerified(true);
        } else {
            alert('Invalid code');
        }
    };

    return (
        <div>
            <h2>Phone Verification</h2>
            <input
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={handlePhoneSubmit}>Send Verification Code</button>

            {isVerified ? (
                <p>Phone number verified successfully!</p>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button onClick={handleCodeSubmit}>Verify Code</button>
                </>
            )}
        </div>
    );
}

export default PhoneVerify;
