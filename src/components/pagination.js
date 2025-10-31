import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true); 
    pages.firstElementChild.remove();
    
    let pageCount;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // @todo: #2.6 — обработать действия
        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break;            
            case 'next': page = Math.min(pageCount || 1, page + 1); break;    
            case 'first': page = 1; break;                               
            case 'last': page = pageCount || 1; break;                   
        }

        // Обеспечиваем, чтобы страница была в допустимых пределах
        page = Math.max(1, Math.min(pageCount || 1, page));

        return Object.assign({}, query, { 
            limit,
            page
        });
    }

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5);           
        pages.replaceChildren(...visiblePages.map(pageNumber => {    
            const el = pageTemplate.cloneNode(true);                 
            return createPage(el, pageNumber, pageNumber === page); 
        }));

        // @todo: #2.5 — обновить статус пагинации (обратите внимание, что rowsPerPage заменена на limit)
        const skip = (page - 1) * limit;
        const endRow = Math.min(skip + limit, total);
        
        fromRow.textContent = skip + 1; 
        toRow.textContent = endRow;
        totalRows.textContent = total;
    }

    return {
        updatePagination,
        applyPagination
    };
}