//Validation funciton logic 
interface Validateble  {
  value:string | number;
  required?:boolean;
  minLength?:number;
  maxLength?:number;
  min?:number;
  max?:number;

}
function validate(validatableInput:Validateble){
  //begin with internal state set to true; 
  let isValid = true;
  if(validatableInput.required){
    //add type guard here before trim the value or just convert it to string
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if(validatableInput.minLength && typeof validatableInput.value === 'string'){
    
  }
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

    if (
      validate({ value: enteredTitle, required:true,minLength:5 })
      validate({ value: enteredDescription, required:true,minLength:5 })
      validate({ value: enteredPeople, required:true,minLength:5 })
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
    }
    this.clearInputs();
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
