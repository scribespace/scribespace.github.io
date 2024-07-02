
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
export const ENV = $getEnv();

export function isDev() {
  return import.meta.env.DEV;
}

export const DEV = isDev() ? (callback: () => void) => {
  if (isDev()) {
    callback();
  }
} :
  () => { };


export function $getTreeNodeIDFromURL() {
 return window.location.search.slice(1);
}

export function $getURLTreeNodeID( treeNodeID: string ) {
  return `${window.location.origin}/?${treeNodeID}`;
}

export function $setURLTreeNodeID( treeNodeID: string ) {
  window.history.pushState({treeNodeID}, '', $getURLTreeNodeID(treeNodeID));
}
export function $setWindowTitle(title: string) {
  let mainTitle = document.title.split(':')[0];
  mainTitle = `${mainTitle}: ${title}`;
  document.title = mainTitle;
}

export function $openTab(url: string) {
  window.open( url, '_blank')?.focus();
}