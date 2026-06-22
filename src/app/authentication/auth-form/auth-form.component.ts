import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { input, output, inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, AsyncPipe],
})
export class AuthFormComponent{
  private readonly formBuilder = inject(FormBuilder);

  actionButtonText = input<string>('Sign In');
  isPasswordResetPage = input<boolean>(false);
  isSignupPage = input<boolean>(false);
  availableVaccines = input<Observable<any[]> | null>(null);
  

  formSubmitted = output<any>();
  addChild = output<void>();

  readonly authForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    children: this.formBuilder.array([])
  });

  get childrenFormArray(): FormArray {
    return this.authForm.get('children') as FormArray;
  }

  getChildForm(index: number): FormGroup {
    return this.childrenFormArray.at(index) as FormGroup;
  }

  getVaccinesFormArray(childIndex: number): FormArray {
    const childForm = this.getChildForm(childIndex);
    return childForm.get('vaccines_taken') as FormArray;
  }

  getVaccineForm(childIndex: number, vaccineIndex: number): FormGroup {
    const vaccinesArray = this.getVaccinesFormArray(childIndex);
    return vaccinesArray.at(vaccineIndex) as FormGroup;
  }

  nameRequired = signal(false);

  ngOnInit() {
    this.updateValidators();

    if (this.isSignupPage()) {
      this.addChildForm();
    }
  }

  private updateValidators() {
    const nameControl = this.authForm.get('name');
    const passwordControl = this.authForm.get('password');

    if (this.isSignupPage()) {
      nameControl?.setValidators([Validators.required, Validators.minLength(2)]);
      nameControl?.updateValueAndValidity();
      
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      passwordControl?.updateValueAndValidity();
      
      this.nameRequired.set(true);
    } else if (this.isPasswordResetPage()) {
      passwordControl?.clearValidators();
      passwordControl?.updateValueAndValidity();
      
      nameControl?.clearValidators();
      nameControl?.updateValueAndValidity();
      
      this.nameRequired.set(false);
    } else {
      passwordControl?.setValidators([Validators.required]);
      passwordControl?.updateValueAndValidity();
      
      nameControl?.clearValidators();
      nameControl?.updateValueAndValidity();
      
      this.nameRequired.set(false);
    }
  }

  createVaccineForm(): FormGroup {
    return this.formBuilder.group({
      vaccineId: ['', Validators.required],
      dateTaken: ['', Validators.required]
    });
  }

  createChildForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(18)]],
      vaccines_taken: this.formBuilder.array([])
    });
  }

  addChildForm(): void {
    this.childrenFormArray.push(this.createChildForm());
    this.addChild.emit();
  }

  removeChildForm(index: number): void {
    if (this.childrenFormArray.length > 1) {
      this.childrenFormArray.removeAt(index);
    }
  }

  addVaccineToChild(childIndex: number): void {
    const vaccinesArray = this.getVaccinesFormArray(childIndex);
    if (vaccinesArray) {
      vaccinesArray.push(this.createVaccineForm());
    } else {
      console.error('Vaccines FormArray not found for child index:', childIndex);
    }
  }

  removeVaccineFromChild(childIndex: number, vaccineIndex: number): void {
    const vaccinesArray = this.getVaccinesFormArray(childIndex);
    if (vaccinesArray && vaccinesArray.length > 0) {
      vaccinesArray.removeAt(vaccineIndex);
    }
  }

  submitCredentials(): void {
    console.log("Aqui entrou")
    if (!this.authForm.valid) {
      console.log('Form is not valid yet, current value:', this.authForm.value);
      this.markFormGroupTouched(this.authForm);
      console.log("Aqui vai sair")
      return;
    }

    const formValue = this.authForm.value;
    const credentials: any = {
      email: formValue.email,
      password: formValue.password,
    };
    console.log("Mts credenciais")
    if (this.isSignupPage()) {
      console.log("Eh sign up page sim")
      credentials.name = formValue.name;
      credentials.children = formValue.children?.map((childForm: any) => ({
        id: this.generateChildId(),
        name: childForm.name,
        age: childForm.age,
        vaccines_taken: childForm.vaccines_taken || []
      })) || [];
    }
    console.log("Envia")
    this.formSubmitted.emit(credentials);
    console.log("Enviou");
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }

    getErrorMessage(controlName: string): string {
    const control = this.authForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `Minimum length is ${requiredLength} characters`;
    }
    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `Maximum value is ${errors['max'].max}`;
    }
    
    return 'Invalid input';
  }

  getChildErrorMessage(index: number, controlName: string): string {
    const childForm = this.getChildForm(index);
    const control = childForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `Minimum length is ${requiredLength} characters`;
    }
    if (errors['min']) {
      return `Age must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `Age must be at most ${errors['max'].max}`;
    }
    
    return 'Invalid input';
  }

  getVaccineErrorMessage(childIndex: number, vaccineIndex: number, controlName: string): string {
    const vaccineForm = this.getVaccineForm(childIndex, vaccineIndex);
    const control = vaccineForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    
    if (errors['required']) {
      return 'This field is required';
    }
    
    return 'Invalid input';
  }

  private generateChildId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
