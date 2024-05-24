import { useEffect, useState } from 'react';
import { WelcomeView } from './views/welcomeView';
import { MAIN_THEME_DEFAULT, MainTheme } from './theme/mainTheme';
import { MainThemeContext } from './mainThemeContext';
import './css/index.css';

export function MainApp() {
  const [mainTheme, setMainTheme] = useState<MainTheme>(MAIN_THEME_DEFAULT);

  useEffect(() => {
    const newTheme = MAIN_THEME_DEFAULT; // Update this when there is more than one theme
    
    // set defaults
    newTheme.editorTheme.editorInputTheme.defaultFontSize = getComputedStyle(document.documentElement).getPropertyValue("--default-font-size");
    newTheme.editorTheme.editorInputTheme.defaultFontFamily = getComputedStyle(document.documentElement).getPropertyValue("--default-font-family");

    setMainTheme(newTheme);
  }, []);

  return (
    <MainThemeContext.Provider value={mainTheme}>
      <WelcomeView />
    </MainThemeContext.Provider>
  );
}
