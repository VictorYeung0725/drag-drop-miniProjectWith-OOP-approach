//Project state management 21/3/2024
class ProjectState {
  //create a listener for all the changing to the state and reflect the changes
  private listeners: any[] = [];
  private project: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  //here will call the listener and check the array
  addListeners(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  //trigger to push into the project list method (public)
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople,
    };
    this.project.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.project.slice());
    }
  }
}

//create a new instance for updating the global state
//NOTE this way we make sure only work on the same state of object
//prevent create more than one state, and changing the wrong state in OOP
//singletons pattern
const projectState = ProjectState.getInstance();

//Validation funciton logic
interface Validateble {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
function validate(validatableInput: Validateble) {
  //begin with internal state set to true;
  let isValid = true;
  if (validatableInput.required) {
    //add type guard here before trim the value or just convert it to string
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }

  return isValid;
}

// Code goes here! 17/3/2024
//trying for typecript review
//drag and drop with typescript OOP

//autoBind here ? declarator is a function
function autoBind(
  // target: any,
  // methodName: string,
  _: any,
  _2: string,
  descrptor: PropertyDescriptor
) {
  const originalMethod = descrptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

//Project list class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProject: any[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById('project-list')!
    );
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProject = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    projectState.addListeners((project: any[]) => {
      this.assignedProject = project;
      this.renderProjects();
    });
    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const prjItem of this.assignedProject) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.append(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PORJECT';
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

//Project input class
//create class for this project
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    //NOTE type Casting ? why do i need to provide <> here ?
    //NOTE Any code that needs to run when an object is created should be placed in the constructor
    //NOTE add selection logic here
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById('project-input')!
    );
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';
    this.titleInputElement = this.element.querySelector(
      '#title'
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  //NOTE add rendering logic here
  //NOTE use private here because we are not going to access this outside of this class
  //only need to be use here

  //what is a tuble
  //NOTE im returning exactly x element of these three type
  private gatherInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validateble = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validateble = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validateble = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input,Please try again later');
      return;
    } else {
      return [enteredTitle, enteredDescription, parseInt(enteredPeople)];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    //BUG where did this pointing to ???
    // console.log(this.titleInputElement.value);
    const userInput = this.gatherInput();
    //To check if userInput is indeed a tuble, since tuble is just a array, here we just check is the value is a array then move on
    if (Array.isArray(userInput)) {
      const [title, descrip, people] = userInput;
      console.log(title, descrip, people);
      projectState.addProject(title, descrip, people);
      this.clearInputs();
    }
  }

  private configure() {
    //here can u decorator ? how BUG
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
