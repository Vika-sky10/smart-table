import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    root.beforeElements = {};
    root.afterElements = {};
    before.reverse().forEach(subName => {
        root.beforeElements[subName] = cloneTemplate(subName);
        root.container.prepend(root.beforeElements[subName].container);
    });
    after.forEach(subName => {
        root.afterElements[subName] = cloneTemplate(subName);
        root.container.append(root.afterElements[subName].container);
    });
    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', (e) => {
        // Используем setTimeout для задержки вызова, чтобы поля успели очиститься
        setTimeout(onAction);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });
    const render = (data) => {
        // #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            // Перебираем ключи данных и заполняем соответствующие элементы
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    // Проверяем тип элемента и устанавливаем значение соответствующим образом
                    const element = row.elements[key];
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        element.value = item[key];
                    } else {
                        element.textContent = item[key];
                    }
                }
            });
            return row.container;
        });
        
        // Заменяем содержимое контейнера строк новыми строками
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}