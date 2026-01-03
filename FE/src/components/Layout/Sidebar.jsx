import {
    Box,
    VStack,
    Icon,
    Text,
    Link,
    Tooltip,
    useColorModeValue,
    Flex,
} from '@chakra-ui/react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { FaHome, FaGraduationCap, FaTrophy, FaLayerGroup } from 'react-icons/fa';

const NavItem = ({ icon, children, to }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    const activeBg = useColorModeValue('brand.500', 'brand.200');
    const activeColor = 'white';
    const color = useColorModeValue('gray.600', 'gray.400');

    return (
        <Link
            as={RouterLink}
            to={to}
            style={{ textDecoration: 'none', width: '100%' }}
        >
            <Flex
                align="center"
                p="3"
                mn="4"
                borderRadius="xl"
                role="group"
                cursor="pointer"
                bg={isActive ? activeBg : 'transparent'}
                color={isActive ? activeColor : color}
                _hover={{
                    bg: isActive ? activeBg : useColorModeValue('gray.100', 'whiteAlpha.100'),
                }}
                transition="all 0.2s"
            >
                <Icon
                    mr="4"
                    fontSize="18"
                    as={icon}
                />
                <Text fontSize="md" fontWeight="medium">
                    {children}
                </Text>
            </Flex>
        </Link>
    );
};

export default function Sidebar() {
    const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
    const borderColor = useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)');

    return (
        <Box
            pos="fixed"
            left="0"
            h="100vh"
            w="280px"
            bg={glassBg}
            backdropFilter="blur(20px)"
            borderRight="1px solid"
            borderColor={borderColor}
            py="8"
            px="6"
            display={{ base: 'none', md: 'block' }}
            zIndex="sticky"
        >
            <Flex align="center" mb="12" px="2">
                <Text
                    fontSize="2xl"
                    fontFamily="heading"
                    fontWeight="bold"
                    bgGradient="linear(to-r, brand.500, accent.500)"
                    bgClip="text"
                >
                    VocabMaster
                </Text>
            </Flex>

            <VStack spacing="2" align="stretch">
                <NavItem to="/" icon={FaHome}>
                    Tổng quan
                </NavItem>
                <NavItem to="/classes" icon={FaGraduationCap}>
                    Lớp học
                </NavItem>
                <NavItem to="/leaderboard" icon={FaTrophy}>
                    Xếp hạng
                </NavItem>
            </VStack>
        </Box>
    );
}
