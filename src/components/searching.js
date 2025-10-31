/**
 * Инициализация поиска по нескольким полям
 * @param {string} searchField - Имя поля поиска из состояния
 * @returns {Function} Функция для применения поиска к данным
 */
export function initSearching(searchField) {
    return (query, state, action) => { 
        return state[searchField] ? Object.assign({}, query, { 
            search: state[searchField] 
        }) : query; 
    }
}