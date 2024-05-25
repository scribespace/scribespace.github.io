import { ColorChangeHandler, CompactPicker } from 'react-color';

import './css/colorPicker.css';
import { useMainThemeContext } from '@/mainThemeContext';

type ColorPickerProps = {
    onChange: ColorChangeHandler;
};

export default function ColorPicker({ onChange }: ColorPickerProps) {
    const {editorTheme: {colorTheme: {colorPickerContainer}} } = useMainThemeContext();
    
    return (
        <CompactPicker className={colorPickerContainer} onChange={onChange} />
    );
}
