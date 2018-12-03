import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { style } from "@angular/animations";

@Component({
  // tslint:disable-next-line
  selector: "body",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
