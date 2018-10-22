import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // private columnDefs: any[];
  private baseUrl: string;
  private resource: string;
  private uri: string;
  private rowsSelections: any[];
  private colDefs: any[];
  private maxBlockInCache: number;

  constructor(private http: HttpClient) {
    this.baseUrl = `https://localhost:44378`;
    this.resource = `/api/values/GetValuePage`;
    this.uri = this.baseUrl + this.resource;
    this.rowsSelections = [
      {
        value: 25,
        viewValue: '25 Rows'
      },
      {
        value: 50,
        viewValue: '50 Rows'
      },
      {
        value: 75,
        viewValue: '75 Rows'
      },
      {
        value: 100,
        viewValue: '100 Rows'
      }
    ];
    this.colDefs = [
      {
        field: 'id',
        fieldHeader: 'Id'
      },
      {
        field: 'name',
        fieldHeader: 'Name'
      },
      {
        field: 'description',
        fieldHeader: 'Description'
      },
      {
        field: 'isComplete',
        fieldHeader: 'Complete'
      },
      {
        field: 'status',
        fieldHeader: 'Status'
      }
    ];
    this.maxBlockInCache = 5;

  }
}
