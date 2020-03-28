import { Component, OnInit } from '@angular/core';
import { AuthTokenManager } from '../services/auth-token-manager.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {

  parts = null
  startDate;
  startTime;
  endDate;
  endTime;

  edit = false;
  id = "";

  constructor(private authTokenManager: AuthTokenManager,
    private router: Router,
    private route: ActivatedRoute) {
      
    authTokenManager.get('/part').subscribe(data => {
      if (data.success) {
        this.parts = data.list.map(m =>
        {
          return {
            include: false,
            part: m
          }
        });

        this.route.paramMap.subscribe(params => {
          if (params.has('id')) {
            this.edit = true;
            this.id = params.get('id');
            authTokenManager.get('/interview/' + this.id).subscribe(data => {
              if (data.success) {
                var interview = data.data;

                for (var i = 0; i < interview.participants.length; ++i) {
                  for (var j = 0; j < this.parts.length; ++j) {
                    if (this.parts[j].part._id == interview.participants[i]) {
                      this.parts[j].include = true;
                      break;
                    }
                  }
                }

                this.startDate = this.startTime = interview.start_time;
                this.endDate = this.endTime = interview.end_time;
              }
            });
          }
        });
      }
    });
  }

  ngOnInit() {
  }

  submit() {
    let start = new Date(this.startDate);
    let t = this.startTime.split(':');
    start.setHours(parseInt(t[0]), parseInt(t[1]));
    
    let end = new Date(this.endDate);
    t = this.endTime.split(':');
    end.setHours(parseInt(t[0]), parseInt(t[1]));

    let partsToSubmit = this.parts.filter(m => m.include).map(m => m.part._id);
    
    if (this.edit) {
      this.authTokenManager.patch('/interview', {
        start_time: start,
        end_time: end,
        parts: partsToSubmit,
        id: this.id
      }).subscribe(data => {
        if (!data.success) {
          alert(data.msg);
        }
        else this.router.navigate(['/']);
      });
    }
    else {
      this.authTokenManager.post('/interview', {
        start_time: start,
        end_time: end,
        parts: partsToSubmit
      }).subscribe(data => {
        if (!data.success) {
          alert(data.msg);
        }
        else this.router.navigate(['/']);
      });
    }
  }

}
