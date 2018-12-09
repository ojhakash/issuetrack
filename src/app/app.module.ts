import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from "ngx-pagination";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from "./app.component";

// Import containers
// import { DefaultLayoutComponent } from "./containers";

// import { P404Component } from "./views/error/404.component";
// import { P500Component } from "./views/error/500.component";
// import { LoginComponent } from "./views/login/login.component";
// import { RegisterComponent } from "./views/register/register.component";

// const APP_CONTAINERS = [DefaultLayoutComponent];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule
} from "@coreui/angular";

// Import routing module
import { AppRoutingModule } from "./app.routing";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { ToastrModule } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AuthModule } from "./auth/auth.module";
import { SharedModule } from "./shared/shared.module";
import { HomeComponent } from "./home/home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportIssueComponent } from "./report-issue/report-issue.component";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { SearchIssueComponent } from "./search-issue/search-issue.component";
import { AppService } from "./app.service";
import { EditIssueComponent } from "./edit-issue/edit-issue.component";
import { StartDateFilterPipe } from "./shared/pipe/start-date-filter.pipe";
import { EndDateFilterPipe } from "./shared/pipe/end-date-filter.pipe";
import { P404Component } from "./error/error.component";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgxPaginationModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    HttpClientModule,
    SharedModule,
    AuthModule,
    BrowserModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    ToastrModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    ReportIssueComponent,
    SearchIssueComponent,
    EditIssueComponent,
    StartDateFilterPipe,
    EndDateFilterPipe,
    P404Component
  ],
  providers: [
    AppService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
platformBrowserDynamic().bootstrapModule(AppModule);
