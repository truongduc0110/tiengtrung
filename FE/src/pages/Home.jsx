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
    Flex,
    Select,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus, FiUsers, FiBook, FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { classesAPI, activityAPI } from '../services/api';

function Home() {
    const [classes, setClasses] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [createForm, setCreateForm] = useState({ name: '', description: '', languageId: 2 });
    const [joinCode, setJoinCode] = useState('');

    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();

    const cardBg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classesRes, statsRes] = await Promise.all([
                classesAPI.getAll(),
                activityAPI.getStats(),
            ]);
            setClasses(classesRes.data.data);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await classesAPI.create(createForm);
            toast({ title: 'Tạo lớp học thành công!', status: 'success', duration: 2000 });
            onCreateClose();
            setCreateForm({ name: '', description: '', languageId: 2 });
            fetchData();
        } catch (error) {
            toast({ title: 'Lỗi', description: error.response?.data?.message || 'Tạo lớp học thất bại', status: 'error', duration: 3000 });
        }
    };

    const handleJoin = async () => {
        try {
            await classesAPI.join(joinCode);
            toast({ title: 'Tham gia lớp học thành công!', status: 'success', duration: 2000 });
            onJoinClose();
            setJoinCode('');
            fetchData();
        } catch (error) {
            toast({ title: 'Lỗi', description: error.response?.data?.message || 'Mã lớp không hợp lệ', status: 'error', duration: 3000 });
        }
    };

    if (loading) return <Flex justify="center" align="center" minH="50vh"><Spinner size="xl" color="brand.500" /></Flex>;

    return (
        <Box>
            {/* Dashboard Header */}
            <Flex justify="space-between" align="center" mb={8}>
                <VStack align="start" spacing={1}>
                    <Heading size="lg" fontFamily="heading">Tổng quan</Heading>
                    <Text color="gray.500">Chào mừng trở lại, tiếp tục học tập nào!</Text>
                </VStack>
                <HStack>
                    <Button leftIcon={<Icon as={FiUsers} />} variant="outline" onClick={onJoinOpen} borderRadius="xl">Tham gia lớp</Button>
                    <Button leftIcon={<Icon as={FiPlus} />} colorScheme="brand" onClick={onCreateOpen} borderRadius="xl" boxShadow="lg">Tạo lớp mới</Button>
                </HStack>
            </Flex>

            {/* Stats Overview */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
                {[
                    { label: 'Từ đã thuộc', value: stats?.totalLearned || 0, icon: '🎓', color: 'brand.500', bg: 'brand.50' },
                    { label: 'Chuỗi ngày', value: stats?.streak || 0, icon: '🔥', color: 'orange.500', bg: 'orange.50' },
                    { label: 'Tổng số lớp', value: classes.length, icon: '📚', color: 'blue.500', bg: 'blue.50' },
                ].map((stat, index) => (
                    <Card key={index} bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="gray.100" _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }} transition="all 0.2s">
                        <CardBody>
                            <HStack spacing={4}>
                                <Flex w={12} h={12} bg={stat.bg} borderRadius="xl" align="center" justify="center" fontSize="2xl">
                                    {stat.icon}
                                </Flex>
                                <Box>
                                    <Text color="gray.500" fontSize="sm">{stat.label}</Text>
                                    <Heading size="md">{stat.value}</Heading>
                                </Box>
                            </HStack>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Classes Grid */}
            <Heading size="md" mb={6} fontFamily="heading">Lớp học của bạn</Heading>

            {classes.length === 0 ? (
                <Flex direction="column" align="center" justify="center" py={16} bg={cardBg} borderRadius="2xl" border="1px dashed" borderColor="gray.200">
                    <Text fontSize="4xl" mb={4}>🚀</Text>
                    <Heading size="sm" mb={2}>Chưa có lớp học nào</Heading>
                    <Text color="gray.500" mb={6}>Hãy bắt đầu bằng cách tạo hoặc tham gia lớp học</Text>
                    <Button colorScheme="brand" onClick={onCreateOpen} borderRadius="xl">Tạo lớp ngay</Button>
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {classes.map((cls) => (
                        <Card
                            key={cls.id}
                            bg={cardBg}
                            borderRadius="2xl"
                            border="1px solid"
                            borderColor="gray.100"
                            cursor="pointer"
                            transition="all 0.3s"
                            _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl', borderColor: 'brand.200' }}
                            onClick={() => navigate(`/class/${cls.id}`)}
                            position="relative"
                            overflow="hidden"
                        >
                            <Box position="absolute" top={0} right={0} w="100px" h="100px" bgGradient="linear(to-bl, brand.100, transparent)" borderRadius="0 0 0 100%" opacity={0.3} />
                            <CardBody>
                                <VStack align="start" spacing={4}>
                                    <HStack justify="space-between" w="full">
                                        <Flex w={12} h={12} bg="brand.50" borderRadius="xl" align="center" justify="center" fontSize="2xl">
                                            {cls.icon || '📘'}
                                        </Flex>
                                        <Badge colorScheme="brand" borderRadius="full" px={3} py={1}>
                                            {cls.language?.flag || '🏳️'} {(cls.language?.code || '').toUpperCase()}
                                        </Badge>
                                    </HStack>
                                    <Box w="full">
                                        <Heading size="md" mb={1} noOfLines={1}>{cls.name}</Heading>
                                        <Text color="gray.500" fontSize="sm" noOfLines={2}>
                                            {cls.description || 'Chưa có mô tả'}
                                        </Text>
                                    </Box>
                                    <HStack pt={2} divider={<Text color="gray.300">•</Text>} spacing={3}>
                                        <Text fontSize="xs" color="gray.500" fontWeight="medium">Mã: {cls.code}</Text>
                                        <Text fontSize="xs" color="gray.500" fontWeight="medium">{cls.vocabularySets?.length || 0} bộ từ</Text>
                                    </HStack>
                                </VStack>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            )}

            {/* Create Class Modal */}
            <Modal isOpen={isCreateOpen} onClose={onCreateClose} isCentered>
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent borderRadius="2xl">
                    <ModalHeader>Tạo lớp học mới</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Tên lớp</FormLabel>
                                <Input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="VD: Tiếng Anh Giao Tiếp" borderRadius="xl" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Ngôn ngữ</FormLabel>
                                <Select
                                    value={createForm.languageId}
                                    onChange={(e) => setCreateForm({ ...createForm, languageId: parseInt(e.target.value) })}
                                    borderRadius="xl"
                                >
                                    <option value={1}>🇬🇧 Tiếng Anh</option>
                                    <option value={2}>🇨🇳 Tiếng Trung</option>
                                    <option value={3}>🇯🇵 Tiếng Nhật</option>
                                    <option value={4}>🇰🇷 Tiếng Hàn</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Mô tả</FormLabel>
                                <Textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} placeholder="Mô tả ngắn về lớp học..." borderRadius="xl" />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onCreateClose}>Hủy</Button>
                        <Button colorScheme="brand" onClick={handleCreate}>Tạo lớp</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Join Class Modal */}
            <Modal isOpen={isJoinOpen} onClose={onJoinClose} isCentered>
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent borderRadius="2xl">
                    <ModalHeader>Tham gia lớp học</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Mã lớp học</FormLabel>
                            <Input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="VD: CODE123" textAlign="center" fontSize="xl" letterSpacing="widest" borderRadius="xl" py={6} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onJoinClose}>Hủy</Button>
                        <Button colorScheme="brand" onClick={handleJoin}>Tham gia</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Home;
