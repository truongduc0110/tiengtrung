import { useState, useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Textarea,
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
    Alert,
    AlertIcon,
    Badge,
    Spinner,
} from '@chakra-ui/react';
import { FiTrash2, FiRefreshCw, FiUpload, FiFile } from 'react-icons/fi';
import { vocabulariesAPI, aiAPI } from '../services/api';
import * as XLSX from 'xlsx';

function BulkAddModal({ isOpen, onClose, setId, onSuccess }) {
    const [rawText, setRawText] = useState('');
    const [parsedWords, setParsedWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggestingPinyin, setIsSuggestingPinyin] = useState(false);
    const toast = useToast();
    const fileInputRef = useRef(null);

    // Xử lý upload file Excel/CSV
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Array of arrays

                // Convert to parsedWords
                // Bỏ qua header nếu dòng đầu tiên là header (check if meaning or pinyin etc)
                // Tuy nhiên ta cứ map hết, user có thể xóa dòng header nếu không cần
                // Hoặc check valid để lọc
                const newWords = data
                    .filter(row => row.length >= 2) // Ít nhất có 2 cột
                    .map((row, index) => {
                        // Xử lý row data: [Chinese, Pinyin, Meaning, Example]
                        // Handle trường hợp user chỉ có [Chinese, Meaning] -> row[1] sẽ là meaning
                        // Logic: Nếu row[1] chứa ký tự latin/pinyin tone -> Pinyin. Nếu không -> Meaning.

                        let chinese = row[0] ? String(row[0]).trim() : '';
                        let pinyin = '';
                        let meaning = '';
                        let example = '';

                        if (row[1]) {
                            // Check if column 2 looks like pinyin? Difficult.
                            // Assume standard format: Chinese, Pinyin, Meaning, Example
                            pinyin = String(row[1]).trim();
                        }
                        if (row[2]) meaning = String(row[2]).trim();
                        if (row[3]) example = String(row[3]).trim();

                        // Fallback logic nếu 2 cột:
                        // Nếu cột 2 là meaning (ko có pinyin)
                        // Thường ta yêu cầu tuân thủ Chinese | Pinyin | Meaning
                        // Nếu người dùng import file, họ nên follow template

                        return {
                            id: Date.now() + index,
                            chinese,
                            pinyin,
                            meaning,
                            example,
                            isValid: !!(chinese && (meaning || pinyin)), // Tạm chấp nhận
                        };
                    })
                    .filter(w => w.chinese); // Lọc dòng trắng

                setParsedWords(prev => [...prev, ...newWords]);
                toast({
                    title: `Đã import ${newWords.length} dòng`,
                    status: 'success',
                });
            } catch (error) {
                console.error("Error reading file:", error);
                toast({
                    title: 'Lỗi đọc file',
                    description: 'Vui lòng kiểm tra định dạng file',
                    status: 'error',
                });
            }
        };
        reader.readAsBinaryString(file);

        // Reset input để chọn lại file cùng tên nếu cần
        e.target.value = '';
    };

    // Parse raw text vào danh sách từ
    // Format: chữ Hán | pinyin | nghĩa | ví dụ (mỗi dòng một từ)
    const parseText = () => {
        const lines = rawText.trim().split('\n').filter(line => line.trim());
        const words = lines.map((line, index) => {
            const parts = line.split('|').map(p => p.trim());
            return {
                id: index,
                chinese: parts[0] || '',
                pinyin: parts[1] || '',
                meaning: parts[2] || '',
                example: parts[3] || '',
                isValid: !!(parts[0] && parts[2]), // Cần ít nhất chữ Hán và nghĩa
            };
        });
        setParsedWords(words);
    };

    // Gợi ý pinyin từ AI cho các từ chưa có pinyin
    const suggestPinyin = async () => {
        const wordsNeedPinyin = parsedWords.filter(w => w.chinese && !w.pinyin);
        if (wordsNeedPinyin.length === 0) {
            toast({
                title: 'Tất cả từ đã có pinyin',
                status: 'info',
                duration: 2000,
            });
            return;
        }

        setIsSuggestingPinyin(true);
        try {
            const updatedWords = [...parsedWords];
            for (const word of wordsNeedPinyin) {
                try {
                    const response = await aiAPI.suggestPinyin(word.chinese);
                    const index = updatedWords.findIndex(w => w.id === word.id);
                    if (index !== -1) {
                        updatedWords[index].pinyin = response.data.data.pinyin;
                    }
                } catch (err) {
                    console.error(`Failed to get pinyin for ${word.chinese}:`, err);
                }
            }
            setParsedWords(updatedWords);
            toast({
                title: 'Đã gợi ý pinyin!',
                status: 'success',
                duration: 2000,
            });
        } catch (error) {
            toast({
                title: 'Lỗi khi gợi ý pinyin',
                status: 'error',
                duration: 2000,
            });
        } finally {
            setIsSuggestingPinyin(false);
        }
    };

    // Xóa một từ khỏi danh sách
    const removeWord = (id) => {
        setParsedWords(prev => prev.filter(w => w.id !== id));
    };

    // Thêm tất cả từ vào bộ từ
    const handleSave = async () => {
        const validWords = parsedWords.filter(w => w.isValid);
        if (validWords.length === 0) {
            toast({
                title: 'Không có từ hợp lệ',
                description: 'Cần ít nhất chữ Hán và nghĩa',
                status: 'warning',
                duration: 2000,
            });
            return;
        }

        setIsLoading(true);
        try {
            const wordsToCreate = validWords.map(w => ({
                chinese: w.chinese,
                pinyin: w.pinyin,
                meaning: w.meaning,
                example: w.example,
                vocabularySetId: parseInt(setId),
            }));

            await vocabulariesAPI.createBulk(wordsToCreate);

            toast({
                title: `Đã thêm ${validWords.length} từ!`,
                status: 'success',
                duration: 2000,
            });

            // Reset state và đóng modal
            setRawText('');
            setParsedWords([]);
            onSuccess?.();
            onClose();
        } catch (error) {
            toast({
                title: 'Lỗi khi thêm từ',
                description: error.response?.data?.message || 'Vui lòng thử lại',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const validCount = parsedWords.filter(w => w.isValid).length;
    const invalidCount = parsedWords.length - validCount;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Thêm nhiều từ</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {/* Hướng dẫn */}
                        <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">
                                Nhập mỗi từ một dòng theo format: <strong>chữ Hán | pinyin | nghĩa | ví dụ</strong>
                                <br />
                                Ví dụ: 你好 | nǐ hǎo | Xin chào | 你好，很高兴认识你
                            </Text>
                        </Alert>

                        {/* Input area */}
                        <Textarea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder={`你好 | nǐ hǎo | Xin chào | 你好，很高兴认识你
谢谢 | xiè xiè | Cảm ơn | 谢谢你的帮助
再见 | zài jiàn | Tạm biệt | 明天见，再见`}
                            rows={6}
                            fontFamily="'Noto Sans SC', monospace"
                        />

                        <HStack justify="space-between">
                            <HStack>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                                <Button
                                    leftIcon={<Icon as={FiUpload} />}
                                    colorScheme="brand"
                                    onClick={parseText}
                                    isDisabled={!rawText.trim()}
                                >
                                    Phân tích từ text
                                </Button>
                                <Button
                                    leftIcon={<Icon as={FiFile} />}
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Import Excel/CSV
                                </Button>
                            </HStack>
                            {parsedWords.length > 0 && (
                                <HStack spacing={2}>
                                    <Badge colorScheme="green">{validCount} hợp lệ</Badge>
                                    {invalidCount > 0 && (
                                        <Badge colorScheme="red">{invalidCount} thiếu thông tin</Badge>
                                    )}
                                </HStack>
                            )}
                        </HStack>

                        {/* Preview table */}
                        {parsedWords.length > 0 && (
                            <Box>
                                <HStack mb={2} justify="space-between">
                                    <Text fontWeight="bold">Xem trước ({parsedWords.length} từ)</Text>
                                    <Button
                                        size="sm"
                                        leftIcon={isSuggestingPinyin ? <Spinner size="xs" /> : <Icon as={FiRefreshCw} />}
                                        onClick={suggestPinyin}
                                        isLoading={isSuggestingPinyin}
                                        loadingText="Đang gợi ý..."
                                    >
                                        Gợi ý Pinyin (AI)
                                    </Button>
                                </HStack>
                                <Box maxH="300px" overflowY="auto" borderWidth="1px" borderRadius="md">
                                    <Table size="sm">
                                        <Thead bg="gray.50" position="sticky" top={0}>
                                            <Tr>
                                                <Th>Chữ Hán</Th>
                                                <Th>Pinyin</Th>
                                                <Th>Nghĩa</Th>
                                                <Th>Ví dụ</Th>
                                                <Th w="50px"></Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {parsedWords.map((word) => (
                                                <Tr
                                                    key={word.id}
                                                    bg={word.isValid ? 'white' : 'red.50'}
                                                >
                                                    <Td fontFamily="'Noto Sans SC', sans-serif" fontSize="lg">
                                                        {word.chinese || <Text color="gray.400">-</Text>}
                                                    </Td>
                                                    <Td color="brand.500">
                                                        {word.pinyin || <Text color="gray.400">-</Text>}
                                                    </Td>
                                                    <Td>
                                                        {word.meaning || <Text color="gray.400">-</Text>}
                                                    </Td>
                                                    <Td fontSize="sm" color="gray.600">
                                                        {word.example || '-'}
                                                    </Td>
                                                    <Td>
                                                        <IconButton
                                                            icon={<Icon as={FiTrash2} />}
                                                            variant="ghost"
                                                            colorScheme="red"
                                                            size="xs"
                                                            onClick={() => removeWord(word.id)}
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
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        colorScheme="brand"
                        onClick={handleSave}
                        isLoading={isLoading}
                        isDisabled={validCount === 0}
                    >
                        Thêm {validCount} từ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default BulkAddModal;
