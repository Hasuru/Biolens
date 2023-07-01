import { Injectable } from '@angular/core';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import { ImageClassificationModel, ImageInput } from '@tensorflow/tfjs-automl';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import '@tensorflow/tfjs-backend-webgl';
import { DatabaseService } from './database.service';

const MODEL_URL = '../../assets/model/model.json';
const DICT_URL = '../../assets/model/dict.txt';

@Injectable({
  providedIn: 'root'
})
export class TensorflowService {
  private graphModel: any;
  private dictionary: any;
  public model:any;

  constructor(
    private httpClient: HttpClient,
  ) {
    loadGraphModel(MODEL_URL)
    .then ((response) => {
      this.graphModel = response;
      this.httpClient.get(DICT_URL, {responseType:  'text'}).subscribe((data) => {
        this.dictionary = data.split('\n');
        this.model = new ImageClassificationModel(this.graphModel, this.dictionary);
      });
    });
  }
}
