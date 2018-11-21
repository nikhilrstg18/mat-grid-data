import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDataGridColDef } from './models/mat-data-grid-col-def';

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
      new MatDataGridColDef('status', 'Status', (element: any) => `${element.status != null ? element.status : ''}`, '12.25rem', false),
      new MatDataGridColDef('hardwareId', 'Hardware Id', (element: any) => `${element.hardwareId != null ? element.hardwareId : ''}`, '12.375rem', false),
      new MatDataGridColDef('serviceTag', 'Service Tag', (element: any) => `${element.serviceTag != null ? element.serviceTag : ''}`, '12.375rem', true),
      new MatDataGridColDef('username', 'Username', (element: any) => `${element.username != null ? element.username : ''}`, '12.375rem', false),
      new MatDataGridColDef('ram', 'Ram', (element: any) => `${element.ram != null ? element.ram : ''}`, '12.375rem', false),
      new MatDataGridColDef('cpuUsage', 'CPU Usage', (element: any) => `${element.cpuUsage != null ? element.cpuUsage : ''}`, '12.375rem', false),
      
    ];
    this.maxBlockInCache = 5;

  }
}
