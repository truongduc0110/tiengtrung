import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

function AuthCallback() {
    const [searchParams] = useSearchParams();
    const { loginWithTokens } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (accessToken && refreshToken) {
            loginWithTokens(accessToken, refreshToken).then(() => {
                navigate('/');
            });
        } else {
            navigate('/login');
        }
    }, [searchParams, loginWithTokens, navigate]);

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.50"
        >
            <VStack spacing={4}>
                <Spinner size="xl" color="brand.500" thickness="4px" />
                <Text color="gray.600">Đang đăng nhập...</Text>
            </VStack>
        </Box>
    );
}

export default AuthCallback;
