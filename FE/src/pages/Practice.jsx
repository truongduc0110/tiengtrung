import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    Icon,
    SimpleGrid,
    Card,
    CardBody,
    Progress,
    Spinner,
    IconButton,
    useToast,
    Badge,
    Input,
    RadioGroup,
    Radio,
    Stack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Checkbox,
    Flex,
    Divider,
    Container,
    Tooltip,
} from '@chakra-ui/react';
import {
    FiArrowLeft, FiRotateCw, FiCheck, FiX, FiVolume2,
    FiSettings, FiPlay, FiGrid, FiList, FiCheckCircle
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabulariesAPI, activityAPI } from '../services/api';

const MotionBox = motion(Box);

const GAME_MODES = [
    { id: 'flashcard', name: 'Flashcard', icon: '🃏', description: 'Lật thẻ học từ', color: 'blue.500', bg: 'blue.50' },
    { id: 'quiz', name: 'Quiz', icon: '❓', description: 'Trắc nghiệm 4 đáp án', color: 'purple.500', bg: 'purple.50' },
    { id: 'listening', name: 'Luyện nghe', icon: '👂', description: 'Nghe và chọn từ', color: 'green.500', bg: 'green.50' },
    { id: 'typing', name: 'Gõ từ', icon: '⌨️', description: 'Gõ từ theo nghĩa', color: 'orange.500', bg: 'orange.50' },
    { id: 'matching', name: 'Nối từ', icon: '🔗', description: 'Nối từ vựng và nghĩa', color: 'pink.500', bg: 'pink.50' },
];

function Practice() {
    const { setId } = useParams();
    const [allVocabularies, setAllVocabularies] = useState([]);
    const [vocabularies, setVocabularies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gameMode, setGameMode] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [results, setResults] = useState([]);
    const [gameComplete, setGameComplete] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [quizOptions, setQuizOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    // Matching Game State
    const [matchingItems, setMatchingItems] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchedIds, setMatchedIds] = useState([]);

    // Settings State
    const [settings, setSettings] = useState({ count: 'all', mode: 'all' });

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchVocabularies();
    }, [setId]);

    const fetchVocabularies = async () => {
        try {
            const response = await vocabulariesAPI.getBySet(setId);
            const vocabs = response.data.data;
            setAllVocabularies(vocabs);
        } catch (error) {
            console.error('Failed to fetch vocabularies:', error);
            toast({
                title: 'Lỗi',
                description: 'Không thể tải danh sách từ vựng',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredVocabs = useMemo(() => {
        let vocabs = [...allVocabularies];
        if (settings.mode === 'unlearned') {
            vocabs = vocabs.filter(v => !v.isLearned);
        }
        return vocabs;
    }, [allVocabularies, settings.mode]);

    const previewVocabs = useMemo(() => {
        if (settings.count === 'all') return filteredVocabs;
        return filteredVocabs.slice(0, parseInt(settings.count));
    }, [filteredVocabs, settings.count]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameComplete || !gameMode) return;

            const current = vocabularies[currentIndex];

            if (gameMode === 'flashcard') {
                if (e.code === 'Space') {
                    e.preventDefault();
                    setShowAnswer((prev) => !prev);
                } else if (showAnswer) {
                    if (e.code === 'ArrowLeft') handleFlashcardAnswer(false);
                    if (e.code === 'ArrowRight') handleFlashcardAnswer(true);
                }
            }

            if (gameMode === 'quiz' || gameMode === 'listening') {
                if (['1', '2', '3', '4'].includes(e.key)) {
                    const index = parseInt(e.key) - 1;
                    if (quizOptions[index] && !showAnswer) {
                        setSelectedOption(quizOptions[index]);
                    }
                }
                if (e.code === 'Enter' && selectedOption && !showAnswer) {
                    if (gameMode === 'quiz') handleQuizAnswer();
                    else handleListeningAnswer();
                }
                if (gameMode === 'listening' && e.code === 'Space') {
                    e.preventDefault();
                    if (current) playAudio(current.chinese);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameMode, gameComplete, showAnswer, selectedOption, quizOptions, currentIndex, vocabularies]);

    const startGame = (mode) => {
        if (previewVocabs.length === 0) {
            toast({
                title: 'Không có từ vựng phù hợp',
                description: 'Vui lòng chọn chế độ khác hoặc thêm từ mới',
                status: 'warning',
            });
            return;
        }

        // Shuffle for the game
        const gameVocabs = [...previewVocabs].sort(() => Math.random() - 0.5);

        setGameMode(mode);
        setVocabularies(gameVocabs);
        setCurrentIndex(0);
        setResults([]);
        setGameComplete(false);
        setShowAnswer(false);
        setUserAnswer('');
        setMatchedIds([]);
        setSelectedMatch(null);

        if (mode === 'quiz' || mode === 'listening') {
            generateQuizOptions(0, gameVocabs);
        } else if (mode === 'matching') {
            generateMatchingGame(gameVocabs);
        }

        activityAPI.log();
    };

    const generateMatchingGame = (vocabs) => {
        let items = [];
        // Limit matching pairs to 8 for better UI (16 items grid) if list is too long
        const gameSet = vocabs.length > 8 ? vocabs.slice(0, 8) : vocabs;

        gameSet.forEach(v => {
            items.push({ id: `l-${v.id}`, content: v.chinese, type: 'chinese', vocabId: v.id });
            items.push({ id: `r-${v.id}`, content: v.meaning, type: 'meaning', vocabId: v.id });
        });
        setMatchingItems(items.sort(() => Math.random() - 0.5));
    };

    const playAudio = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
    };

    const generateQuizOptions = (index, vocabs = vocabularies) => {
        const current = vocabs[index];
        if (!current) return;

        // Ensure we pick random WRONG answers from the current GAME vocabularies first, 
        // fallback to allVocabularies if not enough
        let pool = vocabs.length >= 4 ? vocabs : allVocabularies;

        const wrongOptions = pool
            .filter((v) => v.id !== current.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((v) => v.meaning);

        // If still not enough (very rare edge case where total vocabs < 4), fill safely
        while (wrongOptions.length < 3 && wrongOptions.length < pool.length - 1) {
            wrongOptions.push("Đáp án khác"); // Fallback
        }

        const options = [...wrongOptions, current.meaning].sort(() => Math.random() - 0.5);
        setQuizOptions(options);
        setSelectedOption('');
    };

    const handleFlashcardAnswer = (correct) => {
        setResults([...results, { vocab: vocabularies[currentIndex], correct }]);
        nextQuestion();
    };

    const handleQuizAnswer = () => {
        const correct = selectedOption === vocabularies[currentIndex].meaning;
        setResults([...results, { vocab: vocabularies[currentIndex], correct }]);
        setShowAnswer(true);
        setTimeout(() => nextQuestion(), 1000);
    };

    const handleListeningAnswer = () => {
        const correct = selectedOption === vocabularies[currentIndex].meaning;
        setResults([...results, { vocab: vocabularies[currentIndex], correct }]);
        setShowAnswer(true);
        setTimeout(() => nextQuestion(), 1000);
    };

    const handleMatchingClick = (item) => {
        if (matchedIds.includes(item.id)) return;

        if (!selectedMatch) {
            setSelectedMatch(item);
        } else {
            if (selectedMatch.id === item.id) {
                setSelectedMatch(null);
                return;
            }

            if (selectedMatch.vocabId === item.vocabId && selectedMatch.type !== item.type) {
                const newMatched = [...matchedIds, selectedMatch.id, item.id];
                setMatchedIds(newMatched);
                setSelectedMatch(null);

                if (newMatched.length === matchingItems.length) {
                    setResults(vocabularies.map(v => ({ vocab: v, correct: true })));
                    setGameComplete(true);
                }
            } else {
                toast({ title: 'Chưa chính xác', status: 'error', duration: 500 });
                setSelectedMatch(null);
            }
        }
    };

    const handleTypingAnswer = () => {
        const current = vocabularies[currentIndex];
        const normalizedUser = userAnswer.toLowerCase().trim();
        const normalizedChinese = current.chinese.toLowerCase();
        const normalizedPinyin = current.pinyin?.toLowerCase() || '';

        const correct = normalizedUser === normalizedChinese || normalizedUser === normalizedPinyin;
        setResults([...results, { vocab: current, correct }]);
        setShowAnswer(true);
        setTimeout(() => nextQuestion(), 1500);
    };

    const nextQuestion = () => {
        if (currentIndex + 1 >= vocabularies.length) {
            setGameComplete(true);
        } else {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
            setUserAnswer('');
            if (gameMode === 'quiz' || gameMode === 'listening') {
                generateQuizOptions(currentIndex + 1);
            }
        }
    };

    const resetGame = () => {
        setGameMode(null);
        // Maybe refresh vocabs? No, keep context
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Box>
        );
    }

    if (allVocabularies.length === 0) {
        return (
            <Container centerContent py={20}>
                <VStack spacing={6}>
                    <Text fontSize="6xl">📭</Text>
                    <Heading size="md" textAlign="center">Bộ từ vựng này chưa có từ nào</Heading>
                    <Button onClick={() => navigate(-1)} variant="outline">Quay lại</Button>
                </VStack>
            </Container>
        );
    }

    // DASHBOARD VIEW (Default)
    if (!gameMode) {
        return (
            <Container maxW="container.xl" py={8}>
                {/* Header */}
                <HStack mb={8} justify="space-between">
                    <HStack>
                        <IconButton
                            icon={<FiArrowLeft />}
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            aria-label="Back"
                            fontSize="xl"
                        />
                        <VStack align="start" spacing={0}>
                            <Heading size="lg">Trung tâm Luyện tập</Heading>
                            <Text color="gray.500">Chọn từ vựng và chế độ để bắt đầu</Text>
                        </VStack>
                    </HStack>
                </HStack>

                <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
                    {/* Left Column: List & Filters */}
                    <Box flex="2">
                        <Card variant="outline" mb={6} borderRadius="xl" overflow="hidden">
                            <Box bg="gray.50" p={4} borderBottom="1px" borderColor="gray.100">
                                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                    <HStack spacing={4}>
                                        <HStack>
                                            <Icon as={FiSettings} color="gray.500" />
                                            <Text fontWeight="bold">Bộ lọc:</Text>
                                        </HStack>
                                        <RadioGroup
                                            value={settings.mode}
                                            onChange={(val) => setSettings({ ...settings, mode: val })}
                                        >
                                            <HStack spacing={4}>
                                                <Radio value="all">Tất cả ({allVocabularies.length})</Radio>
                                                <Radio value="unlearned">Chưa thuộc ({allVocabularies.filter(v => !v.isLearned).length})</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </HStack>

                                    <HStack>
                                        <Text fontSize="sm" color="gray.600">Hiển thị:</Text>
                                        <RadioGroup
                                            value={settings.count}
                                            onChange={(val) => setSettings({ ...settings, count: val })}
                                        >
                                            <HStack spacing={2}>
                                                <Radio value="5">5</Radio>
                                                <Radio value="10">10</Radio>
                                                <Radio value="20">20</Radio>
                                                <Radio value="all">Tất cả</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </HStack>
                                </Flex>
                            </Box>

                            <Box maxH="600px" overflowY="auto">
                                <TableContainer>
                                    <Table variant="simple" size="md">
                                        <Thead position="sticky" top={0} bg="white" zIndex={1}>
                                            <Tr>
                                                <Th>Từ vựng</Th>
                                                <Th>Phiên âm</Th>
                                                <Th>Nghĩa</Th>
                                                <Th textAlign="center">Trạng thái</Th>
                                                <Th></Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {previewVocabs.map((vocab) => (
                                                <Tr key={vocab.id} _hover={{ bg: 'gray.50' }}>
                                                    <Td fontWeight="bold" fontSize="lg" fontFamily="'Noto Sans SC'">{vocab.chinese}</Td>
                                                    <Td color="gray.600">{vocab.pinyin}</Td>
                                                    <Td>{vocab.meaning}</Td>
                                                    <Td textAlign="center">
                                                        {vocab.isLearned ? (
                                                            <Badge colorScheme="green">Đã thuộc</Badge>
                                                        ) : (
                                                            <Badge colorScheme="gray">Chưa thuộc</Badge>
                                                        )}
                                                    </Td>
                                                    <Td>
                                                        <IconButton
                                                            icon={<FiVolume2 />}
                                                            size="sm"
                                                            variant="ghost"
                                                            colorScheme="brand"
                                                            onClick={() => playAudio(vocab.chinese)}
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                            {previewVocabs.length === 0 && (
                                                <Tr>
                                                    <Td colSpan={5} textAlign="center" py={8} color="gray.500">
                                                        Không tìm thấy từ vựng nào theo bộ lọc
                                                    </Td>
                                                </Tr>
                                            )}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            <Box p={3} bg="gray.50" borderTop="1px" borderColor="gray.100" textAlign="right">
                                <Text fontSize="sm" color="gray.500">
                                    Đang hiển thị {previewVocabs.length} từ vựng sẽ được dùng trong game
                                </Text>
                            </Box>
                        </Card>
                    </Box>

                    {/* Right Column: Game Modes */}
                    <Box flex="1" minW="300px">
                        <Card position="sticky" top="20px" borderRadius="xl" boxShadow="sm">
                            <CardBody>
                                <Heading size="md" mb={4}>Chọn chế độ chơi</Heading>
                                <VStack spacing={3} align="stretch">
                                    {GAME_MODES.map((mode) => (
                                        <Button
                                            key={mode.id}
                                            h="auto"
                                            py={4}
                                            justifyContent="flex-start"
                                            variant="ghost"
                                            bg={mode.bg}
                                            color={mode.color}
                                            _hover={{ bg: mode.bg, transform: 'translateX(5px)', shadow: 'sm' }}
                                            onClick={() => startGame(mode.id)}
                                            leftIcon={<Text fontSize="2xl">{mode.icon}</Text>}
                                            isDisabled={previewVocabs.length === 0}
                                        >
                                            <VStack align="start" spacing={0}>
                                                <Text fontWeight="bold">{mode.name}</Text>
                                                <Text fontSize="xs" color="gray.500" fontWeight="normal">{mode.description}</Text>
                                            </VStack>
                                        </Button>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                </Flex>
            </Container>
        );
    }

    // ... GAME LOGIC RENDERERS (Flashcard, Quiz, etc.) ...
    // Since I cannot rewrite the entire file's bottom part without context and code duplication, 
    // I will assume the rest of the render logic needs to be preserved.
    // However, I am using write_to_file which OVERWRITES. 
    // So I MUST include the rest of the file content. 

    // ... [Copying the rest of the game components from previous view_file] ...

    // Game Complete
    if (gameComplete) {
        const correctCount = results.filter((r) => r.correct).length;
        const percentage = Math.round((correctCount / results.length) * 100);

        return (
            <Box maxW="600px" mx="auto" textAlign="center" py={10}>
                <Text fontSize="6xl" mb={4}>
                    {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
                </Text>
                <Heading size="xl" mb={4}>Hoàn thành!</Heading>
                <Text fontSize="2xl" mb={6}>
                    {correctCount}/{results.length} câu đúng ({percentage}%)
                </Text>

                <Progress
                    value={percentage}
                    colorScheme={percentage >= 80 ? 'green' : percentage >= 50 ? 'yellow' : 'red'}
                    size="lg"
                    borderRadius="full"
                    mb={8}
                />

                <HStack justify="center" spacing={4}>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                    <Button
                        colorScheme="brand"
                        leftIcon={<FiRotateCw />}
                        onClick={resetGame}
                    >
                        Học lại
                    </Button>
                </HStack>

                {/* Wrong answers */}
                {results.filter((r) => !r.correct).length > 0 && (
                    <Box mt={8} textAlign="left">
                        <Heading size="sm" mb={4}>Từ cần ôn lại:</Heading>
                        <VStack spacing={2}>
                            {results
                                .filter((r) => !r.correct)
                                .map((r, i) => (
                                    <HStack
                                        key={i}
                                        w="full"
                                        p={3}
                                        bg="red.50"
                                        borderRadius="lg"
                                        justify="space-between"
                                    >
                                        <Text fontWeight="bold" fontFamily="'Noto Sans SC'">{r.vocab.chinese}</Text>
                                        <Text color="gray.600">{r.vocab.meaning}</Text>
                                    </HStack>
                                ))}
                        </VStack>
                    </Box>
                )}
            </Box>
        );
    }

    const current = vocabularies[currentIndex];
    const progress = ((currentIndex + 1) / vocabularies.length) * 100;

    // Flashcard Mode
    if (gameMode === 'flashcard') {
        return (
            <Box maxW="500px" mx="auto" pt={10}>
                <HStack mb={6}>
                    <IconButton
                        icon={<FiArrowLeft />}
                        variant="ghost"
                        onClick={resetGame}
                        aria-label="Quay lại"
                    />
                    <Progress value={progress} flex={1} colorScheme="brand" borderRadius="full" hasStripe isAnimated />
                    <Badge colorScheme="brand" variant="solid" borderRadius="full" px={2}>{currentIndex + 1}/{vocabularies.length}</Badge>
                </HStack>

                <AnimatePresence mode="wait">
                    <MotionBox
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50, rotateY: -90 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -50, rotateY: 90 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card
                            minH="350px"
                            cursor="pointer"
                            onClick={() => setShowAnswer(!showAnswer)}
                            bg={showAnswer ? 'brand.50' : 'white'}
                            transition="all 0.3s"
                            boxShadow="2xl"
                            borderRadius="2xl"
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            <CardBody
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                p={8}
                            >
                                {!showAnswer ? (
                                    <>
                                        <Text fontSize="6xl" fontWeight="bold" fontFamily="'Noto Sans SC'" mb={6} color="gray.800">
                                            {current.chinese}
                                        </Text>
                                        <Text color="brand.500" fontSize="2xl" fontWeight="medium">{current.pinyin}</Text>
                                        <Text color="gray.400" fontSize="sm" mt={8} fontStyle="italic">Chạm để lật thẻ</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text fontSize="3xl" mb={4} fontWeight="bold" color="gray.800">{current.meaning}</Text>
                                        {current.example && (
                                            <Box bg="whiteAlpha.500" p={4} borderRadius="lg" w="full">
                                                <Text color="gray.600" fontSize="md">
                                                    "{current.example}"
                                                </Text>
                                            </Box>
                                        )}
                                        <IconButton
                                            icon={<FiVolume2 />}
                                            isRound
                                            size="lg"
                                            mt={6}
                                            onClick={(e) => { e.stopPropagation(); playAudio(current.chinese); }}
                                            colorScheme="brand"
                                            variant="ghost"
                                        />
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </MotionBox>
                </AnimatePresence>

                {showAnswer && (
                    <HStack justify="center" spacing={6} mt={10}>
                        <Button
                            size="lg"
                            colorScheme="red"
                            variant="outline"
                            leftIcon={<FiX />}
                            onClick={() => handleFlashcardAnswer(false)}
                            w="150px"
                            height="60px"
                            borderRadius="xl"
                        >
                            Quên
                        </Button>
                        <Button
                            size="lg"
                            colorScheme="green"
                            leftIcon={<FiCheck />}
                            onClick={() => handleFlashcardAnswer(true)}
                            w="150px"
                            height="60px"
                            borderRadius="xl"
                            boxShadow="lg"
                        >
                            Đã nhớ
                        </Button>
                    </HStack>
                )}
            </Box>
        );
    }

    // Quiz Mode
    if (gameMode === 'quiz') {
        return (
            <Box maxW="600px" mx="auto" pt={10}>
                <HStack mb={8}>
                    <IconButton
                        icon={<FiArrowLeft />}
                        variant="ghost"
                        onClick={resetGame}
                        aria-label="Quay lại"
                    />
                    <Progress value={progress} flex={1} colorScheme="brand" borderRadius="full" hasStripe isAnimated />
                    <Badge colorScheme="purple">{currentIndex + 1}/{vocabularies.length}</Badge>
                </HStack>

                <Card mb={8} borderRadius="2xl" boxShadow="xl">
                    <CardBody textAlign="center" py={10}>
                        <Text fontSize="5xl" fontWeight="bold" fontFamily="'Noto Sans SC'" mb={4}>
                            {current.chinese}
                        </Text>
                        <Text color="brand.500" fontSize="xl">{current.pinyin}</Text>
                    </CardBody>
                    <IconButton
                        aria-label="Play audio"
                        icon={<FiVolume2 />}
                        position="absolute"
                        top={4}
                        right={4}
                        isRound
                        onClick={() => playAudio(current.chinese)}
                    />
                </Card>

                <SimpleGrid columns={1} spacing={4}>
                    {quizOptions.map((option, i) => {
                        const isCorrect = option === current.meaning;
                        const isSelected = selectedOption === option;
                        let bg = 'white';
                        let borderColor = 'gray.200';

                        if (showAnswer) {
                            if (isCorrect) { bg = 'green.50'; borderColor = 'green.500'; }
                            else if (isSelected && !isCorrect) { bg = 'red.50'; borderColor = 'red.500'; }
                        } else if (isSelected) {
                            bg = 'brand.50';
                            borderColor = 'brand.500';
                        }

                        return (
                            <Box
                                key={i}
                                p={5}
                                bg={bg}
                                borderRadius="xl"
                                border="2px solid"
                                borderColor={borderColor}
                                cursor={showAnswer ? 'default' : 'pointer'}
                                transition="all 0.2s"
                                onClick={() => !showAnswer && setSelectedOption(option)}
                                _hover={!showAnswer ? { borderColor: 'brand.400', transform: 'translateY(-2px)', shadow: 'md' } : {}}
                                position="relative"
                            >
                                <HStack>
                                    <Badge borderRadius="full" px={2} mr={3} colorScheme="gray">{i + 1}</Badge>
                                    <Text fontSize="lg" fontWeight="medium">{option}</Text>
                                    {showAnswer && isCorrect && (
                                        <Icon as={FiCheckCircle} color="green.500" ml="auto" fontSize="xl" />
                                    )}
                                </HStack>
                            </Box>
                        );
                    })}
                </SimpleGrid>

                {selectedOption && !showAnswer && (
                    <Button
                        mt={8}
                        w="full"
                        colorScheme="brand"
                        size="lg"
                        height="60px"
                        borderRadius="xl"
                        onClick={handleQuizAnswer}
                        boxShadow="lg"
                    >
                        Kiểm tra
                    </Button>
                )}
            </Box>
        );
    }

    // Listening Mode
    if (gameMode === 'listening') {
        if (!current) return null;
        return (
            <Box maxW="600px" mx="auto" pt={10}>
                <HStack mb={8}>
                    <IconButton
                        icon={<FiArrowLeft />}
                        variant="ghost"
                        onClick={resetGame}
                        aria-label="Quay lại"
                    />
                    <Progress value={progress} flex={1} colorScheme="green" borderRadius="full" hasStripe isAnimated />
                    <Badge colorScheme="green">{currentIndex + 1}/{vocabularies.length}</Badge>
                </HStack>

                <Card mb={8} borderRadius="2xl" boxShadow="xl">
                    <CardBody textAlign="center" py={16}>
                        <VStack spacing={6}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton
                                    icon={<Icon as={FiVolume2} boxSize={10} />}
                                    colorScheme="brand"
                                    size="lg"
                                    isRound
                                    w="100px"
                                    h="100px"
                                    onClick={() => playAudio(current.chinese)}
                                    boxShadow="lg"
                                />
                            </motion.div>
                            <Text color="gray.500" fontSize="md">Nhấn vào loa để nghe phát âm</Text>
                        </VStack>
                    </CardBody>
                </Card>

                <SimpleGrid columns={1} spacing={4}>
                    {quizOptions.map((option, i) => {
                        const isCorrect = option === current.meaning;
                        const isSelected = selectedOption === option;
                        let bg = 'white';
                        let borderColor = 'gray.200';

                        if (showAnswer) {
                            if (isCorrect) { bg = 'green.50'; borderColor = 'green.500'; }
                            else if (isSelected && !isCorrect) { bg = 'red.50'; borderColor = 'red.500'; }
                        } else if (isSelected) {
                            bg = 'brand.50';
                            borderColor = 'brand.500';
                        }

                        return (
                            <Box
                                key={i}
                                p={5}
                                bg={bg}
                                borderRadius="xl"
                                border="2px solid"
                                borderColor={borderColor}
                                cursor={showAnswer ? 'default' : 'pointer'}
                                transition="all 0.2s"
                                onClick={() => {
                                    if (!showAnswer) {
                                        setSelectedOption(option);
                                        playAudio(current.chinese);
                                    }
                                }}
                                _hover={!showAnswer ? { borderColor: 'brand.400', transform: 'translateY(-2px)', shadow: 'md' } : {}}
                            >
                                <HStack>
                                    <Badge borderRadius="full" px={2} mr={3} colorScheme="gray">{i + 1}</Badge>
                                    <Text fontSize="lg" fontWeight="medium">{option}</Text>
                                </HStack>
                            </Box>
                        );
                    })}
                </SimpleGrid>

                {selectedOption && !showAnswer && (
                    <Button
                        mt={8}
                        w="full"
                        colorScheme="brand"
                        size="lg"
                        height="60px"
                        borderRadius="xl"
                        onClick={handleListeningAnswer}
                        boxShadow="lg"
                    >
                        Kiểm tra
                    </Button>
                )}
            </Box>
        );
    }

    // Matching Mode
    if (gameMode === 'matching') {
        return (
            <Box maxW="1000px" mx="auto" pt={6}>
                <HStack mb={8}>
                    <IconButton
                        icon={<FiArrowLeft />}
                        variant="ghost"
                        onClick={resetGame}
                        aria-label="Quay lại"
                    />
                    <Heading size="md" flex={1} textAlign="center">Nối từ vựng</Heading>
                    <Badge colorScheme="brand" fontSize="xl" borderRadius="lg" px={3} py={1}>
                        {Math.floor(matchedIds.length / 2)}/{matchingItems.length / 2}
                    </Badge>
                </HStack>

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    {matchingItems.map((item) => {
                        const isSelected = selectedMatch?.id === item.id;
                        const isMatched = matchedIds.includes(item.id);
                        return (
                            <motion.div
                                key={item.id}
                                whileHover={!isMatched ? { scale: 1.05 } : {}}
                                whileTap={!isMatched ? { scale: 0.95 } : {}}
                            >
                                <Card
                                    cursor={isMatched ? 'default' : 'pointer'}
                                    onClick={() => !isMatched && handleMatchingClick(item)}
                                    bg={isMatched ? 'green.100' : isSelected ? 'brand.100' : 'white'}
                                    borderColor={isSelected ? 'brand.500' : 'transparent'}
                                    borderWidth="2px"
                                    opacity={isMatched ? 0.6 : 1}
                                    boxShadow={isSelected ? 'lg' : 'sm'}
                                    h="120px"
                                    borderRadius="xl"
                                >
                                    <CardBody p={2} display="flex" alignItems="center" justifyContent="center" textAlign="center">
                                        <Text fontWeight="bold" fontSize={item.type === 'chinese' ? '2xl' : 'md'} fontFamily={item.type === 'chinese' ? "'Noto Sans SC'" : 'inherit'}>
                                            {item.content}
                                        </Text>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        )
                    })}
                </SimpleGrid>
            </Box>
        );
    }

    // Typing Mode
    if (gameMode === 'typing') {
        const isCorrect =
            userAnswer.toLowerCase().trim() === current.chinese.toLowerCase() ||
            userAnswer.toLowerCase().trim() === current.pinyin?.toLowerCase();

        return (
            <Box maxW="600px" mx="auto" pt={10}>
                <HStack mb={8}>
                    <IconButton
                        icon={<FiArrowLeft />}
                        variant="ghost"
                        onClick={resetGame}
                        aria-label="Quay lại"
                    />
                    <Progress value={progress} flex={1} colorScheme="brand" borderRadius="full" hasStripe isAnimated />
                    <Badge>{currentIndex + 1}/{vocabularies.length}</Badge>
                </HStack>

                <Card mb={8} borderRadius="2xl" boxShadow="xl">
                    <CardBody textAlign="center" py={12}>
                        <Text fontSize="3xl" fontWeight="bold" mb={4} color="gray.800">
                            {current.meaning}
                        </Text>
                        <Text color="gray.500">Gõ chữ Hán hoặc Pinyin tương ứng</Text>
                    </CardBody>
                </Card>

                <Input
                    size="lg"
                    placeholder="Nhập câu trả lời..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    isDisabled={showAnswer}
                    bg={showAnswer ? (isCorrect ? 'green.50' : 'red.50') : 'white'}
                    textAlign="center"
                    fontSize="2xl"
                    h="60px"
                    borderRadius="xl"
                    onKeyPress={(e) => e.key === 'Enter' && !showAnswer && handleTypingAnswer()}
                    boxShadow="sm"
                />

                {showAnswer && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Box mt={6} p={6} bg={isCorrect ? 'green.50' : 'red.50'} borderRadius="xl" textAlign="center" border="1px dashed" borderColor={isCorrect ? 'green.200' : 'red.200'}>
                            <HStack justify="center" mb={2}>
                                <Icon as={isCorrect ? FiCheckCircle : FiX} color={isCorrect ? 'green.500' : 'red.500'} fontSize="2xl" />
                                <Text fontWeight="bold" fontSize="xl" color={isCorrect ? 'green.600' : 'red.600'}>
                                    {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                                </Text>
                            </HStack>
                            {!isCorrect && (
                                <Box mt={2}>
                                    <Text color="gray.600">Đáp án đúng là:</Text>
                                    <Text fontSize="2xl" fontWeight="bold" fontFamily="'Noto Sans SC'" mt={1}>
                                        {current.chinese}
                                    </Text>
                                    <Text color="gray.500">{current.pinyin}</Text>
                                </Box>
                            )}
                        </Box>
                    </motion.div>
                )}

                {!showAnswer && (
                    <Button
                        mt={8}
                        w="full"
                        colorScheme="brand"
                        size="lg"
                        height="60px"
                        borderRadius="xl"
                        onClick={handleTypingAnswer}
                        isDisabled={!userAnswer.trim()}
                        boxShadow="lg"
                    >
                        Kiểm tra
                    </Button>
                )}
            </Box>
        );
    }

    return null;
}

export default Practice;
