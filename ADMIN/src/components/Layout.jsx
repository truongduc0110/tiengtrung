import { Box, Flex, VStack, HStack, Text, Icon, Divider } from '@chakra-ui/react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { FiHome, FiUsers, FiBook, FiLogOut } from 'react-icons/fi';

const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/' },
    { icon: FiUsers, label: 'Người dùng', path: '/users' },
    { icon: FiBook, label: 'Lớp học', path: '/classes' },
];

function Layout({ onLogout }) {
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        onLogout();
    };

    return (
        <Flex minH="100vh">
            {/* Sidebar */}
            <Box
                w="250px"
                bg="gray.800"
                color="white"
                position="fixed"
                h="100vh"
                p={4}
            >
                <VStack h="full" align="stretch" spacing={4}>
                    <HStack spacing={3} px={4} py={3}>
                        <Text fontSize="xl">🇨🇳</Text>
                        <Text fontWeight="bold">Admin Panel</Text>
                    </HStack>

                    <Divider borderColor="gray.600" />

                    <VStack spacing={1} align="stretch" flex={1}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path}>
                                    <HStack
                                        px={4}
                                        py={3}
                                        borderRadius="lg"
                                        bg={isActive ? 'brand.500' : 'transparent'}
                                        _hover={{ bg: isActive ? 'brand.500' : 'gray.700' }}
                                        transition="all 0.2s"
                                    >
                                        <Icon as={item.icon} />
                                        <Text>{item.label}</Text>
                                    </HStack>
                                </Link>
                            );
                        })}
                    </VStack>

                    <HStack
                        px={4}
                        py={3}
                        borderRadius="lg"
                        cursor="pointer"
                        _hover={{ bg: 'red.600' }}
                        onClick={handleLogout}
                    >
                        <Icon as={FiLogOut} />
                        <Text>Đăng xuất</Text>
                    </HStack>
                </VStack>
            </Box>

            {/* Main Content */}
            <Box flex="1" ml="250px" bg="gray.50" p={6}>
                <Outlet />
            </Box>
        </Flex>
    );
}

export default Layout;
