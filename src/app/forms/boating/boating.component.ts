import { ChangeDetectorRef, Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
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
  selector: 'app-boating',
  templateUrl: './boating.component.html',
  styleUrls: ['./boating.component.scss'],
})
export class BoatingComponent extends BaseFormComponent {
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
        .watchItem(Constants.dataIds.ACCORDION_BOATING)
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
    (this.postObj['activity'] = 'Boating'),
      // initialize the form and populate with values if they exist.
      (this.form = new UntypedFormGroup({
        boatAttendanceNightsOnDockControl: new UntypedFormControl(
          {
            value: this.data.boatAttendanceNightsOnDock,
            disabled: this.loading,
          },
          this.validationService.counterFieldValidator()
        ),
        boatAttendanceNightsOnBouysControl: new UntypedFormControl(
          {
            value: this.data.boatAttendanceNightsOnBouys,
            disabled: this.loading,
          },
          this.validationService.counterFieldValidator()
        ),
        boatAttendanceMiscellaneousControl: new UntypedFormControl(
          {
            value: this.data.boatAttendanceMiscellaneous,
            disabled: this.loading,
          },
          this.validationService.counterFieldValidator()
        ),
        boatRevenueGrossControl: new UntypedFormControl(
          {
            value: this.data.boatRevenueGross,
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
        boatAttendanceNightsOnDock: this.form.get(
          'boatAttendanceNightsOnDockControl'
        ),
        boatAttendanceNightsOnBouys: this.form.get(
          'boatAttendanceNightsOnBouysControl'
        ),
        boatAttendanceMiscellaneous: this.form.get(
          'boatAttendanceMiscellaneousControl'
        ),
        boatRevenueGross: this.form.get('boatRevenueGrossControl'),
        notes: this.form.get('varianceNotesControl'),
      });

    this.calculateTotals();
    super.subscribeToChanges(() => {
      this.calculateTotals();
    });
  }

  calculateTotals() {
    (this.attendanceTotal = this.formulaService.boatingAttendance(
      [
        this.fields.boatAttendanceNightsOnDock.value,
        this.fields.boatAttendanceNightsOnBouys.value,
        this.fields.boatAttendanceMiscellaneous.value,
      ],
      this.data?.config?.attendanceModifier
    )),
      (this.revenueTotal = this.formulaService.basicNetRevenue([
        this.fields.boatRevenueGross.value,
      ]));
  }

  async onSubmit() {
    await super.submit();
  }
}
