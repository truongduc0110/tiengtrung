import { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    IconButton,
    Spinner,
    useToast,
    HStack,
    Text,
} from '@chakra-ui/react';
import { FiTrash2, FiUsers } from 'react-icons/fi';
import { adminAPI } from '../services/api';

function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await adminAPI.getClasses();
            setClasses(response.data.data);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa lớp học này?')) return;
        try {
            await adminAPI.deleteClass(id);
            toast({ title: 'Đã xóa lớp học', status: 'success' });
            fetchClasses();
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Xóa thất bại', status: 'error' });
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
        <Box>
            <Heading size="lg" mb={8}>Quản lý lớp học</Heading>

            <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
                <Table variant="simple">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Lớp học</Th>
                            <Th>Mã lớp</Th>
                            <Th>Chủ lớp</Th>
                            <Th>Thành viên</Th>
                            <Th>Ngày tạo</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {classes.map((cls) => (
                            <Tr key={cls.id}>
                                <Td>
                                    <HStack>
                                        <Text fontSize="xl">{cls.icon || '📖'}</Text>
                                        <Text fontWeight="medium">{cls.name}</Text>
                                    </HStack>
                                </Td>
                                <Td>
                                    <Badge colorScheme="brand">{cls.code}</Badge>
                                </Td>
                                <Td>{cls.owner?.email || 'N/A'}</Td>
                                <Td>
                                    <HStack>
                                        <FiUsers />
                                        <Text>{cls.members?.length || 0}</Text>
                                    </HStack>
                                </Td>
                                <Td>{new Date(cls.createdAt).toLocaleDateString('vi-VN')}</Td>
                                <Td>
                                    <IconButton
                                        icon={<FiTrash2 />}
                                        colorScheme="red"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(cls.id)}
                                        aria-label="Xóa"
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
}

export default Classes;
