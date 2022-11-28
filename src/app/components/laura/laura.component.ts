import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-laura',
  templateUrl: './laura.component.html',
  styleUrls: ['./laura.component.scss'],
})
export class LauraComponent implements OnInit {
  formgroup: any;
  listQuestionOption: any = [];

  constructor() {}

  ngOnInit(): void {
    this.formgroup = new UntypedFormGroup({
      question: new UntypedFormControl(''),
      firstAnswer: new UntypedFormControl(''),
      secondsAnswer: new UntypedFormControl(''),
      addOptionQuestion: new UntypedFormControl(''),
    });
  }

  addResponse() {
    this.listQuestionOption.push(
      this.formgroup.controls.addOptionQuestion.value
    );
    this.formgroup.get('addOptionQuestion').patchValue('');
  }

  submit() {
    let result = {
      question: this.formgroup.controls.question.value,
      listeReponses: [
        this.formgroup.controls.firstAnswer.value,
        this.formgroup.controls.secondsAnswer.value,
        ...this.listQuestionOption,
      ],
    };
    console.log('result', result);
  }
}