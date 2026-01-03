import {
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    SimpleGrid,
    Card,
    CardBody,
    Skeleton,
} from '@chakra-ui/react';
import { FaFire, FaBookReader } from 'react-icons/fa';

function StatsCard({ stats, loading }) {
    if (loading) {
        return (
            <SimpleGrid columns={2} spacing={4}>
                <Skeleton height="100px" borderRadius="xl" />
                <Skeleton height="100px" borderRadius="xl" />
            </SimpleGrid>
        );
    }

    return (
        <SimpleGrid columns={2} spacing={4}>
            <Card
                bgGradient="linear(to-br, orange.400, orange.600)"
                color="white"
                borderRadius="xl"
                boxShadow="lg"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            >
                <CardBody>
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="medium" opacity={0.9}>
                                Chuỗi ngày
                            </Text>
                            <Text fontSize="4xl" fontWeight="bold">
                                {stats?.streak || 0}
                            </Text>
                        </VStack>
                        <Icon as={FaFire} boxSize={8} opacity={0.8} />
                    </HStack>
                    <Text fontSize="xs" mt={2} opacity={0.8}>
                        Ngày liên tiếp
                    </Text>
                </CardBody>
            </Card>

            <Card
                bgGradient="linear(to-br, blue.400, blue.600)"
                color="white"
                borderRadius="xl"
                boxShadow="lg"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            >
                <CardBody>
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="medium" opacity={0.9}>
                                Từ đã thuộc
                            </Text>
                            <Text fontSize="4xl" fontWeight="bold">
                                {stats?.totalLearned || 0}
                            </Text>
                        </VStack>
                        <Icon as={FaBookReader} boxSize={8} opacity={0.8} />
                    </HStack>
                    <Text fontSize="xs" mt={2} opacity={0.8}>
                        Tổng số từ
                    </Text>
                </CardBody>
            </Card>
        </SimpleGrid>
    );
}

export default StatsCard;
