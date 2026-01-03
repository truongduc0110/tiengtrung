import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Tooltip,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react';
import { activityAPI } from '../services/api';

function ActivityCalendar() {
    const [calendarData, setCalendarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [calendarRes, streakRes] = await Promise.all([
                activityAPI.getCalendar(98), // 14 weeks
                activityAPI.getStreak(),
            ]);
            setCalendarData(calendarRes.data.data || []);
            setStreak(streakRes.data.data?.currentStreak || 0);
        } catch (error) {
            console.error('Failed to fetch activity data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Màu sắc theo mức độ hoạt động
    const getColor = (count) => {
        if (count === 0) return 'gray.100';
        if (count <= 2) return 'green.200';
        if (count <= 5) return 'green.400';
        if (count <= 10) return 'green.500';
        return 'green.600';
    };

    // Nhóm dữ liệu theo tuần
    const groupByWeeks = () => {
        const weeks = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Tạo map từ date string -> count
        const countMap = {};
        calendarData.forEach(item => {
            countMap[item.date] = item.count;
        });

        // Tạo 14 tuần gần nhất
        const daysToShow = 98;
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - daysToShow + 1);

        // Điều chỉnh để bắt đầu từ Chủ nhật
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        let currentWeek = [];
        const currentDate = new Date(startDate);

        while (currentDate <= today) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = countMap[dateStr] || 0;
            const isToday = dateStr === today.toISOString().split('T')[0];

            currentWeek.push({
                date: dateStr,
                count,
                dayOfWeek: currentDate.getDay(),
                isToday,
            });

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Push tuần cuối nếu chưa đủ 7 ngày
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return weeks;
    };

    const weeks = groupByWeeks();
    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const monthLabels = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <Spinner size="md" color="brand.500" />
            </Box>
        );
    }

    return (
        <Box
            bg="white"
            p={4}
            borderRadius="xl"
            boxShadow="sm"
        >
            <VStack align="stretch" spacing={3}>
                {/* Header */}
                <HStack justify="space-between">
                    <Text fontWeight="bold" fontSize="lg">📅 Lịch học tập</Text>
                    <HStack spacing={2}>
                        <Text fontSize="2xl">🔥</Text>
                        <Text fontWeight="bold" color="orange.500">{streak} ngày liên tiếp</Text>
                    </HStack>
                </HStack>

                {/* Calendar grid */}
                <Box overflowX="auto">
                    <HStack spacing={1} align="start">
                        {/* Day labels */}
                        <VStack spacing={1} mr={1}>
                            {dayLabels.map((label, i) => (
                                <Box key={i} h="14px" display="flex" alignItems="center">
                                    <Text fontSize="xs" color="gray.500" w="20px">
                                        {i % 2 === 1 ? label : ''}
                                    </Text>
                                </Box>
                            ))}
                        </VStack>

                        {/* Weeks */}
                        {weeks.map((week, weekIndex) => (
                            <VStack key={weekIndex} spacing={1}>
                                {week.map((day, dayIndex) => (
                                    <Tooltip
                                        key={dayIndex}
                                        label={`${day.date}: ${day.count} hoạt động`}
                                        hasArrow
                                        placement="top"
                                    >
                                        <Box
                                            w="14px"
                                            h="14px"
                                            borderRadius="sm"
                                            bg={getColor(day.count)}
                                            border={day.isToday ? '2px solid' : 'none'}
                                            borderColor={day.isToday ? 'brand.500' : 'transparent'}
                                            cursor="pointer"
                                            _hover={{ transform: 'scale(1.2)' }}
                                            transition="transform 0.1s"
                                        />
                                    </Tooltip>
                                ))}
                            </VStack>
                        ))}
                    </HStack>
                </Box>

                {/* Legend */}
                <HStack justify="end" spacing={2}>
                    <Text fontSize="xs" color="gray.500">Ít</Text>
                    <Box w="12px" h="12px" borderRadius="sm" bg="gray.100" />
                    <Box w="12px" h="12px" borderRadius="sm" bg="green.200" />
                    <Box w="12px" h="12px" borderRadius="sm" bg="green.400" />
                    <Box w="12px" h="12px" borderRadius="sm" bg="green.500" />
                    <Box w="12px" h="12px" borderRadius="sm" bg="green.600" />
                    <Text fontSize="xs" color="gray.500">Nhiều</Text>
                </HStack>
            </VStack>
        </Box>
    );
}

export default ActivityCalendar;
