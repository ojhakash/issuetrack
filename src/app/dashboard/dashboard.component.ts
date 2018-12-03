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
  public issues: Array<any>;
  constructor(
    public appService: AppService,
    toaster: ToastrService,
    private router: Router
  ) {
    this.appService.getIssues().subscribe(
      apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.issues = apiResponse.data;
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        this.toastr.error(err.message || "error occurred ! please try again!");
      }
    );
  }

  ngOnInit() {}

  goToEditissue(issueId): any {
    this.router.navigateByUrl(`/home/editissue/${issueId}`);
  }
}
