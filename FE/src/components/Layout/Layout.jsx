import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout() {
    const bg = useColorModeValue('gray.50', 'gray.900');

    return (
        <Flex minH="100vh" bg={bg}>
            <Sidebar />

            <Flex
                flex="1"
                direction="column"
                ml={{ base: 0, md: '280px' }} // Sidebar width
                transition="margin 0.2s"
            >
                <Header />

                <Box
                    as="main"
                    p={{ base: 4, md: 8 }}
                    pt={{ base: '80px', md: '100px' }} // Header height + padding
                    minH="100vh"
                >
                    <Box maxW="7xl" mx="auto">
                        <Outlet />
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
}

export default Layout;
