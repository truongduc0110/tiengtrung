import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Avatar,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    Icon,
    Flex,
    useColorModeValue,
    Card,
    CardBody,
} from '@chakra-ui/react';
import { FiAward } from 'react-icons/fi';
import { FaCrown, FaFire } from 'react-icons/fa';
import { activityAPI } from '../services/api'; // Import API wrapper directly

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const cardBg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await activityAPI.getLeaderboard(20);
            setLeaderboard(response.data.data);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Flex justify="center" align="center" minH="50vh"><Spinner size="xl" color="brand.500" /></Flex>;

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <Box>
            <VStack mb={12} spacing={2}>
                <Heading size="xl" fontFamily="heading" bgGradient="linear(to-r, gold.400, orange.500)" bgClip="text">
                    Bảng Xếp Hạng
                </Heading>
                <Text color="gray.500">Vinh danh những nhà vô địch học tập</Text>
            </VStack>

            {/* Podium for Top 3 */}
            <Flex justify="center" align="flex-end" mb={12} gap={4}>
                {/* 2nd Place */}
                {top3[1] && (
                    <VStack>
                        <Avatar size="lg" src={top3[1].avatar} name={top3[1].name} ring="4px" ringColor="gray.300" />
                        <Text fontWeight="bold">{top3[1].name}</Text>
                        <Box w="80px" h="120px" bgGradient="linear(to-t, gray.300, gray.100)" borderRadius="t-xl" display="flex" alignItems="center" justifyContent="center">
                            <Text fontSize="4xl" fontWeight="bold" color="gray.500">2</Text>
                        </Box>
                    </VStack>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <VStack zIndex={2}>
                        <Icon as={FaCrown} color="gold" fontSize="3xl" mb={-2} />
                        <Avatar size="xl" src={top3[0].avatar} name={top3[0].name} ring="4px" ringColor="yellow.400" />
                        <Text fontWeight="bold" fontSize="lg">{top3[0].name}</Text>
                        <Box w="100px" h="160px" bgGradient="linear(to-t, yellow.400, yellow.200)" borderRadius="t-xl" display="flex" alignItems="center" justifyContent="center" boxShadow="xl">
                            <Text fontSize="5xl" fontWeight="bold" color="yellow.700">1</Text>
                        </Box>
                    </VStack>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <VStack>
                        <Avatar size="lg" src={top3[2].avatar} name={top3[2].name} ring="4px" ringColor="orange.300" />
                        <Text fontWeight="bold">{top3[2].name}</Text>
                        <Box w="80px" h="90px" bgGradient="linear(to-t, orange.300, orange.100)" borderRadius="t-xl" display="flex" alignItems="center" justifyContent="center">
                            <Text fontSize="4xl" fontWeight="bold" color="orange.700">3</Text>
                        </Box>
                    </VStack>
                )}
            </Flex>

            {/* List for the rest */}
            <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" overflow="hidden">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th w="80px" textAlign="center">#</Th>
                            <Th>Người dùng</Th>
                            <Th isNumeric>Chuỗi ngày</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {rest.map((user, index) => (
                            <Tr key={user.userId} _hover={{ bg: 'gray.50' }}>
                                <Td textAlign="center" fontWeight="bold" color="gray.500">{index + 4}</Td>
                                <Td>
                                    <HStack>
                                        <Avatar size="sm" src={user.avatar} name={user.name} />
                                        <Text fontWeight="medium">{user.name}</Text>
                                    </HStack>
                                </Td>
                                <Td isNumeric>
                                    <HStack justify="flex-end">
                                        <Text fontWeight="bold" color="orange.500">{user.totalDays}</Text>
                                        <Icon as={FaFire} color="orange.500" />
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                        {rest.length === 0 && top3.length === 0 && (
                            <Tr>
                                <Td colSpan={3} textAlign="center" py={8} color="gray.500">Chưa có dữ liệu</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Card>
        </Box>
    );
}

export default Leaderboard;
