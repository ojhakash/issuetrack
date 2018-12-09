import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AppService } from "./../../app.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public repeatPassword: any;
  public apiKey: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,
    vcr: ViewContainerRef
  ) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      mobileNumber: new FormControl(null, [Validators.required]),
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        this.forbiddenEmails
      ),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      repeatPassword: new FormControl(
        null,
        [Validators.required],
        this.checkPasswords.bind(this)
      )
    });
    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );

    this.signupForm.setValue({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
      repeatPassword: ""
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      //console.log(this.signupForm.value);
      this.appService.signupFunction(this.signupForm.value).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success("Signup successful");

            setTimeout(() => {
              this.goToSignIn();
            }, 2000);
          } else {
            this.toastr.error(apiResponse.message);
          }
        },
        err => {
          this.toastr.error("some error occured");
        }
      );
    } else {
      this.toastr.warning("please fill all the mandatory fields!");
    }
    // this.signupForm.reset();
  }

  checkPasswords(control: FormControl): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let pass = this.signupForm.get("password").value;
      let confirmPass = control.value;

      pass === confirmPass ? resolve(null) : reject({ notSame: true });
    });
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get("hobbies")).push(control);
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === "test@test.com") {
          resolve({ emailIsForbidden: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }

  public goToSignIn: any = () => {
    this.router.navigateByUrl("/login");
  }; // end goToSignIn

  // public signupFunction: any = () => {
  //   if (!this.firstName) {
  //     this.toastr.warning("enter first name");
  //   } else if (!this.lastName) {
  //     this.toastr.warning("enter last name");
  //   } else if (!this.mobileNumber) {
  //     this.toastr.warning("enter mobile");
  //   } else if (!this.email) {
  //     this.toastr.warning("enter email");
  //   } else if (!this.password) {
  //     this.toastr.warning("enter password");
  //   } else {
  //     let data = {
  //       firstName: this.firstName,
  //       lastName: this.lastName,
  //       mobileNumber: this.mobileNumber,
  //       email: this.email,
  //       password: this.password,
  //       apiKey: this.apiKey
  //     };

  //     console.log(data);

  //   } // end condition
  //}; // end signupFunction
}
