import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hseportalclient';

  async ngOnInit() {
    fetch('api/SampleFunction')
      .then((result) => result.text())
      .then((result) => console.log(result));
  }
}
