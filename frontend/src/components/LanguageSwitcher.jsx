import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { setLanguage, getLanguage, translations } from '../utils/i18n';

function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(getLanguage());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(getLanguage());
    };
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    window.location.reload(); // Reload to update all text
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs sm:text-sm font-medium hidden sm:inline">
          {languages.find(l => l.code === currentLang)?.flag} {languages.find(l => l.code === currentLang)?.name}
        </span>
        <span className="text-xs sm:hidden">
          {languages.find(l => l.code === currentLang)?.flag}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${
                  currentLang === lang.code ? 'bg-purple-50 text-purple-600' : ''
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {currentLang === lang.code && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSwitcher;

