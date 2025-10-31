export function initFiltering(elements) {
    const updateIndexes = (indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            // Очищаем существующие опции (кроме первой пустой)
            while (elements[elementName].children.length > 1) {
                elements[elementName].lastChild.remove();
            }
            
            // Добавляем новые опции
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.closest('.filter-wrapper');
            const input = parent ? parent.querySelector('input') : null;
            
            if (input) {
                input.value = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { 
                    filter[`filter[${elements[key].name}]`] = elements[key].value; 
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;  
    }

    return {
        updateIndexes,
        applyFiltering
    }
}