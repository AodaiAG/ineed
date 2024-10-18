// src/pages/ExplainScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ExplainScreen.module.css'; // Make sure to create this CSS file for unique styling

function ExplainScreen() {
    const navigate = useNavigate();

    // Handle the "Continue" button click
    const handleContinueClick = () => {
        navigate('/pro/enter'); // Adjust this to the desired route for the next page
    };

    return (
        <div className={styles.explainContainer}>
            {/* Greeting Text */}
            <div className={styles.greetingSection}>
                <p>היי,</p>
                <p>הגעת לפלטפורמה שתחבר אותך ישירות ללקוחות שמחפשים בדיוק אותך! בזכות ממשק ידידותי ומותאם לצרכים שלך, תהיה לך אפשרות להנות מהפניות איכותיות באזורך.</p>
            </div>

            {/* Why Choose Us Section */}
            <div className={styles.whyUsSection}>
                <p>למה זה שווה לך?</p>
                <ul className={styles.whyUsList}>
                    <li>חשיפה ללקוחות שזקוקים לשירות שלך</li>
                    <li>כרטיס דיגיטלי שמוכן בסוף ההרשמה</li>
                    <li>חצי שנה ללא עלות נוספת תפניות</li>
                    <li>בקרוב! שירותים לייעול העסק</li>
                </ul>
            </div>

            {/* Footer Note */}
            <div className={styles.footerNoteSection}>
                <p>עם אפס סיכון והזדמנות להרוויח כל שעליך לעשות זה ללחוץ על הכפתור למטה</p>
            </div>

            {/* Image */}
            <div className={styles.characterImageContainer}>
                <img src="/images/Prof/s2.png" alt="Professional Image" className={styles.characterImage} />
            </div>

            {/* Continue Button */}
            <button className={styles.continueButton} onClick={handleContinueClick}>המשך</button>
        </div>
    );
}

export default ExplainScreen;
