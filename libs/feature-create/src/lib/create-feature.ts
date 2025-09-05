import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { EventService } from '@cosmic-events/data-access';
import { EventDto } from '@cosmic-events/util-dtos';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  selector: 'lib-create-feature',
  styleUrl: './create-feature.scss',
  templateUrl: './create-feature.html',
})
export class CreateFeature {
  private readonly event = inject(EventService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  public form = this.formBuilder.group({
    title: ['This is my event title', Validators.required],
    type: ['Guided Tours', Validators.required],
    location: ['Egypt', Validators.required],
    price: ['5000', Validators.required],
    description: ['This is my event description.'],
    startDate: [new Date('9/14/2025'), Validators.required],
    endDate: [new Date('9/30/2025'), Validators.required],
    image: [''],
    marketingPoster: [''],
    website: ['https://www.cosmicevents.app'],
    purchaseLink: ['https://www.cosmicevents.app'],
    isPublished: [true],
    organizerName: ['Organizer Name', Validators.required],
    organizerUrl: ['https://www.cosmicevents.app'],
    panels: this.formBuilder.array([
      this.formBuilder.group({
        description: ['This is my panel description.', Validators.required],
        title: ['This is my panel title', Validators.required],
      }),
    ]),
    speakers: this.formBuilder.array([
      this.formBuilder.group({
        description: ['This is my speaker description.'],
        image: [''],
        name: ['Speaker Name', Validators.required],
      }),
    ]),
  });
  // public form = this.formBuilder.group({
  //   title: ['', Validators.required],
  //   type: ['', Validators.required],
  //   location: ['', Validators.required],
  //   price: ['', Validators.required],
  //   description: [''],
  //   startDate: ['', Validators.required],
  //   endDate: ['', Validators.required],
  //   image: [''],
  //   marketingPoster: [''],
  //   website: [''],
  //   purchaseLink: [''],
  //   isPublished: [false],
  //   organizer: this.formBuilder.group({ name: ['', Validators.required], url: [''] }),
  //   panels: this.formBuilder.array([]),
  //   speakers: this.formBuilder.array([]),
  // });
  public headerImageFile: File | null = null;
  public isChecked = false;
  public marketingPosterFile: File | null = null;
  public speakerPhotoFiles: (File | null)[] = [];

  public get speakers(): FormArray {
    return this.form.get('speakers') as FormArray;
  }

  public get panels(): FormArray {
    return this.form.get('panels') as FormArray;
  }

  public addSpeaker(): void {
    this.speakers.push(
      this.formBuilder.group({
        description: [''],
        image: [''],
        name: ['', Validators.required],
      })
    );
    this.speakerPhotoFiles.push(null);
  }

  public deleteSpeaker(index: number): void {
    this.speakers.removeAt(index);
    this.speakerPhotoFiles.splice(index);
  }

  public addPanel(): void {
    this.panels.push(
      this.formBuilder.group({
        description: ['', Validators.required],
        title: ['', Validators.required],
      })
    );
  }

  public deletePanel(index: number): void {
    this.panels.removeAt(index);
  }

  public onHeaderImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.headerImageFile = input.files[0];
    }
  }

  public onMarketingPosterSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.marketingPosterFile = input.files[0];
    }
  }

  public onSpeakerPhotoSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file = input.files[0];

      this.speakerPhotoFiles[index] = file;
      this.speakers.at(index).get('image')?.setValue(file.name);
    }
  }

  public async onSubmit(): Promise<void> {
    await firstValueFrom(this.event.postEvent(this.form.value as unknown as EventDto));
    this.router.navigate(['/manage']);
  }
}
