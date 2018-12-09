import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

import { AppService } from "./../../app.service";
import { log } from "util";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  constructor(
    public appService: AppService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });

    this.loginForm.setValue({
      email: "",
      password: ""
    });
  }

  goToHome() {
    this.router.navigateByUrl("home/dashboard");
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // console.log(this.loginForm.value);
      this.appService.signinFunction(this.loginForm.value).subscribe(
        apiResponse => {
          if (apiResponse.status === 200) {
            localStorage.setItem("authToken", apiResponse.data.authToken);
            localStorage.setItem("userId", apiResponse.data.userDetails.userId);
            this.toastr.success("Signup successful");

            this.goToHome();
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
}
