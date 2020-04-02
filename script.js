class ManageList {
    constructor() {
        window.addEventListener('load', () => this.addTask());
        document.querySelector('.button').addEventListener('click', this.addTask);
        document.querySelector('.add-task').addEventListener('keyup', event => {
            if (event.key === 'Enter') this.addTask()
        });

        this.taskListBlock = document.querySelector('.list');
        this.listOfTasks = this.taskListBlock.children;
        this.ELEMENT_HEIGHT = 40;  // высота элемента списка
        this.LIST_BORDER = 2;  // сумма границ списка (top + bottom 1px)
        this.sortIcon = document.querySelector('.sort');
        this.sortIcon.addEventListener('click', this.sortList);
        this.sorted = false;
    }

    addTask = () => {
        const task = new Task(this.taskListBlock);  // создаём объект который содержит в себе записанные данные на странице
        this.value = task.value;
        this.taskListBlock.append(this.generateTaskLine(this.value));
        this.taskListBlock.lastElementChild.querySelector('.task').focus();  // фокусируемся на последнем элементе
    }

    generateTaskLine(value) {  
        const taskBlock = document.createElement('div');
        const dragPoint = document.createElement('div');
        const inputLine = document.createElement('input');
        const cancelTask = document.createElement('div');

        taskBlock.classList.add('input');
        dragPoint.classList.add('drag');
        inputLine.classList.add('task');
        inputLine.name = 'task';
        inputLine.value = value;
        cancelTask.classList.add('cancel-task');

        dragPoint.addEventListener('mousedown', this.moveTaskLine);
        cancelTask.addEventListener('click', event => this.deleteTaskLine(event));

        taskBlock.append(dragPoint);
        taskBlock.append(inputLine);
        taskBlock.append(cancelTask);

        return taskBlock;
    }

    sortList = () => {
        this.sortIcon.classList.toggle('sorted');
        let sortedArray = [...this.listOfTasks].sort(callBackSort);  // отсортированный список
        function callBackSort(a, b) {   // колбэк функция для правильной сортировки элементов
            a=a.children[1].value
            b=b.children[1].value
            if(!isNaN(a) && !isNaN(b)) return a - b;
            else return a.localeCompare(b);
        }

        if (this.sorted === true) {
            sortedArray = sortedArray.reverse();
        }
        const sortedList = document.createElement('div');
        sortedList.classList.add('list');
        sortedArray.forEach(element => sortedList.append(element));  // вставляется в лист отсортированный список
        this.taskListBlock.replaceWith(sortedList);
        this.taskListBlock = sortedList;
        this.listOfTasks = this.taskListBlock.children;
        this.sorted = !this.sorted;
    }

    deleteTaskLine = e => {
        const element = e.target.parentNode;
        if (element.parentNode.children.length > 1)
            element.remove();
    }

    moveTaskLine = (e) => {
        if (this.listOfTasks.length == 1) {
            return;
        }
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.dropElement);

        this.movedElement = e.target.parentNode;  // перетаскиваемый элемент
        const elementBorder = this.movedElement.getBoundingClientRect();  // границы передвигающегося элемента
        const listBorder = this.taskListBlock.getBoundingClientRect();  // границы списка (родитель)
        this.y = e.pageY - elementBorder.top + listBorder.top; // расстояние от верхней точки окна до приблизительно центра элемента
                                                               // касающегося верхней точки своего родителя
        this.movedElement.style = 'background: #FFDC40; position: absolute;';
        this.listAfterClick = this.taskListBlock.getBoundingClientRect();  // границы списка после вытаскивания элемента из него
        this.listHeight = this.listAfterClick.bottom - this.listAfterClick.top - this.LIST_BORDER;  // высота изменённого спика
        let top = 0;  // расстояние от верха родителя до перетаскиваемого элемента
        if (elementBorder.y - this.listAfterClick.y < 0) {

        } else if (elementBorder.bottom - this.listAfterClick.y > this.listHeight) {
            top = this.listHeight - this.ELEMENT_HEIGHT;
        } else {
            top = elementBorder.y - this.listAfterClick.y;
        }
        this.movedElement.style.top = top + 'px';
    }
    handleMouseMove = (e) => {
        this.taskListBlock.style.cursor = 'move';
        const elemCenter = this.ELEMENT_HEIGHT / 2; // центр движущегося элемента
        if (e.pageY - this.y >= elemCenter && e.pageY <= this.listAfterClick.bottom - elemCenter) {
            this.movedElement.style.top = (e.pageY - this.y - elemCenter) + 'px';  // движение элемента по оси Y
        }
    }
    dropElement = () => {
        document.removeEventListener('mouseup', this.dropElement);
        document.removeEventListener('mousemove', this.handleMouseMove);

        let movedElementClone = this.taskListBlock.removeChild(this.movedElement);  // клон вставляемого элемента
        let position = Math.round(movedElementClone.style.top.slice(0, -2) / this.ELEMENT_HEIGHT);  // позиция элемента

        let inPosition = this.taskListBlock.children[position];  // элемент находящийся на этой позиции
        let ratio = this.movedElement.style.top.slice(0, -2) / this.ELEMENT_HEIGHT;  // склонность . определяется куда будет вставлен
        movedElementClone.style = '';                                               // элемент относительно элемента находящегося 
        const side = ratio < 0.5 ? 'beforebegin' : 'afterend';                      // на этой позиции

        inPosition.insertAdjacentElement(side, movedElementClone);
    }
}
class Task {
    constructor(taskData) {
        this.value = '';
        if (taskData.children.length > 0) {
            this.value = taskData.lastElementChild.value || '';
        }
    }
}

new ManageList();