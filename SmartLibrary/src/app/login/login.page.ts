import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

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

  registerStatus:String = '';

  constructor(private router:Router, private loginService: LoginService) { }

  ngOnInit() {
  }
  
  async logIn() {
    // code for logging in user
    if(this.user.username != "" && this.user.password != ""){
      this.loginService.loginUser(this.user).subscribe(response => {
        if(response){
          console.log(response);
          localStorage.setItem("sessionToken", response['token']);
          localStorage.setItem("userId", '1')
          this.router.navigate(['/home']);
        }
      })
    }
  }
  
  async register() {
    if(this.user.username != "" && this.user.password != ""){
      this.loginService.registerNewUser(this.user).subscribe(response => {
        console.log(response);
        if(response == "Signup successful!"){
          this.registerStatus = response + " Please Login."  
        }
      });
    }
  }

}
