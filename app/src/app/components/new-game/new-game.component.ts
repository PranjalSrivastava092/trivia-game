import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {

  apiResponse;
  current = 0;
  score = 0;

  answering = true;

  question = "";

  options = [];
  choice = "";
  correct = "";

  constructor(private api: ApiService) {
    api.getQuestions().subscribe(data => {
      this.apiResponse = data;

      this.updateQues();
    });
  }

  updateQues() {
    let ques = this.apiResponse.results[this.current];

    this.options = ques.incorrect_answers;
    this.options.push(ques.correct_answer);

    // shuffle basic
    this.options.sort(m => Math.random());

    this.choice = "";
    this.question = ques.question;
    this.correct = ques.correct_answer;
  }

  ngOnInit() {
  }

  nextQues() {
    if (this.choice == this.correct) {
      ++this.score;
    }

    ++this.current;

    if (this.current >= 5) {
      this.answering = false;

      this.api.submitGame(this.score).subscribe();
    }
    else this.updateQues();
  }

}
