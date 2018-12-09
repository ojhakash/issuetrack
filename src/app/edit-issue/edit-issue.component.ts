import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AppService } from "./../app.service";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { log } from "util";

@Component({
  selector: "app-edit-issue",
  templateUrl: "./edit-issue.component.html",
  styleUrls: ["./edit-issue.component.scss"]
})
export class EditIssueComponent implements OnInit {
  public editIssueForm: FormGroup;
  public commentForm: FormGroup;
  public html: any;
  public froalaOptions: any;
  public routeParams: any;
  public title: any;
  public comments: Array<any>;
  public users: Array<any>;
  public userObjects: Array<any>;
  public watcher: boolean;
  public commentId: String;

  constructor(
    private activeRoute: ActivatedRoute,
    public appService: AppService,
    private toastr: ToastrService,
    private router: Router
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

    this.routeParams = this.activeRoute.snapshot.params;

    // do something with the parameters

    this.editIssueForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      assignedTo: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ]),
      status: new FormControl(null, [Validators.required])
    });

    this.appService.getIssueDetails(this.routeParams.issueId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.title = apiResponse.data.title;
          this.editIssueForm.setValue({
            title: apiResponse.data.title,
            assignedTo: apiResponse.data.assignedTo.email,
            description: apiResponse.data.description,
            status: apiResponse.data.status
          });
        } else {
          this.router.navigateByUrl("/home/reportissue");
        }
      },
      err => {
        this.toastr.error(
          err.data.message || err.message || "error occurred.please try again!"
        );
      }
    );

    this.appService.checkIfWatcher(this.routeParams.issueId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.watcher = true;
        } else {
          this.watcher = false;
        }
      },
      err => {
        console.log(err);
      }
    );
    //comment form
    this.commentForm = new FormGroup({
      comment: new FormControl(null, [Validators.required])
    });

    this.commentForm.setValue({
      comment: ""
    });

    //comment api calls
    this.getComments();
  }

  getComments() {
    this.appService.getAllComments(this.routeParams.issueId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.comments = apiResponse.data;
        } else if (apiResponse.message == "No Comment Found") {
          this.comments = [];
        } else {
          this.toastr.error(
            apiResponse.message || "error occurred.please try again!"
          );
        }
      },
      err => {
        this.toastr.error(
          err.data.message || err.message || "error occurred.please try again!"
        );
      }
    );
  }

  onSubmit() {
    if (this.editIssueForm.valid) {
      if (this.editIssueForm.valid) {
        var user = this.userObjects.find(
          elem => elem.email === this.editIssueForm.value.assignedTo
        );

        const formData = {
          ...this.editIssueForm.value,
          assignedTo: user.userId
        };
        this.appService
          .updateIssue(formData, this.routeParams.issueId)
          .subscribe(
            apiResponse => {
              if (apiResponse.status == 200) {
                this.toastr.success(apiResponse.message);
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

  onCommentSubmit() {
    if (this.commentForm.valid) {
      const formData = {
        ...this.commentForm.value,
        issueId: this.routeParams.issueId
      };

      this.appService.addComment(formData).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.toastr.success(apiResponse.message);
            this.getComments();
            this.commentForm.reset();
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
      this.toastr.error("please fill all the required fields");
    }
  }

  onCommentDeleteBtnClicked(commentId) {
    this.commentId = commentId;
  }

  onRemoveComment() {
    this.appService.removeComment(this.commentId).subscribe(
      response => {
        if (response.status == 200) {
          this.getComments();
        } else {
          this.toastr.error(response.message);
        }
      },
      err => {
        this.toastr.warning("please try again after some time!");
      }
    );
  }

  followIssue = () => {
    this.appService.addWatcher({ issueId: this.routeParams.issueId }).subscribe(
      apiResponse => {
        this.toastr.success(apiResponse.message);
        if (apiResponse.status == 200) {
          this.watcher = true;
        } else {
          this.watcher = false;
        }
      },
      err => {
        console.log(err);
      }
    );
  };

  unFollowIssue = () => {
    this.appService.removeWatcher(this.routeParams.issueId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.watcher = false;
        } else {
          this.watcher = true;
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        this.toastr.warning("please try again!");
      }
    );
  };

  removeIssue = () => {
    this.appService.removeIssue(this.routeParams.issueId).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.toastr.success(apiResponse.message);
          this.router.navigateByUrl("/home/dashboard");
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
      err => {
        this.toastr.warning("please try again!");
      }
    );
  };
}
