import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: "login",
        component: LoginComponent,
        pathMatch: "full"
      },
      {
        path: "signup",
        component: SignupComponent,
        pathMatch: "full"
      }
    ])
  ]
})
export class AuthModule {}
