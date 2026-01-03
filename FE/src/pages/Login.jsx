import { useState } from 'react';
import {
    Box,
    Flex,
    VStack,
    HStack,
    Heading,
    Text,
    Input,
    Button,
    FormControl,
    FormLabel,
    Divider,
    useToast,
    Icon,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Image,
    Container,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast({
                title: 'Đăng nhập thành công!',
                status: 'success',
                duration: 2000,
                position: 'top-right',
            });
            navigate('/');
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
            toast({
                title: 'Lỗi',
                description: message,
                status: 'error',
                duration: 3000,
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(email, password, name);
            toast({
                title: 'Đăng ký thành công!',
                status: 'success',
                duration: 2000,
                position: 'top-right',
            });
            navigate('/');
        } catch (error) {
            const message = error.response?.data?.message || 'Đăng ký thất bại';
            toast({
                title: 'Lỗi',
                description: message,
                status: 'error',
                duration: 3000,
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        window.location.href = `${apiUrl}/auth/google`;
    };

    return (
        <Flex minH="100vh" overflow="hidden" bg="white">
            {/* Left Side - Image & Branding */}
            <Box
                flex="1.2"
                bgGradient="linear(to-br, brand.800, brand.600, brand.900)"
                position="relative"
                display={{ base: 'none', lg: 'flex' }}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p={12}
            >
                {/* Decorative Pattern Circles */}
                <Box
                    position="absolute"
                    top="-10%"
                    left="-10%"
                    w="400px"
                    h="400px"
                    borderRadius="full"
                    bg="whiteAlpha.100"
                />
                <Box
                    position="absolute"
                    bottom="-10%"
                    right="-10%"
                    w="300px"
                    h="300px"
                    borderRadius="full"
                    bg="whiteAlpha.100"
                />

                <VStack position="relative" zIndex={1} spacing={8} maxW="lg" textAlign="center" color="white">
                    <Box
                        bg="whiteAlpha.200"
                        p={6}
                        borderRadius="full"
                        backdropFilter="blur(10px)"
                        boxShadow="xl"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                    >
                        <Text fontSize="6xl">🇨🇳</Text>
                    </Box>
                    <Heading size="3xl" fontFamily="'Noto Sans SC', sans-serif" fontWeight="bold">
                        Học Tiếng Trung
                    </Heading>
                    <Text fontSize="xl" opacity={0.9} lineHeight="tall">
                        Khám phá vẻ đẹp của ngôn ngữ Trung Hoa qua các bài học thú vị,
                        trò chơi tương tác và lộ trình học tập được cá nhân hóa.
                    </Text>

                    <HStack spacing={4} pt={8}>
                        <VStack bg="whiteAlpha.200" p={4} borderRadius="xl" minW="120px" backdropFilter="blur(5px)">
                            <Text fontSize="3xl" fontWeight="bold">1000+</Text>
                            <Text fontSize="sm">Từ vựng</Text>
                        </VStack>
                        <VStack bg="whiteAlpha.200" p={4} borderRadius="xl" minW="120px" backdropFilter="blur(5px)">
                            <Text fontSize="3xl" fontWeight="bold">5+</Text>
                            <Text fontSize="sm">Game học tập</Text>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>

            {/* Right Side - Form */}
            <Box flex="1" display="flex" alignItems="center" justifyContent="center" p={{ base: 4, md: 8, lg: 12 }} bg="gray.50">
                <Box w="full" maxW="md" bg="white" p={8} borderRadius="2xl" boxShadow="xl">
                    <VStack spacing={6} align="stretch">
                        <Box textAlign="center" mb={2}>
                            <Heading size="lg" color="gray.800" mb={2}>Chào mừng bạn 👋</Heading>
                            <Text color="gray.500">Hãy bắt đầu hành trình học tập của bạn</Text>
                        </Box>

                        <Tabs isFitted variant="soft-rounded" colorScheme="brand">
                            <TabList mb={6} bg="gray.100" p={1} borderRadius="xl">
                                <Tab borderRadius="lg" _selected={{ bg: 'white', color: 'brand.600', shadow: 'sm' }} fontWeight="semibold">Đăng nhập</Tab>
                                <Tab borderRadius="lg" _selected={{ bg: 'white', color: 'brand.600', shadow: 'sm' }} fontWeight="semibold">Đăng ký</Tab>
                            </TabList>

                            <TabPanels>
                                {/* Login Panel */}
                                <TabPanel p={0}>
                                    <form onSubmit={handleLogin}>
                                        <VStack spacing={5}>
                                            <FormControl>
                                                <FormLabel>Email</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiMail} color="gray.400" />} />
                                                    <Input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="name@example.com"
                                                        size="lg"
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiLock} color="gray.400" />} />
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="••••••••"
                                                        size="lg"
                                                        required
                                                    />
                                                    <InputRightElement width="3rem">
                                                        <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">
                                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                                <Text textAlign="right" fontSize="sm" color="brand.500" mt={1} cursor="pointer" _hover={{ textDecoration: 'underline' }}>
                                                    Quên mật khẩu?
                                                </Text>
                                            </FormControl>

                                            <Button
                                                type="submit"
                                                colorScheme="brand"
                                                size="lg"
                                                w="full"
                                                isLoading={loading}
                                                rightIcon={<FiArrowRight />}
                                            >
                                                Đăng nhập
                                            </Button>
                                        </VStack>
                                    </form>
                                </TabPanel>

                                {/* Register Panel */}
                                <TabPanel p={0}>
                                    <form onSubmit={handleRegister}>
                                        <VStack spacing={5}>
                                            <FormControl>
                                                <FormLabel>Họ tên</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiUser} color="gray.400" />} />
                                                    <Input
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Nguyễn Văn A"
                                                        size="lg"
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Email</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiMail} color="gray.400" />} />
                                                    <Input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="name@example.com"
                                                        size="lg"
                                                        required
                                                    />
                                                </InputGroup>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Mật khẩu</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiLock} color="gray.400" />} />
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="Ít nhất 6 ký tự"
                                                        size="lg"
                                                        minLength={6}
                                                        required
                                                    />
                                                    <InputRightElement width="3rem">
                                                        <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">
                                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                            </FormControl>

                                            <Button
                                                type="submit"
                                                colorScheme="brand"
                                                size="lg"
                                                w="full"
                                                isLoading={loading}
                                            >
                                                Đăng ký tài khoản
                                            </Button>
                                        </VStack>
                                    </form>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                        <HStack>
                            <Divider />
                            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">hoặc tiếp tục với</Text>
                            <Divider />
                        </HStack>

                        <Button
                            w="full"
                            size="lg"
                            variant="outline"
                            leftIcon={<Icon as={FcGoogle} fontSize="xl" />}
                            onClick={handleGoogleLogin}
                            _hover={{ bg: 'gray.50' }}
                        >
                            Google
                        </Button>
                    </VStack>
                </Box>
            </Box>
        </Flex>
    );
}

export default Login;
