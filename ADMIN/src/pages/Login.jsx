import { useState } from 'react';
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Input,
    Button,
    FormControl,
    FormLabel,
    useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await adminAPI.login(email, password);
            const { accessToken } = response.data.data;
            localStorage.setItem('adminToken', accessToken);
            onLogin();
            navigate('/');
        } catch (error) {
            toast({
                title: 'Đăng nhập thất bại',
                description: error.response?.data?.message || 'Sai email hoặc mật khẩu',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            minH="100vh"
            bg="gray.800"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Container maxW="sm">
                <Box bg="white" borderRadius="xl" p={8} boxShadow="xl">
                    <VStack spacing={6}>
                        <VStack spacing={1}>
                            <Text fontSize="3xl">🔐</Text>
                            <Heading size="lg">Admin Login</Heading>
                            <Text color="gray.500">Đăng nhập trang quản trị</Text>
                        </VStack>

                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        size="lg"
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="brand"
                                    size="lg"
                                    w="full"
                                    isLoading={loading}
                                >
                                    Đăng nhập
                                </Button>
                            </VStack>
                        </form>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
}

export default Login;
