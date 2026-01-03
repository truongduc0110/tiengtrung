import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
};

const colors = {
    brand: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1', // Indigo primary
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
    },
    accent: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef', // Fuchsia accent
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75',
    },
    glass: {
        100: 'rgba(255, 255, 255, 0.1)',
        200: 'rgba(255, 255, 255, 0.2)',
        300: 'rgba(255, 255, 255, 0.3)',
        400: 'rgba(255, 255, 255, 0.4)',
        500: 'rgba(255, 255, 255, 0.5)',
        600: 'rgba(255, 255, 255, 0.6)',
        700: 'rgba(255, 255, 255, 0.7)',
        800: 'rgba(255, 255, 255, 0.8)',
        900: 'rgba(255, 255, 255, 0.9)',
    },
};

const fonts = {
    heading: '"Outfit", sans-serif',
    body: '"Plus Jakarta Sans", sans-serif',
};

const styles = {
    global: (props) => ({
        body: {
            bg: mode('gray.50', '#0f172a')(props),
            color: mode('gray.800', 'whiteAlpha.900')(props),
            fontFamily: 'body',
        },
        '*::placeholder': {
            color: mode('gray.400', 'whiteAlpha.400')(props),
        },
        '::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
        },
        '::-webkit-scrollbar-track': {
            bg: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
            bg: mode('gray.300', 'gray.600')(props),
            borderRadius: 'full',
        },
        '::-webkit-scrollbar-thumb:hover': {
            bg: mode('gray.400', 'gray.500')(props),
        },
    }),
};

const components = {
    Button: {
        baseStyle: {
            fontWeight: 'bold',
            borderRadius: 'xl',
        },
        variants: {
            solid: (props) => ({
                bg: props.colorScheme === 'brand' ? 'brand.500' : `${props.colorScheme}.500`,
                color: 'white',
                _hover: {
                    bg: props.colorScheme === 'brand' ? 'brand.600' : `${props.colorScheme}.600`,
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                },
                _active: {
                    transform: 'translateY(0)',
                },
                transition: 'all 0.2s',
            }),
            outline: {
                borderWidth: '2px',
            },
            glass: {
                bg: 'whiteAlpha.200',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'whiteAlpha.200',
                _hover: {
                    bg: 'whiteAlpha.300',
                },
            },
        },
    },
    Card: {
        baseStyle: (props) => ({
            container: {
                bg: mode('white', 'gray.800')(props),
                borderRadius: '2xl',
                boxShadow: mode(
                    '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                )(props),
                border: '1px solid',
                borderColor: mode('gray.100', 'whiteAlpha.100')(props),
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                _hover: {
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                },
            },
        }),
        variants: {
            glass: {
                container: {
                    bg: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    _dark: {
                        bg: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                },
            },
        },
    },
    Input: {
        variants: {
            filled: (props) => ({
                field: {
                    bg: mode('gray.50', 'whiteAlpha.100')(props),
                    borderRadius: 'xl',
                    _hover: {
                        bg: mode('gray.100', 'whiteAlpha.200')(props),
                    },
                    _focus: {
                        bg: mode('white', 'gray.800')(props),
                        borderColor: 'brand.500',
                    },
                },
            }),
        },
        defaultProps: {
            variant: 'filled',
        },
    },
};

const theme = extendTheme({
    config,
    colors,
    fonts,
    styles,
    components,
});

export default theme;
