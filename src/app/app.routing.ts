import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportIssueComponent } from "./report-issue/report-issue.component";
import { SearchIssueComponent } from "./search-issue/search-issue.component";
import { EditIssueComponent } from "./edit-issue/edit-issue.component";
import { P404Component } from "./error/error.component";

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    data: {
      title: "Home"
    },
    children: [
      {
        path: "reportissue",
        component: ReportIssueComponent,
        pathMatch: "full",
        data: {
          title: "Report Issue"
        }
      },
      {
        path: "editissue/:issueId",
        component: EditIssueComponent,
        pathMatch: "full",
        data: {
          title: "Edit Issue"
        }
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        pathMatch: "full",
        data: {
          title: "Dashboard"
        }
      },
      {
        path: "searchissue",
        component: SearchIssueComponent,
        pathMatch: "full",
        data: {
          title: "Search Issue"
        }
      }
    ]
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404"
    }
  },
  { path: "", redirectTo: "/home/dashboard", pathMatch: "full" },
  { path: "**", redirectTo: "/404", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
