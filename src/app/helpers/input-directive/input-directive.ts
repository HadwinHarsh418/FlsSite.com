import {
    Directive,
    HostListener,
    Input
} from "@angular/core";
import { NgControl } from '@angular/forms';

@Directive({
    selector: "[inputDirective]"
})
export class InputDirective {
    @Input("decimals") decimals: number = 0;
    @Input("inptype") inptype: string = 'notAllowedChar';
    @Input("totrim") totrim: boolean = false;
    @Input("maxLimit") maxLimit: number;
    @Input("upperCase") upperCase: boolean = false;
    public notAllowed = /([;:^#*)(=!%'`"~])/;
    private el: NgControl;

    private check_number(value: string) {
        if (this.decimals <= 0) {
            return String(value).match(new RegExp(/^\d+$/));
        } else {
            var regExpString =
                "^\\s*((\\d+(\\.\\d{0," +
                this.decimals +
                "})?)|((\\d*(\\.\\d{1," +
                this.decimals +
                "}))))\\s*$";
            return String(value).match(new RegExp(regExpString));
        }
    }

    private check_phonenumber(value: string) {
        return String(value).match(new RegExp(/^[+\d]+$/));
    }

    private check_alpha_single(value: string) {
        return String(value).match(new RegExp(/^[a-zA-Z]+$/));
    }

    private check_alphanum_single(value: string) {
        return String(value).match(new RegExp(/^[a-zA-Z0-9]+$/));
    }

    private check_paragraph(value: string) {
        return String(value).match(new RegExp(/^([a-zA-Z0-9\s-_.])+$/));
    }

    private run(oldValue) {
        setTimeout(() => {
            let currentValue: string = (this.totrim) ? 
                                            this.el.control.value 
                                            ? this.el.control.value.trim() 
                                            : '' 
                                        : this.el.control.value;
            currentValue = (this.upperCase) ? 
                                this.el.control.value 
                                ? this.el.control.value.toUpperCase()
                                : '' 
                            : this.el.control.value;
            if (currentValue && currentValue !== '') {
                currentValue = currentValue.toString().replace(this.notAllowed, '');
                switch (this.inptype) {
                    case 'alphaSingle' : 
                        if(!this.check_alpha_single(currentValue)) {
                            currentValue = oldValue;
                        }
                        break;
                    case 'alphanumSingle' : 
                        if(!this.check_alphanum_single(currentValue)) {
                            currentValue = oldValue;
                        }
                        break;
                    case  'number' :
                        if(!this.check_number(currentValue)) {
                            currentValue = oldValue;
                        }
                        break;
                    case 'alphaNumParagraph' :
                        if(!this.check_paragraph(currentValue)) {
                            currentValue = oldValue;
                        }
                        break;
                    case 'phonenumber' :
                        if(!this.check_phonenumber(currentValue)) {
                            currentValue = oldValue;
                        }
                        break;
                    case 'notAllowedChar' :
                        // currentValue = currentValue.replace(this.notAllowed, '');
                        break;
                }
                currentValue = (this.maxLimit) ?
                                currentValue.toString().length > this.maxLimit 
                                ? currentValue.toString().substr(0, this.maxLimit)
                                : currentValue
                            : currentValue;
                this.el.control.patchValue(currentValue);
            } else if(currentValue == ''){
                this.el.control.patchValue(currentValue);
            }
        }, 1);
    }

    constructor(private ngControl: NgControl) {
        this.el = ngControl;
    }

    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent) {
        this.run(this.el.control.value);
    }

    @HostListener("paste", ["$event"])
    onPaste(event: ClipboardEvent) {
        this.run(this.el.control.value);
    }

}