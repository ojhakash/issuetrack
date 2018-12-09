import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

import { AppService } from "./../app.service";
import { log } from "util";

@Component({
  selector: "app-search-issue",
  templateUrl: "./search-issue.component.html",
  styleUrls: ["./search-issue.component.scss"]
})
export class SearchIssueComponent implements OnInit {
  public filterString: String = "";
  public totalPages: Number;
  public currentPage: Number = 1;
  public searchIssueForm: FormGroup;
  public issues: Array<any>;
  public users: Array<any>;
  public userObjects: Array<any>;

  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    private router: Router
  ) {}

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

    this.searchIssueForm = new FormGroup({
      title: new FormControl(null, []),
      reporter: new FormControl(null, [Validators.email]),
      status: new FormControl(null, [])
    });
    this.searchIssueForm.setValue({
      title: "",
      reporter: "",
      status: ""
    });
  }

  goToEditissue(issueId): any {
    this.router.navigateByUrl(`/home/editissue/${issueId}`);
  }

  onSubmit() {
    if (this.searchIssueForm.valid) {
      this.getAllFilteredIssues(1);
    } else {
      this.toastr.warning("please fill all the mandatory fields!");
    }
  }

  getAllFilteredIssues(pageNo): any {
    var user = this.userObjects.find(
      elem => elem.email === this.searchIssueForm.value.reporter
    );

    const formData = {
      ...this.searchIssueForm.value,
      reporterId: user ? user.userId : null
    };

    if (pageNo <= this.totalPages && pageNo > 0) {
      this.currentPage = pageNo;
    }
    this.appService.getFilteredIssues(formData, pageNo).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.issues = apiResponse.data;
          this.totalPages = apiResponse.totalPages;
          this.toastr.success(apiResponse.message);
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        this.toastr.error(err.message || "error occurred ! please try again!");
      }
    );
  }
}
