import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import styles from "../../styles/ExplainScreen.module.css";

function ExplainScreen() {
  const navigate = useNavigate();
  const { translation } = useLanguage();

  useEffect(() => {
    // Add a unique class to the body element for ExplainScreen
    document.body.classList.add(styles.explainScreen_body);

    // Clean up by removing the unique class when the component is unmounted
    return () => {
      document.body.classList.remove(styles.explainScreen_body);
    };
  }, []);

  // Handle the "Continue" button click
  const handleContinueClick = () => {
    navigate("/pro/enter");
  };

  if (!translation) {
    return <div>Loading...</div>; // Wait for translations to load
  }

  return (
    <div className={styles.explainScreen_container}>
      <div>
        {/* Greeting Text */}
        <div className={styles.explainScreen_greetingSection}>
          <p>{translation.greetingLine1}</p>
          <p>{translation.greetingLine2}</p>
        </div>

        {/* Why Choose Us Section */}
        <div className={styles.explainScreen_whyUsSection}>
          <p>{translation.whyChooseUs}</p>
          <ul className={styles.explainScreen_whyUsList}>
            <li>{translation.whyPoint1}</li>
            <li>{translation.whyPoint2}</li>
            <li>{translation.whyPoint3}</li>
            <li>{translation.whyPoint4}</li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className={styles.explainScreen_footerNoteSection}>
          <p>{translation.footerNote}</p>
        </div>
      </div>
      <div className={styles.explainScreen_characterSection}>
        <div className={styles.explainScreen_characterImageContainer}>
          <img
            src="/images/Prof/s2.png"
            alt={translation.professionalImageAlt}
            className={styles.explainScreen_characterImage}
          />
        </div>

        {/* Continue Button */}
        <button
          className={styles.explainScreen_continueButton}
          onClick={handleContinueClick}
        >
          {translation.continueButton}
        </button>
      </div>{" "}
      {/* Image */}
    </div>
  );
}

export default ExplainScreen;
