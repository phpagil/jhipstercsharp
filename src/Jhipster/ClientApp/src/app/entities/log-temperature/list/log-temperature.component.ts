import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ILogTemperature } from "../log-temperature.model";
import { LogTemperatureService } from "../service/log-temperature.service";
import { LogTemperatureDeleteDialogComponent } from "../delete/log-temperature-delete-dialog.component";
import { IProductionLine } from 'app/entities/production-line/production-line.model';

import { ProductionLineService } from './../../production-line/service/production-line.service';
import { NzSelectOptionInterface } from "ng-zorro-antd/select";
import { BehaviorSubject, catchError, debounceTime, map, Observable, of, switchMap } from "rxjs";
@Component({
  selector: "jhi-log-temperature",
  templateUrl: "./log-temperature.component.html",
  styleUrls: [ "./log-temperature.component.css"]
})



export class LogTemperatureComponent implements OnInit {
  randomUserUrl = 'http://localhost:9000/api/production-lines';
  optionList: string[] = [];
  selectedUser = null;
  isLoading = false;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  getRandomNameList: Observable<string[]> = this.http
    .get(`${this.randomUserUrl}`)
    .pipe(
      catchError(() => of({ results: [] })),
      map((res: any) => res.results)
    )
    .pipe(map((list: any) => list.map((item: any) => `${item.name.first}`)));

  loadMore(): void {
    this.isLoading = true;
    this.getRandomNameList.subscribe(data => {
      this.isLoading = false;
      this.optionList = [...this.optionList, ...data];
    });
  }

  public productionLines: IProductionLine[] =  [{}];
  public listOfLines: NzSelectOptionInterface[] = [
    { label: 'Jack', value: 'jack' }
  ];
  public selectedProductionLine: any;
  validateForm!: FormGroup;
  date: any;

  index = 0;
  logTemperatures?: ILogTemperature[];

  
  constructor(
    protected logTemperatureService: LogTemperatureService,
    protected modalService: NgbModal,
    protected productionLineService: ProductionLineService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  loadProductionLines(): void {
    this.isLoading = true;

    this.productionLineService.query().subscribe({
      next: (res: HttpResponse<IProductionLine[]>) => {
        this.isLoading = false;
        this.productionLines = res.body ?? [];
        // eslint-disable-next-line no-console
        console.log(this.productionLines);
        
      },
      error: () => {
        this.isLoading = false;
      },
    });


  }



  loadAll(): void {
    this.isLoading = true;

    this.logTemperatureService.query().subscribe({
      next: (res: HttpResponse<ILogTemperature[]>) => {
        this.isLoading = false;
        this.logTemperatures = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadProductionLines();
    this.loadAll();
    this.loadMore();

    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  
  }

  trackId(_index: number, item: ILogTemperature): number {
    return item.id!;
  }

  delete(logTemperature: ILogTemperature): void {
    const modalRef = this.modalService.open(
      LogTemperatureDeleteDialogComponent,
      { size: "lg", backdrop: "static" }
    );
    modalRef.componentInstance.logTemperature = logTemperature;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }

  
  submitForm(): void {
    // eslint-disable-next-line no-console
    console.log('submit', this.validateForm.value);
  }

  onChange(event: any): void {
   // eslint-disable-next-line no-console
   console.log(event);
  }

}
