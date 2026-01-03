import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Icon,
    Switch,
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
    useToast,
    Spinner,
    IconButton,
    Badge,
    Tooltip,
} from '@chakra-ui/react';
import { FiPlus, FiArrowLeft, FiTrash2, FiEdit, FiPlay, FiList, FiZap } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { setsAPI, vocabulariesAPI } from '../services/api';
import BulkAddModal from '../components/BulkAddModal';
import AIGenerateModal from '../components/AIGenerateModal';

function VocabularySet() {
    const { setId } = useParams();
    const [setInfo, setSetInfo] = useState(null);
    const [vocabularies, setVocabularies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createForm, setCreateForm] = useState({
        chinese: '',
        pinyin: '',
        meaning: '',
        example: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isBulkOpen, onOpen: onBulkOpen, onClose: onBulkClose } = useDisclosure();
    const { isOpen: isAIOpen, onOpen: onAIOpen, onClose: onAIClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchData();
    }, [setId]);

    const fetchData = async () => {
        try {
            const [setRes, vocabRes] = await Promise.all([
                setsAPI.getById(setId),
                vocabulariesAPI.getBySet(setId),
            ]);
            setSetInfo(setRes.data.data);
            setVocabularies(vocabRes.data.data);
        } catch (error) {
            console.error('Failed to fetch vocabulary set:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await vocabulariesAPI.create({
                ...createForm,
                vocabularySetId: parseInt(setId),
            });
            toast({
                title: 'Thêm từ thành công!',
                status: 'success',
                duration: 2000,
            });
            onClose();
            setCreateForm({ chinese: '', pinyin: '', meaning: '', example: '' });
            fetchData();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: error.response?.data?.message || 'Thêm từ thất bại',
                status: 'error',
            });
        }
    };

    const handleToggleLearned = async (vocabId) => {
        try {
            const response = await vocabulariesAPI.toggleLearned(vocabId);
            const isLearned = response.data.data.isLearned;
            setVocabularies((prev) =>
                prev.map((v) =>
                    v.id === vocabId ? { ...v, isLearned } : v
                )
            );
        } catch (error) {
            console.error('Failed to toggle learned:', error);
        }
    };

    const handleDelete = async (vocabId) => {
        if (!confirm('Bạn có chắc muốn xóa từ này?')) return;
        try {
            await vocabulariesAPI.delete(vocabId);
            toast({
                title: 'Đã xóa từ',
                status: 'success',
                duration: 1500,
            });
            fetchData();
        } catch (error) {
            toast({
                title: 'Lỗi',
                description: 'Xóa từ thất bại',
                status: 'error',
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

    if (!setInfo) {
        return (
            <Box textAlign="center" py={20}>
                <Text>Không tìm thấy bộ từ</Text>
            </Box>
        );
    }

    const learnedCount = vocabularies.filter((v) => v.isLearned).length;

    return (
        <Box>
            {/* Header */}
            <HStack mb={6}>
                <IconButton
                    icon={<Icon as={FiArrowLeft} />}
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    aria-label="Quay lại"
                />
                <VStack align="start" spacing={0} flex={1}>
                    <Heading size="lg">{setInfo.icon || '📚'} {setInfo.name}</Heading>
                    <HStack spacing={4}>
                        <Text color="gray.500">
                            {vocabularies.length} từ • {learnedCount} đã thuộc
                        </Text>
                    </HStack>
                </VStack>
                <HStack spacing={2}>
                    <Button
                        leftIcon={<Icon as={FiPlus} />}
                        variant="outline"
                        onClick={onOpen}
                    >
                        Thêm từ
                    </Button>
                    <Button
                        leftIcon={<Icon as={FiList} />}
                        variant="outline"
                        onClick={onBulkOpen}
                    >
                        Thêm nhiều
                    </Button>
                    <Button
                        leftIcon={<Icon as={FiZap} />}
                        variant="outline"
                        colorScheme="yellow"
                        onClick={onAIOpen}
                    >
                        AI Tạo từ
                    </Button>
                    <Button
                        leftIcon={<Icon as={FiPlay} />}
                        colorScheme="brand"
                        onClick={() => navigate(`/practice/${setId}`)}
                        isDisabled={vocabularies.length === 0}
                    >
                        Học ngay
                    </Button>
                </HStack>
            </HStack>

            {/* Vocabulary Table */}
            {vocabularies.length === 0 ? (
                <Box
                    textAlign="center"
                    py={20}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="sm"
                >
                    <Text fontSize="6xl" mb={4}>📝</Text>
                    <Heading size="md" mb={2}>Chưa có từ vựng nào</Heading>
                    <Text color="gray.500" mb={6}>
                        Thêm từ vựng để bắt đầu học
                    </Text>
                    <Button leftIcon={<Icon as={FiPlus} />} colorScheme="brand" onClick={onOpen}>
                        Thêm từ
                    </Button>
                </Box>
            ) : (
                <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
                    <Table variant="simple">
                        <Thead bg="gray.50">
                            <Tr>
                                <Th>Chữ Hán</Th>
                                <Th>Pinyin</Th>
                                <Th>Nghĩa</Th>
                                <Th>Ví dụ</Th>
                                <Th textAlign="center">Thuộc</Th>
                                <Th textAlign="center">Thao tác</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {vocabularies.map((vocab) => (
                                <Tr key={vocab.id} _hover={{ bg: 'gray.50' }}>
                                    <Td>
                                        <Text fontSize="xl" fontWeight="bold" fontFamily="'Noto Sans SC', sans-serif">
                                            {vocab.chinese}
                                        </Text>
                                    </Td>
                                    <Td>
                                        <Text color="brand.500">{vocab.pinyin}</Text>
                                    </Td>
                                    <Td>{vocab.meaning}</Td>
                                    <Td>
                                        <Text color="gray.500" fontSize="sm" noOfLines={2}>
                                            {vocab.example || '-'}
                                        </Text>
                                    </Td>
                                    <Td textAlign="center">
                                        <Switch
                                            colorScheme="green"
                                            isChecked={vocab.isLearned}
                                            onChange={() => handleToggleLearned(vocab.id)}
                                        />
                                    </Td>
                                    <Td textAlign="center">
                                        <Tooltip label="Xóa">
                                            <IconButton
                                                icon={<Icon as={FiTrash2} />}
                                                variant="ghost"
                                                colorScheme="red"
                                                size="sm"
                                                onClick={() => handleDelete(vocab.id)}
                                                aria-label="Xóa"
                                            />
                                        </Tooltip>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            )}

            {/* Add Vocabulary Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Thêm từ mới</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Chữ Hán</FormLabel>
                                <Input
                                    value={createForm.chinese}
                                    onChange={(e) => setCreateForm({ ...createForm, chinese: e.target.value })}
                                    placeholder="你好"
                                    fontSize="xl"
                                    fontFamily="'Noto Sans SC', sans-serif"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Pinyin</FormLabel>
                                <Input
                                    value={createForm.pinyin}
                                    onChange={(e) => setCreateForm({ ...createForm, pinyin: e.target.value })}
                                    placeholder="nǐ hǎo"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Nghĩa</FormLabel>
                                <Input
                                    value={createForm.meaning}
                                    onChange={(e) => setCreateForm({ ...createForm, meaning: e.target.value })}
                                    placeholder="Xin chào"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Ví dụ</FormLabel>
                                <Input
                                    value={createForm.example}
                                    onChange={(e) => setCreateForm({ ...createForm, example: e.target.value })}
                                    placeholder="你好，很高兴认识你"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Hủy
                        </Button>
                        <Button colorScheme="brand" onClick={handleCreate}>
                            Thêm từ
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* Bulk Add Modal */}
            <BulkAddModal
                isOpen={isBulkOpen}
                onClose={onBulkClose}
                setId={setId}
                onSuccess={fetchData}
            />

            {/* AI Generate Modal */}
            <AIGenerateModal
                isOpen={isAIOpen}
                onClose={onAIClose}
                setId={setId}
                onSuccess={fetchData}
            />
        </Box>
    );
}

export default VocabularySet;
