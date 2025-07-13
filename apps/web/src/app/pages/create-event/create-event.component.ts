import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Event } from '@cosmic-events/util-common';
import { EventService } from '@cosmic-events/data-access-common';

@Component({
  selector: 'app-create-event',
  template: `
    <div class="create-event-container">
      <div class="header-section">
        <h1 class="cosmic-title">Create Your Cosmic Adventure</h1>
        <p class="subtitle">Share your extraordinary journey with fellow explorers</p>
      </div>

      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="event-form">
        <mat-stepper #stepper linear>
          <!-- Basic Information Step -->
          <mat-step [stepControl]="basicInfoGroup" label="Basic Information">
            <div formGroupName="basicInfo" class="step-content">
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Event Title *</mat-label>
                  <input matInput formControlName="title" placeholder="Ancient Mysteries of Egypt" />
                  <mat-error *ngIf="basicInfoGroup.get('title')?.hasError('required')"> Title is required </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Subtitle</mat-label>
                  <input matInput formControlName="subtitle" placeholder="Explore the secrets of the pharaohs" />
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Event Type *</mat-label>
                  <mat-select formControlName="type">
                    @for (type of eventTypes; track type.value) {
                      <mat-option [value]="type.value">{{ type.label }}</mat-option>
                    }
                  </mat-select>
                  <mat-error *ngIf="basicInfoGroup.get('type')?.hasError('required')">
                    Event type is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Featured Image URL</mat-label>
                  <input matInput formControlName="featuredImage" placeholder="https://example.com/image.jpg" />
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description *</mat-label>
                  <textarea matInput formControlName="description" placeholder="Describe your event in detail...">
                  </textarea>
                  <mat-error *ngIf="basicInfoGroup.get('description')?.hasError('required')">
                    Description is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Start Date *</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate" />
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                  <mat-error *ngIf="basicInfoGroup.get('startDate')?.hasError('required')">
                    Start date is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>End Date *</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endDate" />
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                  <mat-error *ngIf="basicInfoGroup.get('endDate')?.hasError('required')">
                    End date is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Video Link (YouTube, Vimeo, etc.)</mat-label>
                  <input matInput formControlName="videoLink" placeholder="https://youtube.com/watch?v=..." />
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-raised-button color="primary" matStepperNext type="button">
                  Next: Speakers
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-step>

          <!-- Speakers Step -->
          <mat-step [stepControl]="speakersArray" label="Speakers & Experts">
            <div class="step-content">
              <div class="section-header">
                <h3>Event Speakers & Experts</h3>
                <button mat-raised-button color="accent" type="button" (click)="addSpeaker()">
                  <mat-icon>person_add</mat-icon>
                  Add Speaker
                </button>
              </div>

              <div formArrayName="speakers" cdkDropList (cdkDropListDropped)="dropSpeaker($event)">
                @for (speaker of speakersArray.controls; track speaker; let i = $index) {
                  <mat-card class="speaker-card" cdkDrag>
                    <mat-card-header>
                      <mat-card-title>Speaker {{ i + 1 }}</mat-card-title>
                      <button mat-icon-button color="warn" type="button" (click)="removeSpeaker(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </mat-card-header>

                    <mat-card-content [formGroupName]="i">
                      <div class="form-row">
                        <mat-form-field appearance="outline" class="half-width">
                          <mat-label>Full Name *</mat-label>
                          <input matInput formControlName="name" placeholder="Dr. Michio Kaku" />
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="half-width">
                          <mat-label>Website/Link</mat-label>
                          <input matInput formControlName="link" placeholder="https://website.com" />
                        </mat-form-field>
                      </div>

                      <div class="form-row">
                        <mat-form-field appearance="outline" class="full-width">
                          <mat-label>Image URL</mat-label>
                          <input matInput formControlName="image" placeholder="https://example.com/speaker.jpg" />
                        </mat-form-field>
                      </div>

                      <div class="form-row">
                        <mat-form-field appearance="outline" class="full-width">
                          <mat-label>Biography</mat-label>
                          <textarea
                            matInput
                            formControlName="biography"
                            placeholder="Speaker's background and expertise..."
                          >
                          </textarea>
                        </mat-form-field>
                      </div>
                    </mat-card-content>
                  </mat-card>
                }
              </div>

              @if (speakersArray.length === 0) {
                <div class="empty-state">
                  <mat-icon>person_off</mat-icon>
                  <p>No speakers added yet. Add speakers to enhance your event's credibility.</p>
                </div>
              }

              <div class="step-actions">
                <button mat-button matStepperPrevious type="button">
                  <mat-icon>arrow_back</mat-icon>
                  Previous
                </button>
                <button mat-raised-button color="primary" matStepperNext type="button">
                  Next: Itinerary
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-step>

          <!-- Itinerary Step -->
          <mat-step [stepControl]="itineraryArray" label="Itinerary">
            <div class="step-content">
              <div class="section-header">
                <h3>Event Itinerary</h3>
                <button mat-raised-button color="accent" type="button" (click)="addItineraryDay()">
                  <mat-icon>add_circle</mat-icon>
                  Add Day
                </button>
              </div>

              <div formArrayName="itinerary" cdkDropList (cdkDropListDropped)="dropItinerary($event)">
                @for (day of itineraryArray.controls; track day; let i = $index) {
                  <mat-expansion-panel class="itinerary-panel" cdkDrag>
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon cdkDragHandle>drag_handle</mat-icon>
                        Day {{ i + 1 }}:
                        {{ day.get('title')?.value || 'Untitled' }}
                      </mat-panel-title>
                      <mat-panel-description>
                        <button
                          mat-icon-button
                          color="warn"
                          type="button"
                          (click)="removeItineraryDay(i); $event.stopPropagation()"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </mat-panel-description>
                    </mat-expansion-panel-header>

                    <div [formGroupName]="i" class="itinerary-content">
                      <div class="form-row">
                        <mat-form-field appearance="outline" class="half-width">
                          <mat-label>Day Title *</mat-label>
                          <input matInput formControlName="title" placeholder="Arrival in Cairo" />
                        </mat-form-field>

                        <mat-form-field appearance="outline" class="half-width">
                          <mat-label>Image URL</mat-label>
                          <input matInput formControlName="image" placeholder="https://example.com/day1.jpg" />
                        </mat-form-field>
                      </div>

                      <div class="form-row">
                        <mat-form-field appearance="outline" class="full-width">
                          <mat-label>Description *</mat-label>
                          <textarea
                            matInput
                            formControlName="description"
                            placeholder="Describe the day's activities..."
                          >
                          </textarea>
                        </mat-form-field>
                      </div>
                    </div>
                  </mat-expansion-panel>
                }
              </div>

              @if (itineraryArray.length === 0) {
                <div class="empty-state">
                  <mat-icon>event_note</mat-icon>
                  <p>No itinerary days added yet. Create a day-by-day schedule for your event.</p>
                </div>
              }

              <div class="step-actions">
                <button mat-button matStepperPrevious type="button">
                  <mat-icon>arrow_back</mat-icon>
                  Previous
                </button>
                <button mat-raised-button color="primary" matStepperNext type="button">
                  Next: Additional Details
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-step>

          <!-- Contact & Pricing Step -->
          <mat-step [stepControl]="contactGroup" label="Contact & Pricing">
            <div class="step-content">
              <div formGroupName="contact" class="contact-section">
                <h3>Contact Information</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Contact Name *</mat-label>
                    <input matInput formControlName="name" placeholder="John Smith" />
                    <mat-error *ngIf="contactGroup.get('name')?.hasError('required')">
                      Contact name is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" formControlName="email" placeholder="contact@example.com" />
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Phone</mat-label>
                    <input matInput formControlName="phone" placeholder="+1 (555) 123-4567" />
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Website</mat-label>
                    <input matInput formControlName="website" placeholder="https://youreventcompany.com" />
                  </mat-form-field>
                </div>

                <p class="contact-note">
                  <mat-icon>info</mat-icon>
                  You must provide at least one way to contact you (email, phone, or website)
                </p>
              </div>

              <div formGroupName="pricing" class="pricing-section">
                <h3>Pricing Information</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Currency *</mat-label>
                    <mat-select formControlName="currency">
                      <mat-option value="$">USD ($)</mat-option>
                      <mat-option value="€">EUR (€)</mat-option>
                      <mat-option value="£">GBP (£)</mat-option>
                      <mat-option value="¥">JPY (¥)</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Double Occupancy Price</mat-label>
                    <input matInput type="number" formControlName="doubleOccupancy" placeholder="2500" />
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Single Occupancy Price</mat-label>
                    <input matInput type="number" formControlName="singleOccupancy" placeholder="3500" />
                  </mat-form-field>
                </div>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious type="button">
                  <mat-icon>arrow_back</mat-icon>
                  Previous
                </button>
                <button mat-raised-button color="primary" matStepperNext type="button">
                  Next: Additional Info
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-step>

          <!-- Additional Information Step -->
          <mat-step label="Additional Information">
            <div class="step-content">
              <!-- Event Legs -->
              <div class="event-legs-section">
                <div class="section-header">
                  <h3>Additional Event Legs</h3>
                  <button mat-raised-button color="accent" type="button" (click)="addEventLeg()">
                    <mat-icon>add_location</mat-icon>
                    Add Event Leg
                  </button>
                </div>

                <div formArrayName="additionalLegs" cdkDropList (cdkDropListDropped)="dropEventLeg($event)">
                  @for (leg of additionalLegsArray.controls; track leg; let i = $index) {
                    <mat-card class="event-leg-card" cdkDrag>
                      <mat-card-header>
                        <mat-card-title>
                          <mat-icon cdkDragHandle>drag_handle</mat-icon>
                          Event Leg {{ i + 1 }}
                        </mat-card-title>
                        <button mat-icon-button color="warn" type="button" (click)="removeEventLeg(i)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </mat-card-header>

                      <mat-card-content [formGroupName]="i">
                        <div class="form-row">
                          <mat-form-field appearance="outline" class="half-width">
                            <mat-label>Title *</mat-label>
                            <input matInput formControlName="title" placeholder="Pre-event: Ancient Rome" />
                          </mat-form-field>

                          <mat-form-field appearance="outline" class="quarter-width">
                            <mat-label>Additional Cost</mat-label>
                            <input matInput type="number" formControlName="additionalCost" placeholder="500" />
                          </mat-form-field>

                          <mat-form-field appearance="outline" class="quarter-width">
                            <mat-label>Position</mat-label>
                            <mat-select formControlName="isBefore">
                              <mat-option [value]="true">Before Main Event</mat-option>
                              <mat-option [value]="false">After Main Event</mat-option>
                            </mat-select>
                          </mat-form-field>
                        </div>

                        <div class="form-row">
                          <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Image URL</mat-label>
                            <input matInput formControlName="image" placeholder="https://example.com/leg.jpg" />
                          </mat-form-field>
                        </div>

                        <div class="form-row">
                          <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Description *</mat-label>
                            <textarea
                              matInput
                              formControlName="description"
                              placeholder="Describe this additional event leg..."
                            >
                            </textarea>
                          </mat-form-field>
                        </div>
                      </mat-card-content>
                    </mat-card>
                  }
                </div>
              </div>

              <!-- More Information -->
              <div class="more-info-section">
                <div class="section-header">
                  <h3>More Information</h3>
                  <button mat-raised-button color="accent" type="button" (click)="addMoreInfo()">
                    <mat-icon>add_box</mat-icon>
                    Add Info Section
                  </button>
                </div>

                <div formArrayName="moreInfo" cdkDropList (cdkDropListDropped)="dropMoreInfo($event)">
                  @for (info of moreInfoArray.controls; track info; let i = $index) {
                    <mat-expansion-panel class="more-info-panel" cdkDrag>
                      <mat-expansion-panel-header>
                        <mat-panel-title>
                          <mat-icon cdkDragHandle>drag_handle</mat-icon>
                          {{ info.get('title')?.value || 'Untitled Section' }}
                        </mat-panel-title>
                        <mat-panel-description>
                          <button
                            mat-icon-button
                            color="warn"
                            type="button"
                            (click)="removeMoreInfo(i); $event.stopPropagation()"
                          >
                            <mat-icon>delete</mat-icon>
                          </button>
                        </mat-panel-description>
                      </mat-expansion-panel-header>

                      <div [formGroupName]="i" class="more-info-content">
                        <div class="form-row">
                          <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Section Title *</mat-label>
                            <input matInput formControlName="title" placeholder="What to Bring" />
                          </mat-form-field>
                        </div>

                        <div class="form-row">
                          <mat-form-field appearance="outline" class="full-width">
                            <mat-label>Description *</mat-label>
                            <textarea
                              matInput
                              formControlName="description"
                              placeholder="Detailed information for this section..."
                            >
                            </textarea>
                          </mat-form-field>
                        </div>
                      </div>
                    </mat-expansion-panel>
                  }
                </div>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious type="button">
                  <mat-icon>arrow_back</mat-icon>
                  Previous
                </button>
                <button mat-raised-button color="primary" type="submit" [disabled]="eventForm.invalid || saving()">
                  <mat-icon>{{ saving() ? 'hourglass_empty' : 'save' }}</mat-icon>
                  {{ saving() ? 'Saving...' : 'Save as Draft' }}
                </button>
                <button
                  mat-raised-button
                  color="accent"
                  type="button"
                  (click)="publishEvent()"
                  [disabled]="eventForm.invalid || saving()"
                >
                  <mat-icon>publish</mat-icon>
                  Publish Event
                </button>
              </div>
            </div>
          </mat-step>
        </mat-stepper>
      </form>
    </div>
  `,
  styles: [
    `
      .create-event-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .header-section {
        text-align: center;
        margin-bottom: 3rem;
      }

      .subtitle {
        font-size: 1.2rem;
        color: var(--cosmic-text-secondary);
        margin-top: 0.5rem;
      }

      .event-form {
        background: rgba(26, 26, 62, 0.6);
        border-radius: 16px;
        padding: 2rem;
        backdrop-filter: blur(10px);
        border: 1px solid var(--cosmic-border);
      }

      .step-content {
        padding: 2rem 0;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .section-header h3 {
        font-family: 'Orbitron', monospace;
        color: var(--cosmic-text);
        margin: 0;
      }

      .form-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .full-width {
        flex: 1;
      }
      .half-width {
        flex: 1;
        max-width: calc(50% - 0.5rem);
      }
      .third-width {
        flex: 1;
        max-width: calc(33.333% - 0.67rem);
      }
      .quarter-width {
        flex: 1;
        max-width: calc(25% - 0.75rem);
      }

      .speaker-card,
      .event-leg-card {
        margin-bottom: 1rem;
        background: rgba(45, 45, 95, 0.5);
        border: 1px solid var(--cosmic-border);
      }

      .speaker-card mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .itinerary-panel,
      .more-info-panel {
        margin-bottom: 1rem;
        background: rgba(45, 45, 95, 0.5);
        border: 1px solid var(--cosmic-border);
      }

      .itinerary-content,
      .more-info-content {
        padding: 1rem 0;
      }

      .contact-section,
      .pricing-section,
      .event-legs-section,
      .more-info-section {
        margin-bottom: 3rem;
      }

      .contact-note {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--cosmic-text-secondary);
        font-size: 0.875rem;
        margin-top: 1rem;
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--cosmic-text-secondary);
      }

      .empty-state mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
      }

      .step-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--cosmic-border);
      }

      .cdk-drag-preview {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        border-radius: 8px;
        background: rgba(26, 26, 62, 0.9);
      }

      .cdk-drag-placeholder {
        opacity: 0.5;
        background: var(--cosmic-dark-tertiary);
        border: 2px dashed var(--cosmic-border);
        border-radius: 8px;
      }

      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }

      @media (max-width: 768px) {
        .create-event-container {
          padding: 1rem 0.5rem;
        }

        .form-row {
          flex-direction: column;
        }

        .half-width,
        .third-width,
        .quarter-width {
          max-width: 100%;
        }

        .section-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .step-actions {
          flex-direction: column;
        }
      }
    `,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatExpansionModule,
    MatSnackBarModule,
    DragDropModule,
  ],
})
export class CreateEventComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  eventForm!: FormGroup;
  saving = signal(false);
  eventTypes = this.eventService.getEventTypes();

  // Form groups for easier access
  get basicInfoGroup() {
    return this.eventForm.get('basicInfo') as FormGroup;
  }
  get contactGroup() {
    return this.eventForm.get('contact') as FormGroup;
  }
  get speakersArray() {
    return this.eventForm.get('speakers') as FormArray;
  }
  get itineraryArray() {
    return this.eventForm.get('itinerary') as FormArray;
  }
  get additionalLegsArray() {
    return this.eventForm.get('additionalLegs') as FormArray;
  }
  get moreInfoArray() {
    return this.eventForm.get('moreInfo') as FormArray;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      basicInfo: this.fb.group({
        title: ['', Validators.required],
        subtitle: [''],
        type: ['', Validators.required],
        description: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        videoLink: [''],
        featuredImage: [''],
      }),
      speakers: this.fb.array([]),
      itinerary: this.fb.array([]),
      additionalLegs: this.fb.array([]),
      moreInfo: this.fb.array([]),
      contact: this.fb.group({
        name: ['', Validators.required],
        email: [''],
        phone: [''],
        website: [''],
      }),
      pricing: this.fb.group({
        currency: ['$', Validators.required],
        doubleOccupancy: [''],
        singleOccupancy: [''],
      }),
    });
  }

  // Speaker methods
  createSpeakerGroup(): FormGroup {
    return this.fb.group({
      id: [this.eventService.generateId()],
      name: ['', Validators.required],
      link: [''],
      image: [''],
      biography: ['', Validators.required],
      order: [this.speakersArray.length],
    });
  }

  addSpeaker(): void {
    this.speakersArray.push(this.createSpeakerGroup());
  }

  removeSpeaker(index: number): void {
    this.speakersArray.removeAt(index);
    this.updateSpeakerOrders();
  }

  dropSpeaker(event: CdkDragDrop<any[]>): void {
    const array = this.speakersArray;
    const from = event.previousIndex;
    const to = event.currentIndex;

    const item = array.at(from);
    array.removeAt(from);
    array.insert(to, item);
    this.updateSpeakerOrders();
  }

  private updateSpeakerOrders(): void {
    this.speakersArray.controls.forEach((control, index) => {
      control.get('order')?.setValue(index);
    });
  }

  // Itinerary methods
  createItineraryGroup(): FormGroup {
    return this.fb.group({
      id: [this.eventService.generateId()],
      title: ['', Validators.required],
      image: [''],
      description: ['', Validators.required],
      order: [this.itineraryArray.length],
    });
  }

  addItineraryDay(): void {
    this.itineraryArray.push(this.createItineraryGroup());
  }

  removeItineraryDay(index: number): void {
    this.itineraryArray.removeAt(index);
    this.updateItineraryOrders();
  }

  dropItinerary(event: CdkDragDrop<any[]>): void {
    const array = this.itineraryArray;
    const from = event.previousIndex;
    const to = event.currentIndex;

    const item = array.at(from);
    array.removeAt(from);
    array.insert(to, item);
    this.updateItineraryOrders();
  }

  private updateItineraryOrders(): void {
    this.itineraryArray.controls.forEach((control, index) => {
      control.get('order')?.setValue(index);
    });
  }

  // Event Leg methods
  createEventLegGroup(): FormGroup {
    return this.fb.group({
      id: [this.eventService.generateId()],
      title: ['', Validators.required],
      image: [''],
      description: ['', Validators.required],
      additionalCost: [''],
      isBefore: [true],
      order: [this.additionalLegsArray.length],
    });
  }

  addEventLeg(): void {
    this.additionalLegsArray.push(this.createEventLegGroup());
  }

  removeEventLeg(index: number): void {
    this.additionalLegsArray.removeAt(index);
    this.updateEventLegOrders();
  }

  dropEventLeg(event: CdkDragDrop<any[]>): void {
    const array = this.additionalLegsArray;
    const from = event.previousIndex;
    const to = event.currentIndex;

    const item = array.at(from);
    array.removeAt(from);
    array.insert(to, item);
    this.updateEventLegOrders();
  }

  private updateEventLegOrders(): void {
    this.additionalLegsArray.controls.forEach((control, index) => {
      control.get('order')?.setValue(index);
    });
  }

  // More Info methods
  createMoreInfoGroup(): FormGroup {
    return this.fb.group({
      id: [this.eventService.generateId()],
      title: ['', Validators.required],
      description: ['', Validators.required],
      order: [this.moreInfoArray.length],
    });
  }

  addMoreInfo(): void {
    this.moreInfoArray.push(this.createMoreInfoGroup());
  }

  removeMoreInfo(index: number): void {
    this.moreInfoArray.removeAt(index);
    this.updateMoreInfoOrders();
  }

  dropMoreInfo(event: CdkDragDrop<any[]>): void {
    const array = this.moreInfoArray;
    const from = event.previousIndex;
    const to = event.currentIndex;

    const item = array.at(from);
    array.removeAt(from);
    array.insert(to, item);
    this.updateMoreInfoOrders();
  }

  private updateMoreInfoOrders(): void {
    this.moreInfoArray.controls.forEach((control, index) => {
      control.get('order')?.setValue(index);
    });
  }

  // Form submission
  onSubmit(): void {
    if (this.eventForm.valid) {
      this.saveEvent('draft');
    } else {
      this.showFormErrors();
    }
  }

  publishEvent(): void {
    if (this.eventForm.valid && this.validateContactInfo()) {
      this.saveEvent('published');
    } else {
      this.showFormErrors();
    }
  }

  private saveEvent(status: 'draft' | 'published'): void {
    this.saving.set(true);

    const formValue = this.eventForm.value;
    const event: Partial<Event> = {
      ...formValue.basicInfo,
      speakers: formValue.speakers,
      itinerary: formValue.itinerary,
      additionalLegs: formValue.additionalLegs,
      moreInfo: formValue.moreInfo,
      contactInfo: formValue.contact,
      pricing: formValue.pricing,
      status,
      isPromoted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.eventService.createEvent(event).subscribe({
      next: (savedEvent) => {
        this.saving.set(false);
        const message = status === 'published' ? 'Event published successfully!' : 'Event saved as draft!';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.router.navigate(['/my-events']);
      },
      error: (error) => {
        this.saving.set(false);
        console.error('Error saving event:', error);
        this.snackBar.open('Error saving event. Please try again.', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  private validateContactInfo(): boolean {
    const contact = this.contactGroup.value;
    return !!(contact.email || contact.phone || contact.website);
  }

  private showFormErrors(): void {
    this.snackBar.open('Please fill in all required fields', 'Close', {
      duration: 3000,
    });
  }
}
