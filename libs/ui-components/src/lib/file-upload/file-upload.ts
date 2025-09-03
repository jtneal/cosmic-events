import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'lib-file-upload',
  styleUrl: './file-upload.scss',
  templateUrl: './file-upload.html',
})
export class FileUpload {
  public selectedFile: File | null = null;

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }
}
