import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { IFeatures, Features } from "../features.model";
import { FeaturesService } from "../service/features.service";

@Component({
  selector: "jhi-features-update",
  templateUrl: "./features-update.component.html",
})
export class FeaturesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.maxLength(45)]],
    route: [null, [Validators.maxLength(45)]],
  });

  constructor(
    protected featuresService: FeaturesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ features }) => {
      this.updateForm(features);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const features = this.createFromForm();
    if (features.id !== undefined) {
      this.subscribeToSaveResponse(this.featuresService.update(features));
    } else {
      this.subscribeToSaveResponse(this.featuresService.create(features));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<IFeatures>>
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

  protected updateForm(features: IFeatures): void {
    this.editForm.patchValue({
      id: features.id,
      description: features.description,
      route: features.route,
    });
  }

  protected createFromForm(): IFeatures {
    return {
      ...new Features(),
      id: this.editForm.get(["id"])!.value,
      description: this.editForm.get(["description"])!.value,
      route: this.editForm.get(["route"])!.value,
    };
  }
}
