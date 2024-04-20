const openModal = () => document.getElementById('modal')
    .classList.add('active');

const closeModal = () => {
    document.getElementById('modal').classList.remove('active');
    clearFields();
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_EOQ')) ?? [];

const setLocalStorage = (dbEOQ) => localStorage.setItem('db_EOQ', JSON.stringify(dbEOQ));

//Crear CRUD DE CALCULOS
const createCalculo = (client) => {
    const dbEOQ = getLocalStorage();
    dbEOQ.push(client);
    setLocalStorage(dbEOQ);
}


//
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = '');
}