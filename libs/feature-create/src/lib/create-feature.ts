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
import { EventService } from '@cosmic-events/data-access';

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

  public form = this.formBuilder.group({
    title: ['', Validators.required],
    type: ['', Validators.required],
    location: ['', Validators.required],
    price: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    image: [''],
    marketingPoster: [''],
    website: [''],
    purchaseLink: [''],
    isPublished: [''],
    organizer: this.formBuilder.group({ name: ['', Validators.required], url: [''] }),
    // panels: this.formBuilder.array([
    //   this.formBuilder.group({
    //     title: ['', Validators.required],
    //     description: ['', Validators.required],
    //   }),
    // ]),
    speakers: this.formBuilder.array([]),
  });
  public headerImageFile: File | null = null;
  public isChecked = false;
  public marketingPosterFile: File | null = null;
  public speakerPhotoFiles: (File | null)[] = [];

  public get speakers(): FormArray {
    return this.form.get('speakers') as FormArray;
  }

  public get formStatus(): string {
    if (this.form.invalid) {
      return 'Invalid Entry';
    }

    if (this.form.dirty) {
      return 'Unsaved Changes';
    }

    return 'No Changes';
  }

  public addSpeaker(): void {
    this.speakers.push(this.formBuilder.group({
      description: [''],
      image: [''],
      name: ['', Validators.required],
    }),);
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
      this.speakerPhotoFiles[index] = input.files[0];
    }
  }

  public onSubmit(): void {
    console.log(this.form.value);
  }
}
