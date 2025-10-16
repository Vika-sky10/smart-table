import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
        Object.keys(indexes)                                    // Получаем ключи из объекта
          .forEach((elementName) => {                       // Перебираем по именам
            elements[elementName].append(                   // в каждый элемент добавляем опции
                ...Object.values(indexes[elementName])      // формируем массив имён, значений опций
                          .map(name => {                    // используйте name как значение и текстовое содержимое
                            const option = document.createElement('option');
                            option.value = name;
                            option.textContent = name;
                            return option;
                          })
            )
         });
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
         if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.closest('.filter-wrapper');
            const input = parent ? parent.querySelector('input') : null;
            
            if (input) {
                input.value = '';
                state[input.name] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}