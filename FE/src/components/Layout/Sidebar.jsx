import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    Avatar,
    Divider,
    useColorModeValue,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiBook,
    FiAward,
    FiSettings,
    FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
    { icon: FiHome, label: 'Trang chủ', path: '/' },
    { icon: FiAward, label: 'Bảng xếp hạng', path: '/leaderboard' },
];

function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            as="nav"
            position="fixed"
            left={0}
            top={0}
            h="100vh"
            w="250px"
            bg={bg}
            borderRight="1px"
            borderColor={borderColor}
            display={{ base: 'none', md: 'block' }}
            zIndex={10}
        >
            <VStack h="full" p={4} spacing={4} align="stretch">
                {/* Logo */}
                <HStack spacing={3} px={4} py={3}>
                    <Text fontSize="2xl">🇨🇳</Text>
                    <Text fontSize="xl" fontWeight="bold" color="brand.500">
                        Học Tiếng Trung
                    </Text>
                </HStack>

                <Divider />

                {/* Menu Items */}
                <VStack spacing={1} align="stretch" flex={1}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <HStack
                                    px={4}
                                    py={3}
                                    borderRadius="lg"
                                    bg={isActive ? 'brand.50' : 'transparent'}
                                    color={isActive ? 'brand.500' : 'gray.600'}
                                    _hover={{
                                        bg: isActive ? 'brand.50' : 'gray.100',
                                        color: 'brand.500',
                                    }}
                                    transition="all 0.2s"
                                >
                                    <Icon as={item.icon} fontSize="xl" />
                                    <Text fontWeight={isActive ? 'semibold' : 'medium'}>
                                        {item.label}
                                    </Text>
                                </HStack>
                            </Link>
                        );
                    })}
                </VStack>

                <Divider />

                {/* User Profile */}
                <Box>
                    <HStack px={4} py={3} spacing={3}>
                        <Avatar
                            size="sm"
                            name={user?.name || user?.email}
                            src={user?.avatar}
                        />
                        <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                {user?.name || 'Người dùng'}
                            </Text>
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                {user?.email}
                            </Text>
                        </VStack>
                    </HStack>

                    <HStack
                        px={4}
                        py={3}
                        borderRadius="lg"
                        color="gray.600"
                        cursor="pointer"
                        _hover={{ bg: 'red.50', color: 'red.500' }}
                        onClick={logout}
                    >
                        <Icon as={FiLogOut} fontSize="xl" />
                        <Text fontWeight="medium">Đăng xuất</Text>
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
}

export default Sidebar;
