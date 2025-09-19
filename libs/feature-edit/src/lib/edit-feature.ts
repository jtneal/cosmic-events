import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '@cosmic-events/data-access';
import { EventDto, PanelDto, SpeakerDto } from '@cosmic-events/util-dtos';
import { firstValueFrom, map, of, switchMap } from 'rxjs';

@Component({
  imports: [
    CdkDrag,
    CdkDropList,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe, provideNativeDateAdapter()],
  selector: 'lib-edit-feature',
  styleUrl: './edit-feature.scss',
  templateUrl: './edit-feature.html',
})
export class EditFeature implements OnInit {
  private readonly datePipe = inject(DatePipe);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(EventService);

  public headerImageFile: File | null = null;
  public isChecked = false;
  public marketingPosterFile: File | null = null;
  public speakerPhotoFiles: (File | null)[] = [];

  public form = this.formBuilder.group({
    id: [''],
    title: ['', Validators.required],
    subtitle: ['', Validators.required],
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
    isPublished: [false],
    organizerName: ['', Validators.required],
    organizerUrl: [''],
    panels: this.formBuilder.array([]),
    speakers: this.formBuilder.array([]),
  });

  public event$ = this.route.paramMap.pipe(
    map((params) => params.get('eventId')),
    switchMap((eventId) => {
      if (eventId && eventId !== 'new') {
        return this.service.getUserEvent(eventId);
      }

      return of(new EventDto());
    }),
    takeUntilDestroyed(),
  );

  public get speakers(): FormArray {
    return this.form.get('speakers') as FormArray;
  }

  public get panels(): FormArray {
    return this.form.get('panels') as FormArray;
  }

  public get showGeneratePanelsButton(): boolean {
    return this.panels.length === 0 && this.form.value.startDate !== '' && this.form.value.endDate !== '';
  }

  public ngOnInit(): void {
    this.event$.subscribe((event) => {
      if (event.id) {
        if (event.image) {
          event.image = ''; // can't set files directly, so just clear out the value
        }

        if (event.marketingPoster) {
          event.marketingPoster = ''; // can't set files directly, so just clear out the value
        }

        this.form.reset(event as never);

        for (const panel of event.panels) {
          this.addPanel(Object.assign(new PanelDto(), panel));
        }

        for (const speaker of event.speakers) {
          speaker.imageOriginal = speaker.image;
          speaker.image = ''; // can't set files directly, so just clear out the value
          this.addSpeaker(Object.assign(new SpeakerDto(), speaker));
        }
      }
    });
  }

  public addSpeaker(speaker = new SpeakerDto()): void {
    this.speakers.push(
      this.formBuilder.group({
        description: [speaker.description],
        id: [speaker.id],
        image: [speaker.image],
        imageOriginal: [speaker.imageOriginal],
        name: [speaker.name, Validators.required],
        title: [speaker.title, Validators.required],
      }),
    );
    this.speakerPhotoFiles.push(null);
  }

  public deleteSpeaker(index: number): void {
    this.speakers.removeAt(index);
    this.speakerPhotoFiles.splice(index);
  }

  public addPanel(panel = new PanelDto()): void {
    this.panels.push(
      this.formBuilder.group({
        description: [panel.description, Validators.required],
        id: [panel.id],
        title: [panel.title, Validators.required],
      }),
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
    const formData = new FormData();

    formData.append('data', JSON.stringify(this.form.value));

    if (this.headerImageFile) {
      formData.append('headerImage', this.headerImageFile);
    }

    if (this.marketingPosterFile) {
      formData.append('marketingPoster', this.marketingPosterFile);
    }

    for (const file of this.speakerPhotoFiles) {
      if (file) {
        formData.append(`speakerPhotos`, file);
      }
    }

    await firstValueFrom(this.service.postEvent(formData));
    this.router.navigate(['/manage']);
  }

  public onSpeakerDrop(event: CdkDragDrop<SpeakerDto[]>): void {
    this.moveItemInFormArray(this.speakers, event.previousIndex, event.currentIndex);
    moveItemInArray(this.speakerPhotoFiles, event.previousIndex, event.currentIndex);
  }

  public onPanelDrop(event: CdkDragDrop<PanelDto[]>): void {
    this.moveItemInFormArray(this.panels, event.previousIndex, event.currentIndex);
  }

  public generatePanels(): void {
    if (!this.form.value.startDate || !this.form.value.endDate) {
      return;
    }

    const startDate = new Date(this.form.value.startDate);
    const endDate = new Date(this.form.value.endDate);
    let day = 1;

    while (startDate <= endDate) {
      const panel = new PanelDto();

      panel.title = `Day ${day}: ${this.datePipe.transform(startDate, 'fullDate')}`;
      this.addPanel(panel);
      startDate.setDate(startDate.getDate() + 1);
      day++;
    }
  }

  private moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) {
      return;
    }

    const item = formArray.at(fromIndex);

    formArray.removeAt(fromIndex);
    formArray.insert(toIndex, item);
  }
}
