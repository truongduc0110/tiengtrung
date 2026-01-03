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
    Avatar,
    Badge,
    IconButton,
    Spinner,
    useToast,
    HStack,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { adminAPI } from '../services/api';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getUsers();
            setUsers(response.data.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await adminAPI.deleteUser(id);
            toast({ title: 'Đã xóa người dùng', status: 'success' });
            fetchUsers();
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
            <Heading size="lg" mb={8}>Quản lý người dùng</Heading>

            <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
                <Table variant="simple">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Người dùng</Th>
                            <Th>Email</Th>
                            <Th>Role</Th>
                            <Th>VIP</Th>
                            <Th>Ngày tham gia</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => (
                            <Tr key={user.id}>
                                <Td>
                                    <HStack>
                                        <Avatar size="sm" name={user.name} src={user.avatar} />
                                        <Box>{user.name || 'Chưa đặt tên'}</Box>
                                    </HStack>
                                </Td>
                                <Td>{user.email}</Td>
                                <Td>
                                    <Badge colorScheme={user.role === 'admin' ? 'red' : 'gray'}>
                                        {user.role}
                                    </Badge>
                                </Td>
                                <Td>
                                    {user.isVip ? (
                                        <Badge colorScheme="yellow">VIP</Badge>
                                    ) : (
                                        <Badge variant="outline">Free</Badge>
                                    )}
                                </Td>
                                <Td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</Td>
                                <Td>
                                    <IconButton
                                        icon={<FiTrash2 />}
                                        colorScheme="red"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
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

export default Users;
