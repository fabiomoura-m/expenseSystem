import { useContext, useEffect, useState } from 'react';
import styles from './Modal.module.css';
import Button from '../Button';
import { layoutContext } from '../../context/layoutContext';
import getAllCategories from '../../Services/categories.service';
import addNewExpense from '../../Services/addNewExpense.service';
import { userContext } from '../../context/userContext';
import { useForm } from 'react-hook-form';
import { maskMoney } from '../../utils/maskMoney';

export default function FormCreateExpenseUser() {
    const { layout, setLayout } = useContext(layoutContext);
    const [categories, setCategories] = useState([]);
    const { fetchUser } = useContext(userContext);
    console.log(categories);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            userName: `${layout?.modal?.user?.name} ${layout?.modal?.user?.lastName}`
        }
    });

    async function getCategories() {
        const data = await getAllCategories();
        setCategories(data);
    }

    console.log(layout);

    useEffect(() => {
        getCategories();
    }, []);

    function closeModal() {
        setLayout({ ...layout, modal: { open: false } });
    }

    async function handleSave(data) {
        const id = layout?.modal?.user?.id;
        const body = {
            ...data,
            userID: id,
            amount: Number(data.amount.replace(/\D/g, '')) / 100,
            status: 'PENDENTE'
        };

        await addNewExpense(body);
        fetchUser(id);
        closeModal();
    }

    const configSaveButton = {
        name: 'SALVAR',
        style: {
            color: 'white',
            backgroundColor: '#2196F3'
        },
        type: 'blue',
        onClick: () => {}
    };

    const configCancelButton = {
        name: 'CANCELAR',
        style: {
            color: '#D32F2F',
            backgroundColor: 'transparent',
            border: '1px solid #D32F2F'
        },
        type: 'red',
        onClick: () => {
            closeModal();
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(handleSave)}>
                <div className={styles.titleModal}>
                    <h2>ADICIONAR DESPESA</h2>
                </div>
                <div className={styles.fields}>
                    <div className={styles.boxField}>
                        <label htmlFor="name">Nome</label>
                        <input
                            className={errors?.name ? styles['error'] : ''}
                            id="name"
                            type="text"
                            {...register('name', { required: true })}
                        />
                        {errors.name && (
                            <span className={styles.message_error}>
                                Insira o nome da despesa
                            </span>
                        )}
                    </div>
                    <div className={styles.boxField}>
                        <label>Categoria</label>
                        <select
                            className={
                                errors?.categoryID ? styles['error'] : ''
                            }
                            {...register('categoryID', { required: true })}
                        >
                            <option></option>
                            {categories.map(category => {
                                return (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.categoryID && (
                            <span className={styles.message_error}>
                                Selecione uma categoria
                            </span>
                        )}
                    </div>
                    <div className={styles.boxField}>
                        <label>Usuário</label>
                        <input type="text" {...register('userName')} disabled />
                    </div>
                    <div className={styles.boxField}>
                        <label>Valor</label>
                        <input
                            className={errors?.amount ? styles['error'] : ''}
                            type="text"
                            {...register('amount', {
                                required: true,
                                validate: (value, formValues) =>
                                    Number(value.replace(/\D/g, '')) >= 1,
                                onChange: e => maskMoney(e)
                            })}
                        />
                        {errors.amount && (
                            <span className={styles.message_error}>
                                Insira o valor
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Button config={configSaveButton} />
                    <Button config={configCancelButton} />
                </div>
            </form>
        </div>
    );
}
