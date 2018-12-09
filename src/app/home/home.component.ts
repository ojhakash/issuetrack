import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { navItems } from "./../_navmenu";

import { AppService } from "./../app.service";
import * as io from "socket.io-client";
import { log } from "util";
import { IOffset } from "selenium-webdriver";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public socket: any;
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public notifications: Array<any>;

  constructor(
    public router: Router,
    public toastr: ToastrService,
    public appService: AppService
  ) {
    this.socket = io("http://ec2-34-207-99-161.compute-1.amazonaws.com");
    this.changes = new MutationObserver(mutations => {
      this.sidebarMinimized = document.body.classList.contains(
        "sidebar-minimized"
      );
    });
    this.socket.emit("set-user", { userId: localStorage.getItem("userId") });
    this.socket.on("notification", data => {
      this.toastr.info(data.notification);
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }
  ngOnInit() {
    this.appService.getUserDetails().subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          console.log(apiResponse.data);
        } else {
          this.router.navigateByUrl("/login");
        }
      },
      error => {
        this.router.navigateByUrl("/login");
      }
    );
    this.appService.getAllNotification().subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.notifications = apiResponse.data;
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      error => {
        this.toastr.error("please try again!");
      }
    );
  }

  logout() {
    this.appService.logout().subscribe(
      response => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        this.router.navigateByUrl("/login");
        if (response.status == 200) {
          this.router.navigateByUrl("/login");
        }
      },
      err => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        this.router.navigateByUrl("/login");
      }
    );
  }

  goToIssue(issueId) {
    this.router.navigateByUrl(`/home/editissue/${issueId}`);
  }
}
