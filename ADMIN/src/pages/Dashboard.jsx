import { useState, useEffect } from 'react';
import {
    Box,
    SimpleGrid,
    Card,
    CardBody,
    Heading,
    Text,
    Icon,
    Spinner,
    VStack,
} from '@chakra-ui/react';
import { FiUsers, FiBook, FiLayers, FiFileText } from 'react-icons/fi';
import { adminAPI } from '../services/api';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
                <Spinner size="xl" color="brand.500" />
            </Box>
        );
    }

    const statCards = [
        { icon: FiUsers, label: 'Người dùng', value: stats?.users || 0, color: 'blue' },
        { icon: FiBook, label: 'Lớp học', value: stats?.classes || 0, color: 'green' },
        { icon: FiLayers, label: 'Bộ từ', value: stats?.vocabularySets || 0, color: 'purple' },
        { icon: FiFileText, label: 'Từ vựng', value: stats?.vocabularies || 0, color: 'orange' },
    ];

    return (
        <Box>
            <Heading size="lg" mb={8}>Dashboard</Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                {statCards.map((stat, i) => (
                    <Card key={i}>
                        <CardBody>
                            <VStack spacing={4}>
                                <Box
                                    p={4}
                                    borderRadius="full"
                                    bg={`${stat.color}.100`}
                                >
                                    <Icon as={stat.icon} fontSize="2xl" color={`${stat.color}.500`} />
                                </Box>
                                <VStack spacing={0}>
                                    <Text fontSize="3xl" fontWeight="bold">{stat.value}</Text>
                                    <Text color="gray.500">{stat.label}</Text>
                                </VStack>
                            </VStack>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
}

export default Dashboard;
