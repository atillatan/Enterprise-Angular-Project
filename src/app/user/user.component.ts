import { Component, OnInit, Input } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { PagingDto, ServiceResponse, BaseDto, ResultType } from '../code/dto';
import { ActivatedRoute } from '@angular/router';
import { Location, getLocaleDateTimeFormat } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  private url = 'http://localhost:5001/api/example'; // config servis ten gelecek.

  dtoList: any = [];
  entryDto: any = {};
  serarchDto: BaseDto = new BaseDto();
  pagingDto: PagingDto = new PagingDto();

  constructor(
    private crudService: CrudService,
    private route: ActivatedRoute,
    private location: Location
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
    this.crudService.list(this.serarchDto, this.pagingDto, `${this.url}/listuser`).subscribe(
      serviceResponse => {
        this.dtoList = serviceResponse.Data;
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

}
