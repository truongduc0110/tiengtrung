import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    colors: {
        brand: {
            50: '#fff5f5',
            100: '#fed7d7',
            200: '#feb2b2',
            300: '#fc8181',
            400: '#f56565',
            500: '#e53e3e', // Primary red for Chinese theme
            600: '#c53030',
            700: '#9b2c2c',
            800: '#822727',
            900: '#63171b',
        },
        gold: {
            50: '#fffdf0',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
        },
    },
    fonts: {
        heading: '"Noto Sans SC", "Inter", sans-serif',
        body: '"Inter", "Noto Sans SC", sans-serif',
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.800',
            },
        },
    },
    components: {
        Button: {
            defaultProps: {
                colorScheme: 'brand',
            },
            variants: {
                solid: {
                    bg: 'brand.500',
                    color: 'white',
                    _hover: {
                        bg: 'brand.600',
                    },
                },
                outline: {
                    borderColor: 'brand.500',
                    color: 'brand.500',
                },
                gold: {
                    bg: 'gold.500',
                    color: 'white',
                    _hover: {
                        bg: 'gold.600',
                    },
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: 'xl',
                    boxShadow: 'lg',
                },
            },
        },
    },
});

export default theme;
