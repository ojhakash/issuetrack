import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AppService } from "./../app.service";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { log } from "util";

@Component({
  selector: "app-report-issue",
  templateUrl: "./report-issue.component.html",
  styleUrls: ["./report-issue.component.scss"]
})
export class ReportIssueComponent implements OnInit {
  reportIssueForm: FormGroup;
  html: any;
  froalaOptions: any;
  public users: Array<any>;
  public userObjects: Array<any>;

  constructor(
    public appService: AppService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.html = "<p><span style='color:red'>Hello</span>, world!</p>";
    this.froalaOptions = {
      toolbarButtons: [
        "bold",
        "italic",
        "underline",
        "align",
        "formatUL",
        "formatOL",
        "undo",
        "insertLink",
        "redo",
        "selectAll",
        "clearFormatting",
        "fullscreen",
        "myDropdown"
      ],
      convertMailAddresses: false,
      plainPaste: true,
      shortcutsAvailable: ["bold", "italic"]
    };
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: String) =>
        term.length < 1
          ? []
          : this.users
              .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  ngOnInit() {
    this.appService.getUsers().subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.userObjects = apiResponse.data;
          this.users = apiResponse.data.map(user => user.email);
        } else {
        }
      },
      err => {
        console.log(err);
      }
    );

    this.reportIssueForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      assignedTo: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(4)
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ])
    });

    this.reportIssueForm.setValue({
      title: "",
      assignedTo: "",
      description: "<p><span style='color:red'>Hello</span>, world!</p>"
    });
  }

  onSubmit() {
    if (this.reportIssueForm.valid) {
      var user = this.userObjects.find(
        elem => elem.email === this.reportIssueForm.value.assignedTo
      );

      const formData = {
        ...this.reportIssueForm.value,
        assignedTo: user.userId
      };

      this.appService.addIssue(formData).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.toastr.success(apiResponse.message);
            this.router.navigateByUrl(
              `/home/editissue/${apiResponse.data.issueId}`
            );
          } else {
            this.toastr.error(apiResponse.message);
          }
        },
        err => {
          this.toastr.error(
            err.message || "error occurred ! please try again!"
          );
        }
      );
    } else {
      this.toastr.warning("please fill all the mandatory fields!");
    }
  }
}
