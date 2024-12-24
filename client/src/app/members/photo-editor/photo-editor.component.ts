import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_Models/Member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_Services/account.service';
import { environment } from '../../../environments/environment';
import { MemberService } from '../../_Services/member.service';
import { Photo } from '../../_Models/Photo';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf,NgFor,NgStyle,NgClass,FileUploadModule,DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  private accountservice = inject(AccountService);
  private memberservice = inject(MemberService);
  member = input.required<Member>();
  memberChange = output<Member>();

 uploader?:FileUploader
 hasBaseDropZoneOver = false;
 baseUrl =environment.ApiUrl;
 previewUrl: string | ArrayBuffer | null = null;

  ngOnInit(): void {
   this.initializeUploader()
  }

  fileOverBase(e:any){
    this.hasBaseDropZoneOver =e;
  }

  setMainPhoto(photo:Photo){
    this.memberservice.setMainPhoto(photo).subscribe({
      next:_=>{
        var user = this.accountservice.currentUser();
        if(user){
          user.photoUrl = photo.url,
          this.accountservice.setCurrentUser(user)
        }

        const updatedMember = {...this.member()};
        updatedMember.photoUrl = photo.url
        updatedMember.photos.forEach(p => {

         if(p.isMain) p.isMain = false;
         if(p.id == photo.id) p.isMain = true;

        });
        this.memberChange.emit(updatedMember)
      }
    })
  }

  deletePhoto(photo:Photo){
    this.memberservice.deletePhoto(photo).subscribe({
      next:_=>{
        const updatedMember = {...this.member()};
        updatedMember.photos = updatedMember.photos.filter(x=>x.id !== photo.id);
        this.memberChange.emit(updatedMember);
      }
    })
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url : this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' +this.accountservice.currentUser()?.token,
      isHTML5:true,
      allowedFileType: ['image'],
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

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item,responce,status,headers) =>{

      const photo = JSON.parse(responce);
      const updatedMember ={...this.member()};
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);

      const user = this.accountservice.currentUser();
      if(photo.isMain){
        if(user){
          user.photoUrl = photo.url,
          this.accountservice.setCurrentUser(user)
        }
        const updatedMember = {...this.member()};
        
        updatedMember.photoUrl = photo.url
        updatedMember.photos.forEach(p => {

         if(p.isMain) p.isMain = false;
         if(p.id == photo.id) p.isMain = true;

        });
        this.memberChange.emit(updatedMember);

      }
    }
  }
}
