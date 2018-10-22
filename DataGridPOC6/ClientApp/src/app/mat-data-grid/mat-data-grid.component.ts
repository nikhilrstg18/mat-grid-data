import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDataGridService } from './../services/mat-data-grid.service';

@Component({
  selector: 'mat-data-grid',
  templateUrl: './mat-data-grid.component.html',
  styleUrls: ['./mat-data-grid.component.css']
})
export class MatDataGridComponent implements OnInit {

  private page: number;
  private pageSize: number;
  private rowData: any[];
  private displayedColumns: any[];
  private hasMoreRecords: boolean;
  private sortToggle: boolean;
  private searchText: string;
  private sortOrder: string;
  private dataSource: MatTableDataSource<any[]>;
  private isScrolling: boolean;
  private scrollingUp: boolean;
  private isSantizedAbove: boolean;
  private isSantizedBelow: boolean;
  private historyPages: number[];
  private futurePages: number[];
  private historyPage: number;
  private futurePage: number;
  private loading: boolean;

  @Input('uri') uri: string;
  @Input('col-defs') colDefs: any[];
  @Input('row-selection') rowSelection: any[];
  @Input('max-block-in-cache') maxBlocksInCache: number;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _gridService: MatDataGridService) {
    this.page = 1;
    this.pageSize = 25;
    this.historyPage = 0;
    this.futurePage = 0;
    this.searchText = "";
    this.sortOrder = "";
    this.hasMoreRecords = true;
    this.sortToggle = true;
    this.isScrolling = false;
    this.scrollingUp = false;
    this.isSantizedBelow = false;
    this.isSantizedAbove = false;
    this.loading = false;
    this.historyPages = [];
    this.futurePages = [];
  }

  //@ server side search
  handleSearch(evt) {
    this.hasMoreRecords = true;
    this.searchText = evt.target.value;
    this.resetGridDataWithInitPage();
    this.getRows();
  }

  //@ server side sort & clear sort
  handleSort(evt: Event, value: string) {
    if (value === 'remove') {
      this.dataSource.sort.direction = '';
      this.sortOrder = '';
      this.sortToggle = true;
      evt.stopPropagation();
    } else {
      if (this.sortToggle) {
        this.dataSource.sort.direction = 'asc';
        this.sortOrder = 'asc';
        this.sortToggle = !this.sortToggle;
      } else {
        this.dataSource.sort.direction = 'desc';
        this.sortOrder = 'desc';
        this.sortToggle = !this.sortToggle;
      }
    }
    this.resetGridDataWithInitPage();
    this.getRows();
  }

  //@ server side pageSize
  handleRowSelection(evt) {
    this.hasMoreRecords = true;
    this.resetGridDataWithInitPage();
    this.getRows();
  }

  //@ handling scroll up and scroll down event
  handleTableScroll(evt) {
    // limiting to first scroll event
    const minScrollTime = 50;
    if (this.isScrolling == false) {
      var tableViewHeight = evt.target.offsetHeight
      var tableScrollHeight = evt.target.scrollHeight
      var scrollLocation = evt.target.scrollTop;
      // If the user has scrolled within 300px of the bottom, add more data
      var buffer = 300;
      var limit = tableScrollHeight - tableViewHeight - buffer;
      this.scrollingUp = (scrollLocation < tableViewHeight && this.isSantizedAbove) ? true : false;

      if (this.scrollingUp && this.historyPages.length > 0) {
        //@ on scroll up
        if (scrollLocation <= limit) {
          //@ reading last history page
          console.log("historyPages before scroll : " + this.historyPages);          
          this.historyPage = this.isSantizedAbove && this.historyPages.pop();       
          console.log("historyPages after scroll : " + this.historyPages);   
          this.getRows();          
        }
      } else {
        //@ on scroll down
        if (scrollLocation > limit && this.hasMoreRecords) {
          if (this.futurePages.length > 0) {
            //@ reading next future page 
            console.log("futurePages before scroll: " + this.futurePages);            
            this.futurePage = this.isSantizedBelow && this.futurePages.pop();
            console.log("futurePages after scroll: " + this.futurePages);
            //@ curernt page will be last result of futurePages on scroll down
            if (this.futurePages.length == 0 && this.isSantizedBelow) {
              this.page = this.futurePage;
            }            
          } else {
            this.page = this.page + 1;
          }
          this.getRows();
        }
      }
      this.isScrolling = true;
      setTimeout(() => {
        this.isScrolling = false;
      }, minScrollTime);
    }
  }

  ngOnInit() {
    this.displayedColumns = this.colDefs.map(col => { return col.field });
    this.getRows();
  }

  // private methods
  // ================================

  private getRows() {
    var queryParams = null;
    //@ always paging in query params
    if (this.scrollingUp) {
      queryParams = { 'page': this.historyPage.toString(), 'pageSize': this.pageSize.toString() };
      console.log(`asking for ${(this.historyPage - 1) * this.pageSize} to ${this.historyPage * this.pageSize - 1} records`);
    } else {
      if (this.futurePages.length > 0) {
        queryParams = { 'page': this.futurePage.toString(), 'pageSize': this.pageSize.toString() };
        console.log(`asking for ${(this.futurePage - 1) * this.pageSize} to ${this.futurePage * this.pageSize - 1} records`);
      } else {
        queryParams = { 'page': this.page.toString(), 'pageSize': this.pageSize.toString() };
        console.log(`asking for ${(this.page - 1) * this.pageSize} to ${this.page * this.pageSize - 1} records`);
      }
    }

    //@ optional search inclusive with paging
    if (this.searchText) {
      Object.assign(queryParams, { 'query': this.searchText });
    }
    //@ optional sorting inclusive with paging
    if (this.sortOrder) {
      Object.assign(queryParams, { 'sort': this.sortOrder });
    }

    //@ fetching grid data from server
    this.loading = true;
    this._gridService.getRows(this.uri, queryParams).subscribe((rows: any[]) => {
      //@ check for last set of record
      this.hasMoreRecords = !(rows.length < this.page);
      this.page = !this.hasMoreRecords ? this.page - 1 : this.page;

      if (rows.length > 0) {
        if (this.rowData && this.rowData.length > 0) {
          this.rowData = this.scrollingUp ? rows.concat(this.rowData) : this.rowData.concat(rows);
          //@ sanitize rowData if more than 'maxBlocksInCache' record set in browser memory
          if (this.rowData.length > this.maxBlocksInCache * this.pageSize) {
            if (this.scrollingUp) {
              this.sanitzeRowData('bottom');
            } else {
              this.sanitzeRowData('top');
            }
          }
          this.dataSource = new MatTableDataSource(this.rowData);
          this.dataSource.sort = this.sort;
          console.log(`total records in client memory: ${this.rowData.length}`);
        } else {
          this.rowData = rows
          this.dataSource = new MatTableDataSource(rows);
          this.dataSource.sort = this.sort;
          console.log(`total records in client memory: ${this.rowData.length}`);
        }
      }
      this.loading = false;
    });
  }

  //@ sanitize the rowData top / bottom
  private sanitzeRowData(topBottom: string) {
    console.log(`# of records before sanitizing at ${topBottom}: ${this.rowData.length}`);
    switch (topBottom) {
      case 'top':
        this.rowData = this.rowData.splice(this.pageSize, this.rowData.length);
        var pushPage = this.historyPages.length > 0 ? this.historyPages[this.historyPages.length - 1] + 1 : !this.isSantizedBelow ? this.page - this.maxBlocksInCache : 1;
        this.historyPages.push(pushPage);
        this.isSantizedAbove = true;
        console.log("historyPages: " + this.historyPages);
        break;
      case 'bottom':
        this.rowData = this.rowData.splice(0, this.rowData.length - this.pageSize);
        var pushPage = this.futurePages.length > 0 ? this.futurePages[this.futurePages.length - 1] - 1 : this.page;
        this.futurePages.push(pushPage);
        this.isSantizedBelow = true;
        console.log("futurePages: " + this.futurePages);
        this.hasMoreRecords = true;
        break;
    }    
    console.log(`# of records before sanitizing at ${topBottom}: ${this.rowData.length}`);
  }

  //@ reset the grid data
  private resetGridDataWithInitPage() {
    this.rowData = [];
    this.page = 1;
    this.futurePage = 0;
    this.futurePages = [];
    this.historyPage = 0;
    this.historyPages = [];
  }

  // ================================

}