import { Component } from '@angular/core';
import { TensorflowService } from '../services/tensorflow.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(
    public tensorflowService: TensorflowService
  ) {}

}
