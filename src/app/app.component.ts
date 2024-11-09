import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { LoaderComponent } from "./shared/loader/loader.component";
import { AlertService } from './services/alert.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class AppComponent {
  title = 'votacionesLiceo';
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  loader=false;
  estudiantes: any[] = [];

  constructor
  (
    private alert : AlertService
  )
  {

  }
async  ngOnInit(){
 await   this.getSudents();
  }

  formRegister = new FormGroup({
    nombres: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required)
  })

 async saveStudent(form:any){
  this.loader=true;
    console.log('form', form);
    form.telefono = '0'+form.telefono+''
    console.log("DB === > ", this.db);
    const estudiantesRef = collection(this.db, "estudiantes");
    console.log("estudiantesRef === > ", estudiantesRef);
    try {
      for(let es of this.estudiantes){
        if(es.nombres == form.nombres || es.telefono === form.telefono){
          this.alert.alertDanger("Ya se encuentra registrado",'')
          this.loader=false;
          this.formRegister.reset();

        }else{
          const docRef = await addDoc(estudiantesRef, {
            nombres: form.nombres,
            telefono:form.telefono
            });
            console.log("Document written with ID: ", docRef.id);
            this.loader=false;
            this.formRegister.reset();
            this.alert.alertSuccess('Registro completado exitosamente','')
        }
      }



    } catch (error) {
      console.error("Error adding document: ", error);
      this.loader=false;

    }

    // addDoc(estudiantesRef, {
    //   nombres: form.nombres,
    //   telefono:form.telefono
    // })
    // .then((docRef) => {
    //   console.log("Document written with ID: ", docRef.id);
    // })
    // .catch((error) => {
    //   console.error("Error adding document: ", error);
    // });

    
 }

 async getSudents(){
  this.loader=true;
  const estudiantesRef = collection(this.db, "estudiantes");

  getDocs(estudiantesRef)
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      const data = doc.data() as any;
      this.estudiantes.push(data);
      console.log('TODOS LOS ESTUDIANTES', this.estudiantes);
      this.loader=false;

    });
  })
  .catch((error) => {
    console.error("Error al obtener los documentos: ", error);
    this.loader=false;

  });
 }
 


  
}
