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
    Progress,
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
    IconButton,
    Tooltip,
    Flex,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus, FiCopy, FiArrowLeft, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { classesAPI, setsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ClassDetail() {
    const { classId } = useParams();
    const [classInfo, setClassInfo] = useState(null);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createForm, setCreateForm] = useState({ name: '', description: '' });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const cardBg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        fetchData();
    }, [classId]);

    const fetchData = async () => {
        try {
            const [classRes, setsRes] = await Promise.all([
                classesAPI.getById(classId),
                setsAPI.getByClass(classId),
            ]);
            setClassInfo(classRes.data.data);
            setSets(setsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch class:', error);
            toast({ title: 'Lỗi', description: 'Không thể tải thông tin lớp học', status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSet = async () => {
        try {
            await setsAPI.create({ ...createForm, classId: parseInt(classId) });
            toast({ title: 'Tạo bộ từ thành công!', status: 'success', duration: 2000 });
            onClose();
            setCreateForm({ name: '', description: '' });
            fetchData();
        } catch (error) {
            toast({ title: 'Lỗi', description: error.response?.data?.message || 'Tạo bộ từ thất bại', status: 'error' });
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(classInfo.code);
        toast({ title: 'Đã sao chép mã lớp!', status: 'success', duration: 1500 });
    };

    if (loading) return <Flex justify="center" align="center" minH="50vh"><Spinner size="xl" color="brand.500" /></Flex>;
    if (!classInfo) return <Box textAlign="center" py={20}><Text>Không tìm thấy lớp học</Text></Box>;

    const isOwner = classInfo.ownerId === user?.id;

    return (
        <Box>
            {/* Hero Header */}
            <Box
                bgGradient="linear(to-r, brand.600, accent.600)"
                borderRadius="3xl"
                p={8}
                mb={8}
                color="white"
                position="relative"
                overflow="hidden"
                boxShadow="xl"
            >
                <Box position="absolute" top={0} right={0} w="300px" h="300px" bg="whiteAlpha.100" borderRadius="full" transform="translate(30%, -30%)" />

                <Button
                    leftIcon={<Icon as={FiArrowLeft} />}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    mb={4}
                    onClick={() => navigate('/')}
                >
                    Quay lại
                </Button>

                <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={6}>
                    <VStack align="start" spacing={2}>
                        <HStack>
                            <Flex w={12} h={12} bg="whiteAlpha.200" borderRadius="xl" align="center" justify="center" fontSize="2xl" backdropFilter="blur(10px)">
                                {classInfo.icon || '📖'}
                            </Flex>
                            <Heading size="xl" fontFamily="heading">{classInfo.name}</Heading>
                            {isOwner && <Badge colorScheme="green" bg="green.400" color="white" px={2} py={1} borderRadius="lg">Chủ lớp</Badge>}
                        </HStack>
                        <Text fontSize="lg" opacity={0.9}>{classInfo.description || 'Không có mô tả'}</Text>

                        <HStack spacing={4} pt={2}>
                            <HStack bg="whiteAlpha.200" px={3} py={1} borderRadius="lg">
                                <Text fontSize="sm">Mã lớp:</Text>
                                <Text fontWeight="bold" fontFamily="monospace" fontSize="md">{classInfo.code}</Text>
                                <IconButton
                                    icon={<Icon as={FiCopy} />}
                                    size="xs"
                                    variant="ghost"
                                    color="white"
                                    _hover={{ bg: 'whiteAlpha.300' }}
                                    onClick={copyCode}
                                    aria-label="Copy code"
                                />
                            </HStack>
                            <Badge bg="whiteAlpha.200" color="white" px={3} py={1.5} borderRadius="lg">
                                {classInfo.vocabularySets?.length || 0} bộ từ
                            </Badge>
                        </HStack>
                    </VStack>

                    <Button
                        leftIcon={<Icon as={FiPlus} />}
                        bg="white"
                        color="brand.600"
                        size="lg"
                        _hover={{ bg: 'gray.100' }}
                        onClick={onOpen}
                        borderRadius="xl"
                        boxShadow="lg"
                    >
                        Thêm bộ từ
                    </Button>
                </Flex>
            </Box>

            {/* Sets Grid */}
            {sets.length === 0 ? (
                <Flex direction="column" align="center" justify="center" py={16} bg={cardBg} borderRadius="2xl" border="1px dashed" borderColor="gray.200">
                    <Text fontSize="6xl" mb={4}>📝</Text>
                    <Heading size="md" mb={2}>Chưa có bộ từ nào</Heading>
                    <Text color="gray.500" mb={6}>Tạo bộ từ mới để bắt đầu học</Text>
                    <Button leftIcon={<Icon as={FiPlus} />} colorScheme="brand" onClick={onOpen} borderRadius="xl">Thêm bộ từ</Button>
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {sets.map((set) => {
                        const total = set.vocabularies?.length || 0;
                        const learned = 0; // TODO: Calculate from progress
                        const progress = total > 0 ? (learned / total) * 100 : 0;

                        return (
                            <Card
                                key={set.id}
                                bg={cardBg}
                                borderRadius="2xl"
                                border="1px solid"
                                borderColor="gray.100"
                                cursor="pointer"
                                transition="all 0.3s"
                                _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl', borderColor: 'brand.200' }}
                                onClick={() => navigate(`/set/${set.id}`)}
                            >
                                <CardBody>
                                    <VStack align="start" spacing={4}>
                                        <HStack justify="space-between" w="full">
                                            <Flex w={12} h={12} bg="brand.50" borderRadius="xl" align="center" justify="center" fontSize="2xl">
                                                {set.icon || '📚'}
                                            </Flex>
                                            <Badge colorScheme={total > 0 ? 'green' : 'gray'} borderRadius="full" px={3} py={1}>
                                                {total} từ
                                            </Badge>
                                        </HStack>

                                        <Box w="full">
                                            <Heading size="md" mb={1} noOfLines={1}>{set.name}</Heading>
                                            <Text color="gray.500" fontSize="sm" noOfLines={2}>
                                                {set.description || 'Không có mô tả'}
                                            </Text>
                                        </Box>

                                        <Box w="full">
                                            <HStack justify="space-between" fontSize="xs" color="gray.500" mb={1}>
                                                <Text fontWeight="medium">Tiến độ</Text>
                                                <Text>{Math.round(progress)}%</Text>
                                            </HStack>
                                            <Progress value={progress} colorScheme="brand" borderRadius="full" size="sm" hasStripe />
                                        </Box>

                                        <Button
                                            colorScheme="brand"
                                            size="sm"
                                            w="full"
                                            borderRadius="lg"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/practice/${set.id}`);
                                            }}
                                            isDisabled={total === 0}
                                            _hover={{ transform: 'scale(1.02)' }}
                                        >
                                            Học ngay
                                        </Button>
                                    </VStack>
                                </CardBody>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            )}

            {/* Create Set Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent borderRadius="2xl">
                    <ModalHeader>Tạo bộ từ mới</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Tên bộ từ</FormLabel>
                                <Input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="VD: Chào hỏi cơ bản" borderRadius="xl" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Mô tả</FormLabel>
                                <Textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} placeholder="Mô tả về bộ từ..." borderRadius="xl" />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>Hủy</Button>
                        <Button colorScheme="brand" onClick={handleCreateSet}>Tạo bộ từ</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default ClassDetail;
