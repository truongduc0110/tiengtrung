import {
    Box,
    Flex,
    HStack,
    Text,
    Icon,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaFire } from 'react-icons/fa';
import { FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { activityAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function Header() {
    const [streak, setStreak] = useState(0);
    const [totalLearned, setTotalLearned] = useState(0);
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [streakRes, statsRes] = await Promise.all([
                activityAPI.getStreak(),
                activityAPI.getStats(),
            ]);
            setStreak(streakRes.data.data?.streak || 0);
            setTotalLearned(statsRes.data.data?.totalLearned || 0);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <Box
            as="header"
            position="fixed"
            top={0}
            left={{ base: 0, md: '250px' }}
            right={0}
            h="60px"
            bg={bg}
            borderBottom="1px"
            borderColor={borderColor}
            zIndex={5}
        >
            <Flex h="full" align="center" justify="flex-end" px={6}>
                <HStack spacing={4}>
                    {/* Streak Badge */}
                    <HStack
                        bg="orange.50"
                        px={3}
                        py={1.5}
                        borderRadius="full"
                        spacing={1.5}
                    >
                        <Icon as={FaFire} color="orange.500" fontSize="lg" />
                        <Text fontWeight="bold" color="orange.500" fontSize="sm">
                            {streak}
                        </Text>
                        <Text fontSize="xs" color="orange.600">
                            ngày
                        </Text>
                    </HStack>

                    {/* Total Learned Badge */}
                    <HStack
                        bg="yellow.50"
                        px={3}
                        py={1.5}
                        borderRadius="full"
                        spacing={1.5}
                    >
                        <Text fontSize="lg">🪙</Text>
                        <Text fontWeight="bold" color="yellow.600" fontSize="sm">
                            {totalLearned}
                        </Text>
                    </HStack>

                    {/* Dark Mode Toggle */}
                    <IconButton
                        icon={<Icon as={FiMoon} />}
                        variant="ghost"
                        aria-label="Toggle dark mode"
                        borderRadius="full"
                        size="sm"
                    />

                    {/* User Menu */}
                    <Menu>
                        <MenuButton>
                            <Avatar
                                size="sm"
                                name={user?.name}
                                src={user?.avatar}
                                cursor="pointer"
                            />
                        </MenuButton>
                        <MenuList>
                            <MenuItem icon={<Icon as={FiUser} />}>
                                {user?.name || 'Người dùng'}
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem
                                icon={<Icon as={FiLogOut} />}
                                onClick={handleLogout}
                                color="red.500"
                            >
                                Đăng xuất
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>
        </Box>
    );
}

export default Header;
