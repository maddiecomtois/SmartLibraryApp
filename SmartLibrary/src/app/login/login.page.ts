import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  user = {
    username:'',
    password:''
  }

  constructor(private router:Router) { }

  ngOnInit() {
  }
  
  async logIn() {
    // code for logging in user
    this.router.navigate(['/home'])
  }
  
  async register() {
    // code for registering user
  }

}
