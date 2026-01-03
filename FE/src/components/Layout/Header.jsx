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
import { FiMoon, FiSun, FiLogOut, FiUser } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { activityAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useColorMode } from '@chakra-ui/react';

function Header() {
    const [streak, setStreak] = useState(0);
    const [totalLearned, setTotalLearned] = useState(0);
    const { user, logout } = useAuth();
    const { colorMode, toggleColorMode } = useColorMode();

    // Glassmorphism styles
    const bg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
    const borderColor = useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)');

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
            right={0}
            left={{ base: 0, md: '280px' }} // Offset for sidebar
            h="80px"
            bg={bg}
            backdropFilter="blur(20px)"
            borderBottom="1px solid"
            borderColor={borderColor}
            zIndex={10}
            transition="all 0.2s"
        >
            <Flex h="full" align="center" justify="flex-end" px={8}>
                <HStack spacing={6}>
                    {/* Stats Group */}
                    <HStack spacing={4}>
                        <HStack
                            bg={useColorModeValue('orange.50', 'whiteAlpha.100')}
                            px={4}
                            py={2}
                            borderRadius="full"
                            border="1px solid"
                            borderColor={useColorModeValue('orange.100', 'transparent')}
                        >
                            <Icon as={FaFire} color="orange.500" fontSize="xl" />
                            <Text fontWeight="bold" color="orange.500">
                                {streak}
                            </Text>
                        </HStack>

                        <HStack
                            bg={useColorModeValue('yellow.50', 'whiteAlpha.100')}
                            px={4}
                            py={2}
                            borderRadius="full"
                            border="1px solid"
                            borderColor={useColorModeValue('yellow.100', 'transparent')}
                        >
                            <Text fontSize="xl">🪙</Text>
                            <Text fontWeight="bold" color="yellow.600">
                                {totalLearned}
                            </Text>
                        </HStack>
                    </HStack>

                    {/* Actions Group */}
                    <HStack spacing={2} pl={4} borderLeft="1px solid" borderColor={borderColor}>
                        <IconButton
                            icon={<Icon as={colorMode === 'light' ? FiMoon : FiSun} />}
                            variant="ghost"
                            onClick={toggleColorMode}
                            borderRadius="full"
                            size="lg"
                            aria-label="Toggle theme"
                        />

                        <Menu>
                            <MenuButton>
                                <Avatar
                                    size="sm"
                                    name={user?.name}
                                    src={user?.avatar}
                                    cursor="pointer"
                                    ring="2px"
                                    ringColor="brand.500"
                                    ringOffset="2px"
                                />
                            </MenuButton>
                            <MenuList
                                bg={useColorModeValue('white', 'gray.800')}
                                borderColor={borderColor}
                                boxShadow="xl"
                            >
                                <MenuItem icon={<Icon as={FiUser} />}>
                                    {user?.name || 'User'}
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
                </HStack>
            </Flex>
        </Box>
    );
}

export default Header;
