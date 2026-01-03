import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
    return (
        <Flex minH="100vh" flexDirection="column">
            <Header />
            <Box as="main" p={6} pt={20} flex="1">
                <Outlet />
            </Box>
        </Flex>
    );
}

export default Layout;
