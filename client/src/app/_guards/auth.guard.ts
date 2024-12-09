import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_Services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {

  const accountSernice = inject(AccountService);
  const toastrService = inject(ToastrService);

  if (accountSernice.currentUser()){
    return true;
  }
  else
  {
    toastrService.error("You shall not pass!");
    return false;
  }

};
