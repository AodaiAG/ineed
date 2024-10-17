import React, { useState, useEffect } from 'react';
import PC from '../../components/client/PC';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../../utils/constans";
import translations from '../../utils/translations.json';
import { useLanguage } from '../../components/LanguageContext'; // Import the useLanguage hook

function InfoPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { main, sub, location: locationValue, dateAndTime } = location.state || {};
    const { translation, language } = useLanguage(); // Access translation and language from the context
    const getDirection = () => {
        if (language === 'ar' || language === 'he') return 'rtl';
        return 'ltr';
    };


    const [formData, setFormData] = useState({
        name: '',
        codeN: '97250',
        phone: '',
        note: '',
        jobTypeId: sub,
        main: main,
        sub: sub,
        location: locationValue,
        dateAndTime: dateAndTime
    });



    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const phoneValue = value.replace(/\D/g, '');
            setFormData((prevData) => ({ ...prevData, [name]: phoneValue }));
        } else if (name === 'name') {
            const nameValue = value.replace(/[^a-zA-Zא-ת\s]/g, '');
            setFormData((prevData) => ({ ...prevData, [name]: nameValue }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/submit-data`, formData);
            const { jobId } = response.data;

            navigate('/phone_verify', {
                state: {
                    requestId: jobId,
                    phone: formData.phone,
                    codeN: formData.codeN
                }
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <PC />
                <div className="right-col">
                    <div className="phone-case">
                        <img src="/images/phone.png" alt="Phone Case" />
                        <div className="phone-screen">
                            <div className="content">
                                <form onSubmit={handleSubmit} className="mt-1 form-book" style={{ width: '90%' }}>
                                    <div className="top">
                                        <h2 className="start-title" dir={getDirection()}>{translation.infoTitle}</h2>
                                        <div className="input">
                                            <label dir={getDirection()} style={{ textAlign: "left"}} htmlFor="name">{translation.nameLabel}  </label>
                                            <input
                                                type="text"
                                                dir={getDirection()}
                                                placeholder={translation.placeholderName}
                                                name="name"
                                                maxLength="20"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="input" style={{ display: 'inline-block' }}>
                                            <label dir={getDirection()} htmlFor="phone"
                                                   style={{ display: 'inline-block', width: '100%', textAlign: getDirection() === 'rtl' ? 'right' : 'left' }}>{translation.phoneLabel}</label>
                                            <select
                                                name="codeN"
                                                style={{ width: '28%', border: 'none', borderRadius: '4px', padding: '8px', float: 'left', display: 'block', marginTop: '0.5rem', fontSize: 'calc(10px + 0.6vh)', color: '#222825' }}
                                                value={formData.codeN}
                                                onChange={handleChange}
                                            >
                                                <option value="97250">050</option>
                                                <option value="97251">051</option>
                                                <option value="97252">052</option>
                                                <option value="97253">053</option>
                                                <option value="97254">054</option>
                                                <option value="97255">055</option>
                                                <option value="97256">056</option>
                                                <option value="97257">057</option>
                                                <option value="97258">058</option>
                                            </select>
                                            <input
                                                type="text"
                                                dir={getDirection()}
                                                placeholder={translation.placeholderPhone}
                                                name="phone"
                                                maxLength="7"
                                                style={{ width: '70%', border: 'none', borderRadius: '4px', padding: '8px', float: 'right', display: 'block' }}
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="input">
                                            <label dir={getDirection()} htmlFor="note" style={{ display: 'inline-block', width: '100%', textAlign: getDirection() === 'rtl' ? 'right' : 'left' }}>{translation.noteLabel}

                                            </label>
                                            <textarea
                                                dir={getDirection()}
                                                placeholder={translation.placeholderNote}
                                                name="note"
                                                value={formData.note}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="bottom mt-1">
                                        <input type="hidden" name="jobTypeId" value={formData.jobTypeId} />
                                        <input type="hidden" name="main" value={formData.main} />
                                        <input type="hidden" name="sub" value={formData.sub} />
                                        <input type="hidden" name="location" value={formData.location} />
                                        <input type="hidden" name="dateAndTime" value={formData.dateAndTime} />
                                        <button type="submit" className='navigate-links btnSubmit mt-5'>{translation.submitButton}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoPage;
