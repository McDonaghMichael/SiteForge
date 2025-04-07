import { useEffect } from 'react';

export const DynamicFavicon = (faviconUrl) => {

    useEffect(() => {
        if (!faviconUrl) return;

        const linkElements = document.querySelectorAll('link[rel*="icon"]');

        if (linkElements.length) {
            linkElements.forEach(linkElement => {
                linkElement.href = faviconUrl;
            });
        } else {

            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = faviconUrl;
            document.head.appendChild(link);
        }

        const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (appleTouchIcon) {
            appleTouchIcon.href = faviconUrl;
        }

    }, [faviconUrl]);
};