class ManageList {
    constructor() {
        window.addEventListener('load', (event) => this.addTask(event));
        document.querySelector('.button').addEventListener('click', this.addTask);
        document.querySelector('.add-task').addEventListener('keyup', event => {
            if (event.key === 'Enter') this.addTask()
        });

        this.taskListBlock = document.querySelector('.list');
        this.listOfTasks = this.taskListBlock.children;
        this.sortIcon = document.querySelector('.sort');
        this.sortIcon.addEventListener('click', this.sortList);
        this.sorted = false;
    }

    addTask = () => {
        const task = new Task(this.taskListBlock);
        this.value = task.value;
        this.taskListBlock.append(this.generateTaskLine(this.value));
        this.taskListBlock.lastElementChild.querySelector('.task').focus();
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
        cancelTask.addEventListener('click', (event) => this.deleteTaskLine(event));

        taskBlock.append(dragPoint);
        taskBlock.append(inputLine);
        taskBlock.append(cancelTask);

        return taskBlock;
    }

    sortList = () => {
        this.sortIcon.classList.toggle('sorted');
        const arrayOfTasks = [].map.call(this.listOfTasks, element => element);
        let sortedArray = arrayOfTasks.sort((a, b) => a.children[1].value > b.children[1].value);
        if (this.sorted === true) {
            sortedArray = sortedArray.reverse();
        }
        const sortedList = document.createElement('div');
        sortedList.classList.add('list');
        sortedArray.forEach(element => sortedList.append(element));
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

        this.ELEMENT_HEIGHT = 40;
        this.LIST_BORDER = 2;
        this.movedElement = e.target.parentNode;
        const elementBorder = this.movedElement.getBoundingClientRect();
        const listBorder = this.taskListBlock.getBoundingClientRect();
        this.y = e.pageY - elementBorder.top + listBorder.top;

        this.movedElement.style.backgroundColor = '#FFDC40';
        this.movedElement.style.position = 'absolute';
        this.listAfterClick = this.taskListBlock.getBoundingClientRect();
        let top = 0;
        if (elementBorder.y - this.listAfterClick.y < 0) {

        } else if (elementBorder.bottom - this.listAfterClick.y > this.listAfterClick.bottom - this.listAfterClick.top - this.LIST_BORDER) {
            top = this.listAfterClick.bottom - this.listAfterClick.top - this.LIST_BORDER - this.ELEMENT_HEIGHT;
        } else {
            top = elementBorder.y - this.listAfterClick.y;
        }
        this.movedElement.style.top = top + 'px';
    }
    handleMouseMove = (e) => {
        this.taskListBlock.style.cursor = 'move';
        if (e.pageY - this.y >= this.ELEMENT_HEIGHT / 2 && e.pageY <= this.listAfterClick.bottom - this.ELEMENT_HEIGHT / 2) {
            this.movedElement.style.top = (e.pageY - this.y - this.ELEMENT_HEIGHT / 2) + 'px';
        }
    }
    dropElement = () => {
        document.removeEventListener('mouseup', this.dropElement);
        document.removeEventListener('mousemove', this.handleMouseMove);

        let movedElementClone = this.taskListBlock.removeChild(this.movedElement);
        let position = Math.floor(movedElementClone.style.top.slice(0, -2) / this.ELEMENT_HEIGHT);

        let inPosition = this.taskListBlock.children[position];
        let ratio = this.movedElement.style.top.slice(0, -2) / this.ELEMENT_HEIGHT;
        movedElementClone.style = '';
        const side = ratio < 0.5 ? 'beforebegin' : 'afterend';

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