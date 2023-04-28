import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  promptForCertificate: boolean = false

  onPromptForCertificateChanged(promptForCertificate: boolean) {
    this.promptForCertificate = promptForCertificate;
  }
}
