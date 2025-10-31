import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

// Исходные данные используемые в render()
const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    
    // Приводим значения к числам для удобства расчетов
    const rowsPerPage = parseInt(state.rowsPerPage);    
    const page = parseInt(state.page ?? 1);             
    return {                                            
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); 
    let query = {}; 
    
    // использование дополнительных модулей для фильтрации, сортировки и пагинации
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action); 
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query); 

    updatePagination(total, query); 
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'], // Шаблоны, которые будут добавлены ДО таблицы
    after: ['pagination'] // Шаблоны, которые будут добавлены ПОСЛЕ таблицы
}, render);

// инициализация дополнительных модулей
const {applyPagination, updatePagination} = initPagination(
    sampleTable.afterElements.pagination.elements,      
    (el, page, isCurrent) => {                          
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([        
    sampleTable.beforeElements.header.elements.sortByDate,
    sampleTable.beforeElements.header.elements.sortByTotal
]);

const {applyFiltering, updateIndexes} = initFiltering(sampleTable.beforeElements.filter.elements);

const applySearching = initSearching('search'); 

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Асинхронная функция инициализации
async function init() {
    const indexes = await api.getIndexes();

    updateIndexes({
        searchBySeller: indexes.sellers
    });
    
    return indexes;
}

// Запускаем инициализацию и затем рендер
init().then(render);