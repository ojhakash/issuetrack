import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Cookie } from "ng2-cookies/ng2-cookies";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/toPromise";
import {
  HttpErrorResponse,
  HttpClient,
  HttpParams,
  HttpHeaders
} from "@angular/common/http";

@Injectable()
export class AppService {
  private url = "http://ec2-34-207-99-161.compute-1.amazonaws.com";

  constructor(public http: HttpClient) {} // end constructor

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem("userInfo"));
  }; // end getUserInfoFromLocalstorage

  public setUserInfoInLocalStorage = data => {
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("mobileNumber", data.mobileNumber)
      .set("email", data.email)
      .set("password", data.password);

    return this.http.post(`${this.url}/api/v1/users/signup`, params);
  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set("email", data.email)
      .set("password", data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  public getUserDetails(): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );
    return this.http.get(`${this.url}/api/v1/users/details`, { params });
  }

  public logout(): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );

    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  } // end logout function

  public getUsers(): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );

    return this.http.get(`${this.url}/api/v1/users/view/all`, { params });
  }

  // issue ajax start

  public getIssues(pageNo): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );
    return this.http.get(`${this.url}/api/v1/issue/all/${pageNo}`, { params });
  }

  public addIssue(data): Observable<any> {
    const params = new HttpParams()
      .set("authToken", localStorage.getItem("authToken"))
      .set("title", data.title)
      .set("description", data.description)
      .set("assignedTo", data.assignedTo);

    return this.http.post(`${this.url}/api/v1/issue/add`, params);
  }

  public updateIssue(data, issueId): Observable<any> {
    const params = new HttpParams()
      .set("authToken", localStorage.getItem("authToken"))
      .set("title", data.title)
      .set("description", data.description)
      .set("assignedTo", data.assignedTo)
      .set("status", data.status);

    return this.http.put(`${this.url}/api/v1/issue/${issueId}/edit`, params);
  }

  public getIssueDetails(issueId): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );
    return this.http.get(`${this.url}/api/v1/issue/${issueId}`, { params });
  }

  public removeIssue(issueId): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );
    return this.http.delete(`${this.url}/api/v1/issue/${issueId}/remove`, {
      params
    });
  }

  // end of issue ajax calls

  public getAllComments(issueId): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );
    return this.http.get(`${this.url}/api/v1/comment/${issueId}/all`, {
      params
    });
  }

  public addComment(data): Observable<any> {
    const params = new HttpParams()
      .set("authToken", localStorage.getItem("authToken"))
      .set("comment", data.comment)
      .set("issueId", data.issueId);
    return this.http.post(`${this.url}/api/v1/comment/add`, params);
  }

  public removeComment(commentId): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );
    return this.http.delete(`${this.url}/api/v1/comment/${commentId}/remove`, {
      params
    });
  }

  public getFilteredIssues(data, pageNo): Observable<any> {
    const params = new HttpParams()
      .set("authToken", localStorage.getItem("authToken"))
      .set("title", data.title)
      .set("status", data.status)
      .set("reporterId", data.reporterId);

    return this.http.get(`${this.url}/api/v1/issue/filtered/${pageNo}`, {
      params
    });
  }
  //watcher apis
  public addWatcher(data): Observable<any> {
    const params = new HttpParams()
      .set("authToken", localStorage.getItem("authToken"))
      .set("issueId", data.issueId);

    return this.http.post(`${this.url}/api/v1/watcher/add`, params);
  }

  public removeWatcher(issueId): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );

    return this.http.delete(`${this.url}/api/v1/watcher/remove/${issueId}`, {
      params
    });
  }

  public checkIfWatcher(issueId): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );

    return this.http.get(
      `${this.url}/api/v1/watcher/checkifwatcher/${issueId}`,
      { params }
    );
  }

  public getAllNotification(): Observable<any> {
    const params = new HttpParams().set(
      "authToken",
      localStorage.getItem("authToken")
    );

    return this.http.get(`${this.url}/api/v1/notification/all`, { params });
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";

    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${
        err.message
      }`;
    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);
  } // END handleError
}
