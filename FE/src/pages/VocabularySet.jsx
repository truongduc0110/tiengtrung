import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    SimpleGrid,
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
    Tooltip,
    Flex,
    useColorModeValue,
    Card,
    CardBody,
} from '@chakra-ui/react';
import { FiPlus, FiArrowLeft, FiTrash2, FiPlay, FiList, FiVolume2 } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { setsAPI, vocabulariesAPI, ttsAPI } from '../services/api';
// import BulkAddModal from '../components/BulkAddModal'; 

function VocabularySet() {
    const { setId } = useParams();
    const [setInfo, setSetInfo] = useState(null);
    const [vocabularies, setVocabularies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createForm, setCreateForm] = useState({
        word: '',
        pronunciation: '',
        pronunciation2: '',
        meaning: '',
        example: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isBulkOpen, onOpen: onBulkOpen, onClose: onBulkClose } = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');

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
            toast({ title: 'Thêm từ thành công!', status: 'success', duration: 2000 });
            onClose();
            setCreateForm({ word: '', pronunciation: '', pronunciation2: '', meaning: '', example: '' });
            fetchData();
        } catch (error) {
            toast({ title: 'Lỗi', description: error.response?.data?.message || 'Thêm từ thất bại', status: 'error' });
        }
    };

    const handleToggleLearned = async (vocabId) => {
        try {
            const response = await vocabulariesAPI.toggleLearned(vocabId);
            const isLearned = response.data.data.isLearned;
            setVocabularies((prev) => prev.map((v) => v.id === vocabId ? { ...v, isLearned } : v));
        } catch (error) {
            console.error('Failed to toggle learned:', error);
        }
    };

    const handleDelete = async (vocabId) => {
        if (!confirm('Bạn có chắc muốn xóa từ này?')) return;
        try {
            await vocabulariesAPI.delete(vocabId);
            toast({ title: 'Đã xóa từ', status: 'success', duration: 1500 });
            fetchData();
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Xóa từ thất bại', status: 'error' });
        }
    };

    const playAudio = async (text, languageCode = 'zh') => { // Default to zh for now, should come from set->class->language
        try {
            // Need to get language code from class info actually, but assuming 'zh' or 'en' etc.
            // Ideally setInfo lookup should provide this. For now let's use a safe default or try to get it.
            // setInfo does not have language directly, need to check how to get it. 
            // For now, let's assume standard 'en', 'zh', 'ja', 'ko' are supported and maybe passed.
            // Fallback: If Japanese (pronunciation2 exists), use 'ja'. If Korean hanging, use 'ko'.

            await ttsAPI.speak(text, languageCode);
        } catch (error) {
            console.error("Audio error", error);
        }
    }

    if (loading) return <Flex justify="center" align="center" minH="50vh"><Spinner size="xl" color="brand.500" /></Flex>;
    if (!setInfo) return <Box textAlign="center" py={20}><Text>Không tìm thấy bộ từ</Text></Box>;

    const learnedCount = vocabularies.filter((v) => v.isLearned).length;

    return (
        <Box>
            {/* Header */}
            <Flex
                justify="space-between"
                align={{ base: 'start', md: 'center' }}
                direction={{ base: 'column', md: 'row' }}
                mb={8}
                gap={4}
            >
                <HStack spacing={4}>
                    <IconButton icon={<Icon as={FiArrowLeft} />} variant="ghost" onClick={() => navigate(-1)} borderRadius="full" />
                    <VStack align="start" spacing={1}>
                        <HStack>
                            <Text fontSize="3xl">{setInfo.icon || '📚'}</Text>
                            <Heading size="lg" fontFamily="heading">{setInfo.name}</Heading>
                        </HStack>
                        <Text color="gray.500">{vocabularies.length} từ • {learnedCount} đã thuộc</Text>
                    </VStack>
                </HStack>

                <HStack spacing={3}>
                    <Button leftIcon={<Icon as={FiPlus} />} variant="outline" onClick={onOpen} borderRadius="xl">Thêm từ</Button>
                    {/* <Button leftIcon={<Icon as={FiList} />} variant="outline" onClick={onBulkOpen} borderRadius="xl">Thêm nhiều</Button> */}
                    <Button leftIcon={<Icon as={FiPlay} />} colorScheme="brand" onClick={() => navigate(`/practice/${setId}`)} isDisabled={vocabularies.length === 0} borderRadius="xl" px={8}>Học ngay</Button>
                </HStack>
            </Flex>

            {/* Vocabularies Grid */}
            {vocabularies.length === 0 ? (
                <Flex direction="column" align="center" justify="center" py={16} bg={cardBg} borderRadius="2xl" border="1px dashed" borderColor="gray.200">
                    <Text fontSize="6xl" mb={4}>📝</Text>
                    <Heading size="md" mb={2}>Chưa có từ vựng nào</Heading>
                    <Text color="gray.500" mb={6}>Thêm từ vựng để bắt đầu học</Text>
                    <Button leftIcon={<Icon as={FiPlus} />} colorScheme="brand" onClick={onOpen} borderRadius="xl">Thêm từ</Button>
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                    {vocabularies.map((vocab) => (
                        <Card
                            key={vocab.id}
                            bg={cardBg}
                            borderRadius="2xl"
                            boxShadow="sm"
                            border="1px solid"
                            borderColor="gray.100"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                            transition="all 0.2s"
                        >
                            <CardBody p={5}>
                                <Flex justify="space-between" align="start" mb={4}>
                                    <VStack align="start" spacing={0}>
                                        <Text fontSize="2xl" fontWeight="bold" fontFamily="heading" color="brand.600">
                                            {vocab.word}
                                        </Text>
                                        <Text color="gray.500" fontStyle="italic">{vocab.pronunciation}</Text>
                                        {vocab.pronunciation2 && <Text color="gray.400" fontSize="sm">{vocab.pronunciation2}</Text>}
                                    </VStack>
                                    <IconButton
                                        icon={<Icon as={FiVolume2} />}
                                        size="sm"
                                        variant="ghost"
                                        color="brand.500"
                                        onClick={() => playAudio(vocab.word)} // TODO: Pass language code
                                        aria-label="Play audio"
                                        borderRadius="full"
                                    />
                                </Flex>

                                <Box mb={4} minH="40px">
                                    <Text fontWeight="medium" fontSize="lg">{vocab.meaning}</Text>
                                    {vocab.example && (
                                        <Text color="gray.500" fontSize="sm" mt={1} noOfLines={2}>
                                            "{vocab.example}"
                                        </Text>
                                    )}
                                </Box>

                                <Flex justify="space-between" align="center" pt={4} borderTop="1px solid" borderColor="gray.100">
                                    <HStack>
                                        <Switch colorScheme="green" size="sm" isChecked={vocab.isLearned} onChange={() => handleToggleLearned(vocab.id)} />
                                        <Text fontSize="xs" color={vocab.isLearned ? 'green.500' : 'gray.400'}>{vocab.isLearned ? 'Đã thuộc' : 'Chưa thuộc'}</Text>
                                    </HStack>
                                    <IconButton
                                        icon={<Icon as={FiTrash2} />}
                                        size="xs"
                                        variant="ghost"
                                        colorScheme="red"
                                        onClick={() => handleDelete(vocab.id)}
                                        opacity={0.5}
                                        _hover={{ opacity: 1 }}
                                    />
                                </Flex>
                            </CardBody>
                        </Card>
                    ))}
                </SimpleGrid>
            )}

            {/* Add Vocab Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent borderRadius="2xl">
                    <ModalHeader>Thêm từ mới</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Từ vựng (Word)</FormLabel>
                                <Input value={createForm.word} onChange={(e) => setCreateForm({ ...createForm, word: e.target.value })} placeholder="VD: 你好" fontSize="lg" borderRadius="xl" />
                            </FormControl>
                            <HStack w="full">
                                <FormControl>
                                    <FormLabel>Phiên âm 1</FormLabel>
                                    <Input value={createForm.pronunciation} onChange={(e) => setCreateForm({ ...createForm, pronunciation: e.target.value })} placeholder="VD: nǐ hǎo" borderRadius="xl" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Phiên âm 2 (Opt)</FormLabel>
                                    <Input value={createForm.pronunciation2} onChange={(e) => setCreateForm({ ...createForm, pronunciation2: e.target.value })} placeholder="VD: Romaji" borderRadius="xl" />
                                </FormControl>
                            </HStack>
                            <FormControl isRequired>
                                <FormLabel>Nghĩa</FormLabel>
                                <Input value={createForm.meaning} onChange={(e) => setCreateForm({ ...createForm, meaning: e.target.value })} placeholder="VD: Xin chào" borderRadius="xl" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Ví dụ</FormLabel>
                                <Input value={createForm.example} onChange={(e) => setCreateForm({ ...createForm, example: e.target.value })} placeholder="VD: Câu ví dụ..." borderRadius="xl" />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>Hủy</Button>
                        <Button colorScheme="brand" onClick={handleCreate}>Thêm từ</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default VocabularySet;
