import { useState } from 'react';
import {
    Box,
    Flex,
    VStack,
    Heading,
    Text,
    Input,
    Button,
    FormControl,
    FormLabel,
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
    useColorModeValue,
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
            toast({ title: 'Đăng nhập thành công!', status: 'success', duration: 2000, position: 'top-right' });
            navigate('/');
        } catch (error) {
            toast({ title: 'Lỗi', description: error.response?.data?.message || 'Đăng nhập thất bại', status: 'error', duration: 3000, position: 'top-right' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(email, password, name);
            toast({ title: 'Đăng ký thành công!', status: 'success', duration: 2000, position: 'top-right' });
            navigate('/');
        } catch (error) {
            toast({ title: 'Lỗi', description: error.response?.data?.message || 'Đăng ký thất bại', status: 'error', duration: 3000, position: 'top-right' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        window.location.href = `${apiUrl}/auth/google`;
    };

    return (
        <Flex minH="100vh" overflow="hidden" position="relative">
            {/* Animated Background */}
            <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={-1} overflow="hidden">
                <Box position="absolute" top="-10%" right="-10%" w="500px" h="500px" bg="brand.400" borderRadius="full" filter="blur(100px)" opacity={0.4} />
                <Box position="absolute" bottom="-10%" left="-10%" w="500px" h="500px" bg="accent.400" borderRadius="full" filter="blur(100px)" opacity={0.4} />
            </Box>

            {/* Left Side - Branding (Glass) */}
            <Box
                flex="1"
                display={{ base: 'none', lg: 'flex' }}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                p={12}
                position="relative"
            >
                <VStack spacing={8} maxW="lg" textAlign="center" zIndex={1}>
                    <Box
                        bg="whiteAlpha.200"
                        p={8}
                        borderRadius="3xl"
                        backdropFilter="blur(20px)"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        boxShadow="2xl"
                    >
                        <Text fontSize="8xl">🌏</Text>
                    </Box>
                    <Heading size="4xl" fontFamily="heading" bgGradient="linear(to-r, brand.500, accent.500)" bgClip="text" lineHeight="1.2">
                        VocabMaster
                    </Heading>
                    <Text fontSize="xl" color="gray.600" lineHeight="tall">
                        Học từ vựng đa ngôn ngữ một cách thông minh và thú vị.
                    </Text>
                </VStack>
            </Box>

            {/* Right Side - Form (Glass Card) */}
            <Flex flex="1" align="center" justify="center" p={8}>
                <Box
                    w="full"
                    maxW="md"
                    bg="whiteAlpha.800"
                    backdropFilter="blur(20px)"
                    p={8}
                    borderRadius="3xl"
                    boxShadow="xl"
                    border="1px solid"
                    borderColor="whiteAlpha.500"
                >
                    <VStack spacing={6} align="stretch">
                        <Box textAlign="center" mb={2}>
                            <Heading size="lg" color="gray.800" fontFamily="heading">Chào mừng trở lại 👋</Heading>
                            <Text color="gray.500">Bắt đầu hành trình học tập ngay</Text>
                        </Box>

                        <Tabs isFitted variant="soft-rounded" colorScheme="brand">
                            <TabList mb={6} bg="blackAlpha.50" p={1} borderRadius="xl">
                                <Tab borderRadius="lg" fontWeight="semibold">Đăng nhập</Tab>
                                <Tab borderRadius="lg" fontWeight="semibold">Đăng ký</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel p={0}>
                                    <form onSubmit={handleLogin}>
                                        <VStack spacing={5}>
                                            <FormControl>
                                                <FormLabel fontWeight="medium">Email</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiMail} color="gray.400" />} />
                                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" size="lg" required bg="whiteAlpha.500" />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontWeight="medium">Mật khẩu</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiLock} color="gray.400" />} />
                                                    <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" size="lg" required bg="whiteAlpha.500" />
                                                    <InputRightElement><Button size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">{showPassword ? <FiEyeOff /> : <FiEye />}</Button></InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                            <Button type="submit" colorScheme="brand" size="lg" w="full" isLoading={loading} rightIcon={<FiArrowRight />} borderRadius="xl">Đăng nhập</Button>
                                        </VStack>
                                    </form>
                                </TabPanel>

                                <TabPanel p={0}>
                                    <form onSubmit={handleRegister}>
                                        <VStack spacing={5}>
                                            <FormControl>
                                                <FormLabel fontWeight="medium">Họ tên</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiUser} color="gray.400" />} />
                                                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" size="lg" required bg="whiteAlpha.500" />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontWeight="medium">Email</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiMail} color="gray.400" />} />
                                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" size="lg" required bg="whiteAlpha.500" />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel fontWeight="medium">Mật khẩu</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none" children={<Icon as={FiLock} color="gray.400" />} />
                                                    <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ít nhất 6 ký tự" size="lg" minLength={6} required bg="whiteAlpha.500" />
                                                    <InputRightElement><Button size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">{showPassword ? <FiEyeOff /> : <FiEye />}</Button></InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                            <Button type="submit" colorScheme="brand" size="lg" w="full" isLoading={loading} borderRadius="xl">Đăng ký tài khoản</Button>
                                        </VStack>
                                    </form>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                        <Button w="full" size="lg" variant="outline" leftIcon={<Icon as={FcGoogle} fontSize="xl" />} onClick={handleGoogleLogin} borderRadius="xl" bg="white">
                            Tiếp tục với Google
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </Flex>
    );
}

export default Login;
