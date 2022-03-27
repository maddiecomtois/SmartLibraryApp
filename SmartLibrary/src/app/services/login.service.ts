import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  registerNewUser(user){
    var userObj = {
      "firstName": "",
      "lastName": "",
      "email": user.username, 
      "password": user.password
    };

    return this.http.post<any>("https://smart-library-api.herokuapp.com/signup", userObj);
  }

  loginUser(user){
    var userObj = {
      "email": user.username, 
      "password": user.password,
    };

    return this.http.post("https://smart-library-api.herokuapp.com/login", userObj);
  }
}
