import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { LoginComponent } from "./views/login/login.component";
import { RegisterComponent } from "./views/register/register.component";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportIssueComponent } from "./report-issue/report-issue.component";
import { SearchIssueComponent } from "./search-issue/search-issue.component";
import { EditIssueComponent } from "./edit-issue/edit-issue.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404"
    }
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500"
    }
  },
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login Page"
    }
  },
  {
    path: "register",
    component: RegisterComponent,
    data: {
      title: "Register Page"
    }
  },
  {
    path: "auth",
    loadChildren: "./auth/auth.module#AuthModule",
    data: {
      title: "Login Page"
    }
  },
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
        data: {
          title: "Report Issue"
        }
      },
      {
        path: "editissue/:issueId",
        component: EditIssueComponent,
        data: {
          title: "Edit Issue"
        }
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        data: {
          title: "Dashboard"
        }
      },
      {
        path: "searchissue",
        component: SearchIssueComponent,
        data: {
          title: "Search Issue"
        }
      }
    ]
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home"
    },
    children: [
      {
        path: "base",
        loadChildren: "./views/base/base.module#BaseModule"
      },
      {
        path: "buttons",
        loadChildren: "./views/buttons/buttons.module#ButtonsModule"
      },
      {
        path: "charts",
        loadChildren: "./views/chartjs/chartjs.module#ChartJSModule"
      },
      {
        path: "dashboard",
        loadChildren: "./views/dashboard/dashboard.module#DashboardModule"
      },
      {
        path: "icons",
        loadChildren: "./views/icons/icons.module#IconsModule"
      },
      {
        path: "notifications",
        loadChildren:
          "./views/notifications/notifications.module#NotificationsModule"
      },
      {
        path: "theme",
        loadChildren: "./views/theme/theme.module#ThemeModule"
      },
      {
        path: "widgets",
        loadChildren: "./views/widgets/widgets.module#WidgetsModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
