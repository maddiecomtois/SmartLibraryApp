import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  
  user = {
    username:'',
    password:''
  }

  registerStatus:String = '';

  constructor(private router:Router, private loginService: LoginService) { }
  
  /*
  * Log in the user and set a session token
  */
  async logIn() {
    if(this.user.username != "" && this.user.password != ""){
      this.loginService.loginUser(this.user).subscribe(response => {
        if(response){
          localStorage.setItem("sessionToken", response['token']);
          localStorage.setItem("userId", '1')
          this.router.navigate(['/home']);
        }
      })
    }
  }
  
  /*
  * Register a user then prompt log in
  */
  async register() {
    if(this.user.username != "" && this.user.password != ""){
      this.loginService.registerNewUser(this.user).subscribe(response => {
        if(response == "Signup successful!"){
          this.registerStatus = response + " Please Login."  
        }
      });
    }
  }

}
