export const themes = {
    default: {
        '--bg-color': '#0a0a0a',
        '--text-color': '#e0e0e0',
        '--accent-color': '#00ff41',
        '--secondary-accent': '#00ffff',
        '--dim-color': '#444',
        '--card-bg': '#111'
    },
    dracula: {
        '--bg-color': '#282a36',
        '--text-color': '#f8f8f2',
        '--accent-color': '#bd93f9', // Purple
        '--secondary-accent': '#8be9fd', // Cyan
        '--dim-color': '#6272a4',
        '--card-bg': '#44475a'
    },
    catppuccin: {
        '--bg-color': '#1e1e2e',
        '--text-color': '#cdd6f4',
        '--accent-color': '#cba6f7', // Mauve
        '--secondary-accent': '#89b4fa', // Blue
        '--dim-color': '#45475a',
        '--card-bg': '#313244'
    }
};

export function applyTheme(themeName) {
    const theme = themes[themeName] || themes.default;
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
}
