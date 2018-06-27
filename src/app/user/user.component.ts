import { Component, OnInit, Input } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { PagingDto, ServiceResponse, BaseDto, ResultType } from '../code/dto';
import { Location, getLocaleDateTimeFormat } from '@angular/common';
import { PageEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA, Sort } from '@angular/material';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  private url = 'http://localhost:5001/api/example'; // config servis ten gelecek.

  dtoList: any = [];
  entryDto: any = {};
  searchDto: BaseDto = new BaseDto();
  pagingDto: PagingDto = new PagingDto();

  constructor(
    private crudService: CrudService,
    private location: Location,
    public dialog: MatDialog,
  ) {
    this.list();
  }

  ngOnInit() {

  }

  //#region CRUD Operations

  postOrPut(): void {
    if (!this.isValid(this.entryDto)) { return; }
    if (this.entryDto.Id == null) {
      this.crudService.post(this.entryDto, `${this.url}/postuser`).subscribe(serviceResponse => {
        this.entryDto.Id = serviceResponse.Data;
        this.dtoList.push(this.entryDto);
        this.resetEntry();
      });
    } else {
      this.crudService.put(this.entryDto, `${this.url}/putuser`).subscribe(serviceResponse => {
        const i = this.dtoList.findIndex((obj => obj.Id === this.entryDto.Id));
        this.dtoList[i] = this.entryDto;
        this.resetEntry();
      });
    }
  }

  get(dto: BaseDto): void {
    this.crudService.get(dto.Id, `${this.url}/getuser`).subscribe(serviceResponse => {
      this.entryDto = Object.assign({}, serviceResponse.Data);
    });
  }

  delete(dto: BaseDto): void {
    this.crudService.delete(dto.Id, `${this.url}/deleteuser`).subscribe(serviceResponse => {
      this.dtoList = this.dtoList.filter(h => h !== dto);
    });
  }

  list(): void {
    this.crudService.list(this.searchDto, this.pagingDto, `${this.url}/listuser`).subscribe(
      serviceResponse => {
        this.dtoList = serviceResponse.Data;
        this.pagingDto.count = serviceResponse.TotalCount;
      }
    );
  }

  // #endregion CRUD

  isValid(obj) {
    if (obj.Name == null) {
      alert('Lutfen zorunlu alanlari doldurunuz!');
      return false;
    } else {
      return true;
    }
  }

  resetEntry() {
    this.entryDto = new BaseDto();
    this.entryDto.UpdatedBy = 0;
    this.entryDto.UpdateDate = new Date();
  }

  goBack(): void {
    this.location.back();
  }

  openDialog(dto: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { dto: dto }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation === 'YES') {
        this.delete(result.dto);
      }
      console.log('The dialog was closed');
    });
  }

  changePage(pageEvent: PageEvent): void {
    this.pagingDto.count = pageEvent.length;
    this.pagingDto.pageSize = pageEvent.pageSize;
    this.pagingDto.pageNumber = pageEvent.pageIndex + 1;
    this.list();
  }


  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      return;
    }
    // local paging
    this.dtoList = this.dtoList.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Name': return this.compare(a.Name, b.Name, isAsc);
        case 'LastName': return this.compare(a.LastName, b.LastName, isAsc);
        case 'BirthDate': return this.compare(a.BirthDate, b.BirthDate, isAsc);
        default: return 0;
      }
    });

    // Database paging
    // this.pagingDto.order  = sort.direction;
    // this.list();
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


}
