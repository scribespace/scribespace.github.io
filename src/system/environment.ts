export enum OS {
    Unknown,
    Windows,
    Mac,
    Linux,
    Android,
    iOS
}

function $getEnv() {
    const osTable = [
        {os: OS.Windows, regex:/Windows/},
        {os: OS.Mac, regex:/Mac/},
        {os: OS.Linux, regex:/Linux/},
        {os: OS.Android, regex:/Android/},
        {os: OS.iOS, regex:/(iPhone|iPad|iPod)/}
    ];

    const agent = navigator.userAgent;
    const osTest = osTable.find((s) => s.regex.test(agent))?.os;

    return {
        OS: osTest || OS.Unknown,
    };
}
export const ENV = $getEnv();export function isDev() {
  return import.meta.env.DEV;
}

export const DEV = isDev() ? (callback: () => void) => {
  if (isDev()) {
    callback();
  }
} :
  () => { };

