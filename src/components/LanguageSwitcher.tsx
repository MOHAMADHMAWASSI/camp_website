import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-white hover:text-amber-200 transition-colors"
        aria-label="Switch language"
      >
        <Globe className="h-5 w-5" />
        <span className="text-sm font-medium uppercase">{i18n.language}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  i18n.language === language.code
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;