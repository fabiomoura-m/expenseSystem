import { createContext, useState } from 'react';
import getAllUsers from '../Services/allUsers.service';

const initialState = [];

export const userContext = createContext(initialState);

export function UserProvider({ children }) {
    const [users, setUsers] = useState(initialState);
    const [usersInitial, setUsersInitial] = useState(initialState);
    const [usersAllData, setUsersAllData] = useState(initialState);

    function getTotalExpenseByStatus(expenses, status) {
        let result = expenses.reduce((acc, expense) => {
            if (expense.status === status) {
                acc += expense.amount;
            }
            return acc;
        }, 0);

        return result;
    }

    function usersMap(users) {
        const usersMapped = users.map(user => {
            const { _expenses } = user;
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                PAGO: getTotalExpenseByStatus(_expenses, 'PAGO'),
                PENDENTE: getTotalExpenseByStatus(_expenses, 'PENDENTE'),
                show: true
            };
        });

        return usersMapped;
    }

    async function fetchUsers() {
        let response = await getAllUsers();

        const usersReduce = usersMap(response);

        setUsers(usersReduce);
        setUsersInitial(usersReduce);
        setUsersAllData(response);
    }

    return (
        <userContext.Provider
            value={{
                users,
                setUsers,
                usersInitial,
                setUsersInitial,
                usersAllData,
                setUsersAllData,
                fetchUsers,
                getTotalExpenseByStatus
            }}
        >
            {children}
        </userContext.Provider>
    );
}
