import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastr: ToastrService) {}

  // -------------------------  TOAST SERVICE ------------------------------
  alertDanger( title: any, desc: any ) {
    this.toastr.error( desc, title );
  }

  alertSuccess( title: any, desc: any ) {
    this.toastr.success( desc, title );
  }

  alertWarning( title: any, desc: any ) {
    this.toastr.warning( desc, title );
  }
}
