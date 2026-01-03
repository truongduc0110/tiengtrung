import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Input,
    VStack,
    HStack,
    Text,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Icon,
    useToast,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Checkbox,
    Spinner,
    Alert,
    AlertIcon,
    Badge,
} from '@chakra-ui/react';
import { FiTrash2, FiZap, FiCheck } from 'react-icons/fi';
import { aiAPI, vocabulariesAPI } from '../services/api';

function AIGenerateModal({ isOpen, onClose, setId, onSuccess }) {
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(10);
    const [generatedWords, setGeneratedWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState(new Set());
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();

    // Gọi AI để sinh từ vựng
    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast({
                title: 'Vui lòng nhập chủ đề',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        setIsGenerating(true);
        try {
            const response = await aiAPI.generateVocabulary(topic, count);
            const words = response.data.data.vocabularies || [];
            setGeneratedWords(words);
            // Chọn tất cả từ mặc định
            setSelectedWords(new Set(words.map((_, i) => i)));

            if (words.length === 0) {
                toast({
                    title: 'Không tìm thấy từ vựng',
                    description: 'Thử với chủ đề khác',
                    status: 'info',
                    duration: 3000,
                });
            } else {
                toast({
                    title: `Đã tạo ${words.length} từ!`,
                    status: 'success',
                    duration: 2000,
                });
            }
        } catch (error) {
            toast({
                title: 'Lỗi khi sinh từ vựng',
                description: error.response?.data?.message || 'Vui lòng thử lại',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // Toggle chọn từ
    const toggleWord = (index) => {
        const newSelected = new Set(selectedWords);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedWords(newSelected);
    };

    // Chọn/bỏ chọn tất cả
    const toggleAll = () => {
        if (selectedWords.size === generatedWords.length) {
            setSelectedWords(new Set());
        } else {
            setSelectedWords(new Set(generatedWords.map((_, i) => i)));
        }
    };

    // Xóa từ khỏi danh sách
    const removeWord = (index) => {
        setGeneratedWords(prev => prev.filter((_, i) => i !== index));
        const newSelected = new Set();
        selectedWords.forEach(i => {
            if (i < index) newSelected.add(i);
            else if (i > index) newSelected.add(i - 1);
        });
        setSelectedWords(newSelected);
    };

    // Lưu các từ đã chọn
    const handleSave = async () => {
        const wordsToSave = generatedWords.filter((_, i) => selectedWords.has(i));
        if (wordsToSave.length === 0) {
            toast({
                title: 'Vui lòng chọn ít nhất một từ',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        setIsSaving(true);
        try {
            const wordsData = wordsToSave.map(w => ({
                chinese: w.chinese,
                pinyin: w.pinyin,
                meaning: w.meaning,
                example: w.example || '',
                vocabularySetId: parseInt(setId),
            }));

            await vocabulariesAPI.createBulk(wordsData);

            toast({
                title: `Đã thêm ${wordsToSave.length} từ!`,
                status: 'success',
                duration: 2000,
            });

            // Reset và đóng modal
            setTopic('');
            setGeneratedWords([]);
            setSelectedWords(new Set());
            onSuccess?.();
            onClose();
        } catch (error) {
            toast({
                title: 'Lỗi khi lưu từ vựng',
                description: error.response?.data?.message || 'Vui lòng thử lại',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setTopic('');
        setGeneratedWords([]);
        setSelectedWords(new Set());
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <HStack>
                        <Icon as={FiZap} color="yellow.500" />
                        <Text>Tạo từ vựng bằng AI</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {/* Form nhập chủ đề */}
                        <HStack spacing={4} align="end">
                            <FormControl flex={3}>
                                <FormLabel>Chủ đề</FormLabel>
                                <Input
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="VD: Gia đình, Thức ăn, Du lịch, Công việc..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                                />
                            </FormControl>
                            <FormControl flex={1}>
                                <FormLabel>Số từ</FormLabel>
                                <NumberInput
                                    value={count}
                                    onChange={(_, val) => setCount(val)}
                                    min={5}
                                    max={30}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
                            <Button
                                leftIcon={isGenerating ? <Spinner size="sm" /> : <Icon as={FiZap} />}
                                colorScheme="yellow"
                                onClick={handleGenerate}
                                isLoading={isGenerating}
                                loadingText="Đang tạo..."
                            >
                                Tạo từ
                            </Button>
                        </HStack>

                        {/* Info alert */}
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">
                                AI sẽ tạo các từ vựng tiếng Trung phổ biến theo chủ đề bạn nhập.
                                Bạn có thể xem trước và chọn những từ muốn thêm.
                            </Text>
                        </Alert>

                        {/* Generated words table */}
                        {generatedWords.length > 0 && (
                            <Box>
                                <HStack mb={2} justify="space-between">
                                    <HStack>
                                        <Checkbox
                                            isChecked={selectedWords.size === generatedWords.length}
                                            isIndeterminate={selectedWords.size > 0 && selectedWords.size < generatedWords.length}
                                            onChange={toggleAll}
                                        >
                                            Chọn tất cả
                                        </Checkbox>
                                        <Badge colorScheme="green">
                                            {selectedWords.size}/{generatedWords.length} đã chọn
                                        </Badge>
                                    </HStack>
                                </HStack>
                                <Box maxH="350px" overflowY="auto" borderWidth="1px" borderRadius="md">
                                    <Table size="sm">
                                        <Thead bg="gray.50" position="sticky" top={0}>
                                            <Tr>
                                                <Th w="50px"></Th>
                                                <Th>Chữ Hán</Th>
                                                <Th>Pinyin</Th>
                                                <Th>Nghĩa</Th>
                                                <Th>Ví dụ</Th>
                                                <Th w="50px"></Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {generatedWords.map((word, index) => (
                                                <Tr
                                                    key={index}
                                                    bg={selectedWords.has(index) ? 'green.50' : 'white'}
                                                    _hover={{ bg: selectedWords.has(index) ? 'green.100' : 'gray.50' }}
                                                    cursor="pointer"
                                                    onClick={() => toggleWord(index)}
                                                >
                                                    <Td>
                                                        <Checkbox
                                                            isChecked={selectedWords.has(index)}
                                                            onChange={() => toggleWord(index)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </Td>
                                                    <Td fontFamily="'Noto Sans SC', sans-serif" fontSize="lg" fontWeight="bold">
                                                        {word.chinese}
                                                    </Td>
                                                    <Td color="brand.500">
                                                        {word.pinyin}
                                                    </Td>
                                                    <Td>{word.meaning}</Td>
                                                    <Td fontSize="sm" color="gray.600" maxW="200px" isTruncated>
                                                        {word.example || '-'}
                                                    </Td>
                                                    <Td>
                                                        <IconButton
                                                            icon={<Icon as={FiTrash2} />}
                                                            variant="ghost"
                                                            colorScheme="red"
                                                            size="xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeWord(index);
                                                            }}
                                                            aria-label="Xóa"
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        leftIcon={<Icon as={FiCheck} />}
                        colorScheme="brand"
                        onClick={handleSave}
                        isLoading={isSaving}
                        isDisabled={selectedWords.size === 0}
                    >
                        Thêm {selectedWords.size} từ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AIGenerateModal;
