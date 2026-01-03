import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    SimpleGrid,
    Card,
    CardBody,
    Button,
    Icon,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Input,
    FormControl,
    FormLabel,
    Textarea,
    useToast,
    Spinner,
    Badge,
    Image,
} from '@chakra-ui/react';
import { FiPlus, FiUsers, FiBook } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { classesAPI, activityAPI } from '../services/api';
import HeroSection from '../components/HeroSection';

function Home() {
    const [classes, setClasses] = useState([]);
    const [stats, setStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createForm, setCreateForm] = useState({ name: '', description: '' });
    const [joinCode, setJoinCode] = useState('');

    // Disclosures
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classesRes, statsRes, leaderboardRes] = await Promise.all([
                classesAPI.getAll(),
                activityAPI.getStats(),
                activityAPI.getLeaderboard(20)
            ]);

            setClasses(classesRes.data.data);
            setStats(statsRes.data.data);
            setLeaderboard(leaderboardRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await classesAPI.create(createForm);
            toast({
                title: 'Tạo lớp học thành công!',
                status: 'success',
                duration: 2000,
            });
            onCreateClose();
            setCreateForm({ name: '', description: '' });
            fetchData(); // Refresh all data
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error.response?.data?.message || 'Tạo lớp học thất bại',
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleJoin = async () => {
        try {
            await classesAPI.join(joinCode);
            toast({
                title: 'Tham gia lớp học thành công!',
                status: 'success',
                duration: 2000,
            });
            onJoinClose();
            setJoinCode('');
            fetchData(); // Refresh all data
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error.response?.data?.message || 'Mã lớp không hợp lệ',
                status: 'error',
                duration: 3000,
            });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
                <Spinner size="xl" color="brand.500" />
            </Box>
        );
    }

    return (
        <Box maxW="1200px" mx="auto">
            {/* Hero Section: Image + Streak + Leaderboard + Stats */}
            <HeroSection stats={stats} leaderboard={leaderboard} loading={loading} />

            {/* Classes Section */}
            <Box>
                <HStack justify="space-between" mb={6}>
                    <Heading size="md">Lớp học của bạn</Heading>
                    <HStack spacing={3}>
                        <Button leftIcon={<Icon as={FiUsers} />} variant="outline" size="sm" onClick={onJoinOpen}>
                            Tham gia
                        </Button>
                        <Button leftIcon={<Icon as={FiPlus} />} colorScheme="brand" size="sm" onClick={onCreateOpen}>
                            Tạo lớp
                        </Button>
                    </HStack>
                </HStack>

                {classes.length === 0 ? (
                    <Box
                        textAlign="center"
                        py={12}
                        bg="white"
                        borderRadius="xl"
                        boxShadow="sm"
                        border="1px dashed"
                        borderColor="gray.200"
                    >
                        <Text fontSize="4xl" mb={4}>📚</Text>
                        <Heading size="sm" mb={2}>Chưa có lớp học nào</Heading>
                        <Text color="gray.500" mb={4} fontSize="sm">
                            Bắt đầu hành trình học tập ngay hôm nay
                        </Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {classes.map((cls) => (
                            <Card
                                key={cls.id}
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
                                onClick={() => navigate(`/class/${cls.id}`)}
                                variant="outline"
                                borderColor="gray.100"
                            >
                                <CardBody>
                                    <VStack align="start" spacing={3}>
                                        <HStack justify="space-between" w="full">
                                            <Text fontSize="3xl">{cls.icon || '📖'}</Text>
                                            <Badge colorScheme="brand" fontSize="xs" px={2} py={1} borderRadius="full">
                                                {cls.code}
                                            </Badge>
                                        </HStack>
                                        <Heading size="md" noOfLines={1}>{cls.name}</Heading>
                                        <Text color="gray.500" fontSize="sm" noOfLines={2}>
                                            {cls.description || 'Không có mô tả'}
                                        </Text>
                                        <HStack color="gray.400" fontSize="xs">
                                            <Icon as={FiBook} />
                                            <Text>{cls.vocabularySets?.length || 0} bộ từ</Text>
                                        </HStack>
                                    </VStack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Box>

            {/* Create Class Modal */}
            <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Tạo lớp học mới</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Tên lớp học</FormLabel>
                                <Input
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                    placeholder="VD: HSK 1 - Từ vựng cơ bản"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Mô tả</FormLabel>
                                <Textarea
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                    placeholder="Mô tả về lớp học..."
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onCreateClose}>
                            Hủy
                        </Button>
                        <Button colorScheme="brand" onClick={handleCreate}>
                            Tạo lớp
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Join Class Modal */}
            <Modal isOpen={isJoinOpen} onClose={onJoinClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Tham gia lớp học</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nhập mã lớp học</FormLabel>
                            <Input
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="VD: ABC123"
                                textTransform="uppercase"
                                size="lg"
                                textAlign="center"
                                letterSpacing="0.2em"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onJoinClose}>
                            Hủy
                        </Button>
                        <Button colorScheme="brand" onClick={handleJoin}>
                            Tham gia
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Home;
