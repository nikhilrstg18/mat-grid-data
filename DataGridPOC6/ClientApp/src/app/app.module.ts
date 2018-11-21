// angular Module
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// component | services
import { AppComponent } from './app.component';
import { MatDataGridComponent } from './mat-data-grid/mat-data-grid.component';
import { MatDataGridService } from './services/mat-data-grid.service';


@NgModule({
  declarations: [
    AppComponent,
    MatDataGridComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule
  ],
  providers: [
    MatDataGridService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
