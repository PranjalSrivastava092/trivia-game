import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthTokenManager } from './auth-token-manager.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private authTokenManager: AuthTokenManager) { }

  login(email: string, password: string): Observable<any> {    
    return this.extractToken(this.authTokenManager
      .post("/api/user/login", {
        email,
        password
      }));
  }

  getGames(): Observable<any> {
    return this.authTokenManager.get('/api/user').pipe(
      map(data => {
        return data.games;
      })
    );
  }

  getQuestions(): Observable<any> {
    return this.authTokenManager.get('/api/game/new');
  }

  submitGame(score): Observable<any> {
    return this.authTokenManager.post('/api/game/score', {
      score
    });
  }

  get isLoggedIn(): boolean {
    return this.authTokenManager.isLoggedIn;
  }

  private extractToken(base: Observable<any>) : Observable<any> {
    return base.pipe(
      map(data => {
        if (data.success) {          
          this.authTokenManager.setAuthToken(data.token);

          data.token = '';
        }

        return data;
      })
    );
  }

  logout() {
    this.authTokenManager.setAuthToken('');
  }
}