import { useEffect, useState } from 'react';
import './css/index.css';
import { MainThemeContext } from './mainThemeContext';
import { MAIN_THEME_DEFAULT, MainTheme } from './theme/mainTheme';
import { fontFromStyle } from './utils';
import { WelcomeView } from './views/welcomeView';

export function MainApp() {
  const [mainTheme, setMainTheme] = useState<MainTheme>(MAIN_THEME_DEFAULT);

  useEffect(() => {
    const newTheme = MAIN_THEME_DEFAULT; // Update this when there is more than one theme
    
    // set defaults
    newTheme.editorTheme.editorInputTheme.defaultFontSize = getComputedStyle(document.documentElement).getPropertyValue("--default-font-size");
    const cssFontFamily = getComputedStyle(document.documentElement).getPropertyValue("--default-font-family");
    newTheme.editorTheme.editorInputTheme.defaultFontFamily = fontFromStyle(cssFontFamily);

    setMainTheme(newTheme);
  }, []);

  return (
    <MainThemeContext.Provider value={mainTheme}>
      <WelcomeView />
    </MainThemeContext.Provider>
  );
}
