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
} from '@chakra-ui/react';
import { FiPlus, FiCopy, FiArrowLeft, FiSettings, FiTrash2 } from 'react-icons/fi';
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
            toast({
                title: 'Lỗi',
                description: 'Không thể tải thông tin lớp học',
                status: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSet = async () => {
        try {
            await setsAPI.create({
                ...createForm,
                classId: parseInt(classId),
            });
            toast({
                title: 'Tạo bộ từ thành công!',
                status: 'success',
                duration: 2000,
            });
            onClose();
            setCreateForm({ name: '', description: '' });
            fetchData();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error.response?.data?.message || 'Tạo bộ từ thất bại',
                status: 'error',
            });
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(classInfo.code);
        toast({
            title: 'Đã sao chép mã lớp!',
            status: 'success',
            duration: 1500,
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
                <Spinner size="xl" color="brand.500" />
            </Box>
        );
    }

    if (!classInfo) {
        return (
            <Box textAlign="center" py={20}>
                <Text>Không tìm thấy lớp học</Text>
            </Box>
        );
    }

    const isOwner = classInfo.ownerId === user?.id;

    return (
        <Box>
            {/* Header */}
            <HStack mb={6}>
                <IconButton
                    icon={<Icon as={FiArrowLeft} />}
                    variant="ghost"
                    onClick={() => navigate('/')}
                    aria-label="Quay lại"
                />
                <VStack align="start" spacing={0} flex={1}>
                    <HStack>
                        <Heading size="lg">{classInfo.icon || '📖'} {classInfo.name}</Heading>
                        {isOwner && (
                            <Badge colorScheme="green">Chủ lớp</Badge>
                        )}
                    </HStack>
                    <Text color="gray.500">{classInfo.description || 'Không có mô tả'}</Text>
                </VStack>
                <HStack spacing={2}>
                    <Tooltip label="Sao chép mã lớp">
                        <Button
                            leftIcon={<Icon as={FiCopy} />}
                            variant="outline"
                            size="sm"
                            onClick={copyCode}
                        >
                            {classInfo.code}
                        </Button>
                    </Tooltip>
                    <Button
                        leftIcon={<Icon as={FiPlus} />}
                        colorScheme="brand"
                        onClick={onOpen}
                    >
                        Thêm bộ từ
                    </Button>
                </HStack>
            </HStack>

            {/* Vocabulary Sets Grid */}
            {sets.length === 0 ? (
                <Box
                    textAlign="center"
                    py={20}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="sm"
                >
                    <Text fontSize="6xl" mb={4}>📝</Text>
                    <Heading size="md" mb={2}>Chưa có bộ từ nào</Heading>
                    <Text color="gray.500" mb={6}>
                        Tạo bộ từ mới để bắt đầu học
                    </Text>
                    <Button leftIcon={<Icon as={FiPlus} />} colorScheme="brand" onClick={onOpen}>
                        Thêm bộ từ
                    </Button>
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {sets.map((set) => {
                        const total = set.vocabularies?.length || 0;
                        const learned = 0; // TODO: Calculate from progress
                        const progress = total > 0 ? (learned / total) * 100 : 0;

                        return (
                            <Card
                                key={set.id}
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                                onClick={() => navigate(`/set/${set.id}`)}
                            >
                                <CardBody>
                                    <VStack align="start" spacing={3}>
                                        <HStack justify="space-between" w="full">
                                            <Text fontSize="2xl">{set.icon || '📚'}</Text>
                                            <Badge colorScheme={total > 0 ? 'green' : 'gray'}>
                                                {total} từ
                                            </Badge>
                                        </HStack>
                                        <Heading size="md" noOfLines={1}>{set.name}</Heading>
                                        <Text color="gray.500" fontSize="sm" noOfLines={2}>
                                            {set.description || 'Không có mô tả'}
                                        </Text>

                                        {/* Progress Bar */}
                                        <Box w="full">
                                            <HStack justify="space-between" fontSize="xs" color="gray.500" mb={1}>
                                                <Text>Tiến độ</Text>
                                                <Text>{learned}/{total} từ đã học</Text>
                                            </HStack>
                                            <Progress
                                                value={progress}
                                                colorScheme="brand"
                                                borderRadius="full"
                                                size="sm"
                                            />
                                        </Box>

                                        <Button
                                            colorScheme="brand"
                                            size="sm"
                                            w="full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/practice/${set.id}`);
                                            }}
                                            isDisabled={total === 0}
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Tạo bộ từ mới</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Tên bộ từ</FormLabel>
                                <Input
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                    placeholder="VD: Chào hỏi cơ bản"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Mô tả</FormLabel>
                                <Textarea
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                    placeholder="Mô tả về bộ từ..."
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Hủy
                        </Button>
                        <Button colorScheme="brand" onClick={handleCreateSet}>
                            Tạo bộ từ
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default ClassDetail;
