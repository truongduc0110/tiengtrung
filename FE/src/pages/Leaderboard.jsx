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
} from '@chakra-ui/react';
import { FiAward } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { activityAPI } from '../services/api';

export function LeaderboardTable({ data, loading }) {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
                <Spinner size="xl" color="brand.500" />
            </Box>
        );
    }

    const getRankBadge = (rank) => {
        if (rank === 1) return { color: 'yellow', emoji: '🥇' };
        if (rank === 2) return { color: 'gray', emoji: '🥈' };
        if (rank === 3) return { color: 'orange', emoji: '🥉' };
        return null;
    };

    return (
        <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
            <Table variant="simple">
                <Thead bg="gray.50">
                    <Tr>
                        <Th textAlign="center" w="80px">Hạng</Th>
                        <Th>Người dùng</Th>
                        <Th textAlign="center">Số ngày học</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((user, index) => {
                        const rank = index + 1;
                        const badge = getRankBadge(rank);

                        return (
                            <Tr
                                key={user.userId}
                                bg={rank <= 3 ? `${badge?.color}.50` : 'transparent'}
                                _hover={{ bg: 'gray.50' }}
                            >
                                <Td textAlign="center">
                                    {badge ? (
                                        <Text fontSize="2xl">{badge.emoji}</Text>
                                    ) : (
                                        <Text fontWeight="bold" color="gray.600">{rank}</Text>
                                    )}
                                </Td>
                                <Td>
                                    <HStack spacing={3}>
                                        <Avatar
                                            size="sm"
                                            name={user.name || 'User'}
                                            src={user.avatar}
                                        />
                                        <Text fontWeight={rank <= 3 ? 'bold' : 'medium'}>
                                            {user.name || 'Người dùng ẩn danh'}
                                        </Text>
                                    </HStack>
                                </Td>
                                <Td textAlign="center">
                                    <HStack justify="center" spacing={1}>
                                        <Icon as={FaFire} color="orange.500" />
                                        <Text fontWeight="bold" color="orange.500">
                                            {user.totalDays}
                                        </Text>
                                        <Text color="gray.500" fontSize="sm">ngày</Text>
                                    </HStack>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>

            {data.length === 0 && (
                <Box textAlign="center" py={10}>
                    <Text color="gray.500">Chưa có dữ liệu xếp hạng</Text>
                </Box>
            )}
        </Box>
    );
}

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <Box>
            <VStack align="start" spacing={1} mb={8}>
                <Heading size="lg">
                    <Icon as={FiAward} mr={2} color="gold.500" />
                    Bảng xếp hạng
                </Heading>
                <Text color="gray.500">Những người học chăm chỉ nhất</Text>
            </VStack>

            <LeaderboardTable data={leaderboard} loading={loading} />
        </Box>
    );
}

export default Leaderboard;
