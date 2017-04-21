import { Component, OnInit, Input} from '@angular/core';
import { HttpPost} from '../../providers/httpPost';
declare var $: any;

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  groupList: any = [];
  projectList: any = [];
  @Input() projectInfo: any = [];
  constructor(public httpPost: HttpPost) { }

  ngOnInit() {
    $(function (){
      const screenHeight = $(window).height() - 61;
      $('.divHeight').css('height', screenHeight + 'px');
      $('.leftNavTop').css('height', screenHeight / 2 + 'px');
      $('.leftNavBottom').css('height', screenHeight / 2 + 'px');
    });
    var that = this;
    this.httpPost.dataAjax('POST', 'http://localhost:80/main/groups', 'x-www-form-urlencoded', {}, function(res) {
      if (res.code == '0') {
        that.groupList = res.result;
      }
    });
  }
  showProject(group) {
    var that = this;
    const params = {'groupId': group.groupId};
    this.httpPost.dataAjax('GET', 'http://localhost:80/main/group/project/list', 'x-www-form-urlencoded', params, function(res) {
      if (res.code == '0') {
        that.projectList = res.result;
      }
    });
  };
  showProjectInfo(project) {
    var that = this;
    const params = {'projectId': this.projectList[0].projectId};
    console.log('projectParams--', params);
    this.httpPost.dataAjax('GET', 'http://localhost:80/main/group/project/info', 'x-www-form-urlencoded', params, function(res){
      if (res.code == '0') {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaprojectInfo', res.result);
        that.projectInfo = res.result;
        sessionStorage.setItem('projectInfo', that.projectInfo);
      }
    });
  }
}
