import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AppService } from "./../app.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  public totalPages: Number;
  public currentPage: Number = 1;
  public issues: Array<any>;
  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllIssues(this.currentPage);
  }

  getAllIssues(pageNo): any {
    if (pageNo <= this.totalPages && pageNo > 0) {
      this.currentPage = pageNo;
    }
    this.appService.getIssues(pageNo).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          this.issues = apiResponse.data;
          this.totalPages = apiResponse.totalPages;
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        this.toastr.error(err.message || "error occurred ! please try again!");
      }
    );
  }

  goToEditissue(issueId): any {
    this.router.navigateByUrl(`/home/editissue/${issueId}`);
  }
}
