import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ApiService } from '../_providers/api-service/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  // public href: string = "";
  // public user_name:any ="";
  // public Header:any ="";
  // public currentDate =new Date();
  // public UserDetails :any="";
  // public Fullname  :any="";
  // // public FullNameDisplay  :any="";
  // // public FullnameDisplay  :any="";
  // public SideMenuData : any="";
  // Username :any="";
  // public RoleID :any = "";
  // GetRoleNames: any = [];
  // getroleNames: any = [];
  // roleSName: any;
  // // public UserTitle : any="";
  // MainmoduleArray:[];
  // ParentModules : any =[];
  // SModuleArray : any = [];
  // public SelectedMenu : any = "";
  // public DeniedText : any="" ;

  constructor( private router: Router, private _Activatedroute: ActivatedRoute) {
    // alert("Header/...Cons");
   }
  ngOnInit() {
    // alert("Header/...OnInit");
   
    
   }
  

 
}
