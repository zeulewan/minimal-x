export const isHomePage = () => ["/", "/home"].includes(window.location.pathname);
export const isComposePage = () => /^\/compose\/(tweet|post)(?:\/|$)/.test(window.location.pathname);
