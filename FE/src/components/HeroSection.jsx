import { useState, useEffect } from 'react';
import {
    Box,
    HStack,
    VStack,
    Text,
    Image,
    SimpleGrid,
    Icon,
    Skeleton,
    Heading,
} from '@chakra-ui/react';
import { FaFire } from 'react-icons/fa';
import { activityAPI } from '../services/api';

// Import image from src/public
import heroImage from '../public/images/1.jpg';

function HeroSection({ stats, leaderboard, loading }) {
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        fetchWeeklyActivity();
    }, []);

    const fetchWeeklyActivity = async () => {
        try {
            const [calendarRes, streakRes] = await Promise.all([
                activityAPI.getCalendar(7),
                activityAPI.getStreak(),
            ]);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const calendarData = calendarRes.data.data || [];
            const countMap = {};
            calendarData.forEach(item => {
                const dateStr = new Date(item.date).toISOString().split('T')[0];
                countMap[dateStr] = item.activityCount || item.count || 1;
            });

            const days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayOfWeek = date.getDay();
                days.push({
                    date: dateStr,
                    dayOfWeek,
                    hasActivity: countMap[dateStr] ? true : false,
                });
            }

            setWeeklyActivity(days);
            setStreak(streakRes.data.data?.streak || 0);
        } catch (error) {
            console.error('Failed to fetch weekly activity:', error);
        }
    };

    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const totalLearned = stats?.totalLearned || 0;
    const totalWords = stats?.totalWords || totalLearned + (stats?.notLearned || 0);
    const notLearned = stats?.notLearned || Math.max(0, totalWords - totalLearned);
    const progress = totalWords > 0 ? Math.round((totalLearned / totalWords) * 100) : 0;

    if (loading) {
        return (
            <VStack spacing={4} mb={8} align="stretch">
                <HStack spacing={4} align="stretch">
                    <Skeleton flex={1} height="200px" borderRadius="xl" />
                    <Skeleton flex={1} height="200px" borderRadius="xl" />
                    <Skeleton flex={1} height="200px" borderRadius="xl" />
                </HStack>
                <Skeleton height="100px" borderRadius="xl" />
            </VStack>
        );
    }

    return (
        <VStack spacing={4} mb={8} align="stretch">
            {/* Row 1: Image | Streak | Leaderboard */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {/* Column 1: Image (smaller) */}
                <Box
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    bg="gray.100"
                    h={{ base: "150px", md: "180px" }}
                >
                    <Image
                        src={heroImage}
                        alt="Learning illustration"
                        objectFit="cover"
                        w="full"
                        h="full"
                    />
                </Box>

                {/* Column 2: Streak Calendar (middle) */}
                <Box
                    borderRadius="xl"
                    bgGradient="linear(to-br, orange.400, orange.500)"
                    p={4}
                    color="white"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    h={{ base: "auto", md: "180px" }}
                >
                    <HStack spacing={2}>
                        <Icon as={FaFire} boxSize={5} />
                        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
                            Chuỗi ngày học
                        </Text>
                    </HStack>

                    <Box>
                        <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
                            {streak}
                        </Text>
                        <Text fontSize="md" opacity={0.9}>
                            ngày
                        </Text>
                    </Box>

                    <HStack spacing={2} justify="space-between">
                        {weeklyActivity.map((day, index) => (
                            <VStack key={index} spacing={0}>
                                <Box
                                    w="28px"
                                    h="28px"
                                    borderRadius="full"
                                    bg={day.hasActivity ? "yellow.300" : "whiteAlpha.300"}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {day.hasActivity && (
                                        <Box w="10px" h="10px" borderRadius="full" bg="orange.500" />
                                    )}
                                </Box>
                                <Text fontSize="2xs" fontWeight="medium" opacity={0.9}>
                                    {dayLabels[day.dayOfWeek]}
                                </Text>
                            </VStack>
                        ))}
                    </HStack>
                </Box>

                {/* Column 3: Leaderboard (top right) */}
                <Box
                    borderRadius="xl"
                    bg="white"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.200"
                    p={3}
                    h={{ base: "auto", md: "180px" }}
                    overflow="hidden"
                >
                    <Heading size="sm" mb={2}>Bảng xếp hạng</Heading>
                    <VStack align="stretch" spacing={1} fontSize="sm">
                        {(!leaderboard || leaderboard.length === 0) ? (
                            <Text color="gray.400" fontSize="xs" textAlign="center" py={4}>
                                Chưa có dữ liệu
                            </Text>
                        ) : (
                            (leaderboard || []).slice(0, 4).map((user, index) => (
                                <HStack key={index} justify="space-between" py={1}>
                                    <HStack spacing={2}>
                                        <Text fontWeight="bold" color="gray.500" w="20px">
                                            {index + 1}
                                        </Text>
                                        <Text noOfLines={1} maxW="100px">
                                            {user.name || 'Ẩn danh'}
                                        </Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                        {user.totalDays} ngày
                                    </Text>
                                </HStack>
                            ))
                        )}
                    </VStack>
                </Box>
            </SimpleGrid>

            {/* Row 2: Statistics (below image) */}
            <Box
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                overflow="hidden"
                bg="white"
            >
                <SimpleGrid columns={4}>
                    <Box
                        p={4}
                        borderRight="1px solid"
                        borderColor="gray.200"
                        textAlign="center"
                    >
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                            {totalLearned}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            Đã thuộc
                        </Text>
                    </Box>

                    <Box
                        p={4}
                        borderRight="1px solid"
                        borderColor="gray.200"
                        textAlign="center"
                    >
                        <Text fontSize="2xl" fontWeight="bold" color="gray.600">
                            {notLearned}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            Chưa thuộc
                        </Text>
                    </Box>

                    <Box
                        p={4}
                        borderRight="1px solid"
                        borderColor="gray.200"
                        textAlign="center"
                    >
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                            {totalWords}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            Tổng từ
                        </Text>
                    </Box>

                    <Box p={4} textAlign="center">
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                            {progress}%
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            Tiến độ
                        </Text>
                    </Box>
                </SimpleGrid>
            </Box>
        </VStack>
    );
}

export default HeroSection;
