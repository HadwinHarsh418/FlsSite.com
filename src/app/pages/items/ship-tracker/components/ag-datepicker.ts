import { ICellEditorComp, ICellEditorParams,} from 'ag-grid-community';
export class AgDatePicker implements ICellEditorComp {
  eInput!: HTMLInputElement;

  // gets called once before the renderer is used
  init(params: ICellEditorParams) {
    // create the cell
    this.eInput = document.createElement('input');
    this.eInput.value = params.value;
    this.eInput.type = 'Date';
    this.eInput.classList.add('ag-input');
    this.eInput.style.height = '100%';
    this.eInput.style.width = '100%';
    this.eInput.addEventListener(
      'change',
      () => { this.eInput.focus(); },
      false
   );
  }

  // gets called once when grid ready to insert the element
  getGui() {
    return this.eInput;
  }

  // focus and select can be done after the gui is attached
  afterGuiAttached() {
    this.eInput.focus();
    this.eInput.select();
  }

  // returns the new value after editing
  getValue() {
    return this.eInput.value;
  }

  // any cleanup we need to be done here
  destroy() {
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }
}