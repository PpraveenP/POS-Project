import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };
    
    return (
        <div>
         <button onClick={() => changeLanguage("en")}>English</button>
         <button onClick={() => changeLanguage("fr")}>Français</button>
         {/* Add more buttons for other supported languages */}
        </div>
    );
    };