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
    Flex,
    Container,
    useColorModeValue,
    RadioGroup,
    Radio,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';
import {
    FiArrowLeft, FiRotateCw, FiCheck, FiX, FiVolume2,
    FiSettings, FiPlay, FiCheckCircle
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabulariesAPI, activityAPI, ttsAPI } from '../services/api';

const MotionBox = motion(Box);

const GAME_MODES = [
    { id: 'flashcard', name: 'Flashcard', icon: '🃏', description: 'Lật thẻ học từ', color: 'blue.500', bg: 'blue.50', gradient: 'linear(to-br, blue.400, purple.500)' },
    { id: 'quiz', name: 'Quiz', icon: '❓', description: 'Trắc nghiệm 4 đáp án', color: 'purple.500', bg: 'purple.50', gradient: 'linear(to-br, purple.400, pink.500)' },
    { id: 'listening', name: 'Luyện nghe', icon: '👂', description: 'Nghe và chọn từ', color: 'green.500', bg: 'green.50', gradient: 'linear(to-br, green.400, teal.500)' },
    // { id: 'typing', name: 'Gõ từ', icon: '⌨️', description: 'Gõ từ theo nghĩa', color: 'orange.500', bg: 'orange.50' },
    // { id: 'matching', name: 'Nối từ', icon: '🔗', description: 'Nối từ vựng và nghĩa', color: 'pink.500', bg: 'pink.50' },
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
    const [quizOptions, setQuizOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [settings, setSettings] = useState({ count: 'all', mode: 'all' });

    const navigate = useNavigate();
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        fetchVocabularies();
    }, [setId]);

    const fetchVocabularies = async () => {
        try {
            const response = await vocabulariesAPI.getBySet(setId);
            setAllVocabularies(response.data.data);
        } catch (error) {
            console.error('Failed to fetch vocabularies:', error);
            toast({ title: 'Lỗi', description: 'Không thể tải danh sách từ vựng', status: 'error' });
        } finally {
            setLoading(false);
        }
    };

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

    // Keyboard handling
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

            if ((gameMode === 'quiz' || gameMode === 'listening')) {
                if (['1', '2', '3', '4'].includes(e.key)) {
                    const index = parseInt(e.key) - 1;
                    if (quizOptions[index] && !showAnswer) {
                        setSelectedOption(quizOptions[index]);
                    }
                }
                if (e.code === 'Enter' && selectedOption && !showAnswer) {
                    handleQuizAnswer();
                }
                if (gameMode === 'listening' && e.code === 'Space') {
                    e.preventDefault();
                    if (current) playAudio(current.word);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameMode, gameComplete, showAnswer, selectedOption, quizOptions, currentIndex, vocabularies]);

    const startGame = (mode) => {
        if (previewVocabs.length === 0) {
            toast({ title: 'Không có từ vựng', description: 'Vui lòng chọn chế độ khác', status: 'warning' });
            return;
        }
        const gameVocabs = [...previewVocabs].sort(() => Math.random() - 0.5);
        setGameMode(mode);
        setVocabularies(gameVocabs);
        setCurrentIndex(0);
        setResults([]);
        setGameComplete(false);
        setShowAnswer(false);

        if (mode === 'quiz' || mode === 'listening') {
            generateQuizOptions(0, gameVocabs);
        }
        activityAPI.log();
    };

    const playAudio = async (text) => {
        try {
            await ttsAPI.speak(text);
        } catch (e) {
            console.error(e);
        }
    };

    const generateQuizOptions = (index, vocabs = vocabularies) => {
        const current = vocabs[index];
        if (!current) return;

        let pool = vocabs.length >= 4 ? vocabs : allVocabularies;
        const wrongOptions = pool
            .filter((v) => v.id !== current.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((v) => v.meaning);

        while (wrongOptions.length < 3 && wrongOptions.length < pool.length - 1) {
            wrongOptions.push("Đáp án khác");
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

    const nextQuestion = () => {
        if (currentIndex + 1 >= vocabularies.length) {
            setGameComplete(true);
        } else {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
            if (gameMode === 'quiz' || gameMode === 'listening') {
                generateQuizOptions(currentIndex + 1);
            }
        }
    };

    const resetGame = () => {
        setGameMode(null);
    };

    if (loading) return <Flex justify="center" align="center" minH="50vh"><Spinner size="xl" color="brand.500" /></Flex>;
    if (allVocabularies.length === 0) return <Container centerContent py={20}><Text fontSize="4xl">📭</Text><Button onClick={() => navigate(-1)}>Quay lại</Button></Container>;

    // Dashboard View
    if (!gameMode) {
        return (
            <Container maxW="container.xl" py={8}>
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
                    <IconButton icon={<Icon as={FiArrowLeft} color="white" />} position="absolute" top={4} left={4} variant="ghost" onClick={() => navigate(-1)} />
                    <VStack spacing={2} pt={4}>
                        <Text fontSize="6xl">🎮</Text>
                        <Heading size="xl" fontFamily="heading">Trung tâm Luyện tập</Heading>
                        <Text opacity={0.9}>Chọn chế độ và bắt đầu chinh phục từ vựng!</Text>
                    </VStack>
                </Box>

                <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
                    <Box flex="2">
                        <Card variant="outline" borderRadius="2xl" border="1px solid" borderColor="gray.100" overflow="hidden">
                            <Box p={4} bg="gray.50" borderBottom="1px solid" borderColor="gray.100">
                                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                                    <HStack>
                                        <Icon as={FiSettings} color="gray.500" />
                                        <Text fontWeight="bold">Tùy chọn:</Text>
                                    </HStack>
                                    <RadioGroup value={settings.count} onChange={(val) => setSettings({ ...settings, count: val })}>
                                        <HStack spacing={4}>
                                            <Radio value="10">10 từ</Radio>
                                            <Radio value="20">20 từ</Radio>
                                            <Radio value="all">Tất cả</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </Flex>
                            </Box>
                            <Box maxH="500px" overflowY="auto">
                                <TableContainer>
                                    <Table variant="simple">
                                        <Thead position="sticky" top={0} bg="white" zIndex={1}>
                                            <Tr><Th>Từ vựng</Th><Th>Nghĩa</Th><Th>TT</Th></Tr>
                                        </Thead>
                                        <Tbody>
                                            {previewVocabs.map((v) => (
                                                <Tr key={v.id}>
                                                    <Td fontWeight="bold">{v.word}</Td>
                                                    <Td>{v.meaning}</Td>
                                                    <Td><Badge colorScheme={v.isLearned ? 'green' : 'gray'}>{v.isLearned ? 'OK' : '-'}</Badge></Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Card>
                    </Box>

                    <Box flex="1">
                        <VStack spacing={4} align="stretch">
                            {GAME_MODES.map((mode) => (
                                <motion.div key={mode.id} whileHover={{ y: -5 }}>
                                    <Button
                                        w="full"
                                        h="auto"
                                        py={6}
                                        bgGradient={mode.gradient}
                                        color="white"
                                        _hover={{ opacity: 0.9 }}
                                        onClick={() => startGame(mode.id)}
                                        borderRadius="2xl"
                                        boxShadow="lg"
                                        leftIcon={<Text fontSize="3xl" mr={2}>{mode.icon}</Text>}
                                    >
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="lg" fontWeight="bold">{mode.name}</Text>
                                            <Text fontSize="xs" opacity={0.9}>{mode.description}</Text>
                                        </VStack>
                                    </Button>
                                </motion.div>
                            ))}
                        </VStack>
                    </Box>
                </Flex>
            </Container>
        );
    }

    // GAME OVER
    if (gameComplete) {
        const correctCount = results.filter((r) => r.correct).length;
        const percentage = Math.round((correctCount / results.length) * 100);

        return (
            <Container centerContent py={20}>
                <VStack spacing={6} p={10} bg="white" borderRadius="3xl" boxShadow="2xl" w="full" maxW="lg">
                    <Text fontSize="8xl">{percentage >= 80 ? '🎉' : '💪'}</Text>
                    <Heading size="xl" fontFamily="heading" bgGradient="linear(to-r, brand.500, accent.500)" bgClip="text">
                        {percentage >= 80 ? 'Tuyệt vời!' : 'Hoàn thành!'}
                    </Heading>
                    <Text fontSize="2xl" fontWeight="bold">
                        {correctCount}/{results.length} chính xác
                    </Text>
                    <Progress value={percentage} w="full" colorScheme={percentage >= 80 ? 'green' : 'yellow'} borderRadius="full" size="lg" />

                    <HStack spacing={4} pt={4} w="full">
                        <Button variant="outline" flex={1} onClick={() => navigate(-1)} borderRadius="xl">Thoát</Button>
                        <Button colorScheme="brand" flex={1} leftIcon={<FiRotateCw />} onClick={resetGame} borderRadius="xl">Chơi lại</Button>
                    </HStack>
                </VStack>
            </Container>
        );
    }

    const current = vocabularies[currentIndex];
    const progress = ((currentIndex + 1) / vocabularies.length) * 100;

    // GAME PLAY UI
    return (
        <Container maxW="600px" py={10}>
            <HStack mb={8}>
                <IconButton icon={<FiX />} variant="ghost" onClick={resetGame} isRound />
                <Progress value={progress} flex={1} colorScheme="brand" borderRadius="full" hasStripe isAnimated size="sm" />
                <Badge colorScheme="brand" borderRadius="full" px={3}>{currentIndex + 1}/{vocabularies.length}</Badge>
            </HStack>

            <AnimatePresence mode="wait">
                {gameMode === 'flashcard' && (
                    <Box>
                        <MotionBox
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card
                                minH="400px"
                                cursor="pointer"
                                onClick={() => setShowAnswer(!showAnswer)}
                                borderRadius="3xl"
                                boxShadow="2xl"
                                bg={showAnswer ? 'white' : 'brand.500'}
                                color={showAnswer ? 'gray.800' : 'white'}
                                position="relative"
                                overflow="hidden"
                            >
                                <CardBody display="flex" flexDirection="column" align="center" justify="center" p={10} textAlign="center">
                                    {!showAnswer ? (
                                        <>
                                            <VStack spacing={4}>
                                                <Text fontSize="5xl" fontWeight="bold" fontFamily="heading">{current.word}</Text>
                                                <Text fontSize="2xl" opacity={0.9}>{current.pronunciation}</Text>
                                                {current.pronunciation2 && <Text fontSize="lg" opacity={0.8}>{current.pronunciation2}</Text>}
                                            </VStack>
                                            <Text position="absolute" bottom={8} fontSize="sm" opacity={0.6}>Chạm để lật thẻ</Text>
                                        </>
                                    ) : (
                                        <>
                                            <VStack spacing={6}>
                                                <Text fontSize="3xl" fontWeight="bold" color="brand.600">{current.meaning}</Text>
                                                {current.example && <Text color="gray.500" fontStyle="italic">"{current.example}"</Text>}
                                                <IconButton
                                                    icon={<FiVolume2 />}
                                                    isRound
                                                    colorScheme="brand"
                                                    size="lg"
                                                    onClick={(e) => { e.stopPropagation(); playAudio(current.word); }}
                                                />
                                            </VStack>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        </MotionBox>

                        {showAnswer && (
                            <HStack mt={8} spacing={6} justify="center">
                                <Button size="lg" colorScheme="red" variant="outline" w="120px" borderRadius="2xl" onClick={() => handleFlashcardAnswer(false)}>Quên</Button>
                                <Button size="lg" colorScheme="green" w="120px" borderRadius="2xl" onClick={() => handleFlashcardAnswer(true)}>Đã nhớ</Button>
                            </HStack>
                        )}
                    </Box>
                )}

                {(gameMode === 'quiz' || gameMode === 'listening') && (
                    <Box>
                        <Card mb={8} borderRadius="2xl" boxShadow="xl" p={8} textAlign="center">
                            {gameMode === 'quiz' ? (
                                <VStack>
                                    <Text fontSize="5xl" fontWeight="bold" fontFamily="heading" color="brand.600">{current.word}</Text>
                                    <Text color="gray.500">{current.pronunciation}</Text>
                                </VStack>
                            ) : (
                                <IconButton icon={<FiVolume2 size={40} />} w="120px" h="120px" isRound colorScheme="brand" onClick={() => playAudio(current.word)} mb={4} />
                            )}
                            <IconButton icon={<FiVolume2 />} size="sm" isRound position="absolute" top={4} right={4} onClick={() => playAudio(current.word)} />
                        </Card>

                        <SimpleGrid columns={1} spacing={4}>
                            {quizOptions.map((option, i) => {
                                const isCorrect = option === current.meaning;
                                const isSelected = selectedOption === option;
                                let bg = 'white';
                                let borderColor = 'transparent';
                                let color = 'gray.800';

                                if (showAnswer) {
                                    if (isCorrect) { bg = 'green.500'; color = 'white'; }
                                    else if (isSelected && !isCorrect) { bg = 'red.500'; color = 'white'; }
                                } else if (isSelected) {
                                    borderColor = 'brand.500';
                                    bg = 'brand.50';
                                }

                                return (
                                    <Button
                                        key={i}
                                        h="auto"
                                        py={4}
                                        bg={bg}
                                        color={color}
                                        border="2px solid"
                                        borderColor={borderColor || 'gray.100'}
                                        borderRadius="xl"
                                        justifyContent="flex-start"
                                        onClick={() => !showAnswer && setSelectedOption(option)}
                                        _hover={{ transform: 'scale(1.02)' }}
                                        boxShadow="sm"
                                    >
                                        <Badge mr={3} borderRadius="full" boxSize="6" display="flex" alignItems="center" justifyContent="center" bg={showAnswer && isCorrect ? 'whiteAlpha.400' : 'gray.100'}>{i + 1}</Badge>
                                        <Text fontSize="lg">{option}</Text>
                                        {showAnswer && isCorrect && <Icon as={FiCheckCircle} ml="auto" fontSize="xl" />}
                                    </Button>
                                );
                            })}
                        </SimpleGrid>

                        {selectedOption && !showAnswer && (
                            <Button mt={8} w="full" colorScheme="brand" size="lg" borderRadius="xl" onClick={handleQuizAnswer}>Kiểm tra</Button>
                        )}
                    </Box>
                )}
            </AnimatePresence>
        </Container>
    );
}

export default Practice;
