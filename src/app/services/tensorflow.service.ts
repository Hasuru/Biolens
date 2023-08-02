import { Injectable } from '@angular/core';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
import { ImageClassificationModel, ImageInput } from '@tensorflow/tfjs-automl';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import '@tensorflow/tfjs-backend-webgl';
import { DatabaseService } from './database.service';

const DRAGONLENS_MODEL = '../../assets/models/Dragonlens/model.json';
const DRAGONLENS_DICT = '../../assets/models/Dragonlens/dict.txt';

const FLORALENS_MODEL = '../../assets/models/Floralens/model.json';
const FLORALENS_DICT = '../../assets/models/Floralens/dict.txt';

const LEPILENS_MODEL = '../../assets/models/Lepilens/model.json';
const LEPILENS_DICT = '../../assets/models/Lepilens/dict.txt';

const MOTHLENS_MODEL = '../../assets/models/Mothlens/model.json';
const MOTHLENS_DICT = '../../assets/models/Mothlens/dict.txt';

@Injectable({
  providedIn: 'root'
})
export class TensorflowService {
  // Model Flag: should sinalize which model the app is currently using
  public modelFlag: string = 'Floralens';
  public models: {modelname:string, modelicon:string}[] = [
    {modelname:'Dragonlens', modelicon:'../../assets/icon/dragon.png'},
    {modelname:'Floralens', modelicon:'../../assets/icon/flora.png'},
    {modelname:'Lepilens', modelicon:'../../assets/icon/lepi.png'},
    {modelname:'Mothlens', modelicon:'../../assets/icon/moth.png'}
  ];

  private graphModel: any;
  private dictionary: any;
  public model: any;

  // Models
  private dragonlens: any;
  private floralens: any;
  private lepilens: any;
  private mothlens: any;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.loadDragonLens();
    this.loadFloraLens();
    this.loadLepiLens();
    this.loadMothLens();
  }

  loadDragonLens() {
    loadGraphModel(DRAGONLENS_MODEL)
    .then ((response) => {
      this.graphModel = response;
      this.httpClient.get(DRAGONLENS_DICT, {responseType:  'text'}).subscribe((data) => {
        this.dictionary = data.split('\n');
        this.dragonlens = new ImageClassificationModel(this.graphModel, this.dictionary);
      });
    });
  }

  loadFloraLens() {
    loadGraphModel(FLORALENS_MODEL)
    .then ((response) => {
      this.graphModel = response;
      this.httpClient.get(FLORALENS_DICT, {responseType:  'text'}).subscribe((data) => {
        this.dictionary = data.split('\n');
        this.floralens = new ImageClassificationModel(this.graphModel, this.dictionary);
        this.model = this.floralens;
      });
    });
  }

  loadLepiLens() {
    loadGraphModel(LEPILENS_MODEL)
    .then ((response) => {
      this.graphModel = response;
      this.httpClient.get(LEPILENS_DICT, {responseType:  'text'}).subscribe((data) => {
        this.dictionary = data.split('\n');
        this.lepilens = new ImageClassificationModel(this.graphModel, this.dictionary);
      });
    });
  }

  loadMothLens() {
    loadGraphModel(MOTHLENS_MODEL)
    .then ((response) => {
      this.graphModel = response;
      this.httpClient.get(MOTHLENS_DICT, {responseType:  'text'}).subscribe((data) => {
        this.dictionary = data.split('\n');
        this.mothlens = new ImageClassificationModel(this.graphModel, this.dictionary);
      });
    });
  }
}
