export type BrowserType = "chrome" | "firefox" | "safari" | "opera" | "edge" | undefined

export function detectBrowser(): BrowserType {

    let userAgent = navigator.userAgent;
    let browserName: BrowserType;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "firefox";
    } else if (userAgent.match(/safari/i)) {
        browserName = "safari";
    } else if (userAgent.match(/opr\//i)) {
        browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
        browserName = "edge";
    } else {
        browserName = undefined;
    }

    return browserName;
}
