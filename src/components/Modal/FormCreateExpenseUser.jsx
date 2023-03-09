import { useContext, useRef, useEffect, useState } from "react";
import styles from "./Modal.module.css";
import Button from "../Button";
import { layoutContext } from "../../context/layoutContext";
import getAllCategories from "../../Services/categories.service";
import addNewExpense from "../../Services/addNewExpense.service";
import { expenseContext } from "../../context/expenseContext";

export default function FormCreateExpenseUser() {
  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  const amountRef = useRef(null);
  const nameUserRef = useRef(null);
  const { layout, setLayout } = useContext(layoutContext);
  const [categories, setCategories] = useState([]);
  const { fetchExpenses } = useContext(expenseContext);

  async function getCategories() {
    const data = await getAllCategories();
    setCategories(data);
  }

  useEffect(() => {
    getCategories();
    if (layout) {
      nameUserRef.current.value = `${layout.modal.user.name} ${layout.modal.user.lastName}`;
    }
  }, []);

  function closeModal() {
    setLayout({ ...layout, modal: { open: false } });
  }

  async function handleSave() {
    const body = {
      name: nameRef.current.value,
      categoryID: categoryRef.current.value,
      userID: layout.modal.user.id,
      amount: Number(amountRef.current.value),
      status: "PENDENTE",
    };

    await addNewExpense(body);
    fetchExpenses();
  }

  const configSaveButton = {
    name: "SALVAR",
    style: {
      color: "white",
      backgroundColor: "#2196F3",
    },
    onClick: () => {
      handleSave();
      closeModal();
    },
  };

  const configCancelButton = {
    name: "CANCELAR",
    style: {
      color: "#D32F2F",
      backgroundColor: "transparent",
      border: "1px solid #D32F2F",
    },
    onClick: () => {
      closeModal();
    },
  };

  return (
    <div>
      <form>
        <div className={styles.titleModal}>
          <h2>ADICIONAR DESPESA</h2>
        </div>
        <div className={styles.fields}>
          <div>
            <label>Nome</label>
            <input type="text" ref={nameRef} />
          </div>
          <div className={styles.categoryId}>
            <label>Categoria</label>
            <select ref={categoryRef}>
              <option></option>
              {categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.id}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.inputUser}>
            <label className={styles.labelUser}>Usuário</label>
            <input
              className={styles.inputUserName}
              type="text"
              ref={nameUserRef}
              disabled
            />
          </div>
          <div className={styles.value}>
            <label>Valor</label>
            <input type="text" ref={amountRef} />
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
