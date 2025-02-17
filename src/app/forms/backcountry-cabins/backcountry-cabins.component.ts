import { ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import {
  formulaResult,
  FormulaService,
} from 'src/app/services/formula.service';
import { BaseFormComponent } from 'src/app/shared/components/forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';
import { LoadingService } from 'src/app/services/loading.service';
import { ValidationService } from 'src/app/services/validation.service';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-backcountry-cabins',
  templateUrl: './backcountry-cabins.component.html',
  styleUrls: ['./backcountry-cabins.component.scss'],
})
export class BackcountryCabinsComponent extends BaseFormComponent {
  public attendanceTotal: formulaResult = { result: null, formula: '' };
  public revenueTotal: formulaResult = { result: null, formula: '' };

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected formService: FormService,
    protected dataService: DataService,
    protected router: Router,
    protected activityService: ActivityService,
    protected formulaService: FormulaService,
    protected loadingService: LoadingService,
    protected validationService: ValidationService,
    protected changeDetectior: ChangeDetectorRef
  ) {
    super(
      formBuilder,
      formService,
      router,
      dataService,
      activityService,
      formulaService,
      loadingService,
      changeDetectior
    );

    // push existing form data to parent subscriptions
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.ACCORDION_BACKCOUNTRY_CABINS)
        .subscribe((res) => {
          if (res) {
            this.data = res;
            this.setForm();
          }
        })
    );
    this.setForm();
  }

  setForm() {
    // declare activity type
    (this.postObj['activity'] = 'Backcountry Cabins'),
      // initialize the form and populate with values if they exist.
      (this.form = new UntypedFormGroup({
        peopleAdultControl: new UntypedFormControl(
          {
            value: this.data.peopleAdult,
            disabled: this.loading,
          },
          this.validationService.counterFieldValidator()
        ),
        peopleChildControl: new UntypedFormControl(
          {
            value: this.data.peopleChild,
            disabled: this.loading,
          },
          this.validationService.counterFieldValidator()
        ),
        peopleFamilyControl: new UntypedFormControl(
          {
            value: this.data.peopleFamily,
            disabled: this.loading,
          },
          this.validationService.counterFieldValidator()
        ),
        revenueFamilyControl: new UntypedFormControl(
          {
            value: this.data.revenueFamily,
            disabled: this.loading,
          },
          this.validationService.moneyFieldValidator()
        ),
        varianceNotesControl: new UntypedFormControl({
          value: this.data.notes,
          disabled: this.loading,
        }),
      })),
      // link form controls to the object fields they represent
      (this.fields = {
        peopleAdult: this.form.get('peopleAdultControl'),
        peopleChild: this.form.get('peopleChildControl'),
        peopleFamily: this.form.get('peopleFamilyControl'),
        revenueFamily: this.form.get('revenueFamilyControl'),
        notes: this.form.get('varianceNotesControl'),
      });

    this.calculateTotals();
    super.subscribeToChanges(() => {
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.attendanceTotal = this.formulaService.backcountryCabinsAttendance(
      [this.fields.peopleAdult.value, this.fields.peopleChild.value],
      [this.fields.peopleFamily.value],
      this.data?.config?.attendanceModifier
    );
    this.revenueTotal = this.formulaService.basicNetRevenue([
      this.fields.revenueFamily.value,
    ]);
  }

  async onSubmit() {
    await super.submit();
  }
}
