import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import dayjs from "dayjs/esm";
import { DATE_TIME_FORMAT } from "app/config/input.constants";

import { IProductionLine, ProductionLine } from "../production-line.model";
import { ProductionLineService } from "../service/production-line.service";

@Component({
  selector: "jhi-production-line-update",
  templateUrl: "./production-line-update.component.html",
})
export class ProductionLineUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.maxLength(45)]],
    createdAt: [],
    updatedAt: [],
  });

  constructor(
    protected productionLineService: ProductionLineService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productionLine }) => {
      if (productionLine.id === undefined) {
        const today = dayjs().startOf("day");
        productionLine.createdAt = today;
        productionLine.updatedAt = today;
      }

      this.updateForm(productionLine);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productionLine = this.createFromForm();
    if (productionLine.id !== undefined) {
      this.subscribeToSaveResponse(
        this.productionLineService.update(productionLine)
      );
    } else {
      this.subscribeToSaveResponse(
        this.productionLineService.create(productionLine)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<IProductionLine>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productionLine: IProductionLine): void {
    this.editForm.patchValue({
      id: productionLine.id,
      description: productionLine.description,
      createdAt: productionLine.createdAt
        ? productionLine.createdAt.format(DATE_TIME_FORMAT)
        : null,
      updatedAt: productionLine.updatedAt
        ? productionLine.updatedAt.format(DATE_TIME_FORMAT)
        : null,
    });
  }

  protected createFromForm(): IProductionLine {
    return {
      ...new ProductionLine(),
      id: this.editForm.get(["id"])!.value,
      description: this.editForm.get(["description"])!.value,
      createdAt: this.editForm.get(["createdAt"])!.value
        ? dayjs(this.editForm.get(["createdAt"])!.value, DATE_TIME_FORMAT)
        : undefined,
      updatedAt: this.editForm.get(["updatedAt"])!.value
        ? dayjs(this.editForm.get(["updatedAt"])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
