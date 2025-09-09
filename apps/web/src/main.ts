import { bootstrapApplication } from '@angular/platform-browser';
import 'reflect-metadata';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch(console.error);
