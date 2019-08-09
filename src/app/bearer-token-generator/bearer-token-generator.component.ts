import { Component, OnInit } from '@angular/core';
import { TOOL_NAMES } from '../constants/constants';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ILoginResponseModel, IErrorResponseModel } from '../interfaces/interfaces';

@Component({
  selector: 'app-bearer-token-generator',
  templateUrl: './bearer-token-generator.component.html',
  styleUrls: ['./bearer-token-generator.component.scss']
})
export class BearerTokenGeneratorComponent implements OnInit {

  title: string = TOOL_NAMES.BEARER_TOKEN.DISPLAY_NAME;
  sidebar: string = TOOL_NAMES.BEARER_TOKEN.PATH;
  description: string = TOOL_NAMES.BEARER_TOKEN.DESCRIPTION;
  loginForm: FormGroup;
  token: string;
  errorMessage: string;
  copied: boolean = false;

  constructor(private titleService: Title,
              private fb: FormBuilder,
              private apiService: ApiService) { }

  ngOnInit() {
    this.setTitle(TOOL_NAMES.BEARER_TOKEN.TITLE);
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  onSubmit(form) {
    this.apiService.login(form.value).subscribe(
      (response: ILoginResponseModel) => {
        this.token = 'Bearer ' + response.accessToken;
      }, (error: IErrorResponseModel) => {
        if(error.status === 401) {
          this.errorMessage = 'The username or password is invalid';
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
      }
    );
  }

  showCopyMessage() {
    this.copied = true;
    
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  private setTitle(title: string): void {
    this.titleService.setTitle(title + ' | ObservePoint Tools');
  }

}
