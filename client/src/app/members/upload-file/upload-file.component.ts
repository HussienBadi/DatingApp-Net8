import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_Models/Member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_Services/account.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [NgIf,NgFor,NgStyle,NgClass,FileUploadModule,DecimalPipe],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})
export class UploadFileComponent implements OnInit {
  private accountservice = inject(AccountService);
  private sanitizer = inject(DomSanitizer);

  member = input.required<Member>();
  memberChange = output<Member>();

 uploader?:FileUploader
 hasBaseDropZoneOver = false;
 baseUrl =environment.ApiUrl;
 previewUrl: string | ArrayBuffer | null = null;

 contentType? :string =""
 binaryData: Uint8Array = new Uint8Array();
 fileType:string =""
 fileUrl: SafeResourceUrl | null = null; // Use SafeResourceUrl to avoid the error


  ngOnInit(): void {
   this.initializeUploader()

  }

  fileOverBase(e:any){

    this.hasBaseDropZoneOver =e;

  }

  initializeUploader(){
    this.uploader = new FileUploader({
      //url : this.baseUrl + 'users/add-photo',
      url : this.baseUrl + 'users/upload-file',
      authToken: 'Bearer ' +this.accountservice.currentUser()?.token,
      isHTML5:true,
      allowedFileType: ['image', 'pdf', 'doc'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10 *1024 *1024
    })

    this.uploader.onAfterAddingFile = (file) => {
      // Generate a preview for image or text files
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = reader.result;
        reader.readAsDataURL(file._file); // Read file as a data URL
      };
    }

    // this.uploader.onAfterAddingFile = (file) => {
    //   file.withCredentials = false
    // }

    this.uploader.onSuccessItem = (item,responce,status,headers) =>{

      const file = JSON.parse(responce);
      const updatedMember ={...this.member()};
      updatedMember.uploadFiles.push(file);
      this.memberChange.emit(updatedMember);
    }

    // this.uploader.onSuccessItem = (item,responce,status,headers) =>{

    //   const photo = JSON.parse(responce);

    //   const updatedMember ={...this.member()};
    //   updatedMember.photos.push(photo);
    //   this.memberChange.emit(updatedMember);
    // }
  }



  loadFile(fileId: number) {

      var file = this.member().uploadFiles.find(f=>f.id == fileId);
      this.contentType = file?.contentType;
      /// Example binary data initialization (replace with your actual data)
      const encoder = new TextEncoder();
      // this.binaryData = encoder.encode(file?.fileData);

       this.binaryData = new Uint8Array([
        // Example PDF header bytes (replace with actual binary data)
        0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x33, 0x0A
      ]);

    // Convert the binary data into a file URL
    this.processBinaryData();
  }



  processBinaryData(): void {
    try {
      const blob = new Blob([this.binaryData], { type: 'application/pdf' }); // Adjust MIME type
      const unsafeUrl = URL.createObjectURL(blob); // Generate the blob URL
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl); // Sanitize the URL
    } catch (error) {
      console.error('Error creating blob URL:', error);
    }
  }

  }
