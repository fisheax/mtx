import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Group } from '../models/group.model';
import { Sandbox } from '../models/sandbox.model';

declare var $: any;
declare var _: any;

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  private phpMyAdminUrl = "http://localhost:88/admin/index.php";
  private form =
    '<form action="' + this.phpMyAdminUrl + '" target="phpmyadmin" method="post">' +
        '<input type="hidden" name="pma_servername" value="__server__">' +
        '<input type="hidden" name="pma_username" value="__username__">' +
        '<input type="hidden" name="pma_password" value="__password__">' +
        '<input type="hidden" name="collation_connection" value="utf8mb4_unicode_ci">' +
    '</form>';

  // mock data
  private groups: Group[] = [
    new Group("group_id_1", "group_name_1", [new Sandbox(
      "001", "group_id_1", "sand_name", "127.0.0.1", "3306", "root", "1234567890"
    ), new Sandbox(
      "002", "group_id_1", "sand_name2", "127.0.0.1", "3306", "root", "1234567890"
    )])
  ];

  // current sandbox info
  private currentGroupId: string;
  private currentSandboxId: string;

  constructor(public router: Router) { }

  ngOnInit() {
    // load data here and in the callback function, call submenupicker() to ensure the submenu worked
    setTimeout(function () {
      $('[data-submenu]').submenupicker();
    }, 2000);
  }

  /**
   * jump to the target phpmyadmin page
   * @param groupId
   * @param sandboxId
   */
  operate(groupId: string, sandboxId: string) {
    console.log(this);
    this.currentGroupId = groupId;
    this.currentSandboxId = sandboxId;
    this.router.navigateByUrl("/workspace/operations");
  }

  fetchPage() {
    console.log(this);
    if (!this.currentGroupId || !this.currentSandboxId) {
      // if directly enter in /workspace/operations then do nothing
      return;
    }

    var group = _.filter(this.groups, function (group) {
      return group.id == this.currentGroupId;
    })[0];
    var sandbox = _.filter(group.sandboxes, function (sandbox) {
      return sandbox.id == this.currentSandboxId;
    })[0];

    var poststr = this.build(sandbox.address + ":" + sandbox.port, sandbox.username, sandbox.password);
    var post = $(poststr);
    $("body").append(post);
    post.submit();
    post.remove();
  }

  private build(server: string, username: string, password: string): string {
    return this.form.replace("__server__", server)
      .replace("__username__", username)
      .replace("__password__", password);
  }

  logOut() {
    this.router.navigateByUrl("login");
  }

}
